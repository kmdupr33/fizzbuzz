import { Command } from 'commander';
import { AWSService } from './infrastructure/aws-service';
import { OptimizationService } from './domain/optimization-service';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('aws-optimizer')
  .description('AWS Cloud Infrastructure Optimization Tool')
  .version('1.0.0');

program
  .option('-r, --region <region>', 'AWS region to analyze', 'us-east-1')
  .option('-o, --output <format>', 'Output format (json|text)', 'text')
  .option('-f, --file <path>', 'Output file path')
  .option('-t, --threshold <number>', 'CPU utilization threshold', '40');

program.parse();

const options = program.opts();

async function main() {
  try {
    console.log(chalk.blue('Starting AWS infrastructure analysis...'));
    
    const awsService = new AWSService(options.region);
    const optimizationService = new OptimizationService();
    
    // Get list of instances
    console.log(chalk.yellow('Fetching instance list...'));
    const instances = await awsService.listInstances();
    
    if (instances.length === 0) {
      console.log(chalk.yellow('No instances found in the specified region.'));
      return;
    }
    
    // Get metrics for each instance
    console.log(chalk.yellow('Analyzing instance metrics...'));
    const metrics = await Promise.all(
      instances.map(instanceId => awsService.getInstanceMetrics(instanceId))
    );
    
    // Generate recommendations
    console.log(chalk.yellow('Generating optimization recommendations...'));
    const report = optimizationService.analyzeMetrics(metrics);
    
    // Output results
    if (options.file) {
      const output = options.output === 'json' 
        ? JSON.stringify(report, null, 2)
        : formatTextReport(report);
      
      fs.writeFileSync(options.file, output);
      console.log(chalk.green(`Report written to ${options.file}`));
    } else {
      if (options.output === 'json') {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatTextReport(report));
      }
    }
    
    console.log(chalk.green('Analysis complete!'));
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

function formatTextReport(report: any): string {
  let output = '\nAWS Infrastructure Optimization Report\n';
  output += '=====================================\n\n';
  
  output += `Region: ${report.region}\n`;
  output += `Timestamp: ${report.timestamp}\n`;
  output += `Total Estimated Savings: $${report.totalEstimatedSavings.toFixed(2)}\n\n`;
  
  output += 'Recommendations:\n';
  output += '----------------\n';
  
  report.recommendations.forEach((rec: any) => {
    output += `\nInstance: ${rec.instanceId}\n`;
    output += `Type: ${rec.recommendationType}\n`;
    output += `Current State: ${rec.currentState}\n`;
    output += `Recommended State: ${rec.recommendedState}\n`;
    output += `Estimated Savings: $${rec.estimatedSavings.toFixed(2)}\n`;
    output += `Confidence: ${(rec.confidence * 100).toFixed(1)}%\n`;
    output += `Details: ${rec.details}\n`;
    output += '----------------\n';
  });
  
  return output;
}

main(); 