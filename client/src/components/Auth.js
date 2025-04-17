'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  db
} from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function AuthComponent() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (!user.emailVerified) {
          setError('Please verify your email before logging in.');
          await signOut(auth);
          return;
        }

        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (!docSnap.exists()) {
          router.push('/account-setup');
          return;
        }

        setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
        });

        const correctionValuesRef = doc(db, 'users', user.uid, 'correctionValues', 'data');
        const mealValuesRef = doc(db, 'users', user.uid, 'mealValues', 'data');

        const correctionSnap = await getDoc(correctionValuesRef);
        const mealSnap = await getDoc(mealValuesRef);

        if (correctionSnap.exists() && mealSnap.exists()) {
          router.push('/dashboard');
        } else {
          router.push('/carb');
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailSent(false);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        await sendEmailVerification(newUser);
        setEmailSent(true);
        alert('Verification email sent. Please check your inbox.');
        await signOut(auth);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const loggedInUser = userCredential.user;

        if (!loggedInUser.emailVerified) {
          setError('Your email is not verified. Please check your inbox.');
          await signOut(auth);
          return;
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert(`Error signing in: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      alert(`Error signing out: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {user ? (
        <div className="text-center mb-6">
          <img src={user.photo} alt="User Photo" className="rounded-full w-16 h-16 mx-auto mb-3" />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Log In'}</h2>

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-1">Password</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-3 flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-lg font-medium mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {emailSent && (
              <p className="text-green-600 text-sm">
                A verification email has been sent. Please check your inbox.
              </p>
            )}

            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {!isSignUp && (
            <div className="text-center mt-4">
              <button
                onClick={async () => {
                  try {
                    await sendPasswordResetEmail(auth, email);
                    alert('Password reset email sent!');
                  } catch (error) {
                    alert(error.message);
                  }
                }}
                className="text-blue-500 text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-blue-600 cursor-pointer font-medium"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </span>
            </p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSignInWithGoogle}
              className="inline-flex items-center justify-center w-12 h-12 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md"
            >
              <FcGoogle size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
