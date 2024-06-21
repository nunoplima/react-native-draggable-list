import { NFT_HEIGHT } from '@/constants/nfts'
import { FC } from 'react'
import { Image, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { INft, INftAttributes, INftDetails } from './Nft.types'

const Line = () => (
  <View
    style={{
      flex: 1,
      paddingHorizontal: 10,
    }}
  >
    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#a6a8af' }} />
  </View>
)

const Details: FC<INftDetails> = ({ name, image }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    }}
  >
    <Image
      style={{
        width: 56,
        height: 56,
        borderRadius: 30,
        marginRight: 12,
      }}
      source={{ uri: image }}
    />
    <Text style={{ fontFamily: 'space-grotesk-bold', fontSize: 16 }}>{name}</Text>
  </View>
)

const Attributes: FC<INftAttributes> = ({ attributes }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    bounces={false}
    contentContainerStyle={{
      paddingHorizontal: 10,
      paddingVertical: 10,
      flexGrow: 1,
    }}
  >
    {attributes.map(({ trait_type: trait, value }) => (
      <View
        key={`${trait}-${value}`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#F3F3F3',
          borderColor: '#C4C4C4',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 6,
          paddingVertical: 0,
          height: 38,
          marginRight: 4,
        }}
      >
        <Text style={{ fontFamily: 'space-grotesk-regular', fontSize: 10, color: '#7E8494' }}>
          {trait}
        </Text>
        <Text style={{ fontFamily: 'space-grotesk-bold', fontSize: 12, color: '#646464' }}>
          {value}
        </Text>
      </View>
    ))}
  </ScrollView>
)

const Nft: INft = ({ bgColor, children }) => (
  <View
    style={{
      height: NFT_HEIGHT,
      width: '100%',
      padding: 10,
    }}
  >
    <View
      style={{
        flexDirection: 'column',
        backgroundColor: bgColor,
        borderRadius: 10,
      }}
    >
      {children}
    </View>
  </View>
)

Nft.Line = Line
Nft.Details = Details
Nft.Attributes = Attributes

export { Nft }
