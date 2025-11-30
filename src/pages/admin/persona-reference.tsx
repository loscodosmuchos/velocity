import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  AlertTriangle, 
  Eye, 
  ArrowRight, 
  Target, 
  Scale,
  Users,
  UserCheck,
  Calculator,
  Settings,
  FolderKanban,
  Shield,
  UserCog,
  Crown,
  Handshake,
  Monitor
} from 'lucide-react';

interface PersonaSection {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

interface Persona {
  id: string;
  name: string;
  title: string;
  nickname?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  sections: {
    jobFunctions: PersonaSection;
    concerns: PersonaSection;
    visualAreas: PersonaSection;
    workflow: PersonaSection;
    successMetrics: PersonaSection;
    decisionLens: PersonaSection;
  };
}

const personas: Persona[] = [
  {
    id: 'hiring-manager',
    name: 'Hiring Manager',
    title: 'Project Lead / Department Manager',
    nickname: 'Ben',
    description: 'Overwhelmed with managing contractors, needs quick visibility into project status, costs, and timelines. The primary user who submits requisitions and approves contractor work.',
    icon: <UserCheck className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Submit contractor requisitions and define job requirements',
          'Review and approve timecards and expenses',
          'Monitor project budgets and contractor performance',
          'Coordinate with recruiters on hiring needs',
          'Manage contractor onboarding and task assignments'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Budget overruns without advance warning',
          'Delayed timecard approvals causing payment issues',
          'Lack of visibility into contractor utilization',
          'Too many systems to check for project status',
          'Difficulty tracking SOW consumption and change orders'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Project Dashboard with budget vs. actual spend',
          'Pending Approvals queue (timecards, expenses)',
          'Contractor availability and assignment calendar',
          'SOW burn rate and milestone tracker',
          'Alert notifications for budget thresholds'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Morning: Check pending approvals → Review alerts → Approve timecards',
          'Weekly: Review budget reports → Check contractor utilization',
          'Monthly: Analyze project performance → Submit requisitions for gaps',
          'As needed: Handle change orders → Coordinate with recruiters'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Projects delivered on time and within budget',
          'Zero delayed payments due to approval bottlenecks',
          'High contractor retention and satisfaction scores',
          'Accurate forecasting of resource needs',
          'Minimal rework and scope creep'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Speed: How fast can I get this done?',
          'Cost: Is this within my budget authority?',
          'Quality: Will this contractor deliver results?',
          'Risk: What compliance or legal concerns exist?',
          'Visibility: Can I easily track progress?'
        ]
      }
    }
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    title: 'Talent Acquisition Specialist',
    description: 'Sources and places contractors, needs talent pipeline visibility and placement metrics. Primary liaison between hiring managers and contractor candidates.',
    icon: <Users className="h-5 w-5" />,
    color: 'from-emerald-500 to-teal-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Source candidates from various channels',
          'Screen and interview contractor candidates',
          'Manage candidate pipeline and requisition fulfillment',
          'Coordinate interviews with hiring managers',
          'Negotiate rates and contract terms'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Time-to-fill metrics under pressure',
          'Candidate quality vs. quantity trade-offs',
          'Managing multiple requisitions simultaneously',
          'Keeping hiring managers informed on progress',
          'Rate negotiations within budget constraints'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Requisition pipeline and status board',
          'Candidate tracking and submission metrics',
          'Time-to-fill analytics by department/role',
          'Hiring manager feedback and preferences',
          'Contractor pool and availability database'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Morning: Review new requisitions → Check candidate submissions',
          'Daily: Screen candidates → Schedule interviews → Update pipeline',
          'Weekly: Report on metrics → Sync with hiring managers',
          'Ongoing: Source candidates → Build talent pools'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Low time-to-fill rates',
          'High submission-to-placement ratio',
          'Positive hiring manager feedback scores',
          'Contractor retention and extension rates',
          'Rate negotiation savings'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Urgency: How critical is this requisition?',
          'Fit: Does the candidate match requirements?',
          'Availability: Can they start when needed?',
          'Rate: Is it within budget?',
          'History: Past performance indicators?'
        ]
      }
    }
  },
  {
    id: 'finance-manager',
    name: 'Finance/AP Manager',
    title: 'Accounts Payable / Financial Controller',
    description: 'Handles invoices, payments, budget tracking; needs spend visibility and approval workflows. Ensures financial accuracy and compliance.',
    icon: <Calculator className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Process and approve contractor invoices',
          'Reconcile timecards with invoices',
          'Track budget utilization across projects',
          'Manage payment schedules and terms',
          'Generate financial reports for leadership'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Invoice discrepancies and disputes',
          'Late payments affecting vendor relationships',
          'Budget overages without visibility',
          'Manual reconciliation consuming too much time',
          'Audit trail gaps and compliance risks'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Invoice processing queue and aging reports',
          'Budget vs. actual spend dashboards',
          'Timecard-to-invoice reconciliation views',
          'Payment schedule and cash flow forecasts',
          'Variance reports and exception alerts'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Review incoming invoices → Match to timecards → Process approvals',
          'Weekly: Generate aging reports → Follow up on discrepancies',
          'Monthly: Close period → Reconcile accounts → Report to leadership',
          'Quarterly: Audit preparation → Budget reviews'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Invoice processing time under 48 hours',
          'Zero late payment penalties',
          'High first-pass approval rate',
          'Budget variance under 5%',
          'Clean audit results'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Accuracy: Does this invoice match approved work?',
          'Authority: Who approved this expenditure?',
          'Compliance: Are proper approvals in place?',
          'Budget: Is there remaining budget?',
          'Timing: Impact on cash flow?'
        ]
      }
    }
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    title: 'Workforce Operations Lead',
    description: 'Oversees contractor deployment, compliance, timecards; needs operational dashboards. Ensures smooth day-to-day workforce operations.',
    icon: <Settings className="h-5 w-5" />,
    color: 'from-slate-500 to-zinc-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Monitor contractor attendance and timecard submission',
          'Coordinate contractor onboarding and offboarding',
          'Manage compliance and document collection',
          'Handle operational issues and escalations',
          'Optimize contractor utilization and allocation'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Missing or late timecard submissions',
          'Compliance document expirations',
          'Contractor no-shows and coverage gaps',
          'Onboarding delays and bottlenecks',
          'Managing multiple client requirements'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Timecard status dashboard',
          'Compliance tracking and expiration alerts',
          'Contractor utilization heat maps',
          'Onboarding pipeline and checklist status',
          'Escalation queue and SLA tracking'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Morning: Review overnight issues → Check timecard compliance',
          'Daily: Process onboarding tasks → Handle escalations → Update records',
          'Weekly: Review compliance status → Send reminders → Generate reports',
          'Monthly: Analyze operational metrics → Identify process improvements'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Timecard submission rate over 95%',
          'Zero compliance lapses',
          'Onboarding completed within SLA',
          'High contractor satisfaction scores',
          'Low escalation volume'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Compliance: Is this within policy?',
          'Efficiency: Does this streamline operations?',
          'Risk: What could go wrong?',
          'Client Impact: How does this affect the client?',
          'Scalability: Can we handle increased volume?'
        ]
      }
    }
  },
  {
    id: 'program-manager',
    name: 'Program Manager',
    title: 'Strategic Program Director',
    description: 'Strategic oversight of multiple projects, needs portfolio-level metrics. Ensures alignment with organizational goals and resource optimization.',
    icon: <FolderKanban className="h-5 w-5" />,
    color: 'from-violet-500 to-purple-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Oversee portfolio of projects and programs',
          'Manage resource allocation across projects',
          'Track program milestones and deliverables',
          'Coordinate cross-functional dependencies',
          'Report on program health to stakeholders'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Resource conflicts across projects',
          'Lack of portfolio-level visibility',
          'Dependency delays cascading across programs',
          'Budget aggregation across multiple projects',
          'Stakeholder communication overhead'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Portfolio dashboard with project health indicators',
          'Resource allocation and capacity planning views',
          'Cross-project dependency maps',
          'Aggregate budget and spend analytics',
          'Milestone timeline and critical path visualization'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Review portfolio alerts → Address blockers',
          'Weekly: Program status meetings → Update stakeholders',
          'Bi-weekly: Resource planning → Adjust allocations',
          'Monthly: Portfolio reviews → Strategic planning → Risk assessment'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Portfolio on-time delivery rate',
          'Resource utilization optimization',
          'Stakeholder satisfaction scores',
          'Budget accuracy across programs',
          'Risk mitigation effectiveness'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Strategic Value: Does this align with goals?',
          'Resource Impact: What tradeoffs are required?',
          'Risk: What are the dependencies and risks?',
          'Priority: Which project takes precedence?',
          'Visibility: Can we communicate progress clearly?'
        ]
      }
    }
  },
  {
    id: 'compliance-officer',
    name: 'Compliance Officer',
    title: 'Regulatory Compliance Manager',
    description: 'Ensures contractor certifications, policy adherence; needs compliance dashboards. Protects the organization from regulatory and legal risks.',
    icon: <Shield className="h-5 w-5" />,
    color: 'from-red-500 to-rose-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Monitor contractor compliance status',
          'Track certifications and document expirations',
          'Audit contractor records and processes',
          'Ensure policy adherence across the organization',
          'Manage regulatory reporting requirements'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Expired certifications going unnoticed',
          'Inconsistent compliance across contractors',
          'Audit preparation consuming excessive time',
          'Policy changes not communicated effectively',
          'Risk exposure from non-compliant contractors'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Compliance status dashboard with risk indicators',
          'Certification expiration calendar and alerts',
          'Audit trail and document repository',
          'Policy violation tracking and trends',
          'Regulatory requirement checklists'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Review compliance alerts → Follow up on expirations',
          'Weekly: Run compliance reports → Update risk assessments',
          'Monthly: Conduct audits → Review policy adherence',
          'Quarterly: Regulatory reporting → Policy updates → Training'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Zero compliance violations',
          'All certifications current',
          'Successful audit outcomes',
          'Timely regulatory filings',
          'Reduced risk exposure score'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Compliance: Does this meet regulatory requirements?',
          'Risk: What is the exposure if non-compliant?',
          'Documentation: Is there an audit trail?',
          'Policy: Does this align with organizational policy?',
          'Enforcement: Can we consistently apply this?'
        ]
      }
    }
  },
  {
    id: 'hr-manager',
    name: 'HR Manager',
    title: 'Human Resources Business Partner',
    description: 'Onboarding, offboarding, contractor lifecycle; needs HR process visibility. Manages the people aspects of the contingent workforce.',
    icon: <UserCog className="h-5 w-5" />,
    color: 'from-pink-500 to-fuchsia-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Manage contractor onboarding and orientation',
          'Handle offboarding and exit processes',
          'Maintain contractor records and documentation',
          'Coordinate with hiring managers on workforce needs',
          'Ensure contractor experience and engagement'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Onboarding delays affecting start dates',
          'Inconsistent contractor experience',
          'Missing or incomplete documentation',
          'Coordination challenges across departments',
          'Contractor engagement and retention issues'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Onboarding pipeline and checklist status',
          'Contractor lifecycle stage tracking',
          'Document collection and verification status',
          'Contractor feedback and satisfaction metrics',
          'Headcount and workforce composition reports'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Process new onboardings → Follow up on documents',
          'Weekly: Review lifecycle stages → Update hiring managers',
          'Monthly: Analyze retention metrics → Conduct check-ins',
          'Quarterly: Workforce planning → Process improvements'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Onboarding completed within SLA',
          'High contractor satisfaction scores',
          'Complete documentation compliance',
          'Low early termination rates',
          'Positive exit survey feedback'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Experience: How does this impact the contractor?',
          'Process: Is there a standard procedure?',
          'Compliance: Are we meeting requirements?',
          'Efficiency: Can we streamline this?',
          'Relationships: How does this affect team dynamics?'
        ]
      }
    }
  },
  {
    id: 'executive',
    name: 'Executive / Leadership',
    title: 'C-Suite / Senior Leadership',
    description: 'C-suite needing high-level KPIs, ROI metrics, strategic insights. Drives strategic decisions and organizational direction.',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-yellow-500 to-amber-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Set strategic direction for workforce management',
          'Approve major budget allocations and decisions',
          'Monitor organizational performance metrics',
          'Drive cost optimization initiatives',
          'Ensure alignment with business objectives'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Lack of real-time visibility into spend',
          'ROI justification for workforce investments',
          'Risk exposure and compliance gaps',
          'Strategic decision-making without complete data',
          'Market competitiveness and talent strategy'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Executive dashboard with key KPIs',
          'Total cost of workforce analytics',
          'ROI and cost savings visualizations',
          'Risk and compliance summary',
          'Strategic trend analysis and forecasts'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Weekly: Review executive dashboard → Identify areas of concern',
          'Monthly: Board/leadership meetings → Strategic reviews',
          'Quarterly: Budget planning → Performance assessments',
          'Annually: Strategic workforce planning → Contract renewals'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'Cost per hire/placement optimization',
          'Workforce ROI improvement',
          'Strategic initiative completion',
          'Risk mitigation effectiveness',
          'Stakeholder satisfaction'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Strategic Value: Does this support our mission?',
          'ROI: What is the return on investment?',
          'Risk: What is the exposure?',
          'Competitiveness: How does this position us?',
          'Sustainability: Is this scalable and maintainable?'
        ]
      }
    }
  },
  {
    id: 'account-manager',
    name: 'Account Manager',
    title: 'Client Relationship Manager',
    description: 'Client-facing, manages relationships, needs client satisfaction metrics. Ensures client success and retention.',
    icon: <Handshake className="h-5 w-5" />,
    color: 'from-cyan-500 to-blue-500',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Manage client relationships and satisfaction',
          'Coordinate service delivery and SLA adherence',
          'Handle escalations and issue resolution',
          'Drive account growth and retention',
          'Communicate client needs to internal teams'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'Service delivery gaps affecting satisfaction',
          'Client escalations not resolved quickly',
          'Lack of proactive visibility into account health',
          'Difficulty quantifying value delivered',
          'Competitive pressure on accounts'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'Client health dashboard and scorecards',
          'SLA performance and compliance metrics',
          'Account activity and engagement trends',
          'Value delivered and savings reports',
          'Client feedback and NPS tracking'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Review client alerts → Address escalations',
          'Weekly: Client status meetings → Update account plans',
          'Monthly: Prepare business reviews → Analyze metrics',
          'Quarterly: Strategic account planning → Renewal preparation'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'High client satisfaction and NPS scores',
          'Account retention and renewal rates',
          'SLA achievement percentages',
          'Account growth and expansion',
          'Escalation resolution time'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Client Impact: How does this affect the client?',
          'Relationship: Does this strengthen trust?',
          'Value: Can we demonstrate ROI?',
          'Retention: Does this support renewal?',
          'Growth: Is there expansion opportunity?'
        ]
      }
    }
  },
  {
    id: 'it-administrator',
    name: 'IT Administrator',
    title: 'System Administrator / IT Manager',
    description: 'System configuration, integrations, user management. Ensures the platform runs smoothly and securely.',
    icon: <Monitor className="h-5 w-5" />,
    color: 'from-gray-500 to-slate-600',
    sections: {
      jobFunctions: {
        icon: <Briefcase className="h-4 w-4 text-blue-400" />,
        title: 'Primary Job Functions',
        items: [
          'Manage system configuration and settings',
          'Handle user provisioning and access control',
          'Monitor system performance and uptime',
          'Manage integrations with other systems',
          'Troubleshoot technical issues'
        ]
      },
      concerns: {
        icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
        title: 'Primary Concerns / Pain Points',
        items: [
          'System downtime affecting business operations',
          'Security vulnerabilities and access control gaps',
          'Integration failures and data sync issues',
          'User support requests overwhelming capacity',
          'Keeping up with platform updates and changes'
        ]
      },
      visualAreas: {
        icon: <Eye className="h-4 w-4 text-purple-400" />,
        title: 'Primary Visual Areas of Interest',
        items: [
          'System health and performance dashboard',
          'User management and access audit logs',
          'Integration status and error logs',
          'Security monitoring and alerts',
          'Configuration change tracking'
        ]
      },
      workflow: {
        icon: <ArrowRight className="h-4 w-4 text-green-400" />,
        title: 'Primary Probable Workflow',
        items: [
          'Daily: Monitor system health → Review alerts → Handle tickets',
          'Weekly: User access reviews → Integration checks → Backups',
          'Monthly: Security audits → Performance optimization',
          'Quarterly: System updates → Disaster recovery testing'
        ]
      },
      successMetrics: {
        icon: <Target className="h-4 w-4 text-red-400" />,
        title: 'Success Metrics',
        items: [
          'System uptime over 99.9%',
          'Quick ticket resolution times',
          'Zero security incidents',
          'Successful integration health',
          'User satisfaction with IT support'
        ]
      },
      decisionLens: {
        icon: <Scale className="h-4 w-4 text-indigo-400" />,
        title: 'Decision Lens',
        items: [
          'Security: Does this protect our systems?',
          'Stability: Will this impact uptime?',
          'Scalability: Can this handle growth?',
          'Integration: How does this affect other systems?',
          'Maintainability: Can we support this long-term?'
        ]
      }
    }
  }
];

function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <AccordionItem value={persona.id} className="border-slate-700/50">
      <AccordionTrigger className="hover:no-underline px-4 py-3 bg-slate-800/50 hover:bg-slate-800 rounded-t-lg data-[state=open]:rounded-t-lg data-[state=closed]:rounded-lg transition-all">
        <div className="flex items-center gap-4 w-full">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${persona.color} shadow-lg`}>
            {persona.icon}
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-100">
                {persona.name}
                {persona.nickname && (
                  <span className="text-slate-400 font-normal ml-2">({persona.nickname})</span>
                )}
              </h3>
            </div>
            <p className="text-sm text-slate-400">{persona.title}</p>
          </div>
          <Badge variant="outline" className="bg-slate-900/50 border-slate-600 text-slate-300">
            Expert Persona
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-2 bg-slate-900/30 rounded-b-lg border-t border-slate-700/30">
        <p className="text-slate-300 mb-4 text-sm leading-relaxed">{persona.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(persona.sections).map(([key, section]) => (
            <Card key={key} className="bg-slate-800/60 border-slate-700/50">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-200">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <ul className="space-y-1.5">
                  {section.items.map((item, index) => (
                    <li key={index} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-slate-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function PersonaReferencePage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Persona Reference Guide</h1>
              <p className="text-slate-400 text-sm">Expert Personas for Velocity VMS Platform</p>
            </div>
          </div>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                This reference guide captures our understanding of each role's needs, workflows, and priorities 
                to ensure all platform development remains aligned with user needs. Each persona represents a 
                distinct user archetype with specific pain points, success metrics, and decision-making criteria 
                that inform how we design and prioritize features.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {personas.slice(0, 5).map((persona) => (
            <Card key={persona.id} className="bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 transition-colors cursor-pointer">
              <CardContent className="p-3 flex flex-col items-center text-center">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${persona.color} mb-2`}>
                  {persona.icon}
                </div>
                <span className="text-xs font-medium text-slate-300 line-clamp-1">{persona.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {personas.slice(5, 10).map((persona) => (
            <Card key={persona.id} className="bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 transition-colors cursor-pointer">
              <CardContent className="p-3 flex flex-col items-center text-center">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${persona.color} mb-2`}>
                  {persona.icon}
                </div>
                <span className="text-xs font-medium text-slate-300 line-clamp-1">{persona.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Accordion type="multiple" className="space-y-3">
          {personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </Accordion>

        <Card className="bg-slate-800/30 border-slate-700/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-medium text-slate-200">Design Principle</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every feature and page in Velocity should solve at least 3 expert pain points. 
              Use this reference to validate that new developments address real user needs across 
              multiple personas, ensuring maximum platform value and adoption.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
