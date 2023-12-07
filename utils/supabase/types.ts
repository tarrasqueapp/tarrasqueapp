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
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maps_media_id_fkey';
            columns: ['media_id'];
            referencedRelation: 'media';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'maps_user_id_fkey';
            columns: ['user_id'];
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
            referencedRelation: 'objects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'media_user_id_fkey';
            columns: ['user_id'];
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
            referencedRelation: 'campaigns';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'memberships_user_id_fkey';
            columns: ['user_id'];
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
          id: string;
          name: string;
        };
        Insert: {
          avatar_id?: string | null;
          campaign_order?: Json;
          created_at?: string;
          display_name: string;
          id: string;
          name: string;
        };
        Update: {
          avatar_id?: string | null;
          campaign_order?: Json;
          created_at?: string;
          display_name?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_avatar_id_fkey';
            columns: ['avatar_id'];
            referencedRelation: 'media';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
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
