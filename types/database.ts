export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      soil_analyses: {
        Row: {
          id: string;
          user_id: string | null;
          farm_id: string | null;
          latitude: number | null;
          longitude: number | null;
          nitrogen: number | null;
          phosphorus: number | null;
          potassium: number | null;
          ph: number | null;
          organic_carbon: number | null;
          moisture: number | null;
          ndvi: number | null;
          satellite_moisture: number | null;
          soil_health_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          farm_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          nitrogen?: number | null;
          phosphorus?: number | null;
          potassium?: number | null;
          ph?: number | null;
          organic_carbon?: number | null;
          moisture?: number | null;
          ndvi?: number | null;
          satellite_moisture?: number | null;
          soil_health_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          farm_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          nitrogen?: number | null;
          phosphorus?: number | null;
          potassium?: number | null;
          ph?: number | null;
          organic_carbon?: number | null;
          moisture?: number | null;
          ndvi?: number | null;
          satellite_moisture?: number | null;
          soil_health_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      yield_predictions: {
        Row: {
          id: string;
          soil_analysis_id: string | null;
          crop_type: string | null;
          variety: string | null;
          sowing_date: string | null;
          predicted_yield: number | null;
          confidence_score: number | null;
          economic_value: number | null;
          prediction_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          soil_analysis_id?: string | null;
          crop_type?: string | null;
          variety?: string | null;
          sowing_date?: string | null;
          predicted_yield?: number | null;
          confidence_score?: number | null;
          economic_value?: number | null;
          prediction_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          soil_analysis_id?: string | null;
          crop_type?: string | null;
          variety?: string | null;
          sowing_date?: string | null;
          predicted_yield?: number | null;
          confidence_score?: number | null;
          economic_value?: number | null;
          prediction_data?: Json | null;
          created_at?: string;
        };
      };
      disease_detections: {
        Row: {
          id: string;
          soil_analysis_id: string | null;
          image_url: string | null;
          disease_name: string | null;
          confidence: number | null;
          disease_stage: string | null;
          symptoms: Json | null;
          treatments: Json | null;
          status: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          soil_analysis_id?: string | null;
          image_url?: string | null;
          disease_name?: string | null;
          confidence?: number | null;
          disease_stage?: string | null;
          symptoms?: Json | null;
          treatments?: Json | null;
          status?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          soil_analysis_id?: string | null;
          image_url?: string | null;
          disease_name?: string | null;
          confidence?: number | null;
          disease_stage?: string | null;
          symptoms?: Json | null;
          treatments?: Json | null;
          status?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      irrigation_schedules: {
        Row: {
          id: string;
          soil_analysis_id: string | null;
          schedule_date: string | null;
          water_need_mm: number | null;
          water_need_litres: number | null;
          crop_stage: string | null;
          et0: number | null;
          notification_sent: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          soil_analysis_id?: string | null;
          schedule_date?: string | null;
          water_need_mm?: number | null;
          water_need_litres?: number | null;
          crop_stage?: string | null;
          et0?: number | null;
          notification_sent?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          soil_analysis_id?: string | null;
          schedule_date?: string | null;
          water_need_mm?: number | null;
          water_need_litres?: number | null;
          crop_stage?: string | null;
          et0?: number | null;
          notification_sent?: boolean | null;
          created_at?: string;
        };
      };
      expert_consultations: {
        Row: {
          id: string;
          user_id: string | null;
          expert_id: string | null;
          question: string | null;
          answer: string | null;
          status: string | null;
          created_at: string;
          answered_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          expert_id?: string | null;
          question?: string | null;
          answer?: string | null;
          status?: string | null;
          created_at?: string;
          answered_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          expert_id?: string | null;
          question?: string | null;
          answer?: string | null;
          status?: string | null;
          created_at?: string;
          answered_at?: string | null;
        };
      };
      user_farms: {
        Row: {
          id: string;
          user_id: string | null;
          farm_name: string | null;
          latitude: number | null;
          longitude: number | null;
          area_hectares: number | null;
          polygon: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          farm_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area_hectares?: number | null;
          polygon?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          farm_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          area_hectares?: number | null;
          polygon?: Json | null;
          created_at?: string;
        };
      };
      ai_recommendations: {
        Row: {
          id: string;
          user_id: string | null;
          farm_id: string | null;
          aggregated_data: Json | null;
          recommendations: Json | null;
          farm_health_score: number | null;
          urgent_actions: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          farm_id?: string | null;
          aggregated_data?: Json | null;
          recommendations?: Json | null;
          farm_health_score?: number | null;
          urgent_actions?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          farm_id?: string | null;
          aggregated_data?: Json | null;
          recommendations?: Json | null;
          farm_health_score?: number | null;
          urgent_actions?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
