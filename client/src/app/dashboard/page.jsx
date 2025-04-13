'use client';
import React from 'react';
import Dashboard from '../../components/Home';
import PrivacyPolicyModal from '../../components/PrivacyPolicy';

export default function dashboard() {
  return (
    <div>
      <Dashboard />
      <PrivacyPolicyModal />
    </div>
  );
};

