'use client';
import React from 'react';
import AccountSetup from '../../components/AccountSetUp';
import PrivacyPolicyModal from '../../components/PrivacyPolicy';

export default function setup() {
  return (
    <div>
      <AccountSetup />
      <PrivacyPolicyModal />
    </div>
  );
};

