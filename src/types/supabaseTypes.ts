export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string | null
          description: string | null
          discogs_id: string | null
          id: string
          img_url: string | null
          name: string | null
          spotify_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discogs_id?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          spotify_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discogs_id?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          spotify_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string | null
          created_at: string | null
          creator_id: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          votes: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          begin_time: string | null
          capacity: number | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          finish_time: string | null
          id: string
          img_url: string | null
          in_person: boolean | null
          location_lat: number | null
          location_long: number | null
          location_name: string | null
          ticket_price: number | null
          ticketed: boolean | null
          tickets_bought: number | null
          title: string | null
          updated_at: string | null
          votes: number | null
        }
        Insert: {
          begin_time?: string | null
          capacity?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          finish_time?: string | null
          id?: string
          img_url?: string | null
          in_person?: boolean | null
          location_lat?: number | null
          location_long?: number | null
          location_name?: string | null
          ticket_price?: number | null
          ticketed?: boolean | null
          tickets_bought?: number | null
          title?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Update: {
          begin_time?: string | null
          capacity?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          finish_time?: string | null
          id?: string
          img_url?: string | null
          in_person?: boolean | null
          location_lat?: number | null
          location_long?: number | null
          location_name?: string | null
          ticket_price?: number | null
          ticketed?: boolean | null
          tickets_bought?: number | null
          title?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_creator_id_fkey1"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events_artists: {
        Row: {
          artist_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
        }
        Insert: {
          artist_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
        }
        Update: {
          artist_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_artists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events_hosts: {
        Row: {
          created_at: string | null
          event_id: string | null
          host_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          host_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          host_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_hosts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_hosts_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_hosts_host_id_fkey1"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events_organisers: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          organiser_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          organiser_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          organiser_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organisers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organisers_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
        ]
      }
      organisers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          img_url: string | null
          name: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          creator_id: string | null
          event_id: string | null
          id: string
          img_url: string | null
          title: string | null
          updated_at: string | null
          votes: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          id?: string
          img_url?: string | null
          title?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          creator_id?: string | null
          event_id?: string | null
          id?: string
          img_url?: string | null
          title?: string | null
          updated_at?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          profile_role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          profile_role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          profile_role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_events: {
        Row: {
          bought_ticket: boolean | null
          created_at: string | null
          event_id: string | null
          going: boolean | null
          id: string
          user_id: string | null
        }
        Insert: {
          bought_ticket?: boolean | null
          created_at?: string | null
          event_id?: string | null
          going?: boolean | null
          id?: string
          user_id?: string | null
        }
        Update: {
          bought_ticket?: boolean | null
          created_at?: string | null
          event_id?: string | null
          going?: boolean | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_events_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_organisers: {
        Row: {
          created_at: string | null
          id: string
          organiser_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organiser_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organiser_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organisers_organiser_id_fkey"
            columns: ["organiser_id"]
            isOneToOne: false
            referencedRelation: "organisers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_organisers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_votes: {
        Row: {
          created_at: string
          id: string
          save_event: boolean
          user_id: string
          hide_event: boolean
          voted_upon: string
        }
        Insert: {
          created_at?: string
          id?: string
          save_event?: boolean
          user_id: string
          hide_event?: boolean
          voted_upon: string
        }
        Update: {
          created_at?: string
          id?: string
          save_event?: boolean
          user_id?: string
          hide_event?: boolean
          voted_upon?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_votes_voted_upon_fkey"
            columns: ["voted_upon"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
