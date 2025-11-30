import React, { useState } from 'react';

// Core types for the module
interface MissingDataField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'currency' | 'select' | 'textarea';
  required: boolean;
  description: string;
}

interface MissingDataCategory {
  id: string;
  name: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  icon: string;
  fields: MissingDataField[];
}

interface ContractDocument {
  id: string;
  client: string;
  title: string;
  type: string;
  uploadDate: string;
  fileSize: string;
  status: string;
}

interface MissingDataGeneratorProps {
  onRequirementCreated?: (requirement: any) => void;
  onError?: (error: Error) => void;
  customCategories?: MissingDataCategory[];
  apiBaseUrl?: string;
}

const MissingDataGenerator: React.FC<MissingDataGeneratorProps> = ({
  onRequirementCreated,
  onError,
  customCategories,
  apiBaseUrl = '/api'
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contract, setContract] = useState<ContractDocument | null>(null);

  // Sample contract documents
  const sampleContracts: ContractDocument[] = [
    {
      id: "HAEA-MSP-2022",
      client: "HAEA Corporation", 
      title: "HAEA Fixed Fee SOW MSP Resource Project",
      type: "SOW",
      uploadDate: "2024-07-22",
      fileSize: "2.3 MB",
      status: "Processed"
    },
    {
      id: "TECH-INTEGRATION-2024",
      client: "TechFlow Industries",
      title: "Enterprise Integration Platform Contract",
      type: "Master Agreement", 
      uploadDate: "2024-08-01",
      fileSize: "1.8 MB",
      status: "Under Review"
    },
    {
      id: "CLOUD-SERVICES-2024",
      client: "DataStream Solutions",
      title: "Cloud Migration Services Agreement",
      type: "Service Agreement",
      uploadDate: "2024-08-05", 
      fileSize: "3.1 MB",
      status: "Processed"
    }
  ];

  // Default missing data categories
  const defaultCategories: MissingDataCategory[] = [
    {
      id: "financial",
      name: "Financial Data",
      description: "Cost structures, payment terms, and financial obligations",
      priority: "Critical",
      icon: "DollarSign",
      fields: [
        { id: "total_contract_value", label: "Total Contract Value", type: "currency", required: true, description: "Complete contract monetary value" },
        { id: "payment_schedule", label: "Payment Schedule", type: "text", required: true, description: "When and how payments will be made" },
        { id: "currency", label: "Currency", type: "select", required: true, description: "Contract currency denomination" },
        { id: "tax_implications", label: "Tax Requirements", type: "textarea", required: false, description: "Tax obligations and considerations" }
      ]
    },
    {
      id: "technical",
      name: "Technical Requirements", 
      description: "System specifications, integrations, and technical constraints",
      priority: "High",
      icon: "Settings",
      fields: [
        { id: "system_requirements", label: "System Requirements", type: "textarea", required: true, description: "Technical specifications and requirements" },
        { id: "integration_points", label: "Integration Points", type: "textarea", required: true, description: "Required system integrations" },
        { id: "performance_sla", label: "Performance SLA", type: "text", required: true, description: "Service level agreement requirements" },
        { id: "security_requirements", label: "Security Requirements", type: "textarea", required: true, description: "Security standards and compliance needs" }
      ]
    },
    {
      id: "operational", 
      name: "Operational Details",
      description: "Project timelines, resources, and operational requirements",
      priority: "High",
      icon: "Calendar",
      fields: [
        { id: "project_timeline", label: "Project Timeline", type: "date", required: true, description: "Key project milestones and deadlines" },
        { id: "resource_requirements", label: "Resource Requirements", type: "textarea", required: true, description: "Required team members and skills" },
        { id: "communication_plan", label: "Communication Plan", type: "text", required: true, description: "How teams will communicate and report" },
        { id: "escalation_procedures", label: "Escalation Procedures", type: "textarea", required: false, description: "Issue escalation process" }
      ]
    },
    {
      id: "legal",
      name: "Legal & Compliance",
      description: "Legal terms, compliance requirements, and regulatory obligations", 
      priority: "Critical",
      icon: "Shield",
      fields: [
        { id: "governing_law", label: "Governing Law", type: "text", required: true, description: "Legal jurisdiction for the contract" },
        { id: "compliance_requirements", label: "Compliance Requirements", type: "textarea", required: true, description: "Regulatory compliance obligations" },
        { id: "liability_terms", label: "Liability Terms", type: "textarea", required: true, description: "Liability limitations and indemnification" },
        { id: "termination_clauses", label: "Termination Clauses", type: "textarea", required: false, description: "Contract termination conditions" }
      ]
    }
  ];

  const missingDataCategories = customCategories || defaultCategories;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const generateClientPortalForm = () => {
    if (!contract || selectedCategories.length === 0) return null;

    const selectedCategoryData = missingDataCategories.filter(cat => 
      selectedCategories.includes(cat.id)
    );

    return {
      clientName: contract.client,
      contractTitle: contract.title,
      contractId: contract.id,
      categories: selectedCategoryData,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requestedBy: "Contract Analysis Team",
      priority: selectedCategoryData.some(cat => cat.priority === 'Critical') ? 'Critical' : 'High'
    };
  };

  const sendToClientPortal = async () => {
    const portalData = generateClientPortalForm();
    if (!portalData) return;

    try {
      const response = await fetch(`${apiBaseUrl}/client-requirements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portalData),
      });

      const result = await response.json();
      
      if (result.success) {
        onRequirementCreated?.(result.requirement);
        setSelectedCategories([]);
      } else {
        throw new Error(result.message || 'Failed to send to client portal');
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Missing Data Generator</h1>
        <p className="text-red-100">
          Analyze contracts and automatically generate client portal forms for missing information
        </p>
      </div>

      {/* Contract Selection */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">1. Select Contract for Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleContracts.map((doc) => (
              <div
                key={doc.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  contract?.id === doc.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setContract(doc)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{doc.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    doc.status === 'Processed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Client: {doc.client}</div>
                  <div>Type: {doc.type}</div>
                  <div className="flex justify-between">
                    <span>Size: {doc.fileSize}</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Data Categories */}
      {contract && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">
              2. Select Missing Data Categories for "{contract.client}"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missingDataCategories.map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.priority === 'Critical' 
                        ? 'bg-red-100 text-red-800'
                        : category.priority === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {category.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-xs text-gray-500">
                    {category.fields.length} fields required
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {contract && selectedCategories.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">3. Generate Client Portal Form</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Ready to create client portal form for <strong>{contract.client}</strong> with {selectedCategories.length} categories
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  This will automatically notify the client and create a trackable requirement
                </p>
              </div>
              <button
                onClick={sendToClientPortal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Send to Client Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissingDataGenerator;