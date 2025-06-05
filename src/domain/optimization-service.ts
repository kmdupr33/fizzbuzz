import { InstanceMetrics, OptimizationRecommendation, AnalysisReport } from './types';

export class OptimizationService {
  private readonly CPU_UTILIZATION_THRESHOLD = 40; // 40% average CPU utilization
  private readonly MEMORY_UTILIZATION_THRESHOLD = 60; // 60% average memory utilization
  private readonly NETWORK_UTILIZATION_THRESHOLD = 50; // 50% of network capacity

  analyzeMetrics(metrics: InstanceMetrics[]): AnalysisReport {
    const recommendations: OptimizationRecommendation[] = [];
    let totalEstimatedSavings = 0;

    for (const metric of metrics) {
      const instanceRecommendations = this.generateRecommendations(metric);
      recommendations.push(...instanceRecommendations);
      
      totalEstimatedSavings += instanceRecommendations.reduce(
        (sum, rec) => sum + rec.estimatedSavings,
        0
      );
    }

    return {
      timestamp: new Date().toISOString(),
      region: metrics[0]?.region || 'unknown',
      recommendations,
      totalEstimatedSavings,
      metrics,
    };
  }

  private generateRecommendations(metric: InstanceMetrics): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Right-sizing recommendation
    if (metric.cpuUtilization < this.CPU_UTILIZATION_THRESHOLD) {
      recommendations.push({
        instanceId: metric.instanceId,
        recommendationType: 'right-sizing',
        currentState: 'Current instance size',
        recommendedState: 'Downsize instance',
        estimatedSavings: metric.cost * 0.3, // Estimate 30% cost reduction
        confidence: this.calculateConfidence(metric.cpuUtilization),
        details: `Instance shows low CPU utilization (${metric.cpuUtilization.toFixed(2)}%). Consider downsizing to a smaller instance type.`,
      });
    }

    // Reserved Instance recommendation
    if (metric.cpuUtilization > this.CPU_UTILIZATION_THRESHOLD * 1.5) {
      recommendations.push({
        instanceId: metric.instanceId,
        recommendationType: 'reserved-instance',
        currentState: 'On-demand instance',
        recommendedState: 'Reserved instance',
        estimatedSavings: metric.cost * 0.4, // Estimate 40% cost reduction with RI
        confidence: 0.8,
        details: 'High and consistent utilization suggests this instance would benefit from a Reserved Instance purchase.',
      });
    }

    // Scheduled shutdown recommendation
    if (
      metric.cpuUtilization < this.CPU_UTILIZATION_THRESHOLD &&
      metric.memoryUsage < this.MEMORY_UTILIZATION_THRESHOLD &&
      metric.networkIn < this.NETWORK_UTILIZATION_THRESHOLD
    ) {
      recommendations.push({
        instanceId: metric.instanceId,
        recommendationType: 'scheduled-shutdown',
        currentState: 'Running 24/7',
        recommendedState: 'Scheduled shutdown during off-hours',
        estimatedSavings: metric.cost * 0.5, // Estimate 50% cost reduction
        confidence: this.calculateConfidence(
          Math.min(metric.cpuUtilization, metric.memoryUsage, metric.networkIn)
        ),
        details: 'Low utilization across all metrics suggests this instance could be shut down during non-business hours.',
      });
    }

    return recommendations;
  }

  private calculateConfidence(utilization: number): number {
    // Higher confidence when utilization is very low
    return Math.max(0.5, 1 - utilization / 100);
  }
} 