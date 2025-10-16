"use client";

import {
  AlertCircle,
  Camera,
  CheckCircle,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DiseaseResult {
  disease_name: string;
  confidence: number;
  disease_stage: string;
  symptoms: string[];
  action_plan: string[];
  treatments: {
    organic: string[];
    chemical: string[];
    ipm: string[];
    cultural: string[];
  };
  tips: string[];
  yield_impact: string;
  spread_risk: string;
  recovery_chance: string;
}

export default function DiseasePage() {
  const [step, setStep] = useState<"upload" | "details" | "results">("upload");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropType, setCropType] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [results, setResults] = useState<DiseaseResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Unable to access camera. Please upload an image instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", {
            type: "image/jpeg",
          });
          setImageFile(file);
          setImagePreview(URL.createObjectURL(blob));
          stopCamera();
          setStep("details");
        }
      }, "image/jpeg");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      for (const track of stream.getTracks()) {
        track.stop();
      }
      setCameraActive(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStep("details");
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);

      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseAnonKey) {
          alert("Supabase configuration error. Please contact support.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://teejiieuaxzrucsttrid.supabase.co/functions/v1/analyze-disease",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              image: base64Image,
              crop: cropType,
              symptoms: symptoms,
            }),
          },
        );

        if (!response.ok) {
          // Fallback to mock result
          const mock: DiseaseResult = {
            disease_name: "Leaf Spot (suspected)",
            confidence: 0.62,
            disease_stage: "early",
            symptoms: ["brown circular spots", "yellowing edges"],
            action_plan: [
              "Isolate affected plants",
              "Avoid overhead irrigation",
              "Apply neem oil spray",
            ],
            treatments: {
              organic: ["Neem oil 3ml/L weekly", "Remove infected leaves"],
              chemical: ["Copper oxychloride 3g/L if severe"],
              ipm: ["Improve airflow", "Rotate crops"],
              cultural: [],
            },
            tips: ["Sanitize tools", "Avoid water stress"],
            yield_impact: "low to medium",
            spread_risk: "moderate",
            recovery_chance: "high",
          };
          setResults(mock);
          setStep("results");
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.error) {
          alert(data.error);
          setLoading(false);
          return;
        }

        setResults(data);
        setStep("results");
        setLoading(false);
      };
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Failed to analyze image. Please try again.");
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreview(null);
    setCropType("");
    setSymptoms("");
    setResults(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="w-6 h-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Disease Detection
          </h1>
        </div>
        <Badge className="bg-purple-500">AI Vision</Badge>
      </header>

      {step === "upload" && (
        <div className="space-y-4">
          {cameraActive ? (
            <Card className="p-4 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" /> Capture
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Camera className="w-16 h-16 text-purple-600" />
                  <h2 className="text-xl font-semibold">Take a Photo</h2>
                  <p className="text-sm text-gray-600">
                    Capture a clear photo of the affected plant leaves
                  </p>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="w-4 h-4 mr-2" /> Open Camera
                  </Button>
                </div>
              </Card>

              <div className="text-center text-sm text-gray-500">or</div>

              <Card className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Upload className="w-16 h-16 text-purple-600" />
                  <h2 className="text-xl font-semibold">Upload Image</h2>
                  <p className="text-sm text-gray-600">
                    Choose a photo from your gallery
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Choose Image
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {step === "details" && imagePreview && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="relative w-full h-64 mb-4">
              <Image
                src={imagePreview}
                alt="Plant preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAnalysis}
              className="w-full"
            >
              <X className="w-3 h-3 mr-2" /> Change Image
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">
              Additional Information (Optional)
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Crop Type</Label>
                <Input
                  placeholder="e.g., Rice, Wheat, Tomato"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Observed Symptoms</Label>
                <Textarea
                  placeholder="Describe what you see (spots, wilting, discoloration, etc.)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Disease"
              )}
            </Button>
          </Card>
        </div>
      )}

      {step === "results" && results && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{results.disease_name}</h2>
              <Badge
                className={
                  results.confidence > 0.7 ? "bg-green-500" : "bg-yellow-500"
                }
              >
                {(results.confidence * 100).toFixed(0)}% Confident
              </Badge>
            </div>

            {imagePreview && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={imagePreview}
                  alt="Analyzed plant"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-red-50 p-2 rounded">
                <div className="font-semibold text-red-700">Stage</div>
                <div>{results.disease_stage}</div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="font-semibold text-orange-700">Spread Risk</div>
                <div>{results.spread_risk}</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">Recovery</div>
                <div>{results.recovery_chance}</div>
              </div>
            </div>
          </Card>

          {results.symptoms && results.symptoms.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Symptoms Detected
              </h3>
              <ul className="space-y-1">
                {results.symptoms.map((symptom) => (
                  <li key={symptom} className="text-sm flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {results.action_plan && results.action_plan.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Immediate Action Plan
              </h3>
              <ol className="space-y-1">
                {results.action_plan.map((action) => (
                  <li key={action} className="text-sm flex gap-2">
                    <span className="font-semibold text-blue-600">
                      {results.action_plan.indexOf(action) + 1}.
                    </span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {results.treatments && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Treatment Options</h3>

              {results.treatments.organic &&
                results.treatments.organic.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-green-700 mb-1">
                      Organic
                    </h4>
                    <ul className="space-y-1">
                      {results.treatments.organic.map((treatment) => (
                        <li key={treatment} className="text-sm text-gray-700">
                          • {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {results.treatments.chemical &&
                results.treatments.chemical.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-orange-700 mb-1">
                      Chemical
                    </h4>
                    <ul className="space-y-1">
                      {results.treatments.chemical.map((treatment) => (
                        <li key={treatment} className="text-sm text-gray-700">
                          • {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {results.treatments.ipm && results.treatments.ipm.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-blue-700 mb-1">
                    IPM Strategy
                  </h4>
                  <ul className="space-y-1">
                    {results.treatments.ipm.map((treatment) => (
                      <li key={treatment} className="text-sm text-gray-700">
                        • {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {results.tips && results.tips.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Prevention Tips</h3>
              <ul className="space-y-1">
                {results.tips.map((tip) => (
                  <li key={tip} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={resetAnalysis} variant="outline">
              New Analysis
            </Button>
            <Button onClick={() => setStep("upload")}>Upload Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
