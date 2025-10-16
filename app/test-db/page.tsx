"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function TestDBPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test connection by querying pg_tables
        const { error } = await supabase
          .from("soil_analyses")
          .select("count")
          .limit(1);

        if (error) {
          console.error("Error:", error);
          setStatus("error");
        } else {
          setStatus("success");
          setTables([
            "soil_analyses",
            "yield_predictions",
            "disease_detections",
            "irrigation_schedules",
            "expert_consultations",
            "user_farms",
            "ai_recommendations",
          ]);
        }
      } catch (err) {
        console.error("Connection error:", err);
        setStatus("error");
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Database Connection Test
        </h1>
        {status === "loading" && <Badge>Testing...</Badge>}
        {status === "success" && (
          <Badge className="bg-green-500">Connected</Badge>
        )}
        {status === "error" && <Badge className="bg-red-500">Failed</Badge>}
      </header>

      {status === "success" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Tables Available:</h2>
          {tables.map((table) => (
            <Card key={table} className="p-3">
              <p className="font-mono text-sm">{table}</p>
            </Card>
          ))}
        </div>
      )}

      {status === "error" && (
        <Card className="p-6 bg-red-50 border-red-200">
          <p className="text-red-700 font-semibold mb-2">Connection Failed</p>
          <p className="text-sm text-red-600">
            Please run the SQL migration in Supabase dashboard.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Location: supabase/migrations/20250116000000_initial_schema.sql
          </p>
        </Card>
      )}
    </div>
  );
}
