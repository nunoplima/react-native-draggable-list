import Nft from '@/components/Nft'
import SortableList from '@/components/SortableList'
import { IPositions } from '@/components/SortableList/SortableList.types'
import { NFTS } from '@/constants/nfts'
import { useCachedResources } from '@/hooks/useCachedResources'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSharedValue } from 'react-native-reanimated'

export default function App() {
  const isReady = useCachedResources()

  const positions = useSharedValue<IPositions>(
    Object.assign({}, ...NFTS.map(({ nft_data: { token_id } }, index) => ({ [token_id]: index })))
  )

  if (!isReady) {
    return null
  }

  return (
    <GestureHandlerRootView>
      <SortableList positions={positions}>
        {NFTS.map(
          ({
            nft_data: {
              token_id: id,
              external_data: {
                name,
                thumbnails: { image_256: image },
                attributes,
                asset_properties: { dominant_color: bgColor },
              },
            },
          }) => (
            <Nft key={id} id={id} bgColor={bgColor}>
              <Nft.Details image={image} name={name} />
              <Nft.Line />
              <Nft.Attributes attributes={attributes} />
            </Nft>
          )
        )}
      </SortableList>
    </GestureHandlerRootView>
  )
}
