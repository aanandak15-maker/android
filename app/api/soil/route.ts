import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { calculateSoilHealthScore } from "@/lib/soil-health";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file.",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      latitude,
      longitude,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      organic_carbon,
      moisture,
      ndvi,
      satellite_moisture,
      farm_id,
    } = body;

    // Calculate health score
    const healthResult = calculateSoilHealthScore({
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture,
      organic_carbon,
      ndvi,
    });

    // Try to save to Supabase, but continue with mock data if it fails
    let savedData = null;
    try {
      const { data, error } = await supabase
        .from("soil_analyses")
        .insert({
          latitude,
          longitude,
          nitrogen,
          phosphorus,
          potassium,
          ph,
          organic_carbon,
          moisture,
          ndvi,
          satellite_moisture,
          soil_health_score: healthResult.score,
          farm_id,
        })
        .select()
        .single();

      if (!error) {
        savedData = data;
      } else {
        console.warn("Supabase save failed, using mock response:", error);
      }
    } catch (dbError) {
      console.warn("Database connection failed, using mock response:", dbError);
    }

    // Return mock data if database save failed
    const responseData = savedData || {
      id: `mock-${Date.now()}`,
      latitude,
      longitude,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      organic_carbon,
      moisture,
      ndvi,
      satellite_moisture,
      soil_health_score: healthResult.score,
      farm_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      ...responseData,
      health: healthResult,
    });
  } catch (error) {
    console.error("Soil API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const { data, error } = await supabase
      .from("soil_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch soil analyses" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Soil GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
