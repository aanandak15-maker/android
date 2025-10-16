-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create soil_analyses table
CREATE TABLE soil_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  farm_id UUID,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  nitrogen DECIMAL(5, 2),
  phosphorus DECIMAL(5, 2),
  potassium DECIMAL(5, 2),
  ph DECIMAL(4, 2),
  organic_carbon DECIMAL(5, 2),
  moisture DECIMAL(5, 2),
  ndvi DECIMAL(5, 4),
  satellite_moisture DECIMAL(5, 2),
  soil_health_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create yield_predictions table
CREATE TABLE yield_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soil_analysis_id UUID REFERENCES soil_analyses(id),
  crop_type VARCHAR(100),
  variety VARCHAR(100),
  sowing_date DATE,
  predicted_yield DECIMAL(8, 2),
  confidence_score DECIMAL(5, 2),
  economic_value DECIMAL(10, 2),
  prediction_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create disease_detections table
CREATE TABLE disease_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soil_analysis_id UUID REFERENCES soil_analyses(id),
  image_url TEXT,
  disease_name VARCHAR(255),
  confidence DECIMAL(5, 2),
  disease_stage VARCHAR(50),
  symptoms JSONB,
  treatments JSONB,
  status VARCHAR(50) DEFAULT 'detected',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create irrigation_schedules table
CREATE TABLE irrigation_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soil_analysis_id UUID REFERENCES soil_analyses(id),
  schedule_date DATE,
  water_need_mm DECIMAL(6, 2),
  water_need_litres DECIMAL(10, 2),
  crop_stage VARCHAR(100),
  et0 DECIMAL(6, 2),
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expert_consultations table
CREATE TABLE expert_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  expert_id UUID,
  question TEXT,
  answer TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ
);

-- Create user_farms table
CREATE TABLE user_farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  farm_name VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area_hectares DECIMAL(8, 2),
  polygon JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_recommendations table
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  farm_id UUID,
  aggregated_data JSONB,
  recommendations JSONB,
  farm_health_score INTEGER,
  urgent_actions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE soil_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE yield_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anon access (no auth yet)
CREATE POLICY "Allow all operations for anon" ON soil_analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON yield_predictions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON disease_detections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON irrigation_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON expert_consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON user_farms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON ai_recommendations FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_soil_analyses_created_at ON soil_analyses(created_at DESC);
CREATE INDEX idx_soil_analyses_farm_id ON soil_analyses(farm_id);
CREATE INDEX idx_yield_predictions_soil_id ON yield_predictions(soil_analysis_id);
CREATE INDEX idx_disease_detections_soil_id ON disease_detections(soil_analysis_id);
CREATE INDEX idx_irrigation_schedules_date ON irrigation_schedules(schedule_date);
CREATE INDEX idx_user_farms_user_id ON user_farms(user_id);
