import { ReactNode } from 'react'
import Animated, { AnimatedRef, SharedValue } from 'react-native-reanimated'
import { IPositions } from '../SortableList/SortableList.types'

interface ISortableRow {
  id: string
  positions: SharedValue<IPositions>
  scrollY: SharedValue<number>
  scrollViewRef: AnimatedRef<Animated.ScrollView>
  children: ReactNode
}

export type { ISortableRow }
