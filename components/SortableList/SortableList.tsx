import { NFTS, NFT_HEIGHT } from '@/constants/nfts'
import { FC, ReactElement } from 'react'
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import SortableRow from '../SortableRow'
import { ISortableList } from './SortableList.types'

export const SortableList: FC<ISortableList> = ({ positions, children }) => {
  const scrollY = useSharedValue(0)
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()

  const handleOnScroll = useAnimatedScrollHandler(({ contentOffset: { y } }) => {
    scrollY.value = y
  })

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={{
        height: NFTS.length * NFT_HEIGHT,
      }}
      onScroll={handleOnScroll}
    >
      {children?.map((child: ReactElement<{ id: string }>) => (
        <SortableRow
          key={child?.props.id}
          id={child?.props.id}
          positions={positions}
          scrollY={scrollY}
          scrollViewRef={scrollViewRef}
        >
          {child}
        </SortableRow>
      ))}
    </Animated.ScrollView>
  )
}
