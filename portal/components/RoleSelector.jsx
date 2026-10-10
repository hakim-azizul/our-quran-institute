'use client';

import React from 'react';
import { Icon } from './Icons';

export default function RoleSelector({ activeRole, onRoleChange }) {
  const roles = [
    {
      id: 'student',
      title: 'Student / Learner',
      desc: '1-on-1 Hifz, Tajweed & Arabic',
      icon: 'book-open',
    },
    {
      id: 'teacher',
      title: 'Teacher / Scholar',
      desc: 'Sanad Faculty & Azhari Scholars',
      icon: 'users',
    },
  ];

  return (
    <div className="role-tabs-wrapper">
      <span className="role-tabs-label">Select Account Type:</span>
      <div className="role-tabs-grid role-tabs-grid-two">
        {roles.map((role) => {
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              className={`role-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onRoleChange(role.id)}
            >
              <div className="role-tab-icon-wrap">
                <Icon
                  name={role.icon}
                  size={18}
                  color={isActive ? '#0D4A38' : '#C5A45A'}
                />
              </div>
              <div className="role-tab-content">
                <span className="role-tab-title">{role.title}</span>
                <span className="role-tab-desc">{role.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
