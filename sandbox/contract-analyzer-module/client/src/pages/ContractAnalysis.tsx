import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar, 
  Settings, 
  CheckCircle, 
  XCircle,
  Monitor,
  Laptop,
  Printer,
  Phone,
  Shield,
  Database,
  Clock,
  AlertTriangle,
  Building,
  Globe,
  Zap,
  Target,
  BarChart3,
  Layers,
  MessageSquare,
  Brain
} from 'lucide-react';
import HAEAAIPrompt from '@/components/HAEAAIPrompt';
import VoiceChatWidget from '@/components/VoiceChatWidget';

const HAEAContractAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const serviceCategories = [
    {
      category: "Level 2 & 3 Support",
      description: "Break-fix technical support services",
      scope: "Onsite and remote troubleshooting, diagnosis, and resolution",
      icon: <Settings className="w-5 h-5" />
    },
    {
      category: "IMAC Services",
      description: "Installs, Moves, Adds, and Changes",
      scope: "Routine installations, relocations, upgrades of devices",
      icon: <Monitor className="w-5 h-5" />
    },
    {
      category: "White Glove VIP Support",
      description: "High priority support for VIPs",
      scope: "Korean/English language skills, on-call services",
      icon: <Shield className="w-5 h-5" />
    },
    {
      category: "Remote Control Support",
      description: "Efficient remote device management",
      scope: "Remote troubleshooting and resolution",
      icon: <Globe className="w-5 h-5" />
    },
    {
      category: "Imaging Services",
      description: "Desktop imaging and deployment",
      scope: "Development, testing, deployment of standard images",
      icon: <Database className="w-5 h-5" />
    },
    {
      category: "Software Support",
      description: "Application and OS support",
      scope: "Testing, troubleshooting, upgrades, patches",
      icon: <Layers className="w-5 h-5" />
    },
    {
      category: "Device Lifecycle Refresh",
      description: "Equipment refresh management",
      scope: "End-of-lease replacement, DoD wipe, packaging",
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      category: "Asset Management",
      description: "Complete asset tracking",
      scope: "Inventory management, tracking, reporting",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const personnelRequirements = [
    { role: "CDM Manager/Project Manager", count: 1, location: "CA", experience: "8+ years" },
    { role: "CDM Engineers", count: 13, location: "CA", experience: "10+ years" },
    { role: "CDM Engineers", count: 4, location: "Remote", experience: "10+ years" },
    { role: "Asset Management", count: 2, location: "CA", experience: "10+ years" },
    { role: "Korean Speaking Tech", count: 2, location: "Irvine, CA", experience: "8+ years" },
    { role: "CDM Engineers", count: 4, location: "Offshore, India", experience: "8+ years" },
    { role: "Asset Management", count: 1, location: "Offshore, India", experience: "8+ years" }
  ];

  const hardwareStandards = [
    { category: "Desktops/Laptops/Thin Client", vendors: "Dell, Lenovo, HP, Apple, Microsoft, Wyse, 10Zig" },
    { category: "Tablets", vendors: "Apple, Dell, Lenovo, Microsoft" },
    { category: "Monitors", vendors: "Lenovo, Samsung, View Sonic, Dell" },
    { category: "Printers", vendors: "HP, Zebra, Brother, Lexmark, Ricoh" },
    { category: "Scanners", vendors: "Psion Teklogix, Omni, Micros, Zebra" },
    { category: "Scales", vendors: "Varsity, Weigh-Tronix" },
    { category: "Phones", vendors: "Cisco" },
    { category: "Headsets", vendors: "Plantronics, Microsoft Live Chat" },
    { category: "Projectors", vendors: "View Sonic, Dell" }
  ];

  const serviceVolume = [
    { metric: "ITSM/ServiceNow Tickets", volume: "2,035/month" },
    { metric: "ESM Tickets", volume: "650/month" },
    { metric: "Desktops/Laptops", volume: "5,796 units" },
    { metric: "Printers", volume: "1,896 units" },
    { metric: "Monitors", volume: "8,047 units" },
    { metric: "Scanners", volume: "87+ units" },
    { metric: "Phones", volume: "5,000 units" },
    { metric: "Scales", volume: "46 units" },
    { metric: "Projectors", volume: "100+ units" }
  ];

  const providerResponsibilities = [
    "Perform all Services to HAEA's reasonable satisfaction",
    "Schedule and supervise all Personnel on a timely basis",
    "Furnish equipment, tools, and materials for offsite services",
    "Maintain clean workspace and minimize disruption when onsite",
    "Prepare and deliver periodic reports as requested",
    "Identify property, materials, and software being used",
    "Meet Service Level Agreements and Requirements",
    "Provide 24/7 VIP support with Korean/English language capabilities",
    "Maintain A+ certification minimum for all technicians",
    "Background checks and drug screening for all personnel"
  ];

  const haeaResponsibilities = [
    "Provide appropriate facility access for onsite services",
    "Provide workspace, computers, phones, and Internet access",
    "Provide all hardware (compute devices and peripherals)",
    "Provide all software and licensing",
    "Provide system access and security clearances",
    "Provide base policies and standards for hardware/software",
    "Meet with Provider for status discussions and direction",
    "Order equipment required for refresh projects",
    "Approve all procedures, policies, and improvement plans",
    "Issue valid purchase orders before services commence"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          HAEA MSP Contract Analysis
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
            Fixed Fee SOW
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
            4-Year Term (2022-2026)
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1">
            ~6,500 Devices
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Comprehensive analysis of the HAEA Client Device Management MSP contract including services, 
          responsibilities, equipment specifications, and cost structure breakdown.
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="costs">Cost Structure</TabsTrigger>
          <TabsTrigger value="ai-support">AI Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span>Contract Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4 Years</div>
                    <div className="text-sm text-muted-foreground">Contract Duration</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">~6,500</div>
                    <div className="text-sm text-muted-foreground">Managed Devices</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2,685</div>
                    <div className="text-sm text-muted-foreground">Monthly Tickets</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">27</div>
                    <div className="text-sm text-muted-foreground">Total Personnel</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Service Scope</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">North America Coverage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 VIP Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Korean/English Language Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Onsite & Remote Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Complete Asset Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Device Lifecycle Management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Contract Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Equipment Coverage</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• HAEA provides all hardware</div>
                    <div>• HAEA provides all software & licensing</div>
                    <div>• Provider supplies tools for offsite work</div>
                    <div>• Multi-vendor environment support</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Service Model</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• Fixed monthly fee structure</div>
                    <div>• Travel expenses billed at actuals</div>
                    <div>• 480 project pool hours/year</div>
                    <div>• Performance-based payments</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Termination Terms</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>• 30 days notice for cause</div>
                    <div>• 90 days notice without cause</div>
                    <div>• 3-month transition period</div>
                    <div>• Knowledge transfer included</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Categories Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {serviceCategories.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{service.category}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                        <p className="text-xs text-blue-600 italic">{service.scope}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Volume Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {serviceVolume.map((item, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="font-bold text-lg text-blue-700">{item.volume}</div>
                    <div className="text-sm text-muted-foreground">{item.metric}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Applications & Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Business Applications</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>SAP</span>
                      <Badge variant="outline">Inventory Management</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Office Suite 2016-O365</span>
                      <Badge variant="outline">Productivity</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Adobe Suite</span>
                      <Badge variant="outline">Creative Tools</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ServiceNow</span>
                      <Badge variant="outline">ITSM</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Support Tools</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>TeamViewer, Dameware</span>
                      <Badge variant="outline">Remote Access</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SCCM</span>
                      <Badge variant="outline">Device Management</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Symantec, Defender</span>
                      <Badge variant="outline">Security</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>VMware, Citrix, WVD</span>
                      <Badge variant="outline">Virtualization</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personnel Tab */}
        <TabsContent value="personnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Personnel Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personnelRequirements.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {person.count}
                      </div>
                      <div>
                        <div className="font-semibold">{person.role}</div>
                        <div className="text-sm text-muted-foreground">{person.experience}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{person.location}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personnel Requirements & Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Minimum Certifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">A+ Certification (Required)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Network+ (Encouraged)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Security+ (Encouraged)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Azure Fundamentals (Encouraged)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">ITIL Foundation (Encouraged)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Special Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Background check required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Drug panel screening</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Korean/English bilingual (3 min.)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Flexible hours & cross-training</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Multi-channel communication</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hardware Standards & Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hardwareStandards.map((hardware, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{hardware.category}</h3>
                      <Badge variant="outline">Multi-Vendor</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{hardware.vendors}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Ownership & Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    HAEA Provides
                  </h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <div>• All hardware (desktops, laptops, peripherals)</div>
                    <div>• All software and licensing</div>
                    <div>• System access and security clearances</div>
                    <div>• Workspace, computers, phones, Internet (onsite)</div>
                    <div>• Hardware and software policies/standards</div>
                    <div>• Equipment ordering for refresh projects</div>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Provider Provides
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div>• Equipment, tools, materials (offsite work)</div>
                    <div>• All technical personnel and supervision</div>
                    <div>• Service delivery and management</div>
                    <div>• Reporting and documentation</div>
                    <div>• Process improvement recommendations</div>
                    <div>• Knowledge transfer and training</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipment Scope & Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">5,796</div>
                  <div className="text-sm text-muted-foreground">Desktops/Laptops</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Printer className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">1,896</div>
                  <div className="text-sm text-muted-foreground">Printers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">8,047</div>
                  <div className="text-sm text-muted-foreground">Monitors</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Phone className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-bold text-lg">5,000</div>
                  <div className="text-sm text-muted-foreground">Phones</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Responsibilities Tab */}
        <TabsContent value="responsibilities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <Settings className="w-5 h-5" />
                  <span>Provider Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providerResponsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <Building className="w-5 h-5" />
                  <span>HAEA Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {haeaResponsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Level Monitoring & Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">Provider Responsibilities</h3>
                  <div className="space-y-2 text-sm">
                    <div>• Develop and maintain SLR monitoring procedures</div>
                    <div>• Report on SLR performance and improvements</div>
                    <div>• Coordinate monitoring with HAEA and third parties</div>
                    <div>• Measure, analyze, and provide management reports</div>
                    <div>• Conduct SLR improvement meetings</div>
                    <div>• Implement approved SLR improvement plans</div>
                    <div>• Provide access to performance monitoring systems</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-green-600">HAEA Responsibilities</h3>
                  <div className="space-y-2 text-sm">
                    <div>• Define Service-Level requirements</div>
                    <div>• Define monitoring and reporting requirements</div>
                    <div>• Review and approve procedures and policies</div>
                    <div>• Review and approve improvement plans</div>
                    <div>• Review and approve metrics and reports</div>
                    <div>• Monitor effectiveness of support capabilities</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Contract Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="relative flex items-center space-x-4 pb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                      2022
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Transition Phase</h3>
                      <p className="text-sm text-muted-foreground">December 12, 2022 - January 31, 2023</p>
                      <p className="text-sm text-green-600 font-medium">Fees: Waived</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Level 2/3 support, IMAC, VIP support, remote control, imaging, upgrades, software support, peripherals, coordination, device lifecycle, smart hands, asset management
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center space-x-4 pb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      2023
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Year 1 - Full Service</h3>
                      <p className="text-sm text-muted-foreground">February 1, 2023 - January 31, 2024</p>
                      <p className="text-sm text-blue-600 font-medium">Monthly services per SLA/SLR requirements</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        All services in conformance with Service Level Agreements at specified locations
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center space-x-4 pb-8">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                      2024
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Year 2 - Continued Service</h3>
                      <p className="text-sm text-muted-foreground">February 1, 2024 - January 31, 2025</p>
                      <p className="text-sm text-purple-600 font-medium">Full service delivery continuation</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        All service categories maintained at agreed performance levels
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                      2025
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Year 3 - Contract Completion</h3>
                      <p className="text-sm text-muted-foreground">February 1, 2025 - January 31, 2026</p>
                      <p className="text-sm text-green-600 font-medium">Final year with transition planning</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Completion of 3-year full service period with knowledge transfer preparation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination & Transition Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-600" />
                  <h3 className="font-semibold text-red-800 mb-2">Termination for Cause</h3>
                  <p className="text-sm text-red-700">30 days written notice for failure to meet obligations</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-blue-800 mb-2">Termination Without Cause</h3>
                  <p className="text-sm text-blue-700">90 days prior written notice for any reason</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold text-green-800 mb-2">Transition Period</h3>
                  <p className="text-sm text-green-700">3 months for handover with knowledge transfer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Structure Tab */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Fee Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Contract Fee Structure</h3>
                  <p className="text-sm text-yellow-700">
                    The contract specifies a Fixed Fee monthly billing model, but specific dollar amounts are not filled in the provided document template.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Included in Fixed Fee</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>All technical services and personnel</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Level 2 & 3 support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>IMAC services</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>VIP support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Asset management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>480 project pool hours/year</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Additional Expenses</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Travel expenses (HAEA requested)</span>
                        <Badge variant="outline">Billed at Actuals</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        All other services and activities are included in the fixed monthly fee structure.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Terms</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• Fixed fee invoiced monthly after deliverable acceptance</div>
                    <div>• Expenses invoiced within 10 days of month-end</div>
                    <div>• Payment terms per master agreement (not provider standard)</div>
                    <div>• Fees subject to reduction for unsatisfactory performance</div>
                    <div>• No payment for retention or termination of personnel</div>
                  </div>
                </div>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800">Contract Value Framework</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded border">
                        <div className="text-2xl font-bold text-orange-600">36</div>
                        <div className="text-sm text-muted-foreground">Total Months</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded border">
                        <div className="text-2xl font-bold text-blue-600">TBD</div>
                        <div className="text-sm text-muted-foreground">Monthly Fee</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded border">
                        <div className="text-2xl font-bold text-green-600">TBD</div>
                        <div className="text-sm text-muted-foreground">Total Contract Value</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Support Tab */}
        <TabsContent value="ai-support" className="space-y-6">
          <HAEAAIPrompt />
        </TabsContent>
      </Tabs>
      
      {/* Voice Chat Widget - Only on HAEA Contract Analysis page */}
      <VoiceChatWidget />
    </div>
  );
};

export default HAEAContractAnalysis;