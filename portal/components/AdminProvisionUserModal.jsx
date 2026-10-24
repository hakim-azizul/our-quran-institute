'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function AdminProvisionUserModal({
  isOpen = false,
  onClose,
  onUserProvisioned,
  teachers = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'student', // 'student' | 'teacher'
    mentor: teachers[0]?.name || 'Dr. Sheikh Ahmad Al-Azhari',
    ratePerClass: 25,
    specialization: 'Quran Reading & Tajweed Rules',
    tajweedLevel: 'Intermediate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          ...formData,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to provision user.');
        return;
      }

      setSuccessMsg(data.message || 'User provisioned successfully with assigned role!');
      if (onUserProvisioned) onUserProvisioned(data.user);

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setFormData({
          name: '',
          email: '',
          password: 'password123',
          role: 'student',
          mentor: teachers[0]?.name || 'Dr. Sheikh Ahmad Al-Azhari',
          ratePerClass: 25,
          specialization: 'Quran Reading & Tajweed Rules',
          tajweedLevel: 'Intermediate',
        });
      }, 900);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
      setErrorMsg('Network error while provisioning user.');
    }
  };

  const modalContent = (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-banner" style={{ background: '#0D4A38', color: '#FFFFFF', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#FFDF85', color: '#0D4A38', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Icon name="user-plus" size={18} />
            </span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>
                Provision New User &amp; Assign Role
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#FFDF85', marginTop: '2px' }}>
                Admins assign whether the user joins as an Enrolled Student or Faculty Scholar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF',
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {errorMsg && (
            <div className="auth-alert-box auth-alert-error" style={{ marginBottom: '16px' }}>
              <Icon name="alert-circle" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box auth-alert-success" style={{ marginBottom: '16px' }}>
              <Icon name="check-circle" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Assignment Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Designated Academic Role (Assigned by Admin)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: 'student' }))}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: formData.role === 'student' ? '2px solid #0D4A38' : '1.5px solid #E2E8F0',
                  background: formData.role === 'student' ? '#F0FDF4' : '#FFFFFF',
                  color: formData.role === 'student' ? '#0D4A38' : '#64748B',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="student" size={16} />
                <span>Student / Learner</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: 'teacher' }))}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: formData.role === 'teacher' ? '2px solid #0D4A38' : '1.5px solid #E2E8F0',
                  background: formData.role === 'teacher' ? '#F0FDF4' : '#FFFFFF',
                  color: formData.role === 'teacher' ? '#0D4A38' : '#64748B',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="scholar" size={16} />
                <span>Teacher / Scholar</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Full Legal / Display Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={formData.role === 'teacher' ? 'Dr. Sheikh...' : 'Tariq Al-Mansoor'}
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="user@quraninstitute.org"
                className="form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Initial Temporary Password *
            </label>
            <input
              type="text"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="form-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
            />
          </div>

          {formData.role === 'student' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Assign Faculty Mentor
                </label>
                <select
                  name="mentor"
                  value={formData.mentor}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  <option value="Dr. Sheikh Ahmad Al-Azhari">Dr. Sheikh Ahmad Al-Azhari</option>
                  <option value="Ustadh Mahmoud Al-Misri">Ustadh Mahmoud Al-Misri</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Initial Tajweed Level
                </label>
                <select
                  name="tajweedLevel"
                  value={formData.tajweedLevel}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                >
                  <option value="Beginner (Noorani Qaida)">Beginner (Noorani Qaida)</option>
                  <option value="Intermediate (Makharij & Rules)">Intermediate (Makharij & Rules)</option>
                  <option value="Advanced (Hifz & Revision)">Advanced (Hifz & Revision)</option>
                  <option value="Sanad Track (Ten Qira’at)">Sanad Track (Ten Qira’at)</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Per-Class Honorarium ($/Class)
                </label>
                <input
                  type="number"
                  name="ratePerClass"
                  min="1"
                  value={formData.ratePerClass}
                  onChange={handleChange}
                  className="form-input"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Teaching Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Qira’at & Tajweed Sanad"
                  className="form-input"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#0D4A38',
                color: '#FFDF85',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon name="check-circle" size={15} color="#FFDF85" />
              <span>{isSubmitting ? 'Creating User...' : `Create ${formData.role === 'teacher' ? 'Scholar' : 'Student'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
