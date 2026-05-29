import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { House, LibraryItem, Presence, UserProfile, HouseMode, CouncilMember, VaultDocument, Repair } from '../types';
import { INITIAL_LIBRARY_ITEMS, INITIAL_HOUSES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, MessageSquare, Send, ArrowRight, Upload, Users, Library, Database, Wrench, FileText, X, Calendar, Globe, Lock, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import UploadStoryFlow from './UploadStoryFlow';

export default function RoomView({ house, user, onBack }: { house: House, user: UserProfile, onBack: () => void }) {
  const [activeUsers, setActiveUsers] = useState<Presence[]>([]);
  const [mode, setMode] = useState<HouseMode>('vault');
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>([]);
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<VaultDocument | null>(null);
  
  const houseLibrary = INITIAL_LIBRARY_ITEMS.filter(t => t.houseId === house.id);

  useEffect(() => {
    const presenceRef = doc(db, 'presence', user.uid);
    setDoc(presenceRef, {
      userId: user.uid,
      houseId: house.id,
      status: 'available',
      lastSeen: serverTimestamp(),
      displayName: user.displayName
    }).catch(err => handleFirestoreError(err, OperationType.WRITE, `presence/${user.uid}`));

    const q = query(collection(db, 'presence'), where('houseId', '==', house.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as Presence);
      setActiveUsers(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'presence');
    });

    return () => {
      unsubscribe();
      deleteDoc(presenceRef).catch(() => {});
    };
  }, [house.id, user.uid, user.displayName]);

  useEffect(() => {
    const qVault = query(collection(db, 'vault'), where('houseId', '==', house.id));
    const unsubVault = onSnapshot(qVault, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VaultDocument));
      setVaultDocs(docs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'vault'));

    const qCouncil = query(collection(db, 'council'), where('houseId', '==', house.id));
    const unsubCouncil = onSnapshot(qCouncil, (snapshot) => {
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouncilMember));
      setCouncilMembers(members);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'council'));

    const qRepairs = query(collection(db, 'repairs'), where('houseId', '==', house.id));
    const unsubRepairs = onSnapshot(qRepairs, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repair));
      setRepairs(items);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'repairs'));

    return () => {
      unsubVault();
      unsubCouncil();
      unsubRepairs();
    };
  }, [house.id]);

  const modes: { id: HouseMode, label: string, icon: any }[] = [
    { id: 'council', label: 'Council', icon: Users },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'vault', label: 'Vault', icon: Database },
    { id: 'repairs', label: 'Repairs', icon: Wrench },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-none transition-colors border border-slate-100 hover:border-black">
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <div>
              <div className="flex items-center gap-4">
                <span className="system-tag text-slate-300">House {house.id}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="font-display text-xs text-slate-400 italic font-medium tracking-tight">"<span className="text-slate-200">the</span> {house.mantra}"</span>
              </div>
              <h2 className="text-5xl heading-large text-black italic mt-2 lowercase">{house.name}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-1">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 system-tag transition-all border border-transparent",
                    mode === m.id ? "bg-black text-white" : "text-slate-300 hover:text-black hover:border-slate-100"
                  )}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>
            
            <div className="flex -space-x-2">
              {activeUsers.map((u) => (
                <div key={u.userId} className="w-10 h-10 rounded-none bg-black border-2 border-white flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm" title={u.displayName}>
                  {u.displayName?.charAt(0) || 'U'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left Column: Mode Content */}
        <div className="lg:col-span-8 space-y-20">
          <div className="p-10 bg-slate-50 border border-slate-100 space-y-4">
            <h3 className="system-tag text-slate-300">Intention</h3>
            <p className="text-3xl font-display font-medium italic text-black leading-tight tracking-tight">
              {house.intention}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'council' && (
              <motion.section
                key="council"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <h3 className="system-tag text-slate-300">The Round Table</h3>
                    <h4 className="text-4xl heading-large text-black italic">Council <span className="text-slate-300">of the</span> House</h4>
                    <p className="text-sm font-display italic text-slate-400">Professionals <span className="text-slate-200">and</span> trusted collaborators who help maintain this domain.</p>
                  </div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-black text-white system-tag hover:bg-slate-800 transition-all">
                    Add Council Member
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {councilMembers.length > 0 ? councilMembers.map((member) => (
                    <div key={member.id} className="p-8 border border-slate-100 bg-white flex items-center gap-6 group hover:border-black transition-all">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-200 group-hover:text-black transition-colors" />
                      </div>
                      <div>
                        <h5 className="text-xl font-display font-bold text-black italic">{member.name}</h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{member.role}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                      <Users className="w-10 h-10 text-slate-100" />
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No council members assigned.</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {mode === 'library' && (
              <motion.section
                key="library"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <h3 className="system-tag text-slate-300">Template Library</h3>
                    <h4 className="text-4xl heading-large text-black italic">Tools <span className="text-slate-300">and</span> Toys</h4>
                    <p className="text-sm font-display italic text-slate-400">Standard operating procedures <span className="text-slate-200">and</span> legal templates for this domain.</p>
                  </div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-black text-white system-tag hover:bg-slate-800 transition-all">
                    Create Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {houseLibrary.map(item => (
                    <div key={item.id} className="p-8 border border-slate-100 hover:border-black transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                        <Library className="w-5 h-5 text-slate-200 group-hover:text-black transition-colors" />
                      </div>
                      <h5 className="text-2xl font-display font-bold text-black mb-3 italic">{item.title}</h5>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                      <button className="mt-8 flex items-center gap-3 text-[10px] font-bold text-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Use Template <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {mode === 'vault' && (
              <motion.section
                key="vault"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <h3 className="system-tag text-slate-300">Document Storage</h3>
                    <h4 className="text-4xl heading-large text-black italic">The Vault</h4>
                    <p className="text-sm font-display italic text-slate-400">Upload documents once. Stop retelling <span className="text-slate-200">the</span> story over <span className="text-slate-200">and</span> over.</p>
                  </div>
                  <button 
                    onClick={() => setShowUploadFlow(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-black text-white system-tag hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Piece
                  </button>
                </div>

                <div className="space-y-4">
                  {vaultDocs.length > 0 ? vaultDocs.map((doc) => (
                    <div 
                      key={doc.id} 
                      onMouseEnter={() => setHoveredDocId(doc.id)}
                      onMouseLeave={() => setHoveredDocId(null)}
                      className="relative p-8 border border-slate-100 flex items-center justify-between group hover:border-black transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-slate-300 group-hover:text-black transition-colors" />
                        </div>
                        <div>
                          <h5 className="text-lg font-display font-bold text-black italic">{doc.fileName}</h5>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {doc.docDate ? `Dated: ${doc.docDate}` : 'No Date'}
                            </p>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {doc.source || 'Unknown Source'}
                            </p>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              {doc.confidentiality}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedDocForPreview(doc)}
                        className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:text-black transition-colors"
                      >
                        Preview
                      </button>

                      {/* AI Summary Tooltip */}
                      <AnimatePresence>
                        {hoveredDocId === doc.id && doc.aiSummary && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 right-0 -bottom-2 translate-y-full z-30 p-6 bg-black text-white shadow-2xl border border-white/10"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Database className="w-3 h-3 text-slate-400" />
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">AI Intelligence Summary</span>
                            </div>
                            <p className="text-sm font-display italic leading-relaxed text-slate-200">
                              "{doc.aiSummary}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                              <span className="text-[8px] text-slate-500 uppercase tracking-widest">Newcastle Intelligence Core</span>
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                                <div className="w-1 h-1 bg-green-500/50 rounded-full" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )) : (
                    <div className="p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                      <Database className="w-10 h-10 text-slate-100" />
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">The vault is empty.</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {mode === 'repairs' && (
              <motion.section
                key="repairs"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end">
                  <div className="space-y-4">
                    <h3 className="system-tag text-slate-300">Risk Tracking</h3>
                    <h4 className="text-4xl heading-large text-black italic">Repairs <span className="text-slate-300">and</span> Issues</h4>
                    <p className="text-sm font-display italic text-slate-400">Identify <span className="text-slate-200">and</span> resolve issues before they become crises.</p>
                  </div>
                  <button className="flex items-center gap-3 px-8 py-4 bg-black text-white system-tag hover:bg-slate-800 transition-all">
                    Log Issue
                  </button>
                </div>
                <div className="space-y-4">
                  {repairs.length > 0 ? repairs.map((repair) => (
                    <div key={repair.id} className="p-10 border border-slate-100 bg-white flex items-center justify-between group hover:border-black transition-all">
                      <div className="flex items-center gap-8">
                        <Wrench className={cn(
                          "w-8 h-8",
                          repair.severity === 'urgent' ? "text-red-500" : "text-slate-200 group-hover:text-black transition-colors"
                        )} />
                        <div>
                          <h5 className="text-2xl font-display font-bold text-black italic">{repair.title}</h5>
                          <p className="text-sm text-slate-500 font-sans mt-2">{repair.description}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em]",
                        repair.severity === 'urgent' ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        {repair.severity}
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                      <Wrench className="w-10 h-10 text-slate-100" />
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No repairs needed.</p>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: The Gathering & AI */}
        <div className="lg:col-span-4 space-y-20">
          <section className="space-y-10">
            <h3 className="system-tag text-slate-300">The Council Chamber</h3>
            <div className="space-y-8">
              {activeUsers.map(u => (
                <div key={u.userId} className="flex items-center gap-6 group">
                  <div className="relative">
                    <div className="w-14 h-14 bg-black flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {u.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-xl heading-large text-black italic lowercase tracking-tight">{u.displayName}</h4>
                    <p className="system-tag text-slate-400 mt-1">{u.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10 pt-20 border-t border-slate-100">
            <h3 className="system-tag text-slate-300">Ask Newcastle</h3>
            <div className="p-8 bg-slate-50 border border-slate-100 space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-black" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">
                  Ask <span className="text-slate-200">the</span> core intelligence questions.
                </p>
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1 border-b border-slate-200 pb-2 focus-within:border-black transition-colors">
                  <input
                    type="text"
                    placeholder="Ask about this volume..."
                    className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                <button className="p-3 hover:bg-slate-100 transition-colors">
                  <Send className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </section>

          {/* Repairs Quick Access */}
          <section className="pt-20 border-t border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mb-8">Status</h3>
            <div className={cn(
              "p-10 space-y-6 shadow-2xl transition-colors",
              house.status === 'critical' ? "bg-red-500 text-white" : "bg-black text-white"
            )}>
              <AlertTriangle className="w-10 h-10 text-white" />
              <h4 className="text-2xl font-display font-bold italic">
                {house.status === 'critical' ? 'Urgent Attention Required' : 'House Status: ' + house.status}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {house.status === 'critical' 
                  ? 'There are unresolved repairs that require immediate action to protect this house.' 
                  : 'This domain is currently stable. Continue building from what is true.'}
              </p>
              <button 
                onClick={() => setMode('repairs')}
                className="w-full py-4 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
              >
                View Repairs
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedDocForPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 lg:p-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-6xl h-full flex flex-col shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-black flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl heading-large italic lowercase">{selectedDocForPreview.fileName}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="system-tag text-slate-400">
                        {selectedDocForPreview.source || 'Unknown Source'}
                      </p>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <p className="system-tag text-slate-400">
                        {selectedDocForPreview.confidentiality}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a 
                    href={selectedDocForPreview.fileUrl} 
                    download={selectedDocForPreview.fileName}
                    className="flex items-center gap-3 px-6 py-3 border border-slate-100 hover:border-black system-tag transition-all"
                  >
                    Download
                  </a>
                  <button 
                    onClick={() => setSelectedDocForPreview(null)}
                    className="p-3 hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-300 hover:text-black" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col items-center justify-center p-12">
                {(() => {
                  const url = selectedDocForPreview.fileUrl;
                  const name = selectedDocForPreview.fileName.toLowerCase();
                  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/.test(name);
                  const isPDF = name.endsWith('.pdf');

                  if (url === '#' || !url) {
                    return (
                      <div className="text-center space-y-6">
                        <Database className="w-16 h-16 text-slate-200 mx-auto" />
                        <div>
                          <p className="text-xl font-display font-bold italic">Preview Not Available</p>
                          <p className="text-sm text-slate-400 mt-2 font-sans">This document is currently stored as a record only.</p>
                        </div>
                      </div>
                    );
                  }

                  if (isImage) {
                    return (
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={selectedDocForPreview.fileName} 
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain shadow-2xl"
                        />
                      </div>
                    );
                  }

                  if (isPDF) {
                    return (
                      <iframe 
                        src={`${url}#toolbar=0`} 
                        className="w-full h-full border-none bg-white shadow-2xl"
                        title={selectedDocForPreview.fileName}
                      />
                    );
                  }

                  return (
                    <div className="text-center space-y-8 max-w-md">
                      <div className="w-24 h-24 bg-white border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                        <FileText className="w-12 h-12 text-slate-200" />
                      </div>
                      <div className="space-y-4">
                        <p className="text-xl font-display font-bold italic">Preview Unavailable</p>
                        <p className="text-sm text-slate-400 font-sans">For security and compatibility, this file type must be downloaded to be viewed.</p>
                      </div>
                      <a 
                        href={url} 
                        download={selectedDocForPreview.fileName}
                        className="inline-flex items-center gap-4 px-12 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                      >
                        Download Document
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Info Bar */}
              {selectedDocForPreview.aiSummary && (
                <div className="p-8 bg-white border-t border-slate-100 shrink-0">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-3 h-3 text-black" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Contextual Intelligence</span>
                    </div>
                    <p className="text-lg font-display italic leading-relaxed text-black">
                      "{selectedDocForPreview.aiSummary}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Flow Modal */}
      <AnimatePresence>
        {showUploadFlow && (
          <UploadStoryFlow
            user={user}
            houses={INITIAL_HOUSES}
            initialHouseId={house.id}
            onClose={() => setShowUploadFlow(false)}
            onComplete={() => {
              setShowUploadFlow(false);
              setMode('vault');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
