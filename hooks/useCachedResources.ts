import * as Font from 'expo-font'
import { useEffect, useState } from 'react'

export const useCachedResources = () => {
  const [isLoadingComplete, setLoadingComplete] = useState(false)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          'space-grotesk-regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
          'space-grotesk-bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
          'space-grotesk-semibold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
