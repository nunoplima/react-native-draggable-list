import { FC, PropsWithChildren, ReactElement } from 'react'

interface INftData {
  id: string
  name: string
  image: string
  attributes: { trait_type: string; value: string }[]
  bgColor: string
}

interface INftAttributes extends Pick<INftData, 'attributes'> {}

interface INftDetails extends Pick<INftData, 'name' | 'image'> {}

interface INft {
  (props: PropsWithChildren<Pick<INftData, 'id' | 'bgColor'>>): ReactElement
  Line: FC
  Details: FC<Pick<INftData, 'name' | 'image'>>
  Attributes: FC<Pick<INftData, 'attributes'>>
}

export type { INft, INftAttributes, INftDetails }
