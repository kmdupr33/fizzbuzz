import { OptimizationService } from './optimization-service';
import { InstanceMetrics } from './types';

describe('OptimizationService', () => {
  let service: OptimizationService;

  beforeEach(() => {
    service = new OptimizationService();
  });

  describe('analyzeMetrics', () => {
    it('should generate recommendations for underutilized instances', () => {
      const metrics: InstanceMetrics[] = [
        {
          instanceId: 'i-1234567890abcdef0',
          cpuUtilization: 25,
          memoryUsage: 30,
          networkIn: 20,
          networkOut: 15,
          cost: 100,
          region: 'us-east-1',
        },
      ];

      const report = service.analyzeMetrics(metrics);

      expect(report.recommendations).toHaveLength(2); // Should have right-sizing and scheduled-shutdown recommendations
      expect(report.totalEstimatedSavings).toBeGreaterThan(0);
      expect(report.region).toBe('us-east-1');
    });

    it('should generate recommendations for highly utilized instances', () => {
      const metrics: InstanceMetrics[] = [
        {
          instanceId: 'i-1234567890abcdef0',
          cpuUtilization: 80,
          memoryUsage: 70,
          networkIn: 60,
          networkOut: 55,
          cost: 200,
          region: 'us-east-1',
        },
      ];

      const report = service.analyzeMetrics(metrics);

      expect(report.recommendations).toHaveLength(1); // Should have reserved-instance recommendation
      expect(report.totalEstimatedSavings).toBeGreaterThan(0);
    });

    it('should handle empty metrics array', () => {
      const report = service.analyzeMetrics([]);

      expect(report.recommendations).toHaveLength(0);
      expect(report.totalEstimatedSavings).toBe(0);
      expect(report.region).toBe('unknown');
    });
  });
}); 