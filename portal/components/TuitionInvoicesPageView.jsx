'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export default function TuitionInvoicesPageView({ currentUser }) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/finance?type=invoices');
      const data = await res.json();
      if (data.success && data.invoices) {
        setInvoices(data.invoices);
        if (data.invoices.length > 0) {
          // If none currently selected or selected not in list, pick first
          setSelectedInvoiceId((prev) => {
            if (prev && data.invoices.some((inv) => inv.id === prev)) {
              return prev;
            }
            return data.invoices[0].id;
          });
        }
      }
    } catch (err) {
      console.error('Failed to load tuition invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeInvoice =
    invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0] || null;

  const handlePayInvoice = async (invoiceId) => {
    try {
      setIsProcessingPayment(true);
      setPaymentSuccessMsg('');
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay_invoice',
          invoiceId,
          paymentMethod: 'bKash Merchant Pay (Automated)',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentSuccessMsg(data.message || 'Payment successfully processed! Receipt generated.');
        await fetchInvoices();
        setTimeout(() => setPaymentSuccessMsg(''), 5000);
      } else {
        alert(data.error || 'Failed to process payment.');
      }
    } catch (err) {
      console.error(err);
      alert('Payment processing error.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Financial summary metrics
  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const pendingDue = invoices
    .filter((inv) => inv.status !== 'Paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const hasDueInvoice = pendingDue > 0;

  return (
    <div className="tuition-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Page Header Banner */}
      <div
        className="tuition-page-header"
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--color-green-surface)',
              border: '1.5px solid var(--color-gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-green-primary)',
              flexShrink: 0,
            }}
          >
            <Icon name="receipt" size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '26px',
                  fontWeight: '700',
                  color: 'var(--color-green-deep)',
                  margin: 0,
                }}
              >
                Tuition Invoices &amp; Official Receipts
              </h1>
              <span
                style={{
                  background: 'var(--color-green-surface)',
                  color: 'var(--color-green-primary)',
                  border: '1px solid var(--color-gold-border)',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                }}
              >
                Institutional Billing
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Institutional financial statements, monthly tuition ledger, and verified PDF receipts for academic records.
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-green-primary)',
              color: '#FFFFFF',
              border: '1px solid var(--color-gold-primary)',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon name="printer" size={16} color="currentColor" />
            <span>Print / Save PDF Receipt</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Total Settled */}
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Tuition Paid
            </span>
            <span style={{ color: 'var(--color-green-mint)' }}>
              <Icon name="check-circle" size={18} />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-green-primary)' }}>
            ${totalPaid.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {invoices.filter((i) => i.status === 'Paid').length} verified billing cycles settled
          </div>
        </div>

        {/* Current Due Balance */}
        <div
          style={{
            background: hasDueInvoice ? 'rgba(217, 119, 6, 0.04)' : 'var(--color-white)',
            border: hasDueInvoice ? '1.5px solid #F59E0B' : '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: hasDueInvoice ? '#B45309' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Balance
            </span>
            <span style={{ color: hasDueInvoice ? '#D97706' : 'var(--color-green-mint)' }}>
              <Icon name={hasDueInvoice ? 'alert-triangle' : 'shield-check'} size={18} />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: hasDueInvoice ? '#B45309' : 'var(--color-green-primary)' }}>
            ${pendingDue.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: hasDueInvoice ? '#92400E' : 'var(--text-muted)' }}>
            {hasDueInvoice ? 'Active payment required' : 'All accounts in good standing'}
          </div>
        </div>

        {/* Standard Tuition Rate */}
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Monthly Tuition Rate
            </span>
            <span style={{ color: 'var(--color-gold-deep)' }}>
              <Icon name="book-open" size={18} />
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
            $55.00 <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>/ mo</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            1-on-1 Quran Classes
          </div>
        </div>

        {/* Payment Channels */}
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Payment Methods
            </span>
            <span style={{ color: 'var(--color-green-primary)' }}>
              <Icon name="credit-card" size={18} />
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-green-deep)', marginTop: '4px' }}>
            Card &amp; Online Pay
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Instant automated confirmation
          </div>
        </div>
      </div>

      {/* Invoice Archive Selector Tabs */}
      <div
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--border-light)',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
            Billing Statements Archive:
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Select an invoice to inspect line items, payment status, and verification seal.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {invoices.map((inv) => {
            const isSelected = inv.id === activeInvoice?.id;
            const isPaid = inv.status === 'Paid';
            return (
              <button
                key={inv.id}
                type="button"
                onClick={() => setSelectedInvoiceId(inv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--color-green-surface)' : 'var(--bg-canvas)',
                  border: isSelected ? '1.5px solid var(--color-green-primary)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? 'var(--color-green-primary)' : 'var(--text-main)' }}>
                    {inv.month}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    #{inv.id}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    ${inv.amount.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isPaid ? '#DCFCE7' : '#FEF3C7',
                      color: isPaid ? '#166534' : '#92400E',
                    }}
                  >
                    {isPaid ? 'PAID' : 'DUE'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {paymentSuccessMsg && (
        <div
          style={{
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '14px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          <Icon name="check-circle" size={18} color="#166534" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* Main Printable Official Invoice Sheet */}
      {activeInvoice ? (
        <div
          className="printable-invoice-card"
          id="printable-receipt-content"
          style={{
            background: 'var(--color-white)',
            border: '2px solid var(--color-gold-border)',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: 'var(--shadow-elevated)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Document Top Header */}
          <div className="invoice-doc-header">
            <div className="doc-brand">
              <img
                src="/assets/logo_gold.png"
                alt="Our Quran Institute"
                className="doc-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <h2 className="doc-institute-name">Our Quran Institute</h2>
                <span className="doc-institute-arabic">مَعْهَدُ القُرْآنِ الكَرِيمِ لِلتَّعْلِيمِ وَالتَّرْبِيَةِ</span>
                <p className="doc-institute-meta">
                  Online Quran Academy • Certified Tajweed &amp; Hifz
                </p>
              </div>
            </div>

            <div className="doc-invoice-meta">
              <span className="meta-doc-type">OFFICIAL TUITION INVOICE</span>
              <span className="meta-inv-num">#{activeInvoice.id}</span>
              <span className="meta-inv-date">Issued: {activeInvoice.issueDate}</span>
              <span className="meta-inv-due">Due Date: {activeInvoice.dueDate}</span>
            </div>
          </div>

          {/* Bill To & Payment Status Information */}
          <div className="invoice-doc-addresses">
            <div className="bill-to-box">
              <span className="address-label">BILL TO (STUDENT &amp; GUARDIAN):</span>
              <h3 className="student-recipient-name">{activeInvoice.studentName}</h3>
              <p className="guardian-name">Guardian: {activeInvoice.parentName || 'Hajji Mansoor Rahman'}</p>
              <p className="student-id-ref">Student ID: {activeInvoice.studentId}</p>
              <p className="academic-session">Academic Session: 1447-1448 AH (2026-2027)</p>
            </div>

            <div className="payment-status-box">
              <span className="address-label">PAYMENT STATUS:</span>
              <div className={`status-badge-large status-${activeInvoice.status.toLowerCase()}`}>
                {activeInvoice.status === 'Paid' ? 'PAID IN FULL' : 'PAYMENT DUE'}
              </div>

              {activeInvoice.status === 'Paid' ? (
                <div className="payment-receipt-details">
                  <span>
                    <strong>Method:</strong> {activeInvoice.paymentMethod || 'Online Payment'}
                  </span>
                  <span>
                    <strong>Transaction ID:</strong> {activeInvoice.transactionId}
                  </span>
                  <span>
                    <strong>Settled Date:</strong>{' '}
                    {activeInvoice.paidAt ? new Date(activeInvoice.paidAt).toLocaleDateString() : 'Verified'}
                  </span>
                </div>
              ) : (
                <div className="due-action-box">
                  <span className="due-prompt">
                    Payment of ${activeInvoice.amount} ({activeInvoice.amountBDT || 7500} BDT) is due.
                  </span>
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    className="btn-pay-now-action"
                    onClick={() => handlePayInvoice(activeInvoice.id)}
                  >
                    <Icon name="credit-card" size={14} style={{ marginRight: 6 }} />
                    {isProcessingPayment ? 'Processing...' : 'Pay Now by Card'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="invoice-table-wrap">
            <table className="invoice-items-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Term / Billing Period</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.desc}</strong>
                      <span className="item-sub">1-on-1 Live Online Quran Classes with Certified Teacher</span>
                    </td>
                    <td>{activeInvoice.month}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>
                      <strong>${item.amount.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Document Signatures, Verification Seal, and Totals */}
          <div className="invoice-doc-footer">
            <div className="footer-seal-block">
              <div className="seal-graphic">
                <Icon name="shield-check" size={15} style={{ marginRight: 6 }} />
                Verified Academic Registrar
              </div>
              <div className="signature-area">
                <span className="sig-handwriting">Dr. Ibrahim Al-Mansoor</span>
                <span className="sig-title">Academic Director</span>
              </div>
            </div>

            <div className="invoice-totals-box">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>${activeInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Institute Scholarship Discount:</span>
                <span>$0.00</span>
              </div>
              <div className="totals-row grand-total">
                <span>Total Amount (USD):</span>
                <span>${activeInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="totals-bdt-note">
                Equivalent to BDT {activeInvoice.amountBDT || Math.round(activeInvoice.amount * 115)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Icon name="receipt" size={32} color="var(--color-gold-primary)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-main)' }}>No Invoices Available</h3>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            There are currently no billing statements generated for this student record.
          </p>
        </div>
      )}
    </div>
  );
}
