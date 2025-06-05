# AWS Infrastructure Optimizer

A command-line tool that analyzes AWS CloudWatch metrics and cost data to identify underutilized resources and provide optimization recommendations.

## Features

- Analyzes EC2 instances for:
  - CPU utilization patterns
  - Memory usage
  - Network I/O
  - Associated costs
- Generates recommendations for:
  - Instance right-sizing
  - Reserved Instance opportunities
  - Resources that could be scheduled for off-hours shutdown
- Outputs detailed reports in both JSON and human-readable formats
- Supports multiple AWS regions
- Configurable thresholds and output options

## Prerequisites

- Node.js 14.x or later
- AWS credentials configured (via AWS CLI or environment variables)
- Required AWS permissions:
  - CloudWatch: GetMetricStatistics
  - EC2: DescribeInstances
  - Cost Explorer: GetCostAndUsage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aws-infrastructure-optimizer.git
cd aws-infrastructure-optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

Basic usage:
```bash
npm start
```

With options:
```bash
npm start -- -r us-west-2 -o json -f report.json -t 30
```

### Command Line Options

- `-r, --region <region>`: AWS region to analyze (default: us-east-1)
- `-o, --output <format>`: Output format (json|text) (default: text)
- `-f, --file <path>`: Output file path
- `-t, --threshold <number>`: CPU utilization threshold (default: 40)

## Example Output

```
AWS Infrastructure Optimization Report
=====================================

Region: us-east-1
Timestamp: 2024-03-20T10:00:00.000Z
Total Estimated Savings: $1500.00

Recommendations:
----------------

Instance: i-1234567890abcdef0
Type: right-sizing
Current State: Current instance size
Recommended State: Downsize instance
Estimated Savings: $500.00
Confidence: 85.0%
Details: Instance shows low CPU utilization (25.50%). Consider downsizing to a smaller instance type.
----------------
```

## Development

1. Install development dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Run linter:
```bash
npm run lint
```

## Project Structure

```
src/
├── domain/
│   ├── types.ts
│   └── optimization-service.ts
├── infrastructure/
│   └── aws-service.ts
└── index.ts
```

## Design Decisions

- Used TypeScript for better type safety and maintainability
- Implemented clean architecture pattern to separate concerns
- Used AWS SDK v3 for better modularity and tree-shaking
- Implemented proper error handling and logging
- Used Commander.js for CLI argument parsing
- Implemented caching to minimize API calls

## Future Improvements

- Support for multiple cloud providers
- Interactive CLI interface
- Containerized solution with Docker
- CI/CD pipeline configuration
- More detailed cost analysis
- Support for additional resource types
- Custom recommendation rules
- Export to various formats (CSV, PDF)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 