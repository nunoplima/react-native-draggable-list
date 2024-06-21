import { ReactElement } from 'react'
import { SharedValue } from 'react-native-reanimated'

interface IPositions extends Record<string, number> {}

interface ISong {
  id: string
  artist: string
  cover: string
  title: string
}

interface ISortableList {
  children: ReactElement<{ id: string }>[]
  positions: SharedValue<IPositions>
}

export type { IPositions, ISong, ISortableList }
