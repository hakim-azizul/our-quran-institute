'use client';

import React from 'react';
import { Icon } from './Icons';

export default function TeacherRegisterFields({ formData, onChange }) {
  return (
    <div className="role-fields-container">
      <div className="role-fields-header">
        <Icon name="users" size={16} color="#0D4A38" />
        <span>Faculty Sanad &amp; Scholarly Credentials</span>
      </div>

      <div className="form-group">
        <label className="form-label">Sanad / Ijazah Issuing Authority</label>
        <div className="form-input-container">
          <input
            type="text"
            name="sanadCertification"
            value={formData.sanadCertification || ''}
            onChange={onChange}
            placeholder="e.g. Al-Azhar Al-Sharif / Islamic University of Madinah"
            className="form-input form-input-noicon"
            required
          />
        </div>
      </div>

      <div className="form-row-two">
        <div className="form-group">
          <label className="form-label">Primary Qira'at Riwayah</label>
          <div className="form-input-container">
            <select
              name="qiraat"
              value={formData.qiraat || 'Hafs ‘an ‘Asim'}
              onChange={onChange}
              className="form-input form-input-noicon form-select"
            >
              <option value="Hafs ‘an ‘Asim">Hafs ‘an ‘Asim (Standard)</option>
              <option value="Warsh ‘an Nafi’">Warsh ‘an Nafi’</option>
              <option value="Qalun ‘an Nafi’">Qalun ‘an Nafi’</option>
              <option value="Al-Susi / Al-Duri ‘an Abi ‘Amr">Abu ‘Amr al-Basri</option>
              <option value="10 Qira’at Mutawatirah (Full Sanad)">
                10 Qira’at Mutawatirah (Full Sanad)
              </option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Teaching Experience</label>
          <div className="form-input-container">
            <select
              name="yearsExperience"
              value={formData.yearsExperience || '3-5 years'}
              onChange={onChange}
              className="form-input form-input-noicon form-select"
            >
              <option value="1-2 years">1–2 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="6-10 years">6–10 years</option>
              <option value="10+ years">10+ years (Senior Scholar)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Scholarly Specialization</label>
        <div className="form-input-container">
          <input
            type="text"
            name="specialization"
            value={formData.specialization || ''}
            onChange={onChange}
            placeholder="e.g. Tajweed Matn (Jazariyyah), Hifz Intensive, Arabic Grammar"
            className="form-input form-input-noicon"
          />
        </div>
      </div>
    </div>
  );
}
