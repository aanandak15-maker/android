import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function YieldPage() {
  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Yield Prediction</h1>
        </div>
        <Badge className="bg-blue-500">ML Powered</Badge>
      </header>

      <Card className="p-6 text-center">
        <p className="text-gray-600">Yield prediction module coming soon...</p>
        <p className="text-sm text-gray-500 mt-2">
          ML-powered crop yield forecasting
        </p>
      </Card>
    </div>
  );
}
