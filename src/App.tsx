import React, { useState, useEffect } from 'react';
import { UserProfile, House } from './types';
import Auth from './components/Auth';
import CastleMap from './components/CastleMap';
import RoomView from './components/RoomView';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Map as MapIcon, LogOut, Bell, Search, Plus, Upload, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { INITIAL_HOUSES } from './constants';
import UploadStoryFlow from './components/UploadStoryFlow';

type View = 'castle' | 'room';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>('castle');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [activePresences, setActivePresences] = useState<Record<string, number>>({});
  const [showUploadFlow, setShowUploadFlow] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'presence'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.houseId) {
          counts[data.houseId] = (counts[data.houseId] || 0) + 1;
        }
      });
      setActivePresences(counts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'presence');
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <Auth onAuthReady={setUser} />;
  }

  const handleSelectHouse = (house: House) => {
    setSelectedHouse(house);
    setView('room');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <div className="flex flex-col cursor-pointer" onClick={() => setView('castle')}>
              <span className="text-4xl heading-large uppercase">NEW CASTLE <span className="text-xl italic lowercase tracking-normal">vibes</span></span>
            </div>

            <div className="flex items-center gap-12">
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 border-r border-slate-100 pr-10">
              <button 
                className="px-6 py-2 bg-[#E63946] text-white system-tag hover:scale-105 transition-all text-[8px] rounded-full"
              >
                get a castle
              </button>
              <button 
                className="px-6 py-2 bg-[#457B9D] text-white system-tag hover:scale-105 transition-all text-[8px] rounded-full"
              >
                become an affiliate
              </button>
            </div>

            <button 
              onClick={() => setShowUploadFlow(true)}
              className="flex items-center gap-3 px-6 py-3 bg-black text-white system-tag hover:bg-slate-800 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Upload Piece
            </button>

            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-transparent focus-within:border-black transition-all">
              <Search className="w-4 h-4 text-slate-300" />
              <input type="text" placeholder="Find volumes..." className="bg-transparent border-none outline-none text-[10px] uppercase font-bold tracking-widest placeholder:text-slate-300 w-40" />
            </div>

            <button className="p-2 text-slate-300 hover:text-black transition-all relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full" />
            </button>
            
            <div className="flex items-center gap-6 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-black leading-none italic">{user.displayName}</p>
                <p className="system-tag text-slate-300 mt-1">{user.role}</p>
              </div>
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.displayName?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {view === 'castle' && (
            <motion.div
              key="castle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CastleMap 
                onSelectHouse={handleSelectHouse} 
                onUpload={() => setShowUploadFlow(true)}
                activePresences={activePresences} 
              />
            </motion.div>
          )}

          {view === 'room' && selectedHouse && (
            <motion.div
              key="room"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoomView
                house={selectedHouse}
                user={user}
                onBack={() => setView('castle')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUploadFlow && (
            <UploadStoryFlow
              user={user}
              houses={INITIAL_HOUSES}
              onClose={() => setShowUploadFlow(false)}
              onComplete={() => {
                setShowUploadFlow(false);
                // Optionally navigate to the house where it was uploaded
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-24 mt-40">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-6">
            <div className="flex flex-col text-black">
              <span className="text-3xl heading-large uppercase">NEW CASTLE <span className="text-sm italic lowercase tracking-normal">vibes</span></span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-purple-300 mt-1">powered by 'perplexity computer'</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-display italic">
              A private AI-assisted document intelligence portal <span className="text-slate-300">for</span> organizing your story.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="px-8 py-4 bg-[#E63946] text-white system-tag hover:scale-105 transition-all rounded-full">
                get a castle
              </button>
              <button className="px-8 py-4 bg-[#457B9D] text-white system-tag hover:scale-105 transition-all rounded-full">
                become an affiliate
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-24 gap-y-12">
            <div className="space-y-6">
              <h4 className="system-tag text-black">Network</h4>
              <ul className="space-y-3 system-tag text-slate-400">
                <li><a href="#" className="hover:text-black transition-colors">Class Action Hub</a></li>
                <li><a href="#" className="hover:text-black transition-colors">New Found Liberation DV Advocacy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Travel Club</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Cash Credit Crypto Repair</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Business Banking</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="system-tag text-black">Legal</h4>
              <ul className="space-y-3 system-tag text-slate-400">
                <li><a href="#" className="hover:text-black transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Terms</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="system-tag text-black">Account</h4>
              <ul className="space-y-3 system-tag text-slate-400">
                <li><button onClick={() => setUser(null)} className="text-rose-500 hover:text-rose-600 transition-colors">Sign Out</button></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-24 pt-12 border-t border-slate-50 flex justify-between items-end">
          <p className="system-tag text-slate-300">
            © 2026 NEW CASTLE Legal Ops. Private Operating System.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-200">
            TIME . space + Story
          </p>
        </div>
      </footer>
    </div>
  );
}

