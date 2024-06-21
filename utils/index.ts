import { NFT_HEIGHT } from '@/constants/nfts'

export const getPosition = (position: number) => {
  'worklet'

  return position * NFT_HEIGHT
}

export const getOrder = (top: number, max: number) => {
  'worklet'

  const y = Math.round(top / NFT_HEIGHT) * NFT_HEIGHT
  const row = Math.max(y, 0) / NFT_HEIGHT

  return Math.min(row, max)
}
