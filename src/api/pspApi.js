import api from "./apiConfig";

export const fetchPSPs = async () => {
  try {
    const response = await api.get("psps");
    return response.data;
  } catch (error) {
    console.error("Error fetching PSPs:", error);
    throw error;
  }
};


// Lawma Admin PSP Management
export const createPSP = async (payload) => {
  try {
    // Expected payload keys: companyName, adminName, phone, lga, address
    const response = await api.post("psps", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating PSP:", error);
    throw error;
  }
};

export const deactivatePSP = async (pspId) => {
  try {
    // Common pattern for deactivation endpoints
    const response = await api.put(`psps/${pspId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating PSP:", error);
    throw error;
  }
};

export const activatePSP = async (pspId) => {
  try {
    // Common pattern for activation endpoints
    const response = await api.put(`psps/${pspId}/activate`);
    return response.data;
  } catch (error) {
    console.error("Error activating PSP:", error);
    throw error;
  }
};

export const changePSPStatus = async (pspId, status) => {
  try {
    // Convert status to lowercase as backend expects
    const normalizedStatus = status.toLowerCase();
    console.log(`Changing PSP ${pspId} status to: ${normalizedStatus}`);
    const response = await api.put(`psps/${pspId}/change-status`, { status: normalizedStatus });
    console.log(`PSP ${pspId} status change response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error changing PSP ${pspId} status:`, error);
    throw error;
  }
};

export const addMember = async (pspId, memberData) => {
  try {
    // Expected payload: { name, email, phone_number, company_name }
    const response = await api.post(`psps/${pspId}/members`, memberData);
    return response.data;
  } catch (error) {
    console.error("Error adding member:", error);
    throw error;
  }
};

export const fetchMembers = async (pspId) => {
  try {
    const response = await api.get(`psps/${pspId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

export const activateMember = async (memberId) => {
  try {
    const response = await api.put(`psps/team/members/${memberId}/activate`);
    return response.data;
  } catch (error) {
    console.error("Error activating member:", error);
    throw error;
  }
};

export const deactivateMember = async (memberId) => {
  try {
    const response = await api.put(`psps/team/members/${memberId}/deactivate`);
    return response.data;
  } catch (error) {
    console.error("Error deactivating member:", error);
    throw error;
  }
};