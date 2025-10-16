export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  organic_carbon?: number;
  ndvi?: number;
}

export interface SoilHealthResult {
  score: number;
  grade: "Excellent" | "Good" | "Fair" | "Poor";
  color: string;
  recommendations: string[];
}

export function calculateSoilHealthScore(data: SoilData): SoilHealthResult {
  let score = 0;
  const recommendations: string[] = [];

  // Nitrogen (0-100 ppm) - ideal range 40-60
  if (data.nitrogen >= 40 && data.nitrogen <= 60) {
    score += 20;
  } else if (data.nitrogen >= 30 && data.nitrogen <= 70) {
    score += 15;
    if (data.nitrogen < 40)
      recommendations.push("Consider adding nitrogen fertilizer");
    if (data.nitrogen > 60)
      recommendations.push("Reduce nitrogen application to avoid leaching");
  } else {
    score += 10;
    if (data.nitrogen < 30)
      recommendations.push("⚠️ Low nitrogen - apply organic compost or urea");
    if (data.nitrogen > 70)
      recommendations.push(
        "⚠️ Excess nitrogen - risk of groundwater contamination",
      );
  }

  // Phosphorus (0-100 ppm) - ideal range 25-45
  if (data.phosphorus >= 25 && data.phosphorus <= 45) {
    score += 20;
  } else if (data.phosphorus >= 15 && data.phosphorus <= 55) {
    score += 15;
    if (data.phosphorus < 25)
      recommendations.push("Apply phosphorus-rich fertilizer");
  } else {
    score += 10;
    if (data.phosphorus < 15)
      recommendations.push("⚠️ Low phosphorus - add rock phosphate or DAP");
    if (data.phosphorus > 55)
      recommendations.push("⚠️ High phosphorus - reduce P fertilizers");
  }

  // Potassium (0-100 ppm) - ideal range 120-280 (normalized to 0-100)
  const normalizedK = (data.potassium / 280) * 100;
  if (normalizedK >= 43 && normalizedK <= 100) {
    score += 20;
  } else if (normalizedK >= 30) {
    score += 15;
    recommendations.push("Monitor potassium levels regularly");
  } else {
    score += 10;
    recommendations.push("⚠️ Low potassium - apply potash or MOP");
  }

  // pH (0-14) - ideal range 6.0-7.5
  if (data.ph >= 6.0 && data.ph <= 7.5) {
    score += 20;
  } else if (data.ph >= 5.5 && data.ph <= 8.0) {
    score += 15;
    if (data.ph < 6.0)
      recommendations.push("Soil is slightly acidic - consider liming");
    if (data.ph > 7.5)
      recommendations.push(
        "Soil is slightly alkaline - monitor nutrient availability",
      );
  } else {
    score += 10;
    if (data.ph < 5.5)
      recommendations.push("⚠️ Very acidic soil - apply lime immediately");
    if (data.ph > 8.0)
      recommendations.push(
        "⚠️ Very alkaline soil - add sulfur or organic matter",
      );
  }

  // Moisture (0-100%) - ideal range 40-70%
  if (data.moisture >= 40 && data.moisture <= 70) {
    score += 20;
  } else if (data.moisture >= 30 && data.moisture <= 80) {
    score += 15;
    if (data.moisture < 40)
      recommendations.push("Consider irrigation - soil is getting dry");
    if (data.moisture > 70) recommendations.push("Ensure proper drainage");
  } else {
    score += 10;
    if (data.moisture < 30)
      recommendations.push("⚠️ Critical water stress - irrigate immediately");
    if (data.moisture > 80)
      recommendations.push("⚠️ Waterlogged - improve drainage urgently");
  }

  // Bonus points for NDVI (satellite data) if available
  if (data.ndvi !== undefined) {
    if (data.ndvi > 0.6) {
      score = Math.min(100, score + 5);
      recommendations.push("✅ Healthy vegetation cover detected");
    } else if (data.ndvi < 0.3) {
      recommendations.push("⚠️ Low vegetation health - check crop stress");
    }
  }

  // Determine grade
  let grade: SoilHealthResult["grade"];
  let color: string;

  if (score >= 85) {
    grade = "Excellent";
    color = "#16a34a"; // green-600
  } else if (score >= 70) {
    grade = "Good";
    color = "#84cc16"; // lime-500
  } else if (score >= 55) {
    grade = "Fair";
    color = "#eab308"; // yellow-500
  } else {
    grade = "Poor";
    color = "#ef4444"; // red-500
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "✅ Soil health is optimal - maintain current practices",
    );
  }

  return { score, grade, color, recommendations };
}
