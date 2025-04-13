'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oobCode = urlParams.get('oobCode');

      if (!oobCode) {
        setMessage('Invalid verification link.');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setMessage('Email verified successfully! Redirecting...');
        
        await auth.currentUser?.reload();

        setTimeout(() => {
          router.push('/carb');
        }, 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('The verification link is invalid or expired.');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-8 rounded-lg shadow-md bg-gray-800">
        <h1 className="text-xl font-semibold">{message}</h1>
      </div>
    </div>
  );
}
