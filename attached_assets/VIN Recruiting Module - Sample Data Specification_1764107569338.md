# VIN Recruiting Module - Sample Data Specification

## Overview
This document defines the sample data structure and content requirements for the VIN Strategic Workforce Console recruiting module demo.

## Core Data Entities

### 1. Job Positions (50+ Realistic Positions)

#### Automotive Industry Positions
```javascript
const automotivePositions = [
  // Engineering Roles
  {
    id: 'pos_001',
    title: 'Senior Automotive Engineer',
    department: 'Engineering',
    level: 'Senior',
    location: 'Detroit, MI',
    salaryRange: '$95,000 - $125,000',
    status: 'Active',
    priority: 'High',
    openDate: '2024-12-15',
    targetFillDate: '2025-02-15',
    hiringManager: 'Jennifer Chen',
    description: 'Lead development of next-generation electric vehicle systems',
    requirements: ['8+ years automotive experience', 'EV systems knowledge', 'CAD proficiency'],
    applicantCount: 23,
    stage: 'Active Recruiting'
  },
  {
    id: 'pos_002',
    title: 'Battery Systems Engineer',
    department: 'Engineering',
    level: 'Mid',
    location: 'Austin, TX',
    salaryRange: '$85,000 - $110,000',
    status: 'Critical',
    priority: 'Critical',
    openDate: '2024-11-20',
    targetFillDate: '2025-01-30',
    hiringManager: 'David Rodriguez',
    description: 'Design and optimize battery management systems for electric vehicles',
    requirements: ['Battery technology expertise', 'Thermal management', 'Safety protocols'],
    applicantCount: 15,
    stage: 'Urgent - Extended Search'
  },
  // ... additional positions
]
```

#### Position Categories Distribution
- **Engineering (40%)**: 20 positions
  - Software Engineers (8)
  - Hardware Engineers (6)
  - Systems Engineers (4)
  - Quality Engineers (2)
- **Manufacturing (25%)**: 12 positions
  - Production Managers (4)
  - Process Engineers (4)
  - Quality Control (2)
  - Maintenance Technicians (2)
- **Sales & Marketing (15%)**: 8 positions
- **Operations (10%)**: 5 positions
- **Executive/Management (10%)**: 5 positions

### 2. Candidates (200+ Diverse Profiles)

#### Candidate Profile Structure
```javascript
const candidateProfiles = [
  {
    id: 'cand_001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    currentTitle: 'Senior Software Engineer',
    currentCompany: 'Tesla',
    experience: '8 years',
    education: 'MS Computer Science - Stanford',
    skills: ['Python', 'Machine Learning', 'Autonomous Systems', 'ROS'],
    source: 'LinkedIn',
    appliedPositions: ['pos_001', 'pos_015'],
    currentStage: 'Technical Interview',
    overallScore: 4.5,
    notes: 'Strong technical background in autonomous vehicle systems',
    diversity: {
      gender: 'Female',
      ethnicity: 'Asian',
      veteran: false
    },
    applicationDate: '2025-01-10',
    lastActivity: '2025-01-14'
  },
  // ... additional candidates
]
```

#### Candidate Source Distribution
- **LinkedIn (35%)**: 70 candidates
- **Employee Referrals (25%)**: 50 candidates
- **Job Boards (20%)**: 40 candidates
- **Recruiting Agencies (15%)**: 30 candidates
- **Career Fairs (5%)**: 10 candidates

### 3. Hiring Pipeline Stages

#### Standard Pipeline Definition
```javascript
const hiringStages = [
  {
    id: 'stage_001',
    name: 'Application Received',
    order: 1,
    averageDuration: 1,
    conversionRate: 0.57,
    description: 'Initial application submitted and received'
  },
  {
    id: 'stage_002',
    name: 'Resume Screening',
    order: 2,
    averageDuration: 3,
    conversionRate: 0.53,
    description: 'HR and hiring manager review of qualifications'
  },
  {
    id: 'stage_003',
    name: 'Phone/Video Interview',
    order: 3,
    averageDuration: 5,
    conversionRate: 0.67,
    description: 'Initial interview with hiring manager or recruiter'
  },
  {
    id: 'stage_004',
    name: 'Technical Assessment',
    order: 4,
    averageDuration: 7,
    conversionRate: 0.45,
    description: 'Skills-based evaluation or coding challenge'
  },
  {
    id: 'stage_005',
    name: 'Panel Interview',
    order: 5,
    averageDuration: 4,
    conversionRate: 0.72,
    description: 'In-person or virtual interview with team members'
  },
  {
    id: 'stage_006',
    name: 'Final Interview',
    order: 6,
    averageDuration: 3,
    conversionRate: 0.83,
    description: 'Final interview with senior leadership'
  },
  {
    id: 'stage_007',
    name: 'Reference Check',
    order: 7,
    averageDuration: 2,
    conversionRate: 0.95,
    description: 'Verification of previous employment and performance'
  },
  {
    id: 'stage_008',
    name: 'Offer Extended',
    order: 8,
    averageDuration: 1,
    conversionRate: 0.87,
    description: 'Formal job offer presented to candidate'
  },
  {
    id: 'stage_009',
    name: 'Offer Accepted',
    order: 9,
    averageDuration: 5,
    conversionRate: 1.0,
    description: 'Candidate accepts offer and signs agreement'
  },
  {
    id: 'stage_010',
    name: 'Background Check',
    order: 10,
    averageDuration: 7,
    conversionRate: 0.98,
    description: 'Background verification and security clearance'
  },
  {
    id: 'stage_011',
    name: 'Onboarding',
    order: 11,
    averageDuration: 14,
    conversionRate: 1.0,
    description: 'New hire orientation and initial training'
  }
]
```

### 4. Recruiting Metrics & KPIs

#### Historical Performance Data
```javascript
const recruitingMetrics = {
  timeToFill: {
    overall: 28,
    byDepartment: {
      engineering: 35,
      manufacturing: 22,
      sales: 18,
      operations: 25,
      executive: 45
    },
    trend: [-3, -1, +2, -5, +1, -2], // Last 6 months
    benchmark: 32
  },
  fillRate: {
    overall: 0.85,
    byDepartment: {
      engineering: 0.78,
      manufacturing: 0.92,
      sales: 0.88,
      operations: 0.85,
      executive: 0.67
    },
    trend: [0.82, 0.84, 0.83, 0.86, 0.87, 0.85], // Last 6 months
    target: 0.90
  },
  costPerHire: {
    overall: 4200,
    bySource: {
      linkedin: 3800,
      referrals: 1200,
      jobBoards: 2500,
      agencies: 8500,
      careerFairs: 3200
    },
    trend: [4500, 4300, 4100, 4000, 4150, 4200], // Last 6 months
    budget: 4000
  },
  qualityOfHire: {
    overall: 4.2,
    retention90Day: 0.92,
    retention1Year: 0.78,
    performanceRating: 4.1,
    timeToProductivity: 45, // days
    hiringManagerSatisfaction: 4.3
  },
  diversityMetrics: {
    genderDistribution: {
      male: 0.55,
      female: 0.43,
      nonBinary: 0.02
    },
    ethnicityDistribution: {
      white: 0.45,
      asian: 0.25,
      hispanic: 0.15,
      black: 0.12,
      other: 0.03
    },
    veteranStatus: 0.08,
    diversityTarget: 0.50
  }
}
```

### 5. Interview & Assessment Data

#### Interview Scheduling
```javascript
const interviews = [
  {
    id: 'int_001',
    candidateId: 'cand_001',
    positionId: 'pos_001',
    type: 'Technical Interview',
    scheduledDate: '2025-01-16',
    scheduledTime: '14:00',
    duration: 60,
    interviewers: ['Jennifer Chen', 'Mark Thompson'],
    location: 'Conference Room A / Zoom',
    status: 'Scheduled',
    feedback: null,
    score: null
  },
  // ... additional interviews
]
```

#### Assessment Results
```javascript
const assessments = [
  {
    id: 'assess_001',
    candidateId: 'cand_001',
    positionId: 'pos_001',
    type: 'Technical Coding Challenge',
    completedDate: '2025-01-12',
    score: 85,
    maxScore: 100,
    timeSpent: 120, // minutes
    evaluator: 'David Kim',
    feedback: 'Strong problem-solving skills, clean code structure',
    passed: true
  },
  // ... additional assessments
]
```

### 6. Offer Management

#### Offer Details
```javascript
const offers = [
  {
    id: 'offer_001',
    candidateId: 'cand_001',
    positionId: 'pos_001',
    extendedDate: '2025-01-15',
    expirationDate: '2025-01-22',
    salary: 115000,
    bonus: 15000,
    equity: 5000,
    benefits: 'Full package including health, dental, 401k',
    startDate: '2025-02-15',
    status: 'Pending',
    negotiationRounds: 1,
    finalOffer: false
  },
  // ... additional offers
]
```

## Sample Data Generation Rules

### Realistic Data Patterns
1. **Seasonal Hiring Trends**
   - Q1: Higher volume (post-holiday hiring)
   - Q2: Steady state
   - Q3: Slower (summer vacations)
   - Q4: Year-end push

2. **Industry-Specific Patterns**
   - Engineering roles: Longer time to fill, higher salaries
   - Manufacturing: Faster fills, more local candidates
   - Executive: Longest time to fill, highest cost per hire

3. **Geographic Distribution**
   - Detroit, MI: 30% (automotive hub)
   - Austin, TX: 20% (tech expansion)
   - San Francisco, CA: 15% (innovation center)
   - Other locations: 35%

### Data Relationships
- Candidates can apply to multiple positions
- Positions can have multiple candidates at different stages
- Interview feedback correlates with final hiring decisions
- Source effectiveness varies by position type
- Diversity metrics reflect realistic industry demographics

## Integration with Existing Demo

### Workforce Console Enhancement
```javascript
// Enhanced KPI data structure
const enhancedKPIData = {
  // Existing workforce metrics
  totalSpend: { /* existing data */ },
  activeEmployees: { /* existing data */ },
  budgetUsed: { /* existing data */ },
  criticalAlerts: { /* existing data */ },
  
  // New recruiting metrics
  openPositions: {
    value: '47',
    change: '+5 new',
    trend: 'up',
    status: 'normal',
    indicator: '●',
    color: 'text-blue-500',
    breakdown: {
      critical: 12,
      high: 18,
      medium: 15,
      low: 2
    }
  },
  timeToFill: {
    value: '28 days',
    change: '-3 days',
    trend: 'down',
    status: 'improving',
    indicator: '●',
    color: 'text-green-500',
    benchmark: 32
  },
  fillRate: {
    value: '85%',
    change: '+2%',
    trend: 'up',
    status: 'normal',
    indicator: '●',
    color: 'text-green-500',
    target: 90
  },
  costPerHire: {
    value: '$4,200',
    change: '-$300',
    trend: 'down',
    status: 'improving',
    indicator: '●',
    color: 'text-green-500',
    budget: 4000
  }
}
```

This sample data specification provides the foundation for creating realistic, comprehensive recruiting functionality within the VIN Strategic Workforce Console demo.

