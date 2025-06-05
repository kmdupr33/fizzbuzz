export interface InstanceMetrics {
  instanceId: string;
  cpuUtilization: number;
  memoryUsage: number;
  networkIn: number;
  networkOut: number;
  cost: number;
  region: string;
}

export interface OptimizationRecommendation {
  instanceId: string;
  recommendationType: 'right-sizing' | 'reserved-instance' | 'scheduled-shutdown';
  currentState: string;
  recommendedState: string;
  estimatedSavings: number;
  confidence: number;
  details: string;
}

export interface AnalysisReport {
  timestamp: string;
  region: string;
  recommendations: OptimizationRecommendation[];
  totalEstimatedSavings: number;
  metrics: InstanceMetrics[];
} 