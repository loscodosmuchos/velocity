import { useNavigate } from "react-router";
import { 
  List, FileText, LayoutDashboard, ClipboardCheck, 
  GitCompare, Workflow, ChevronRight, CheckCircle,
  Eye, Palette, Users, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'approved' | 'draft' | 'review';
  path: string;
  features: string[];
  color: string;
}

function TemplateCard({ title, description, icon: Icon, status, path, features, color }: TemplateCardProps) {
  const navigate = useNavigate();
  
  const statusConfig = {
    approved: { label: 'Approved', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
    draft: { label: 'Draft', bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/40' },
    review: { label: 'In Review', bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40' }
  };
  
  const s = statusConfig[status];
  
  return (
    <div 
      onClick={() => navigate(path)}
      className={cn(
        "group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        "p-6 cursor-pointer transition-all duration-300",
        "hover:border-slate-600/50 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]"
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-2xl", color)} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", color.replace('bg-gradient-to-r', 'bg-opacity-20'), "bg-opacity-20")}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className={cn("px-2 py-1 rounded-lg text-xs font-medium border", s.bg, s.text, s.border)}>
          {s.label}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      
      <div className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-blue-400 group-hover:text-blue-300">
        <Eye className="h-4 w-4" />
        <span>View Template</span>
        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default function TemplatesHubPage() {
  const templates: TemplateCardProps[] = [
    {
      title: "List Template",
      description: "Purpose-built for scanning large datasets with minimal cognitive load",
      icon: List,
      status: 'approved',
      path: "/admin/templates/list",
      features: [
        "Visual status icons replace text",
        "Mini sparklines for trends",
        "Workflow arrows show next steps",
        "Smart filter pills"
      ],
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      title: "Detail Template",
      description: "Deep-dive view answering all questions about a single entity",
      icon: FileText,
      status: 'approved',
      path: "/admin/templates/detail",
      features: [
        "Hero section with identity",
        "Premium KPI cards",
        "Proactive alerts",
        "Quick action bar"
      ],
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      title: "Dashboard Template",
      description: "Strategic overview for executive glance and trend spotting",
      icon: LayoutDashboard,
      status: 'draft',
      path: "/admin/templates/dashboard",
      features: [
        "Large KPI cards dominate",
        "Charts and visualizations",
        "Alert cubes for exceptions",
        "Drill-down on click"
      ],
      color: "bg-gradient-to-r from-emerald-500 to-teal-500"
    },
    {
      title: "Action Template",
      description: "Task completion with minimum clicks and clear outcomes",
      icon: ClipboardCheck,
      status: 'draft',
      path: "/admin/templates/action",
      features: [
        "Wizard/stepper pattern",
        "Progress indicators",
        "Preview before confirm",
        "Success/failure clear"
      ],
      color: "bg-gradient-to-r from-amber-500 to-orange-500"
    },
    {
      title: "Comparison Template",
      description: "Side-by-side evaluation for decision support",
      icon: GitCompare,
      status: 'draft',
      path: "/admin/templates/comparison",
      features: [
        "Parallel columns",
        "Highlight differences",
        "Recommendation badge",
        "Score/rank display"
      ],
      color: "bg-gradient-to-r from-red-500 to-rose-500"
    },
    {
      title: "Workflow Template",
      description: "Process navigation showing current step and what's next",
      icon: Workflow,
      status: 'draft',
      path: "/admin/templates/workflow",
      features: [
        "Visual workflow diagram",
        "Current step highlighted",
        "Branch points visible",
        "Time estimates shown"
      ],
      color: "bg-gradient-to-r from-indigo-500 to-violet-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Palette className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Page Templates</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Reference standards for different page types. Review and approve each template 
            to ensure visual consistency across the platform. Change the template = update all pages using that pattern.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2</div>
                <div className="text-xs text-slate-400">Approved</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Eye className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-slate-400">In Review</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-500/20">
                <Zap className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-xs text-slate-400">Draft</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {templates.map((template, i) => (
            <TemplateCard key={i} {...template} />
          ))}
        </div>
        
        <div className="mt-12 p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-3">How to Use Templates</h3>
          <div className="grid grid-cols-4 gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">1</span>
              <span>Review template layout and components</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">2</span>
              <span>Approve or request changes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">3</span>
              <span>Apply pattern to new pages</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">4</span>
              <span>Update template = update all pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
