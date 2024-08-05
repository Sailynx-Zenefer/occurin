import { useState, useEffect } from 'react'
import { supabaseClient } from '../config/supabase-client'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { Session } from '@supabase/supabase-js'
import AvatarUploader from './AvatarUploader'
import { ScrollView } from 'react-native'
import { useAlerts } from 'react-native-paper-alerts'


type ProfileUpdates = {
  username: string
  website: string
  avatar_url: string
  full_name: string,
  profile_role: string,
}

export default function Profile({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profileRole, setProfileRole] = useState('')
  const alerts = useAlerts()
  
  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        if (!session?.user) throw new Error('No user on the session!')
  
        let { data, error, status } = await supabaseClient
          .from('profiles')
          .select(`created_at, updated_at, username, full_name, avatar_url, website, profile_role`)
          .eq('id', session?.user.id) 
          .single()
        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setUsername(data?.username || '')
          setWebsite(data?.website || '')
          setAvatarUrl(data?.avatar_url || '')
          setFullName(data?.full_name || '')
          setProfileRole(data?.profile_role || '')
        }
      } catch (error) {
        
        if (error instanceof Error) {
          Alert.alert("Error:",error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    if (session) getProfile()
  }, [session])


  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
    profile_role,
  }: ProfileUpdates) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        full_name,
        profile_role,
        updated_at: new Date().toISOString() 
      }

      let { error } = await supabaseClient.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        alerts.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <ScrollView style={styles.container}>
            <View>
      <AvatarUploader
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url)
          updateProfile({ username, website,full_name : fullName,profile_role : profileRole, avatar_url: avatarUrl })
        }}
      />
    </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Full Name" value={fullName || ''} onChangeText={(text) => setFullName(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          onPress={() => updateProfile({ username, website,full_name : fullName,profile_role : profileRole, avatar_url: avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </View>



      <View style={styles.verticallySpaced}>
        <Button onPress={() => supabaseClient.auth.signOut()} >
        "Sign Out"
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})