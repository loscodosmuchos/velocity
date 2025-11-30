// Sample contract data for demonstration purposes
export interface ContractData {
  id: string;
  title: string;
  type: 'MSP' | 'SOW' | 'Contract' | 'SLA';
  client: string;
  provider: string;
  effectiveDate: string;
  completionDate: string;
  totalValue: string;
  currency: string;
  overview: {
    summary: string;
    scope: string;
    objectives: string[];
  };
  services: Array<{
    category: string;
    description: string;
    scope: string;
    icon: string;
  }>;
  personnel: Array<{
    role: string;
    count: number;
    location: string;
    experience: string;
    specialSkills?: string[];
  }>;
  equipment: {
    hardware: Array<{
      category: string;
      vendors: string;
      quantity?: string;
    }>;
    software: Array<{
      category: string;
      applications: string[];
      licensing?: string;
    }>;
  };
  responsibilities: {
    provider: string[];
    client: string[];
    shared: string[];
  };
  timeline: {
    phases: Array<{
      name: string;
      duration: string;
      milestones: string[];
      deliverables: string[];
    }>;
    criticalDates: Array<{
      date: string;
      event: string;
      importance: 'High' | 'Medium' | 'Low';
    }>;
  };
  costStructure: {
    model: string;
    breakdown: Array<{
      category: string;
      amount: string;
      frequency: string;
      notes?: string;
    }>;
    additionalCosts: Array<{
      item: string;
      rate: string;
      condition: string;
    }>;
  };
  metrics: {
    sla: Array<{
      metric: string;
      target: string;
      measurement: string;
    }>;
    kpis: Array<{
      name: string;
      target: string;
      reporting: string;
    }>;
  };
}

export const sampleContracts: ContractData[] = [
  {
    id: 'haea-msp-2022',
    title: 'HAEA Fixed Fee SOW MSP Resource Project',
    type: 'MSP',
    client: 'HAEA Corporation',
    provider: 'MSP Services Inc.',
    effectiveDate: 'December 12, 2022',
    completionDate: 'January 31, 2026',
    totalValue: 'TBD - Fixed Monthly Fee',
    currency: 'USD',
    overview: {
      summary: 'Comprehensive managed services for ~6,500 devices across North America with Level 2/3 support, IMAC services, and VIP support.',
      scope: 'Desktop support, asset management, imaging services, device lifecycle management',
      objectives: [
        'Provide 24/7 Level 2/3 technical support',
        'Manage complete device lifecycle',
        'Maintain 99.5% uptime SLA',
        'Deliver VIP white glove services'
      ]
    },
    services: [
      {
        category: 'Level 2 & 3 Support',
        description: 'Break-fix technical support services',
        scope: 'Onsite and remote troubleshooting, diagnosis, and resolution',
        icon: 'Settings'
      },
      {
        category: 'IMAC Services',
        description: 'Installs, Moves, Adds, and Changes',
        scope: 'Routine installations, relocations, upgrades of devices',
        icon: 'Monitor'
      },
      {
        category: 'White Glove VIP Support',
        description: 'High priority support for VIPs',
        scope: 'Korean/English language skills, on-call services',
        icon: 'Shield'
      },
      {
        category: 'Asset Management',
        description: 'Complete asset tracking',
        scope: 'Inventory management, tracking, reporting',
        icon: 'FileText'
      }
    ],
    personnel: [
      { role: 'CDM Manager/Project Manager', count: 1, location: 'CA', experience: '8+ years' },
      { role: 'CDM Engineers', count: 13, location: 'CA', experience: '10+ years' },
      { role: 'CDM Engineers', count: 4, location: 'Remote', experience: '10+ years' },
      { role: 'Asset Management', count: 2, location: 'CA', experience: '10+ years' },
      { role: 'Korean Speaking Tech', count: 2, location: 'Irvine, CA', experience: '8+ years', specialSkills: ['Korean Language', 'VIP Support'] },
      { role: 'CDM Engineers', count: 4, location: 'Offshore, India', experience: '8+ years' },
      { role: 'Asset Management', count: 1, location: 'Offshore, India', experience: '8+ years' }
    ],
    equipment: {
      hardware: [
        { category: 'Desktops/Laptops/Thin Client', vendors: 'Dell, Lenovo, HP, Apple, Microsoft, Wyse, 10Zig', quantity: '5,796 units' },
        { category: 'Printers', vendors: 'HP, Zebra, Brother, Lexmark, Ricoh', quantity: '1,896 units' },
        { category: 'Monitors', vendors: 'Lenovo, Samsung, View Sonic, Dell', quantity: '8,047 units' },
        { category: 'Phones', vendors: 'Cisco', quantity: '5,000 units' }
      ],
      software: [
        { category: 'Operating Systems', applications: ['Windows 10/11', 'macOS', 'Linux'], licensing: 'Enterprise Volume' },
        { category: 'Productivity', applications: ['Microsoft Office 365', 'Adobe Creative Suite'], licensing: 'Subscription' },
        { category: 'Security', applications: ['Antivirus', 'Endpoint Protection', 'VPN'], licensing: 'Per Device' }
      ]
    },
    responsibilities: {
      provider: [
        'Perform all Services to HAEA\'s reasonable satisfaction',
        'Schedule and supervise all Personnel on a timely basis',
        'Furnish equipment, tools, and materials for offsite services',
        'Maintain clean workspace and minimize disruption when onsite'
      ],
      client: [
        'Provide all hardware and software necessary for onsite work',
        'Grant appropriate access to facilities and systems',
        'Designate key personnel for coordination',
        'Approve major changes and expenditures'
      ],
      shared: [
        'Coordinate maintenance windows and downtime',
        'Ensure compliance with security policies',
        'Maintain communication protocols',
        'Review and approve service levels'
      ]
    },
    timeline: {
      phases: [
        {
          name: 'Initial Setup',
          duration: '3 months',
          milestones: ['Team deployment', 'System integration', 'Process establishment'],
          deliverables: ['Staffing plan', 'Service catalog', 'SLA documentation']
        },
        {
          name: 'Steady State Operations',
          duration: '3.5 years',
          milestones: ['Quarterly reviews', 'Annual audits', 'Continuous improvement'],
          deliverables: ['Monthly reports', 'Performance dashboards', 'Cost optimization']
        },
        {
          name: 'Transition Planning',
          duration: '6 months',
          milestones: ['Knowledge transfer', 'Asset handover', 'Documentation'],
          deliverables: ['Transition plan', 'Final reports', 'Asset inventory']
        }
      ],
      criticalDates: [
        { date: 'December 12, 2022', event: 'Contract Effective Date', importance: 'High' },
        { date: 'March 12, 2023', event: 'Full Service Deployment', importance: 'High' },
        { date: 'January 31, 2026', event: 'Contract Completion', importance: 'High' }
      ]
    },
    costStructure: {
      model: 'Fixed Monthly Fee',
      breakdown: [
        { category: 'Personnel Costs', amount: 'TBD', frequency: 'Monthly', notes: '27 FTE across all locations' },
        { category: 'Management Fee', amount: 'TBD', frequency: 'Monthly', notes: 'Project management and oversight' },
        { category: 'Travel Expenses', amount: 'At Cost', frequency: 'As Incurred', notes: 'Pre-approved travel only' }
      ],
      additionalCosts: [
        { item: 'Emergency After-Hours Support', rate: 'TBD per hour', condition: 'Outside normal business hours' },
        { item: 'Hardware Procurement', rate: 'Cost + 5%', condition: 'Client-requested purchases' },
        { item: 'Special Projects', rate: 'TBD per hour', condition: 'Scope change requests' }
      ]
    },
    metrics: {
      sla: [
        { metric: 'Initial Response Time', target: '15 minutes', measurement: 'Priority 1 incidents' },
        { metric: 'Resolution Time', target: '4 hours', measurement: 'Priority 1 incidents' },
        { metric: 'System Uptime', target: '99.5%', measurement: 'Monthly availability' },
        { metric: 'Customer Satisfaction', target: '4.5/5', measurement: 'Monthly survey' }
      ],
      kpis: [
        { name: 'Ticket Volume', target: '2,685/month', reporting: 'Monthly dashboard' },
        { name: 'First Call Resolution', target: '85%', reporting: 'Weekly reports' },
        { name: 'Asset Accuracy', target: '98%', reporting: 'Quarterly audit' },
        { name: 'Cost per Device', target: 'TBD', reporting: 'Monthly financial reports' }
      ]
    }
  },
  {
    id: 'techcorp-cloud-2024',
    title: 'TechCorp Cloud Migration Services Agreement',
    type: 'SOW',
    client: 'TechCorp Industries',
    provider: 'CloudFirst Solutions',
    effectiveDate: 'January 15, 2024',
    completionDate: 'December 31, 2024',
    totalValue: '$2,850,000',
    currency: 'USD',
    overview: {
      summary: 'Complete cloud migration of 200+ applications and 500TB of data to AWS with enterprise security and compliance.',
      scope: 'Application assessment, cloud architecture, migration execution, optimization',
      objectives: [
        'Migrate 100% of legacy applications to cloud',
        'Achieve 40% cost reduction in infrastructure',
        'Implement zero-trust security model',
        'Establish cloud-native DevOps practices'
      ]
    },
    services: [
      {
        category: 'Cloud Assessment',
        description: 'Complete application and infrastructure audit',
        scope: 'Legacy system analysis, cloud readiness assessment',
        icon: 'BarChart3'
      },
      {
        category: 'Architecture Design',
        description: 'Enterprise cloud architecture development',
        scope: 'Multi-tier design, security framework, DR planning',
        icon: 'Layers'
      },
      {
        category: 'Migration Execution',
        description: 'Phased application and data migration',
        scope: 'Application refactoring, data transfer, testing',
        icon: 'Zap'
      },
      {
        category: 'Optimization & Training',
        description: 'Performance tuning and knowledge transfer',
        scope: 'Cost optimization, team training, documentation',
        icon: 'Target'
      }
    ],
    personnel: [
      { role: 'Project Manager', count: 1, location: 'Onsite', experience: '10+ years', specialSkills: ['PMP', 'Cloud Migration'] },
      { role: 'Cloud Architects', count: 3, location: 'Hybrid', experience: '8+ years', specialSkills: ['AWS', 'Azure', 'Security'] },
      { role: 'DevOps Engineers', count: 4, location: 'Remote', experience: '6+ years', specialSkills: ['CI/CD', 'Infrastructure as Code'] },
      { role: 'Data Engineers', count: 2, location: 'Hybrid', experience: '7+ years', specialSkills: ['ETL', 'Big Data', 'Analytics'] },
      { role: 'Security Specialists', count: 2, location: 'Onsite', experience: '9+ years', specialSkills: ['Zero Trust', 'Compliance'] }
    ],
    equipment: {
      hardware: [
        { category: 'Migration Tools', vendors: 'AWS Migration Hub, CloudEndure', quantity: 'Licenses for 200 servers' },
        { category: 'Monitoring', vendors: 'CloudWatch, Datadog, New Relic', quantity: 'Enterprise licenses' },
        { category: 'Security Tools', vendors: 'AWS Security Hub, Prisma Cloud', quantity: 'Full platform access' }
      ],
      software: [
        { category: 'Cloud Platforms', applications: ['AWS EC2', 'RDS', 'S3', 'Lambda'], licensing: 'Pay-as-you-go' },
        { category: 'DevOps Tools', applications: ['Jenkins', 'GitLab', 'Terraform', 'Ansible'], licensing: 'Enterprise' },
        { category: 'Analytics', applications: ['AWS QuickSight', 'Tableau', 'PowerBI'], licensing: 'Named User' }
      ]
    },
    responsibilities: {
      provider: [
        'Design and implement cloud architecture',
        'Execute migration with minimal downtime',
        'Provide 24/7 support during migration',
        'Train client teams on cloud operations',
        'Optimize costs and performance post-migration'
      ],
      client: [
        'Provide access to legacy systems and data',
        'Assign dedicated project team',
        'Approve architecture decisions',
        'Participate in training programs',
        'Manage change communication to end users'
      ],
      shared: [
        'Define migration priorities and schedule',
        'Establish testing and validation procedures',
        'Monitor migration progress and performance',
        'Ensure security and compliance requirements'
      ]
    },
    timeline: {
      phases: [
        {
          name: 'Discovery & Planning',
          duration: '2 months',
          milestones: ['Assessment complete', 'Architecture approved', 'Migration plan finalized'],
          deliverables: ['Cloud readiness report', 'Migration architecture', 'Project plan']
        },
        {
          name: 'Infrastructure Setup',
          duration: '1 month',
          milestones: ['Cloud environment configured', 'Security implemented', 'Connectivity established'],
          deliverables: ['Cloud infrastructure', 'Security framework', 'Network configuration']
        },
        {
          name: 'Application Migration',
          duration: '6 months',
          milestones: ['Wave 1 complete', 'Wave 2 complete', 'Wave 3 complete'],
          deliverables: ['Migrated applications', 'Performance reports', 'User documentation']
        },
        {
          name: 'Optimization & Handover',
          duration: '3 months',
          milestones: ['Performance tuned', 'Team trained', 'Documentation complete'],
          deliverables: ['Optimized environment', 'Training materials', 'Operations runbooks']
        }
      ],
      criticalDates: [
        { date: 'January 15, 2024', event: 'Project Kickoff', importance: 'High' },
        { date: 'March 30, 2024', event: 'Infrastructure Go-Live', importance: 'High' },
        { date: 'September 30, 2024', event: 'Migration Complete', importance: 'High' },
        { date: 'December 31, 2024', event: 'Project Closure', importance: 'High' }
      ]
    },
    costStructure: {
      model: 'Fixed Price with Milestones',
      breakdown: [
        { category: 'Discovery & Planning', amount: '$485,000', frequency: 'One-time', notes: 'Assessment and architecture design' },
        { category: 'Infrastructure Setup', amount: '$325,000', frequency: 'One-time', notes: 'Cloud environment configuration' },
        { category: 'Migration Services', amount: '$1,540,000', frequency: 'Milestone-based', notes: 'Application and data migration' },
        { category: 'Optimization & Training', amount: '$420,000', frequency: 'One-time', notes: 'Performance tuning and knowledge transfer' },
        { category: 'Support & Warranty', amount: '$80,000', frequency: 'Monthly', notes: '3-month post-migration support' }
      ],
      additionalCosts: [
        { item: 'AWS Infrastructure Costs', rate: 'At Cost + 10%', condition: 'Client-owned AWS account' },
        { item: 'Additional Training', rate: '$2,500 per day', condition: 'Beyond included training hours' },
        { item: 'Scope Changes', rate: '$275 per hour', condition: 'Approved change requests' }
      ]
    },
    metrics: {
      sla: [
        { metric: 'Migration Success Rate', target: '100%', measurement: 'Applications successfully migrated' },
        { metric: 'Downtime per Application', target: '<4 hours', measurement: 'During migration window' },
        { metric: 'Performance Improvement', target: '25%', measurement: 'Response time improvement' },
        { metric: 'Data Integrity', target: '100%', measurement: 'Zero data loss during migration' }
      ],
      kpis: [
        { name: 'Cost Reduction', target: '40%', reporting: 'Monthly infrastructure cost reports' },
        { name: 'Security Score', target: '95%', reporting: 'AWS Security Hub dashboard' },
        { name: 'Team Readiness', target: '90%', reporting: 'Training completion and certification' },
        { name: 'User Satisfaction', target: '4.0/5', reporting: 'Post-migration user surveys' }
      ]
    }
  },
  {
    id: 'retail-plus-erp-2023',
    title: 'RetailPlus ERP Implementation Project',
    type: 'Contract',
    client: 'RetailPlus Corporation',
    provider: 'Enterprise Systems LLC',
    effectiveDate: 'June 1, 2023',
    completionDate: 'May 31, 2024',
    totalValue: '$1,750,000',
    currency: 'USD',
    overview: {
      summary: 'Complete ERP system implementation for 150-store retail chain with integrated POS, inventory, and financial management.',
      scope: 'ERP software implementation, data migration, training, and 12-month support',
      objectives: [
        'Unify operations across all 150 retail locations',
        'Implement real-time inventory management',
        'Automate financial reporting and compliance',
        'Improve customer experience through integrated systems'
      ]
    },
    services: [
      {
        category: 'ERP Implementation',
        description: 'Core ERP system deployment and configuration',
        scope: 'Software installation, customization, integration',
        icon: 'Database'
      },
      {
        category: 'Data Migration',
        description: 'Legacy system data transfer and validation',
        scope: 'Data extraction, transformation, loading, verification',
        icon: 'Zap'
      },
      {
        category: 'Training & Support',
        description: 'User training and ongoing system support',
        scope: 'Training programs, documentation, helpdesk support',
        icon: 'Users'
      },
      {
        category: 'Integration Services',
        description: 'Third-party system integrations',
        scope: 'POS systems, e-commerce platform, payment processing',
        icon: 'Layers'
      }
    ],
    personnel: [
      { role: 'Project Manager', count: 1, location: 'Onsite', experience: '12+ years', specialSkills: ['ERP Implementation', 'Retail Systems'] },
      { role: 'ERP Consultants', count: 4, location: 'Hybrid', experience: '8+ years', specialSkills: ['SAP', 'Oracle', 'Microsoft Dynamics'] },
      { role: 'Data Migration Specialists', count: 2, location: 'Remote', experience: '6+ years', specialSkills: ['ETL', 'Data Quality'] },
      { role: 'Training Specialists', count: 3, location: 'Onsite', experience: '5+ years', specialSkills: ['Adult Learning', 'System Training'] },
      { role: 'Integration Engineers', count: 2, location: 'Hybrid', experience: '7+ years', specialSkills: ['API Development', 'Middleware'] }
    ],
    equipment: {
      hardware: [
        { category: 'Servers', vendors: 'Dell PowerEdge, HPE ProLiant', quantity: '8 production + 4 DR servers' },
        { category: 'Storage', vendors: 'NetApp, EMC', quantity: '500TB primary + 500TB backup' },
        { category: 'Network Equipment', vendors: 'Cisco, Juniper', quantity: 'Switches and routers for 150 locations' },
        { category: 'Workstations', vendors: 'Dell OptiPlex, HP EliteDesk', quantity: '600 units across all stores' }
      ],
      software: [
        { category: 'ERP Platform', applications: ['SAP Business One', 'Microsoft Dynamics 365'], licensing: 'Named User + Device' },
        { category: 'Database', applications: ['SQL Server', 'Oracle Database'], licensing: 'Enterprise' },
        { category: 'Integration', applications: ['MuleSoft', 'Microsoft BizTalk'], licensing: 'Enterprise Connector' },
        { category: 'Reporting', applications: ['Power BI', 'Crystal Reports'], licensing: 'Per User' }
      ]
    },
    responsibilities: {
      provider: [
        'Install and configure ERP system across all locations',
        'Migrate data from legacy systems with zero data loss',
        'Provide comprehensive training to all user groups',
        'Integrate ERP with existing POS and e-commerce systems',
        'Deliver 12 months of post-implementation support'
      ],
      client: [
        'Provide access to legacy systems and data',
        'Assign business users for requirements gathering',
        'Coordinate store-level implementation activities',
        'Manage change communication to all employees',
        'Approve system configurations and customizations'
      ],
      shared: [
        'Define business processes and system workflows',
        'Conduct user acceptance testing',
        'Plan and execute go-live activities',
        'Monitor system performance and user adoption',
        'Establish ongoing support procedures'
      ]
    },
    timeline: {
      phases: [
        {
          name: 'Requirements & Design',
          duration: '3 months',
          milestones: ['Requirements gathered', 'System design approved', 'Infrastructure ready'],
          deliverables: ['Business requirements document', 'System design specification', 'Infrastructure plan']
        },
        {
          name: 'Development & Testing',
          duration: '4 months',
          milestones: ['Core system configured', 'Integrations complete', 'Testing passed'],
          deliverables: ['Configured ERP system', 'Integration components', 'Test results']
        },
        {
          name: 'Pilot Implementation',
          duration: '2 months',
          milestones: ['Pilot stores live', 'User feedback incorporated', 'Rollout plan approved'],
          deliverables: ['Pilot system', 'Feedback analysis', 'Rollout schedule']
        },
        {
          name: 'Full Rollout',
          duration: '3 months',
          milestones: ['50% stores live', 'All stores live', 'Support transition'],
          deliverables: ['Production system', 'Training completion', 'Support documentation']
        }
      ],
      criticalDates: [
        { date: 'June 1, 2023', event: 'Project Start', importance: 'High' },
        { date: 'September 15, 2023', event: 'Infrastructure Complete', importance: 'High' },
        { date: 'February 1, 2024', event: 'Pilot Go-Live', importance: 'High' },
        { date: 'May 31, 2024', event: 'Full Implementation Complete', importance: 'High' }
      ]
    },
    costStructure: {
      model: 'Fixed Price with Payment Schedule',
      breakdown: [
        { category: 'Software Licenses', amount: '$650,000', frequency: 'One-time', notes: 'ERP licenses for all users and locations' },
        { category: 'Implementation Services', amount: '$750,000', frequency: 'Milestone-based', notes: 'Configuration, customization, integration' },
        { category: 'Data Migration', amount: '$125,000', frequency: 'One-time', notes: 'Legacy system data transfer' },
        { category: 'Training Services', amount: '$95,000', frequency: 'One-time', notes: 'Comprehensive user training program' },
        { category: 'Support Services', amount: '$130,000', frequency: 'Monthly', notes: '12 months post-implementation support' }
      ],
      additionalCosts: [
        { item: 'Hardware Infrastructure', rate: 'At Cost + 15%', condition: 'Client-requested procurement' },
        { item: 'Additional Customizations', rate: '$185 per hour', condition: 'Scope changes after approval' },
        { item: 'Extended Support', rate: '$12,500 per month', condition: 'Beyond 12-month included support' }
      ]
    },
    metrics: {
      sla: [
        { metric: 'System Availability', target: '99.9%', measurement: 'Monthly uptime during business hours' },
        { metric: 'Data Migration Accuracy', target: '99.95%', measurement: 'Records successfully migrated' },
        { metric: 'User Training Completion', target: '100%', measurement: 'All users complete required training' },
        { metric: 'Go-Live Success Rate', target: '100%', measurement: 'Stores successfully launched' }
      ],
      kpis: [
        { name: 'Inventory Accuracy', target: '98%', reporting: 'Weekly inventory reports' },
        { name: 'Order Processing Time', target: '50% improvement', reporting: 'Daily operational metrics' },
        { name: 'Financial Close Time', target: '5 days', reporting: 'Monthly financial reports' },
        { name: 'User Adoption Rate', target: '95%', reporting: 'Monthly usage analytics' }
      ]
    }
  }
];

export const getContractById = (id: string): ContractData | undefined => {
  return sampleContracts.find(contract => contract.id === id);
};

export const getContractsByType = (type: string): ContractData[] => {
  return sampleContracts.filter(contract => contract.type === type);
};