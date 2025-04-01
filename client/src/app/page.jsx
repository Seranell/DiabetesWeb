'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig"; // Adjust the path if needed
import AuthComponent from "../components/Auth";

export default function Welcome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard"); // Redirect to dashboard if authenticated
      } else {
        setLoading(false); // Show AuthComponent if unauthenticated
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // Optional loading state

  return (
    <div>
      <div>
        <AuthComponent />
      </div>
    </div>
  );
}
