import apiClient from '../../../axios';

// ─── Billing Service ───────────────────────────────────────────────────────────
// Aligns with Jobryn API.yaml (Recruiter only).
// Available endpoints:
//   GET/POST   /api/v1/billing/recruiter/invoices/
//   GET/PATCH  /api/v1/billing/recruiter/invoices/{id}/
//   GET/POST   /api/v1/billing/recruiter/payments/
//   GET/PATCH  /api/v1/billing/recruiter/payments/{id}/
export const BillingService = {

  // ── Invoices ──────────────────────────────────────────────────────────────────
  getInvoices: async (params = {}) => {
    const response = await apiClient.get('/billing/recruiter/invoices/', { params });
    return response.data;
  },

  getInvoiceById: async (id: number | string) => {
    const response = await apiClient.get(`/billing/recruiter/invoices/${id}/`);
    return response.data;
  },

  updateInvoice: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/billing/recruiter/invoices/${id}/`, data);
    return response.data;
  },

  deleteInvoice: async (id: number | string) => {
    await apiClient.delete(`/billing/recruiter/invoices/${id}/`);
  },

  // ── Payments ─────────────────────────────────────────────────────────────────
  getPayments: async (params = {}) => {
    const response = await apiClient.get('/billing/recruiter/payments/', { params });
    return response.data;
  },

  getPaymentById: async (id: number | string) => {
    const response = await apiClient.get(`/billing/recruiter/payments/${id}/`);
    return response.data;
  },
};
