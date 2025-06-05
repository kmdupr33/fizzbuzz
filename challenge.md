Cloud Infrastructure Optimization Challenge
Background
You are working for a software consultancy that helps enterprises optimize their cloud infrastructure and development practices. One of your clients is experiencing significant cost overruns in their AWS environment and needs help identifying and resolving inefficiencies.

Challenge Description
Create a command-line tool that analyzes AWS CloudWatch metrics and cost data to identify underutilized resources and provide optimization recommendations. The tool should:

Connect to AWS using the provided credentials (you can use mock data for the challenge)
Analyze EC2 instances for:
CPU utilization patterns
Memory usage
Network I/O
Associated costs
Generate recommendations for:
Instance right-sizing
Reserved Instance opportunities
Resources that could be scheduled for off-hours shutdown
Output a detailed report in both JSON and human-readable formats
Requirements
Technical Requirements
Use Python or Node.js
Implement proper error handling and logging
Include unit tests with at least 80% coverage
Follow clean code principles and include documentation
Use type hints/TypeScript for better code maintainability
Implement the repository using a clean architecture pattern
Functional Requirements
The tool must be configurable via command line arguments or a config file
Support analyzing multiple AWS regions
Include a cost savings estimate for each recommendation
Handle rate limiting and pagination for AWS API calls
Support filtering and sorting of recommendations
Bonus Points
Implementation of caching to minimize API calls
Support for multiple cloud providers
Interactive CLI interface
Containerized solution with Docker
CI/CD pipeline configuration
Evaluation Criteria
Your solution will be evaluated based on:

Code quality and organization
Test coverage and quality
Performance and scalability considerations
Error handling and edge cases
Documentation quality
Bonus features implemented
Submission Guidelines
Create a public GitHub repository for your solution
Include a README.md with:
Setup instructions
Usage examples
Design decisions and trade-offs
Future improvements
Submit the repository URL when complete
Time Limit
You have 1 hour to complete this challenge. Focus on demonstrating your problem-solving approach and code quality rather than implementing every feature.

Good luck! If you have any questions, please reach out to john@makefizz.buzz.