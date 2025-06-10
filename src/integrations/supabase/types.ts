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
      admin_otps: {
        Row: {
          admin_id: number
          created_at: string | null
          expires_at: string
          id: number
          otp_code: string
          verified: boolean | null
        }
        Insert: {
          admin_id: number
          created_at?: string | null
          expires_at: string
          id?: number
          otp_code: string
          verified?: boolean | null
        }
        Update: {
          admin_id?: number
          created_at?: string | null
          expires_at?: string
          id?: number
          otp_code?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_otps_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: number
          last_login: string | null
          password_hash: string
          password_hash_2: string | null
          password_hash_3: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: number
          last_login?: string | null
          password_hash: string
          password_hash_2?: string | null
          password_hash_3?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: number
          last_login?: string | null
          password_hash?: string
          password_hash_2?: string | null
          password_hash_3?: string | null
          username?: string
        }
        Relationships: []
      }
      anti_click_bot_settings: {
        Row: {
          block_duration_minutes: number | null
          created_at: string | null
          id: number
          is_enabled: boolean | null
          max_clicks_per_minute: number | null
          require_captcha: boolean | null
          time_window_seconds: number | null
          updated_at: string | null
        }
        Insert: {
          block_duration_minutes?: number | null
          created_at?: string | null
          id?: number
          is_enabled?: boolean | null
          max_clicks_per_minute?: number | null
          require_captcha?: boolean | null
          time_window_seconds?: number | null
          updated_at?: string | null
        }
        Update: {
          block_duration_minutes?: number | null
          created_at?: string | null
          id?: number
          is_enabled?: boolean | null
          max_clicks_per_minute?: number | null
          require_captcha?: boolean | null
          time_window_seconds?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ban_settings: {
        Row: {
          created_at: string | null
          id: number
          max_clicks_per_window: number | null
          temp_ban_duration_minutes: number | null
          time_window_seconds: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          max_clicks_per_window?: number | null
          temp_ban_duration_minutes?: number | null
          time_window_seconds?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          max_clicks_per_window?: number | null
          temp_ban_duration_minutes?: number | null
          time_window_seconds?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      banned_ips: {
        Row: {
          ban_reason: string | null
          ban_type: string | null
          banned_at: string | null
          banned_by_admin: boolean | null
          click_count_at_ban: number | null
          country: string | null
          created_at: string | null
          expires_at: string | null
          id: number
          ip_address: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          ban_reason?: string | null
          ban_type?: string | null
          banned_at?: string | null
          banned_by_admin?: boolean | null
          click_count_at_ban?: number | null
          country?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          ip_address: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          ban_reason?: string | null
          ban_type?: string | null
          banned_at?: string | null
          banned_by_admin?: boolean | null
          click_count_at_ban?: number | null
          country?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          ip_address?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      challenge_settings: {
        Row: {
          created_at: string | null
          end_time: string
          id: number
          is_active: boolean | null
          name: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: number
          is_active?: boolean | null
          name: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: number
          is_active?: boolean | null
          name?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      click_events: {
        Row: {
          country: string
          created_at: string | null
          id: number
          image_id: number
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: number
          image_id: number
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: number
          image_id?: number
        }
        Relationships: []
      }
      click_tracking: {
        Row: {
          clicked_at: string | null
          country: string | null
          id: number
          image_id: number
          ip_address: string
        }
        Insert: {
          clicked_at?: string | null
          country?: string | null
          id?: number
          image_id: number
          ip_address: string
        }
        Update: {
          clicked_at?: string | null
          country?: string | null
          id?: number
          image_id?: number
          ip_address?: string
        }
        Relationships: []
      }
      country_stats: {
        Row: {
          clicks: number | null
          country: string
          id: number
          image_id: number
        }
        Insert: {
          clicks?: number | null
          country: string
          id?: number
          image_id: number
        }
        Update: {
          clicks?: number | null
          country?: string
          id?: number
          image_id?: number
        }
        Relationships: []
      }
      image_stats: {
        Row: {
          image_id: number
          image_path: string | null
          pressed_image_path: string | null
          sound_path: string | null
          total_clicks: number | null
        }
        Insert: {
          image_id?: number
          image_path?: string | null
          pressed_image_path?: string | null
          sound_path?: string | null
          total_clicks?: number | null
        }
        Update: {
          image_id?: number
          image_path?: string | null
          pressed_image_path?: string | null
          sound_path?: string | null
          total_clicks?: number | null
        }
        Relationships: []
      }
      suspicious_clicks_log: {
        Row: {
          blocked_at: string | null
          click_type: string | null
          details: Json | null
          id: number
          image_id: number
          ip_address: string
          user_agent: string | null
        }
        Insert: {
          blocked_at?: string | null
          click_type?: string | null
          details?: Json | null
          id?: number
          image_id: number
          ip_address: string
          user_agent?: string | null
        }
        Update: {
          blocked_at?: string | null
          click_type?: string | null
          details?: Json | null
          id?: number
          image_id?: number
          ip_address?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_click_tracking: {
        Row: {
          block_expires_at: string | null
          click_count: number | null
          created_at: string | null
          first_click_at: string | null
          id: number
          ip_address: string
          is_blocked: boolean | null
          last_click_at: string | null
          suspicious_activity_count: number | null
          user_agent: string | null
        }
        Insert: {
          block_expires_at?: string | null
          click_count?: number | null
          created_at?: string | null
          first_click_at?: string | null
          id?: number
          ip_address: string
          is_blocked?: boolean | null
          last_click_at?: string | null
          suspicious_activity_count?: number | null
          user_agent?: string | null
        }
        Update: {
          block_expires_at?: string | null
          click_count?: number | null
          created_at?: string | null
          first_click_at?: string | null
          id?: number
          ip_address?: string
          is_blocked?: boolean | null
          last_click_at?: string | null
          suspicious_activity_count?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_image_clicks: {
        Args: { img_id: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
