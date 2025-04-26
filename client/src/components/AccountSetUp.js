'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '../../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export default function AccountSetup() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/carb');
      return;
    }

    // Prefill name and photo from auth
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || 'https://www.gravatar.com/avatar/?d=mp');
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = auth.currentUser;
    if (!user) return;

    try {
      // Check if username is already taken
      const usernameRef = doc(db, 'usernames', username);
      const usernameSnap = await getDoc(usernameRef);

      if (usernameSnap.exists()) {
        setError('Username already taken.');
        setLoading(false);
        return;
      }

      // Upload image if user selected a new one
      let finalPhotoURL = user.photoURL || 'https://www.gravatar.com/avatar/?d=mp';
      if (file) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        finalPhotoURL = await getDownloadURL(storageRef);
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName,
        photoURL: finalPhotoURL,
      });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: displayName,
        username,
        email: user.email,
        photo: finalPhotoURL,
        createdAt: new Date(),
      });

      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid,
      });

      router.push('/carb');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {photoURL && (
            <img
              src={photoURL}
              alt="Preview"
              className="mt-2 w-20 h-20 rounded-full object-cover"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>
      </form>
    </div>
  );
}
