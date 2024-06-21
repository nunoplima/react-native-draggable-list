import { ANIMATION_CONFIG, TIME_TO_ACTIVATE_PAN } from '@/constants/gestures'
import { NFT_HEIGHT } from '@/constants/nfts'
import { getOrder, getPosition } from '@/utils'
import { useWindowDimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  clamp,
  scrollTo,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ISortableRow } from './SortableRow.types'

export const SortableRow = ({ id, positions, scrollY, scrollViewRef, children }: ISortableRow) => {
  const translateY = useSharedValue(getPosition(positions.value[id]))
  const translateX = useSharedValue(0)
  const initialY = useSharedValue(getPosition(positions.value[id]))
  const initialX = useSharedValue(0)
  const isPanActive = useSharedValue(false)
  const opacity = useSharedValue(1)
  const swipeTouchStart = useSharedValue({ x: 0, y: 0, time: 0 })

  const inset = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const containerHeight = height - inset.top - inset.bottom
  const positionsLength = Object.keys(positions.value).length
  const contentHeight = positionsLength * NFT_HEIGHT

  useAnimatedReaction(
    () => positions.value[id],
    (newOrder) => {
      if (!isPanActive.value) {
        const newY = getPosition(newOrder)
        translateY.value = withTiming(newY, ANIMATION_CONFIG)
      }
    }
  )

  const longPressGesture = Gesture.LongPress()
    .minDuration(TIME_TO_ACTIVATE_PAN)
    .onStart(() => {
      isPanActive.value = true
    })

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(TIME_TO_ACTIVATE_PAN)
    .onStart(() => {
      initialY.value = translateY.value
      translateX.value = withTiming(0, ANIMATION_CONFIG)
    })
    .onUpdate((event) => {
      translateY.value = initialY.value + event.translationY
      const newOrder = getOrder(translateY.value, positionsLength)
      const oldOrder = positions.value[id]

      if (newOrder !== oldOrder) {
        const idToSwap = Object.keys(positions.value).find(
          (key) => positions.value[key] === newOrder
        )

        if (idToSwap) {
          const newPositions = { ...positions.value }
          newPositions[id] = newOrder
          newPositions[idToSwap] = oldOrder
          positions.value = newPositions
        }
      }

      const lowerBound = scrollY.value
      const upperBound = lowerBound + containerHeight - NFT_HEIGHT
      const maxScroll = contentHeight - containerHeight
      const leftToScrollDown = maxScroll - scrollY.value

      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound)
        scrollY.value -= diff
        scrollTo(scrollViewRef, 0, scrollY.value, false)
        initialY.value -= diff
        translateY.value = initialY.value + event.translationY
      }
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, leftToScrollDown)
        scrollY.value += diff
        initialY.value += diff
        translateY.value = initialY.value + event.translationY
        scrollTo(scrollViewRef, 0, scrollY.value, false)
      }
    })
    .onEnd(() => {
      const newPosition = getPosition(positions.value[id]!)
      initialY.value = newPosition
      translateY.value = withTiming(newPosition, ANIMATION_CONFIG)
    })
    .onFinalize(() => {
      isPanActive.value = false
    })

  // swipe will disclose actions related to the item
  const swipeGesture = Gesture.Pan()
    .manualActivation(true)
    .onBegin((event) => {
      swipeTouchStart.value = {
        x: event.x,
        y: event.y,
        time: Date.now(),
      }
    })
    .onTouchesMove((event, state) => {
      const xDiff = Math.abs(event.changedTouches[0].x - swipeTouchStart.value.x)
      const yDiff = Math.abs(event.changedTouches[0].y - swipeTouchStart.value.y)
      const isHorizontalPanning = xDiff >= yDiff
      const timeToCheck = Date.now() - swipeTouchStart.value.time

      if (timeToCheck > TIME_TO_ACTIVATE_PAN) return

      if (isHorizontalPanning) {
        state.activate()
      } else {
        state.fail()
      }
    })
    .onStart(() => {
      initialX.value = translateX.value
    })
    .onUpdate((event) => {
      const newTranslationX = clamp(initialX.value + event.translationX, -120, 0)
      translateX.value = withTiming(newTranslationX, ANIMATION_CONFIG)
    })
    .onEnd(() => {
      if (translateX.value < -60) {
        translateX.value = withTiming(-120, ANIMATION_CONFIG)
      } else {
        translateX.value = withTiming(0, ANIMATION_CONFIG)
      }
    })

  // const composedGestures = Gesture.Race(
  //   swipeGesture,
  //   Gesture.Simultaneous(panGesture, longPressGesture)
  // )

  const composedGestures = Gesture.Simultaneous(panGesture, longPressGesture)

  const animatedStyle = useAnimatedStyle(() => {
    const zIndex = isPanActive.value ? 100 : 0
    const scale = withTiming(isPanActive.value ? 1.05 : 1, ANIMATION_CONFIG)

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'lightgray',
      zIndex,
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale }],
    }
  })

  const animatedInnerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Animated.View style={animatedInnerStyle}>
        <GestureDetector gesture={composedGestures}>
          <Animated.View>{children}</Animated.View>
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  )
}
