'use client';

import React from 'react';
import { Icon } from './Icons';

export default function RoleSelector({ activeRole, onRoleChange }) {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      badge: 'Learner',
      desc: '1-on-1 Quran & Hifz',
      icon: 'book-open',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      badge: 'Instructor',
      desc: 'Classes & Grading',
      icon: 'users',
    },
    {
      id: 'parent',
      title: 'Parent',
      badge: 'Guardian',
      desc: 'Progress & Reviews',
      icon: 'parent',
    },
  ];

  return (
    <div className="role-tabs-wrapper">
      <span className="role-tabs-label">Select Account Type:</span>
      <div className="role-tabs-grid role-tabs-grid-three">
        {roles.map((role) => {
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              className={`role-tab-btn role-tab-card ${isActive ? 'active' : ''}`}
              onClick={() => onRoleChange(role.id)}
            >
              <div className="role-tab-icon-wrap">
                <Icon
                  name={role.icon}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#0D4A38'}
                />
              </div>
              <div className="role-tab-content">
                <span className="role-tab-title">{role.title}</span>
                <span className="role-tab-badge">{role.badge}</span>
                <span className="role-tab-desc">{role.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
