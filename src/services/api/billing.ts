import apiClient from '../../../axios';

// ─── Billing Service ───────────────────────────────────────────────────────────
// Covers /api/v1/billing/recruiter/invoices/ and
//        /api/v1/billing/recruiter/payments/
// Aligns with Jobryn API.yaml specification (Recruiter only).
export const BillingService = {

  // ── Invoices (/api/v1/billing/recruiter/invoices/) ─────────────────────────
  getInvoices: async (params = {}) => {
    const response = await apiClient.get('/billing/recruiter/invoices/', { params });
    return response.data;
  },

  getInvoiceById: async (id: number | string) => {
    const response = await apiClient.get(`/billing/recruiter/invoices/${id}/`);
    return response.data;
  },

  createInvoice: async (data: any) => {
    const response = await apiClient.post('/billing/recruiter/invoices/', data);
    return response.data;
  },

  updateInvoice: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/billing/recruiter/invoices/${id}/`, data);
    return response.data;
  },

  replaceInvoice: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/billing/recruiter/invoices/${id}/`, data);
    return response.data;
  },

  deleteInvoice: async (id: number | string) => {
    await apiClient.delete(`/billing/recruiter/invoices/${id}/`);
  },

  // ── Payments (/api/v1/billing/recruiter/payments/) ─────────────────────────
  getPayments: async (params = {}) => {
    const response = await apiClient.get('/billing/recruiter/payments/', { params });
    return response.data;
  },

  getPaymentById: async (id: number | string) => {
    const response = await apiClient.get(`/billing/recruiter/payments/${id}/`);
    return response.data;
  },

  createPayment: async (data: any) => {
    const response = await apiClient.post('/billing/recruiter/payments/', data);
    return response.data;
  },

  updatePayment: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/billing/recruiter/payments/${id}/`, data);
    return response.data;
  },

  replacePayment: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/billing/recruiter/payments/${id}/`, data);
    return response.data;
  },

  deletePayment: async (id: number | string) => {
    await apiClient.delete(`/billing/recruiter/payments/${id}/`);
  },

  /** 
   * Get wallet balance and transaction history.
   * ⚠️ NOTE: This endpoint is not yet defined in the Jobryn API.yaml.
   * Returning an empty stub to avoid runtime crashes in WalletScreen.
   */
  getWallet: async () => {
    try {
      const response = await apiClient.get('/billing/wallet/');
      return response.data;
    } catch {
      return { balance: '0.00', currency: 'USD', transactions: [] };
    }
  },
};





