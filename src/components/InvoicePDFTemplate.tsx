import React from "react";

export function InvoicePDFTemplate({ invoice, school, sub }: any) {
  return (
    <div style={{ width: "800px", padding: "40px", backgroundColor: "#fff", color: "#000", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #f1f5f9", paddingBottom: "20px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>SCHOOL ERP CONNECT</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>Multi-Tenant SaaS Platform</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#3b82f6" }}>INVOICE</h2>
          <p style={{ margin: "4px 0", fontSize: "14px" }}><strong>Invoice #:</strong> {invoice.invoice_number}</p>
          <p style={{ margin: "0", fontSize: "14px" }}><strong>Date:</strong> {new Date(invoice.created_at).toLocaleDateString()}</p>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
            <strong>Status:</strong> <span style={{ color: invoice.status === 'paid' ? '#10b981' : '#f59e0b', textTransform: "uppercase", fontWeight: "bold" }}>{invoice.status}</span>
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <h3 style={{ fontSize: "16px", color: "#64748b", textTransform: "uppercase", margin: "0 0 8px 0" }}>Billed To:</h3>
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>{school.name}</p>
          <p style={{ margin: "4px 0 0 0", color: "#334155", maxWidth: "250px" }}>{school.address || "Address not provided"}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h3 style={{ fontSize: "16px", color: "#64748b", textTransform: "uppercase", margin: "0 0 8px 0" }}>Subscription Details:</h3>
          <p style={{ margin: 0, fontWeight: "bold" }}>{sub.plan} Plan</p>
          <p style={{ margin: "4px 0 0 0", color: "#334155" }}>Billing Cycle: {sub.billing_cycle}</p>
          <p style={{ margin: "4px 0 0 0", color: "#334155" }}>Limits: {school.student_limit} Students, {school.teacher_limit} Teachers</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" }}>
            <th style={{ padding: "12px", textAlign: "left", color: "#475569" }}>Description</th>
            <th style={{ padding: "12px", textAlign: "right", color: "#475569" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            <td style={{ padding: "16px 12px" }}>
              <div style={{ fontWeight: "bold", color: "#0f172a" }}>School ERP Connect - {sub.plan} Plan</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                Period: {invoice.billing_period_start ? new Date(invoice.billing_period_start).toLocaleDateString() : 'N/A'} - {invoice.billing_period_end ? new Date(invoice.billing_period_end).toLocaleDateString() : 'N/A'}
              </div>
            </td>
            <td style={{ padding: "16px 12px", textAlign: "right", fontWeight: "bold" }}>
              ${Number(invoice.amount).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ color: "#64748b" }}>Subtotal</span>
            <span style={{ fontWeight: "bold" }}>${Number(invoice.amount).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
            <span style={{ color: "#64748b" }}>Tax (GST)</span>
            <span style={{ fontWeight: "bold" }}>${Number(invoice.gst_amount).toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "2px solid #3b82f6" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a" }}>Total Due</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}>${Number(invoice.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: "60px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
        <p>Thank you for choosing School ERP Connect!</p>
        <p>If you have any questions about this invoice, please contact support@schoolconnect.com</p>
      </div>
    </div>
  );
}
