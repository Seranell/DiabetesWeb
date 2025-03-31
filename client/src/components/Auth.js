import { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut, db, doc, setDoc, getDoc } from '../../../firebaseConfig';

export default function AuthComponent() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDoc);

                // Save user data if not existing
                if (!docSnap.exists()) {
                    await setDoc(userDoc, {
                        name: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        createdAt: new Date()
                    });
                }

                setUser({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL
                });
            } else {
                setUser(null);
            }
        });
    }, []);

    const handleSignIn = async () => {
        try {
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Sign-In Error:", error);
            alert(`Error signing in: ${error.message}`);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
            alert(`Error signing out: ${error.message}`);
        }
    };

    return (
        <div className="p-4 max-w-sm mx-auto mt-20 text-center">
            <div>
                {user ? (
                    <div>
                        <img src={user.photo} alt="User Photo" className="rounded-full w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <button className="mt-4" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : (
                    <button onClick={handleSignIn}>Sign In with Google</button>
                )}
            </div>
        </div>
    );
}
