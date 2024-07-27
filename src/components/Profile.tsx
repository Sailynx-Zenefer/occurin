import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { Session } from '@supabase/supabase-js'

export default function Profile({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profileRole, setProfileRole] = useState('')

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`created_at, updated_at, username, full_name, avatar_url, website, profile_role`)
        .eq('id', session?.user.id) 
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username as string)
        setWebsite(data.website as string)
        setAvatarUrl(data.avatar_url as string)
        setFullName(data.full_name as string)
        setProfileRole(data.profile_role as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
    profile_role,
  }: {
    username: string
    website: string
    avatar_url: string
    full_name: string,
    profile_role: string,
  }) {
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

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
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
        <Button onPress={() => supabase.auth.signOut()} >
        "Sign Out"
        </Button>
      </View>
    </View>
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