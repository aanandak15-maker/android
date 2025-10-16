import { z } from "zod";

// Soil Analysis Schema
export const soilAnalysisSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  nitrogen: z.number().min(0).max(100),
  phosphorus: z.number().min(0).max(100),
  potassium: z.number().min(0).max(100),
  ph: z.number().min(0).max(14),
  organic_carbon: z.number().min(0).max(10).optional(),
  moisture: z.number().min(0).max(100),
  farm_id: z.string().uuid().optional(),
});

export type SoilAnalysisInput = z.infer<typeof soilAnalysisSchema>;

// Yield Prediction Schema
export const yieldPredictionSchema = z.object({
  soil_analysis_id: z.string().uuid(),
  crop_type: z.string().min(1),
  variety: z.string().min(1),
  sowing_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type YieldPredictionInput = z.infer<typeof yieldPredictionSchema>;

// Disease Detection Schema
export const diseaseDetectionSchema = z.object({
  soil_analysis_id: z.string().uuid().optional(),
  image: z.instanceof(File).or(z.string()),
  crop_type: z.string().optional(),
  symptoms: z.string().optional(),
});

export type DiseaseDetectionInput = z.infer<typeof diseaseDetectionSchema>;

// Irrigation Schedule Schema
export const irrigationScheduleSchema = z.object({
  soil_analysis_id: z.string().uuid(),
  schedule_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  water_need_mm: z.number().positive(),
  crop_stage: z.string(),
});

export type IrrigationScheduleInput = z.infer<typeof irrigationScheduleSchema>;

// Expert Consultation Schema
export const expertConsultationSchema = z.object({
  question: z.string().min(10).max(1000),
  expert_id: z.string().uuid().optional(),
});

export type ExpertConsultationInput = z.infer<typeof expertConsultationSchema>;

// User Farm Schema
export const userFarmSchema = z.object({
  farm_name: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  area_hectares: z.number().positive(),
  polygon: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    )
    .optional(),
});

export type UserFarmInput = z.infer<typeof userFarmSchema>;
