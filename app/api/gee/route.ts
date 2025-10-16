import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEE API key not configured" },
        { status: 500 },
      );
    }

    // Simplified GEE data fetching using Earth Engine REST API
    // Note: For production, use official GEE Python/JS client
    // This is a placeholder that simulates satellite data based on location

    // For now, we'll use a mock calculation based on coordinates
    // In production, this would call actual GEE APIs
    const mockNDVI = 0.45 + Math.random() * 0.3; // 0.45-0.75 range
    const mockMoisture = 40 + Math.random() * 30; // 40-70% range

    return NextResponse.json({
      ndvi: parseFloat(mockNDVI.toFixed(4)),
      satellite_moisture: parseFloat(mockMoisture.toFixed(2)),
      source: "Sentinel-2",
      date: new Date().toISOString().split("T")[0],
      message: "Using simulated satellite data. Configure GEE for real data.",
    });
  } catch (error) {
    console.error("GEE API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch satellite data" },
      { status: 500 },
    );
  }
}
