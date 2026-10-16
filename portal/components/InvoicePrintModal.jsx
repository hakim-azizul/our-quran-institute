'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function InvoicePrintModal({
  isOpen = false,
  onClose,
  currentUser,
}) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/finance?type=invoices');
      const data = await res.json();
      if (data.success && data.invoices) {
        setInvoices(data.invoices);
        if (data.invoices.length > 0) {
          setSelectedInvoiceId(data.invoices[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
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
        setPaymentSuccessMsg(data.message);
        fetchInvoices();
        setTimeout(() => setPaymentSuccessMsg(''), 4000);
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="invoice-modal-backdrop" onClick={onClose}>
      <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="invoice-modal-top-bar">
          <div className="top-bar-left">
            <span className="receipt-icon">
              <Icon name="receipt" size={20} />
            </span>
            <div>
              <h2 className="top-bar-title">Tuition Invoices &amp; Receipts</h2>
              <p className="top-bar-sub">Financial tracking, monthly tuition payment status &amp; official PDF receipts.</p>
            </div>
          </div>

          <div className="top-bar-actions">
            <button
              type="button"
              className="btn-print-invoice"
              onClick={() => window.print()}
            >
              <Icon name="printer" size={15} style={{ marginRight: 6 }} />
              Print / Save PDF Receipt
            </button>
            <button type="button" className="btn-close-invoice" onClick={onClose} aria-label="Close invoice">
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Invoice Selector Strip */}
        <div className="invoice-selector-strip">
          <span className="strip-label">Billing Invoices Archive:</span>
          <div className="invoice-pills-row">
            {invoices.map((inv) => {
              const isSelected = inv.id === activeInvoice?.id;
              return (
                <button
                  key={inv.id}
                  type="button"
                  className={`invoice-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedInvoiceId(inv.id)}
                >
                  <span className="pill-month">{inv.month}</span>
                  <span className="pill-id">{inv.id}</span>
                  <span className={`pill-status-tag status-${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Printable Official Invoice Card */}
        {activeInvoice ? (
          <div className="printable-invoice-card" id="printable-receipt-content">
            {/* Header */}
            <div className="invoice-doc-header">
              <div className="doc-brand">
                <img
                  src="/assets/logo_gold.png"
                  alt="Our Quran Institute"
                  className="doc-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <h1 className="doc-institute-name">Our Quran Institute</h1>
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

            {/* Bill To & Status Banner */}
            <div className="invoice-doc-addresses">
              <div className="bill-to-box">
                <span className="address-label">BILL TO (STUDENT &amp; GUARDIAN):</span>
                <h3 className="student-recipient-name">{activeInvoice.studentName}</h3>
                <p className="guardian-name">Guardian: {activeInvoice.parentName || 'Hajji Mansoor Rahman'}</p>
                <p className="student-id-ref">Student ID: {activeInvoice.studentId}</p>
                <p className="academic-session">Session: 1447-1448 AH (2026-2027)</p>
              </div>

              <div className="payment-status-box">
                <span className="address-label">PAYMENT STATUS:</span>
                <div className={`status-badge-large status-${activeInvoice.status.toLowerCase()}`}>
                  {activeInvoice.status === 'Paid' ? 'PAID IN FULL' : 'PAYMENT DUE'}
                </div>

                {activeInvoice.status === 'Paid' ? (
                  <div className="payment-receipt-details">
                    <span><strong>Method:</strong> {activeInvoice.paymentMethod || 'Online Payment'}</span>
                    <span><strong>Transaction ID:</strong> {activeInvoice.transactionId}</span>
                    <span><strong>Paid At:</strong> {new Date(activeInvoice.paidAt).toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="due-action-box">
                    <span className="due-prompt">Payment of ${activeInvoice.amount} ({activeInvoice.amountBDT || 7500} BDT) is due.</span>
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

            {paymentSuccessMsg && (
              <div className="payment-success-banner">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check-circle" size={16} />
                  {paymentSuccessMsg}
                </span>
              </div>
            )}

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
                      <td><strong>${item.amount.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Signatures */}
            <div className="invoice-doc-footer">
              <div className="footer-seal-block">
                <div className="seal-graphic">
                  <Icon name="shield-check" size={14} style={{ marginRight: 6 }} />
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
          <div className="empty-invoices-state">
            <p>No invoices available for this student record.</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
