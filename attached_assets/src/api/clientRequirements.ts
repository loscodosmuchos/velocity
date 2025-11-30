// API utilities for client requirements

export interface CreateRequirementPayload {
  clientName: string;
  contractTitle: string;
  contractId: string;
  categories: any[];
  dueDate: string;
  requestedBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface RequirementResponse {
  success: boolean;
  requirement?: any;
  message?: string;
  error?: string;
}

export const createClientRequirement = async (
  payload: CreateRequirementPayload,
  apiBaseUrl = '/api'
): Promise<RequirementResponse> => {
  try {
    const response = await fetch(`${apiBaseUrl}/client-requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating client requirement:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getClientRequirements = async (
  clientName?: string,
  apiBaseUrl = '/api'
): Promise<any[]> => {
  try {
    const url = clientName 
      ? `${apiBaseUrl}/client-requirements?clientName=${encodeURIComponent(clientName)}`
      : `${apiBaseUrl}/client-requirements`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching client requirements:', error);
    return [];
  }
};

export const updateRequirementStatus = async (
  requirementId: string,
  status: string,
  apiBaseUrl = '/api'
): Promise<boolean> => {
  try {
    const response = await fetch(`${apiBaseUrl}/client-requirements/${requirementId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating requirement status:', error);
    return false;
  }
};