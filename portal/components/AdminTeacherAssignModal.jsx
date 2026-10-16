'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons';

export default function AdminTeacherAssignModal({
  isOpen = false,
  onClose,
  students = [],
  teachers = [],
  initialStudentId = null,
  onAssignmentComplete,
}) {
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudentId || students[0]?.id || ''
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState(
    teachers[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selectedStudentId if initialStudentId changes
  React.useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
      const stu = students.find((s) => s.id === initialStudentId);
      if (stu?.assignedTeacherId) {
        setSelectedTeacherId(stu.assignedTeacherId);
      }
    }
  }, [initialStudentId]);

  if (!isOpen) return null;

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedTeacherId) {
      alert('Please select both a student and a teacher.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMsg('');

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign_teacher',
          studentId: selectedStudentId,
          teacherId: selectedTeacherId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(data.message || 'Teacher-student pairing updated successfully!');
        if (onAssignmentComplete) onAssignmentComplete();
        setTimeout(() => {
          setFeedbackMsg('');
          if (onClose) onClose();
        }, 1200);
      } else {
        alert(data.error || 'Failed to assign teacher.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating teacher assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="pairing-modal-backdrop" onClick={onClose}>
      <div className="pairing-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pairing-modal-header">
          <div className="pairing-badge-row">
            <span className="pairing-icon">
              <Icon name="link" size={20} />
            </span>
            <div>
              <h2 className="pairing-modal-title">Assign Teacher to Student</h2>
              <p className="pairing-modal-subtitle">
                Assign students to certified Quran teachers
              </p>
            </div>
          </div>
          <button type="button" className="pairing-close-btn" onClick={onClose} aria-label="Close dialog">
            <Icon name="x" size={16} />
          </button>
        </div>

        <form onSubmit={handleConfirmAssignment} className="pairing-modal-body">
          {/* Student Selector */}
          <div className="form-group-item">
            <label htmlFor="assign-student-select">Select Student:</label>
            <select
              id="assign-student-select"
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const s = students.find((stu) => stu.id === e.target.value);
                if (s?.assignedTeacherId) {
                  setSelectedTeacherId(s.assignedTeacherId);
                }
              }}
              className="pairing-select-input"
              required
            >
              {students.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.name} ({stu.id}) • Currently with: {stu.mentor || 'Unassigned'}
                </option>
              ))}
            </select>
          </div>

          {/* Current Status Box */}
          {activeStudent && (
            <div className="current-pairing-box">
              <span className="pairing-box-label">Current Academic Allocation:</span>
              <div className="pairing-box-content">
                <div>
                  <strong>Student:</strong> {activeStudent.name}
                  <span className="sub-meta">Hifz: Para {activeStudent.memorizedJuz || 0} of 30</span>
                </div>
                <div>
                  <strong>Current Mentor:</strong> {activeStudent.mentor || 'Pending Assignment'}
                </div>
              </div>
            </div>
          )}

          {/* Teacher Selector */}
          <div className="form-group-item">
            <label htmlFor="assign-teacher-select">Assign Verified Scholar:</label>
            <select
              id="assign-teacher-select"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="pairing-select-input"
              required
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id}) • {t.specialization || 'Scholar'} • {t.studentsCount || 0} Students
                </option>
              ))}
            </select>
          </div>

          {activeTeacher && (
            <div className="teacher-preview-box">
              <span className="teacher-preview-avatar">
                <Icon name="scholar" size={24} />
              </span>
              <div>
                <h4 className="teacher-preview-name">{activeTeacher.name}</h4>
                <p className="teacher-preview-sanad">{activeTeacher.sanadCertification || 'Verified Scholar'}</p>
                <span className="teacher-preview-stats">
                  Rate: ${activeTeacher.ratePerClass || activeTeacher.hourlyRate || 35}/class • Active Students: {activeTeacher.studentsCount || 0}
                </span>
              </div>
            </div>
          )}

          {feedbackMsg && (
            <div className="pairing-success-toast">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="check-circle" size={16} /> {feedbackMsg}
              </span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pairing-modal-footer">
            <button
              type="button"
              className="btn-pairing-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-pairing-confirm"
            >
              {isSubmitting ? (
                'Updating Allocation...'
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="link" size={14} color="#FFFFFF" />
                  <span>Confirm Teacher Assignment</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
