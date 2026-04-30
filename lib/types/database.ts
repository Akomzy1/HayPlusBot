export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_action_log: {
        Row: {
          action_type: string
          admin_user_id: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          id: number
          ip: unknown
          reason_note: string | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          id?: number
          ip?: unknown
          reason_note?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          id?: number
          ip?: unknown
          reason_note?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_action_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_users: {
        Row: {
          granted_at: string
          granted_by: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      economic_calendar_cache: {
        Row: {
          actual: string | null
          currency: string
          event_name: string
          external_id: string | null
          forecast: string | null
          id: number
          importance: Database["public"]["Enums"]["event_importance"]
          ingested_at: string
          previous: string | null
          scheduled_at: string
        }
        Insert: {
          actual?: string | null
          currency: string
          event_name: string
          external_id?: string | null
          forecast?: string | null
          id?: number
          importance: Database["public"]["Enums"]["event_importance"]
          ingested_at?: string
          previous?: string | null
          scheduled_at: string
        }
        Update: {
          actual?: string | null
          currency?: string
          event_name?: string
          external_id?: string | null
          forecast?: string | null
          id?: number
          importance?: Database["public"]["Enums"]["event_importance"]
          ingested_at?: string
          previous?: string | null
          scheduled_at?: string
        }
        Relationships: []
      }
      hfm_sync_state: {
        Row: {
          id: boolean
          last_error: string | null
          last_error_at: string | null
          last_partner_api_check_at: string | null
          strategy_metrics: Json | null
          strategy_metrics_synced_at: string | null
          subscribers_count: number | null
          subscribers_synced_at: string | null
          updated_at: string
        }
        Insert: {
          id?: boolean
          last_error?: string | null
          last_error_at?: string | null
          last_partner_api_check_at?: string | null
          strategy_metrics?: Json | null
          strategy_metrics_synced_at?: string | null
          subscribers_count?: number | null
          subscribers_synced_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: boolean
          last_error?: string | null
          last_error_at?: string | null
          last_partner_api_check_at?: string | null
          strategy_metrics?: Json | null
          strategy_metrics_synced_at?: string | null
          subscribers_count?: number | null
          subscribers_synced_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      market_news_cache: {
        Row: {
          bias: Database["public"]["Enums"]["news_bias"]
          expires_at: string
          generated_at: string
          id: number
          input_hash: string
          pair: Database["public"]["Enums"]["pair"]
          summary: string
        }
        Insert: {
          bias: Database["public"]["Enums"]["news_bias"]
          expires_at: string
          generated_at?: string
          id?: number
          input_hash: string
          pair: Database["public"]["Enums"]["pair"]
          summary: string
        }
        Update: {
          bias?: Database["public"]["Enums"]["news_bias"]
          expires_at?: string
          generated_at?: string
          id?: number
          input_hash?: string
          pair?: Database["public"]["Enums"]["pair"]
          summary?: string
        }
        Relationships: []
      }
      master_account_config: {
        Row: {
          account_number: string
          broker_name: string
          circuit_breaker_state: Json
          enabled: boolean
          id: boolean
          last_modified_by: string | null
          metaapi_account_id: string | null
          mt_investor_password_encrypted: string | null
          pair_whitelist: Database["public"]["Enums"]["pair"][]
          paused_at: string | null
          risk_per_trade: number
          updated_at: string
        }
        Insert: {
          account_number: string
          broker_name?: string
          circuit_breaker_state?: Json
          enabled?: boolean
          id?: boolean
          last_modified_by?: string | null
          metaapi_account_id?: string | null
          mt_investor_password_encrypted?: string | null
          pair_whitelist?: Database["public"]["Enums"]["pair"][]
          paused_at?: string | null
          risk_per_trade?: number
          updated_at?: string
        }
        Update: {
          account_number?: string
          broker_name?: string
          circuit_breaker_state?: Json
          enabled?: boolean
          id?: boolean
          last_modified_by?: string | null
          metaapi_account_id?: string | null
          mt_investor_password_encrypted?: string | null
          pair_whitelist?: Database["public"]["Enums"]["pair"][]
          paused_at?: string | null
          risk_per_trade?: number
          updated_at?: string
        }
        Relationships: []
      }
      master_account_metrics: {
        Row: {
          balance: number
          captured_at: string
          equity: number
          floating_pnl: number
          id: number
          open_positions_count: number
          source: string
        }
        Insert: {
          balance: number
          captured_at?: string
          equity: number
          floating_pnl?: number
          id?: number
          open_positions_count?: number
          source?: string
        }
        Update: {
          balance?: number
          captured_at?: string
          equity?: number
          floating_pnl?: number
          id?: number
          open_positions_count?: number
          source?: string
        }
        Relationships: []
      }
      news_headlines: {
        Row: {
          headline: string
          id: number
          ingested_at: string
          published_at: string | null
          raw: Json | null
          source: string
          symbol: string | null
          url: string | null
        }
        Insert: {
          headline: string
          id?: number
          ingested_at?: string
          published_at?: string | null
          raw?: Json | null
          source: string
          symbol?: string | null
          url?: string | null
        }
        Update: {
          headline?: string
          id?: number
          ingested_at?: string
          published_at?: string | null
          raw?: Json | null
          source?: string
          symbol?: string | null
          url?: string | null
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          dedupe_key: string
          delivery_status: Database["public"]["Enums"]["delivery_status"]
          error: string | null
          id: number
          sent_at: string
          subject: string | null
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          dedupe_key: string
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          error?: string | null
          id?: number
          sent_at?: string
          subject?: string | null
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          dedupe_key?: string
          delivery_status?: Database["public"]["Enums"]["delivery_status"]
          error?: string | null
          id?: number
          sent_at?: string
          subject?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      signal_confluence_factors: {
        Row: {
          awarded: boolean
          created_at: string
          factor_name: string
          factor_number: number
          id: number
          reason: string | null
          signal_id: string
        }
        Insert: {
          awarded: boolean
          created_at?: string
          factor_name: string
          factor_number: number
          id?: number
          reason?: string | null
          signal_id: string
        }
        Update: {
          awarded?: boolean
          created_at?: string
          factor_name?: string
          factor_number?: number
          id?: number
          reason?: string | null
          signal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_confluence_factors_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
        ]
      }
      signal_evaluations: {
        Row: {
          choch_detected: boolean
          classification:
            | Database["public"]["Enums"]["signal_classification"]
            | null
          confluence_score: number | null
          created_at: string
          details: Json | null
          direction: Database["public"]["Enums"]["direction"] | null
          discard_reason: string | null
          evaluated_at: string
          htf_d1_bias: Database["public"]["Enums"]["htf_bias"] | null
          htf_h4_bias: Database["public"]["Enums"]["htf_bias"] | null
          id: number
          pair: Database["public"]["Enums"]["pair"]
          passed_htf_bias: boolean
          reached_scoring: boolean
          sweep_detected: boolean
        }
        Insert: {
          choch_detected?: boolean
          classification?:
            | Database["public"]["Enums"]["signal_classification"]
            | null
          confluence_score?: number | null
          created_at?: string
          details?: Json | null
          direction?: Database["public"]["Enums"]["direction"] | null
          discard_reason?: string | null
          evaluated_at?: string
          htf_d1_bias?: Database["public"]["Enums"]["htf_bias"] | null
          htf_h4_bias?: Database["public"]["Enums"]["htf_bias"] | null
          id?: number
          pair: Database["public"]["Enums"]["pair"]
          passed_htf_bias?: boolean
          reached_scoring?: boolean
          sweep_detected?: boolean
        }
        Update: {
          choch_detected?: boolean
          classification?:
            | Database["public"]["Enums"]["signal_classification"]
            | null
          confluence_score?: number | null
          created_at?: string
          details?: Json | null
          direction?: Database["public"]["Enums"]["direction"] | null
          discard_reason?: string | null
          evaluated_at?: string
          htf_d1_bias?: Database["public"]["Enums"]["htf_bias"] | null
          htf_h4_bias?: Database["public"]["Enums"]["htf_bias"] | null
          id?: number
          pair?: Database["public"]["Enums"]["pair"]
          passed_htf_bias?: boolean
          reached_scoring?: boolean
          sweep_detected?: boolean
        }
        Relationships: []
      }
      signals: {
        Row: {
          choch_at: string | null
          classification: Database["public"]["Enums"]["signal_classification"]
          confluence_score: number
          created_at: string
          direction: Database["public"]["Enums"]["direction"]
          entry_price: number | null
          entry_zone_distal: number | null
          entry_zone_proximal: number | null
          entry_zone_type: Database["public"]["Enums"]["entry_zone_type"] | null
          evaluated_at: string
          filter_1_passed: boolean
          filter_2_passed: boolean
          filter_3_passed: boolean | null
          filter_3_skipped: boolean
          htf_d1_bias: Database["public"]["Enums"]["htf_bias"]
          htf_h4_bias: Database["public"]["Enums"]["htf_bias"]
          id: string
          narrative: string | null
          narrative_generated_at: string | null
          pair: Database["public"]["Enums"]["pair"]
          reward_pips: number | null
          risk_pips: number | null
          session: Database["public"]["Enums"]["session_window"]
          stop_loss: number | null
          sweep_level_price: number | null
          sweep_level_type: string | null
          take_profit_1: number | null
          take_profit_2: number | null
          updated_at: string
        }
        Insert: {
          choch_at?: string | null
          classification: Database["public"]["Enums"]["signal_classification"]
          confluence_score: number
          created_at?: string
          direction: Database["public"]["Enums"]["direction"]
          entry_price?: number | null
          entry_zone_distal?: number | null
          entry_zone_proximal?: number | null
          entry_zone_type?:
            | Database["public"]["Enums"]["entry_zone_type"]
            | null
          evaluated_at?: string
          filter_1_passed: boolean
          filter_2_passed: boolean
          filter_3_passed?: boolean | null
          filter_3_skipped?: boolean
          htf_d1_bias: Database["public"]["Enums"]["htf_bias"]
          htf_h4_bias: Database["public"]["Enums"]["htf_bias"]
          id?: string
          narrative?: string | null
          narrative_generated_at?: string | null
          pair: Database["public"]["Enums"]["pair"]
          reward_pips?: number | null
          risk_pips?: number | null
          session: Database["public"]["Enums"]["session_window"]
          stop_loss?: number | null
          sweep_level_price?: number | null
          sweep_level_type?: string | null
          take_profit_1?: number | null
          take_profit_2?: number | null
          updated_at?: string
        }
        Update: {
          choch_at?: string | null
          classification?: Database["public"]["Enums"]["signal_classification"]
          confluence_score?: number
          created_at?: string
          direction?: Database["public"]["Enums"]["direction"]
          entry_price?: number | null
          entry_zone_distal?: number | null
          entry_zone_proximal?: number | null
          entry_zone_type?:
            | Database["public"]["Enums"]["entry_zone_type"]
            | null
          evaluated_at?: string
          filter_1_passed?: boolean
          filter_2_passed?: boolean
          filter_3_passed?: boolean | null
          filter_3_skipped?: boolean
          htf_d1_bias?: Database["public"]["Enums"]["htf_bias"]
          htf_h4_bias?: Database["public"]["Enums"]["htf_bias"]
          id?: string
          narrative?: string | null
          narrative_generated_at?: string | null
          pair?: Database["public"]["Enums"]["pair"]
          reward_pips?: number | null
          risk_pips?: number | null
          session?: Database["public"]["Enums"]["session_window"]
          stop_loss?: number | null
          sweep_level_price?: number | null
          sweep_level_type?: string | null
          take_profit_1?: number | null
          take_profit_2?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      signups: {
        Row: {
          country_code: string | null
          created_at: string
          email: string
          hfcopy_subscribed: boolean
          hfcopy_subscribed_at: string | null
          hfcopy_unsubscribed_at: string | null
          hfm_account_number: string | null
          hfm_account_verified_at: string | null
          hfm_account_verified_under_our_code: boolean
          id: string
          referral_token: string | null
          risk_disclosure_ip: unknown
          risk_disclosure_signed_at: string | null
          risk_disclosure_version: string | null
          signed_up_at: string
          updated_at: string
          user_id: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          email: string
          hfcopy_subscribed?: boolean
          hfcopy_subscribed_at?: string | null
          hfcopy_unsubscribed_at?: string | null
          hfm_account_number?: string | null
          hfm_account_verified_at?: string | null
          hfm_account_verified_under_our_code?: boolean
          id?: string
          referral_token?: string | null
          risk_disclosure_ip?: unknown
          risk_disclosure_signed_at?: string | null
          risk_disclosure_version?: string | null
          signed_up_at?: string
          updated_at?: string
          user_id: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          email?: string
          hfcopy_subscribed?: boolean
          hfcopy_subscribed_at?: string | null
          hfcopy_unsubscribed_at?: string | null
          hfm_account_number?: string | null
          hfm_account_verified_at?: string | null
          hfm_account_verified_under_our_code?: boolean
          id?: string
          referral_token?: string | null
          risk_disclosure_ip?: unknown
          risk_disclosure_signed_at?: string | null
          risk_disclosure_version?: string | null
          signed_up_at?: string
          updated_at?: string
          user_id?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      subscribe_balance_check_log: {
        Row: {
          account_currency: string
          balance_account_currency: number
          balance_usd_equivalent: number
          checked_at: string
          fx_rate_used: number
          hfm_account_number: string
          id: number
          passed: boolean
          reason_if_failed: string | null
          user_id: string
        }
        Insert: {
          account_currency: string
          balance_account_currency: number
          balance_usd_equivalent: number
          checked_at?: string
          fx_rate_used: number
          hfm_account_number: string
          id?: number
          passed: boolean
          reason_if_failed?: string | null
          user_id: string
        }
        Update: {
          account_currency?: string
          balance_account_currency?: number
          balance_usd_equivalent?: number
          checked_at?: string
          fx_rate_used?: number
          hfm_account_number?: string
          id?: number
          passed?: boolean
          reason_if_failed?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["direction"]
          entry_at: string | null
          entry_price: number
          exit_at: string | null
          exit_price: number | null
          id: string
          lot_size: number
          metaapi_order_id: string | null
          metaapi_position_id: string | null
          outcome: Database["public"]["Enums"]["trade_outcome"] | null
          pair: Database["public"]["Enums"]["pair"]
          pips_pnl: number | null
          pnl_amount: number | null
          risk_amount: number
          risk_pct: number | null
          signal_id: string
          stop_loss: number
          take_profit_1: number
          take_profit_2: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["direction"]
          entry_at?: string | null
          entry_price: number
          exit_at?: string | null
          exit_price?: number | null
          id?: string
          lot_size: number
          metaapi_order_id?: string | null
          metaapi_position_id?: string | null
          outcome?: Database["public"]["Enums"]["trade_outcome"] | null
          pair: Database["public"]["Enums"]["pair"]
          pips_pnl?: number | null
          pnl_amount?: number | null
          risk_amount: number
          risk_pct?: number | null
          signal_id: string
          stop_loss: number
          take_profit_1: number
          take_profit_2: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["direction"]
          entry_at?: string | null
          entry_price?: number
          exit_at?: string | null
          exit_price?: number | null
          id?: string
          lot_size?: number
          metaapi_order_id?: string | null
          metaapi_position_id?: string | null
          outcome?: Database["public"]["Enums"]["trade_outcome"] | null
          pair?: Database["public"]["Enums"]["pair"]
          pips_pnl?: number | null
          pnl_amount?: number | null
          risk_amount?: number
          risk_pct?: number | null
          signal_id?: string
          stop_loss?: number
          take_profit_1?: number
          take_profit_2?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          country_code: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          digest_frequency: Database["public"]["Enums"]["digest_frequency"]
          email_notifications_enabled: boolean
          telegram_chat_id: string | null
          telegram_notifications_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          digest_frequency?: Database["public"]["Enums"]["digest_frequency"]
          email_notifications_enabled?: boolean
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          digest_frequency?: Database["public"]["Enums"]["digest_frequency"]
          email_notifications_enabled?: boolean
          telegram_chat_id?: string | null
          telegram_notifications_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_signed_disclosure: { Args: never; Returns: boolean }
    }
    Enums: {
      delivery_status: "sent" | "failed" | "bounced"
      digest_frequency: "instant" | "daily" | "weekly"
      direction: "long" | "short"
      entry_zone_type: "order_block" | "fvg"
      event_importance: "low" | "medium" | "high"
      htf_bias: "bullish" | "bearish" | "ranging"
      news_bias: "bullish" | "bearish" | "neutral"
      notification_channel: "email" | "telegram"
      pair:
        | "EUR/USD"
        | "GBP/USD"
        | "USD/JPY"
        | "AUD/USD"
        | "USD/CAD"
        | "USD/CHF"
        | "GBP/JPY"
        | "EUR/JPY"
        | "AUD/JPY"
      session_window: "london" | "ny_am" | "outside"
      signal_classification: "a_plus" | "a" | "b" | "discarded"
      trade_outcome: "win" | "loss" | "breakeven" | "manual_close"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      delivery_status: ["sent", "failed", "bounced"],
      digest_frequency: ["instant", "daily", "weekly"],
      direction: ["long", "short"],
      entry_zone_type: ["order_block", "fvg"],
      event_importance: ["low", "medium", "high"],
      htf_bias: ["bullish", "bearish", "ranging"],
      news_bias: ["bullish", "bearish", "neutral"],
      notification_channel: ["email", "telegram"],
      pair: [
        "EUR/USD",
        "GBP/USD",
        "USD/JPY",
        "AUD/USD",
        "USD/CAD",
        "USD/CHF",
        "GBP/JPY",
        "EUR/JPY",
        "AUD/JPY",
      ],
      session_window: ["london", "ny_am", "outside"],
      signal_classification: ["a_plus", "a", "b", "discarded"],
      trade_outcome: ["win", "loss", "breakeven", "manual_close"],
    },
  },
} as const
