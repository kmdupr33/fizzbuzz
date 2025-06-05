import { CloudWatchClient, GetMetricStatisticsCommand } from '@aws-sdk/client-cloudwatch';
import { EC2Client, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { CostExplorerClient, GetCostAndUsageCommand } from '@aws-sdk/client-cost-explorer';
import { InstanceMetrics } from '../domain/types';

export class AWSService {
  private cloudWatchClient: CloudWatchClient;
  private ec2Client: EC2Client;
  private costExplorerClient: CostExplorerClient;
  private region: string;

  constructor(region: string) {
    this.region = region;
    this.cloudWatchClient = new CloudWatchClient({ region });
    this.ec2Client = new EC2Client({ region });
    this.costExplorerClient = new CostExplorerClient({ region });
  }

  async getInstanceMetrics(instanceId: string): Promise<InstanceMetrics> {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7); // Last 7 days

    const [cpuUtilization, memoryUsage, networkIn, networkOut] = await Promise.all([
      this.getMetricAverage('CPUUtilization', instanceId, startTime, endTime),
      this.getMetricAverage('MemoryUtilization', instanceId, startTime, endTime),
      this.getMetricAverage('NetworkIn', instanceId, startTime, endTime),
      this.getMetricAverage('NetworkOut', instanceId, startTime, endTime),
    ]);

    const cost = await this.getInstanceCost(instanceId, startTime, endTime);

    return {
      instanceId,
      cpuUtilization,
      memoryUsage,
      networkIn,
      networkOut,
      cost,
      region: this.region,
    };
  }

  private async getMetricAverage(
    metricName: string,
    instanceId: string,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    const command = new GetMetricStatisticsCommand({
      Namespace: 'AWS/EC2',
      MetricName: metricName,
      Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
      StartTime: startTime,
      EndTime: endTime,
      Period: 86400, // Daily
      Statistics: ['Average'],
    });

    const response = await this.cloudWatchClient.send(command);
    const datapoints = response.Datapoints || [];
    
    if (datapoints.length === 0) return 0;
    
    const sum = datapoints.reduce((acc, point) => acc + (point.Average || 0), 0);
    return sum / datapoints.length;
  }

  private async getInstanceCost(
    instanceId: string,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    const command = new GetCostAndUsageCommand({
      TimePeriod: {
        Start: startTime.toISOString().split('T')[0],
        End: endTime.toISOString().split('T')[0],
      },
      Granularity: 'MONTHLY',
      Filter: {
        Dimensions: {
          Key: 'RESOURCE_ID',
          Values: [instanceId],
        },
      },
      Metrics: ['UnblendedCost'],
    });

    const response = await this.costExplorerClient.send(command);
    const results = response.ResultsByTime || [];
    
    if (results.length === 0) return 0;
    
    return parseFloat(results[0].Total?.UnblendedCost?.Amount || '0');
  }

  async listInstances(): Promise<string[]> {
    const command = new DescribeInstancesCommand({});
    const response = await this.ec2Client.send(command);
    
    return response.Reservations?.flatMap(reservation =>
      reservation.Instances?.map(instance => instance.InstanceId || '') || []
    ).filter(Boolean) || [];
  }
} 