import { useState, useEffect } from 'react'
import {StyleSheet, View,Image } from 'react-native'
import {Button } from 'react-native-paper'
import { useAlerts } from 'react-native-paper-alerts'
import {downloadImage,uploadImage} from '@/hooks/imageUtils'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function AvatarUploader({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }
  
  useEffect(() => {
    if (url) downloadImage(url,setAvatarUrl,'avatars')
  }, [url])

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          onPress={()=>(uploadImage(onUpload,setUploading,"avatars"))}
          disabled={uploading}
        >{uploading ? 'Uploading ...' : 'Upload'}</Button>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
})