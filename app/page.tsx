import {
  Camera,
  CloudRain,
  DollarSign,
  Sparkles,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          🌾 Agri Smart Platform
        </h1>
        <p className="text-sm text-gray-600">
          Comprehensive farm management with AI insights
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-green-50 border-green-200">
          <Sprout className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-sm">Soil Analysis</h3>
          <p className="text-xs text-gray-600">Core Module</p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-sm">Yield Prediction</h3>
          <p className="text-xs text-gray-600">ML Powered</p>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <Camera className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-sm">Disease Detection</h3>
          <p className="text-xs text-gray-600">AI Vision</p>
        </Card>

        <Card className="p-4 bg-cyan-50 border-cyan-200">
          <CloudRain className="w-8 h-8 text-cyan-600 mb-2" />
          <h3 className="font-semibold text-sm">Weather</h3>
          <p className="text-xs text-gray-600">Real-time</p>
        </Card>
      </div>

      <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-1">AI Agent Dashboard</h3>
            <p className="text-xs text-gray-600">Unified recommendations</p>
          </div>
          <Sparkles className="w-10 h-10 text-green-600" />
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Status</p>
            <p className="font-semibold">All Systems</p>
          </div>
          <Badge className="bg-green-500">Active</Badge>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Monthly Cost</p>
            <p className="font-semibold text-2xl">$0.00</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-600" />
        </Card>
      </div>
    </div>
  );
}
