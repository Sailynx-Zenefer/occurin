import { useState, useEffect } from 'react'
import {StyleSheet, View,Image } from 'react-native'
import {Button, Surface, useTheme } from 'react-native-paper'
import { useAlerts } from 'react-native-paper-alerts'
import {downloadImage,uploadImage} from '@/hooks/imageUtils'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function AvatarUploader({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUri, setAvatarUri] = useState(null)
  const avatarSize = { height: size, width: size }
  const theme = useTheme()
  useEffect(() => {
    if (url) downloadImage(url,setAvatarUri,'avatars')
  }, [url])

  return (
    <Surface style={styles.avatarContainer}>
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}

        <Button
          style={styles.buttonStyle}
          buttonColor={theme.colors.secondary}
          textColor={theme.colors.onSecondary}
          mode={"outlined"}
          onPress={()=>(uploadImage(onUpload,setUploading,"avatars"))}
          disabled={uploading}
        >{uploading ? 'Uploading ...' : 'Select a New Image'}</Button>
    </Surface>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
    marginBottom:"auto",
  },
  avatarContainer: {
    padding:5,
    marginHorizontal:"auto",
    marginVertical:10,
    height:"auto",
    borderRadius:10
  },
  buttonStyle:{
    marginHorizontal:20,
    marginTop:0,
    marginBottom:"auto",
    height:"auto",
  },
  image: {
    objectFit: 'cover',
    margin:"auto"
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
})