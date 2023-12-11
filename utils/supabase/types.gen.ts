export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      invites: {
        Row: {
          campaign_id: string;
          created_at: string;
          email: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          email: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          email?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invites_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      maps: {
        Row: {
          campaign_id: string;
          created_at: string;
          id: string;
          media_id: string;
          name: string;
          order: number;
          user_id: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          id?: string;
          media_id: string;
          name: string;
          order: number;
          user_id: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          id?: string;
          media_id?: string;
          name?: string;
          order?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'maps_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maps_media_id_fkey';
            columns: ['media_id'];
            isOneToOne: false;
            referencedRelation: 'media';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maps_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      media: {
        Row: {
          created_at: string;
          height: number | null;
          id: string;
          size: number | null;
          url: string;
          user_id: string;
          width: number | null;
        };
        Insert: {
          created_at?: string;
          height?: number | null;
          id: string;
          size?: number | null;
          url: string;
          user_id: string;
          width?: number | null;
        };
        Update: {
          created_at?: string;
          height?: number | null;
          id?: string;
          size?: number | null;
          url?: string;
          user_id?: string;
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'media_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'objects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'media_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      memberships: {
        Row: {
          campaign_id: string;
          color: string;
          created_at: string;
          id: string;
          role: Database['public']['Enums']['campaign_member_role'];
          user_id: string;
        };
        Insert: {
          campaign_id: string;
          color: string;
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['campaign_member_role'];
          user_id: string;
        };
        Update: {
          campaign_id?: string;
          color?: string;
          created_at?: string;
          id?: string;
          role?: Database['public']['Enums']['campaign_member_role'];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'memberships_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'memberships_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      plugins: {
        Row: {
          campaign_id: string;
          created_at: string;
          id: string;
          manifest_url: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          id?: string;
          manifest_url: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          id?: string;
          manifest_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plugins_campaign_id_fkey';
            columns: ['campaign_id'];
            isOneToOne: false;
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_id: string | null;
          campaign_order: Json;
          created_at: string;
          display_name: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          avatar_id?: string | null;
          campaign_order?: Json;
          created_at?: string;
          display_name: string;
          email: string;
          id: string;
          name: string;
        };
        Update: {
          avatar_id?: string | null;
          campaign_order?: Json;
          created_at?: string;
          display_name?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_avatar_id_fkey';
            columns: ['avatar_id'];
            isOneToOne: false;
            referencedRelation: 'media';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      setup: {
        Row: {
          id: number;
          step: Database['public']['Enums']['setup_step'];
        };
        Insert: {
          id?: number;
          step: Database['public']['Enums']['setup_step'];
        };
        Update: {
          id?: number;
          step?: Database['public']['Enums']['setup_step'];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      execute_schema_tables: {
        Args: {
          _schema: string;
          _query: string;
        };
        Returns: string;
      };
    };
    Enums: {
      campaign_member_role: 'GAME_MASTER' | 'PLAYER';
      setup_step: 'CREATED_DATABASE' | 'CREATED_USER' | 'COMPLETED';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
    ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
