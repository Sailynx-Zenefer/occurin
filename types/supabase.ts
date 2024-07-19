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
      comments: {
        Row: {
          comment_id: number
          created_at: string
          edited_at: string | null
          post_id: number | null
          text_content: string | null
          user_id: number | null
          votes: number | null
        }
        Insert: {
          comment_id?: number
          created_at?: string
          edited_at?: string | null
          post_id?: number | null
          text_content?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Update: {
          comment_id?: number
          created_at?: string
          edited_at?: string | null
          post_id?: number | null
          text_content?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          description: string | null
          end_timestamp: string | null
          event_id: number
          has_capacity: boolean | null
          image_id: string | null
          in_person: boolean | null
          start_timestamp: string | null
          ticket_price: number | null
          ticketed: boolean | null
          tickets_bought: number | null
          title: string | null
          user_id: number | null
          votes: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_timestamp?: string | null
          event_id?: number
          has_capacity?: boolean | null
          image_id?: string | null
          in_person?: boolean | null
          start_timestamp?: string | null
          ticket_price?: number | null
          ticketed?: boolean | null
          tickets_bought?: number | null
          title?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          description?: string | null
          end_timestamp?: string | null
          event_id?: number
          has_capacity?: boolean | null
          image_id?: string | null
          in_person?: boolean | null
          start_timestamp?: string | null
          ticket_price?: number | null
          ticketed?: boolean | null
          tickets_bought?: number | null
          title?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          edited_at: string | null
          event_id: number | null
          img_url: string | null
          post_id: number
          text_content: string | null
          user_id: number | null
          votes: number | null
        }
        Insert: {
          created_at?: string
          edited_at?: string | null
          event_id?: number | null
          img_url?: string | null
          post_id?: number
          text_content?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Update: {
          created_at?: string
          edited_at?: string | null
          event_id?: number | null
          img_url?: string | null
          post_id?: number
          text_content?: string | null
          user_id?: number | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          is_host: boolean | null
          password: string | null
          profile_img: string | null
          user_id: number
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          is_host?: boolean | null
          password?: string | null
          profile_img?: string | null
          user_id?: number
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          is_host?: boolean | null
          password?: string | null
          profile_img?: string | null
          user_id?: number
          username?: string | null
        }
        Relationships: []
      }
      users_events: {
        Row: {
          bookmarked: boolean | null
          bought_ticket: boolean | null
          created_at: string
          event_id: number | null
          id: number
          user_id: number | null
        }
        Insert: {
          bookmarked?: boolean | null
          bought_ticket?: boolean | null
          created_at?: string
          event_id?: number | null
          id?: number
          user_id?: number | null
        }
        Update: {
          bookmarked?: boolean | null
          bought_ticket?: boolean | null
          created_at?: string
          event_id?: number | null
          id?: number
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "users_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
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