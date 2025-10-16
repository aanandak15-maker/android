const { createClient } = require("@supabase/supabase-js");

// Using the NEW Supabase project credentials
const supabaseUrl = "https://qwggdywnbnldsvbuyeya.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3Z2dkeXduYm5sZHN2YnV5ZXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1ODE0OTgsImV4cCI6MjA3NjE1NzQ5OH0.s70jatrnvIkUGvHIeJn1d-E3J6aXXs366zzN8RRnA1g";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection...");
  console.log("URL:", supabaseUrl);
  console.log("");

  try {
    // Test basic connection
    const { error: testError } = await supabase
      .from("soil_analyses")
      .select("count")
      .limit(1);

    if (testError) {
      console.log("❌ Connection failed:", testError.message);
      return;
    }

    console.log("✅ Connected to Supabase successfully!");
    console.log("");

    // Check all tables
    const tables = [
      "soil_analyses",
      "yield_predictions",
      "disease_detections",
      "irrigation_schedules",
      "expert_consultations",
      "user_farms",
      "ai_recommendations",
    ];

    console.log("Checking tables:");
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`✅ ${table}: Exists (${count || 0} records)`);
      }
    }

    // Test inserting a sample soil analysis
    console.log("\n📝 Testing data insertion...");
    const { data: insertData, error: insertError } = await supabase
      .from("soil_analyses")
      .insert({
        latitude: 28.6139,
        longitude: 77.209,
        nitrogen: 45.5,
        phosphorus: 30.2,
        potassium: 40.8,
        ph: 6.8,
        moisture: 65.0,
        soil_health_score: 75,
      })
      .select()
      .single();

    if (insertError) {
      console.log("❌ Insert failed:", insertError.message);
    } else {
      console.log("✅ Data inserted successfully!");
      console.log("   ID:", insertData.id);
      console.log("   Created at:", insertData.created_at);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testConnection();
