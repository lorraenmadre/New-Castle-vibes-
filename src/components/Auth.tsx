import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

const DESIGN_URL = 'https://lorraenmadre.app';

export default function Auth({ onAuthReady }: { onAuthReady: (user: UserProfile) => void }) {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => {
      setLoading(false);
      setAuthError('Newcastle is awake, but Firebase is taking too long to answer. Try signing in again.');
    }, 8000);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        window.clearTimeout(loadingTimeout);

        if (!user) {
          setLoading(false);
          return;
        }

        const fallbackUser: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'New User',
          role: 'owner',
          createdAt: new Date().toISOString(),
        };

        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            onAuthReady(userDoc.data() as UserProfile);
          } else {
            const newUser: UserProfile = {
              ...fallbackUser,
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            onAuthReady(newUser);
          }
        } catch (error) {
          console.error('User profile load failed. Continuing with local profile:', error);
          setAuthError('Your login worked, but the profile vault is not reachable yet. Opening Newcastle in safe mode.');
          onAuthReady(fallbackUser);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        window.clearTimeout(loadingTimeout);
        console.error('Auth listener failed:', error);
        setAuthError('Firebase Auth did not initialize cleanly. Refresh once, then check the Firebase authorized domains.');
        setLoading(false);
      }
    );

    return () => {
      window.clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, [onAuthReady]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Login failed. Add this site to Firebase Auth authorized domains, then try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black gap-6">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-black" />
        </motion.div>
        <p className="system-tag text-slate-300">Opening New Castle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-black p-12 lg:p-24 font-sans selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-7xl pl-12 lg:pl-20"
      >
        <div className="space-y-4">
          <h1 className="text-8xl lg:text-[10rem] heading-large uppercase whitespace-nowrap">
            NEW CASTLE <span className="italic lowercase tracking-normal">vibes</span>
          </h1>
        </div>
        <div className="mt-12 space-y-12">
          <p className="text-3xl lg:text-4xl font-display italic text-slate-500 max-w-3xl leading-[1.1]">
            Get your House in order with <span className="system-tag text-black not-italic block mt-4 ml-1">TIME . space + Story</span>
          </p>
          {authError && (
            <p className="max-w-2xl text-sm font-display italic text-rose-600 bg-rose-50 border border-rose-100 p-4">
              {authError}
            </p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-end space-y-12 pr-12 lg:pr-20 mt-auto"
      >
        <div className="flex flex-col sm:flex-row items-end gap-12">
          <div className="flex flex-col items-center gap-4">
            <a
              href={DESIGN_URL}
              target="_blank"
              rel="noreferrer"
              className="px-16 py-8 border border-black bg-white text-black system-tag hover:bg-black hover:text-white transition-all shadow-xl rounded-full"
            >
              design
            </a>
            <p className="system-tag text-slate-300 normal-case tracking-normal italic">Roadmap to your Universal Family Office</p>
          </div>
          <button
            onClick={handleLogin}
            className="px-16 py-8 bg-[#E63946] text-white system-tag hover:scale-105 active:scale-95 transition-all shadow-2xl rounded-full"
          >
            get a castle
          </button>
          <button
            className="px-16 py-8 bg-[#457B9D] text-white system-tag hover:scale-105 active:scale-95 transition-all shadow-2xl rounded-full"
          >
            become an affiliate
          </button>
        </div>
        <p className="system-tag text-slate-300">
          NEW CASTLE Legal Ops | Est. 2026
          <span className="block text-[8px] uppercase tracking-[0.3em] text-purple-300 mt-2">powered by 'perplexity computer'</span>
        </p>
      </motion.div>
    </div>
  );
}
