"use client";

import { CheckCircle, Loader2, MapPin, Satellite, Sprout } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SoilFormData {
  latitude: number;
  longitude: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
}

export default function SoilPage() {
  const [step, setStep] = useState<"location" | "form" | "results">("location");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SoilFormData>({
    latitude: 28.6139,
    longitude: 77.209,
    nitrogen: 45,
    phosphorus: 30,
    potassium: 120,
    ph: 6.5,
    moisture: 55,
  });
  const [satelliteData, setSatelliteData] = useState<{
    ndvi: number;
    satellite_moisture: number;
    source: string;
    date: string;
    message?: string;
  } | null>(null);
  const [results, setResults] = useState<{
    id: string;
    latitude: number;
    longitude: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    moisture: number;
    ndvi?: number;
    health: {
      score: number;
      grade: string;
      color: string;
      recommendations: string[];
    };
  } | null>(null);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setLoading(false);
          setStep("form");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          setStep("form"); // Proceed anyway with default coordinates
        },
      );
    } else {
      setLoading(false);
      setStep("form");
    }
  };

  const fetchSatelliteData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/gee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setSatelliteData(data);
    } catch (error) {
      console.error("Satellite data error:", error);
      const mock = {
        ndvi: 0.6 + Math.random() * 0.2,
        satellite_moisture: 40 + Math.random() * 30,
        source: "Mock",
        date: new Date().toISOString().split("T")[0],
      };
      setSatelliteData(mock);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ndvi: satelliteData?.ndvi,
          satellite_moisture: satelliteData?.satellite_moisture,
        }),
      });
      const data = await response.json();
      setResults(data);
      setStep("results");
    } catch (error) {
      console.error("Submit error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sprout className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Soil Analysis</h1>
        </div>
        <Badge className="bg-green-500">Core Module</Badge>
      </header>

      {step === "location" && (
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <MapPin className="w-16 h-16 text-green-600" />
            <h2 className="text-xl font-semibold">Get Your Location</h2>
            <p className="text-sm text-gray-600">
              We need your location to fetch satellite data and provide accurate
              soil analysis.
            </p>
            <Button
              onClick={getLocation}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Getting
                  Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" /> Use My Location
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setStep("form")}
              className="w-full"
            >
              Enter Manually
            </Button>
          </div>
        </Card>
      )}

      {step === "form" && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={fetchSatelliteData}
              disabled={loading}
              variant="outline"
              className="w-full mt-3"
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Fetching...
                </>
              ) : satelliteData ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-2 text-green-600" />{" "}
                  Satellite Data Loaded
                </>
              ) : (
                <>
                  <Satellite className="w-3 h-3 mr-2" /> Fetch Satellite Data
                </>
              )}
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Soil Parameters</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Nitrogen (ppm)</Label>
                  <span className="text-sm font-semibold text-green-600">
                    {formData.nitrogen}
                  </span>
                </div>
                <Slider
                  value={[formData.nitrogen]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, nitrogen: value })
                  }
                  max={100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Phosphorus (ppm)</Label>
                  <span className="text-sm font-semibold text-green-600">
                    {formData.phosphorus}
                  </span>
                </div>
                <Slider
                  value={[formData.phosphorus]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, phosphorus: value })
                  }
                  max={100}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Potassium (ppm)</Label>
                  <span className="text-sm font-semibold text-green-600">
                    {formData.potassium}
                  </span>
                </div>
                <Slider
                  value={[formData.potassium]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, potassium: value })
                  }
                  max={280}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">pH Level</Label>
                  <span className="text-sm font-semibold text-green-600">
                    {formData.ph.toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={[formData.ph]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, ph: value })
                  }
                  min={0}
                  max={14}
                  step={0.1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Moisture (%)</Label>
                  <span className="text-sm font-semibold text-green-600">
                    {formData.moisture}
                  </span>
                </div>
                <Slider
                  value={[formData.moisture]}
                  onValueChange={([value]) =>
                    setFormData({ ...formData, moisture: value })
                  }
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Soil Health"
              )}
            </Button>
          </Card>
        </div>
      )}

      {step === "results" && results && (
        <div className="space-y-4">
          <Card
            className="p-6 text-center"
            style={{ borderColor: results.health.color }}
          >
            <div className="mb-4">
              <div
                className="text-6xl font-bold"
                style={{ color: results.health.color }}
              >
                {results.health.score}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Soil Health Score
              </div>
            </div>
            <Badge
              className="text-lg px-4 py-1"
              style={{ backgroundColor: results.health.color }}
            >
              {results.health.grade}
            </Badge>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {results.health.recommendations.map((rec: string) => (
                <li key={rec} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Soil Parameters</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600">Nitrogen:</span>
                <span className="ml-2 font-semibold">
                  {results.nitrogen} ppm
                </span>
              </div>
              <div>
                <span className="text-gray-600">Phosphorus:</span>
                <span className="ml-2 font-semibold">
                  {results.phosphorus} ppm
                </span>
              </div>
              <div>
                <span className="text-gray-600">Potassium:</span>
                <span className="ml-2 font-semibold">
                  {results.potassium} ppm
                </span>
              </div>
              <div>
                <span className="text-gray-600">pH:</span>
                <span className="ml-2 font-semibold">{results.ph}</span>
              </div>
              <div>
                <span className="text-gray-600">Moisture:</span>
                <span className="ml-2 font-semibold">{results.moisture}%</span>
              </div>
              {results.ndvi && (
                <div>
                  <span className="text-gray-600">NDVI:</span>
                  <span className="ml-2 font-semibold">
                    {results.ndvi.toFixed(3)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Button
            onClick={() => {
              setStep("form");
              setResults(null);
              setSatelliteData(null);
            }}
            variant="outline"
            className="w-full"
          >
            New Analysis
          </Button>
        </div>
      )}
    </div>
  );
}
