import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Check, Calendar, Home, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { House, UserProfile } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { cn } from '../lib/utils';

interface UploadStoryFlowProps {
  user: UserProfile;
  houses: House[];
  initialHouseId?: string;
  onClose: () => void;
  onComplete: () => void;
}

interface AISuggestions {
  summary: string;
  suggestedHouseId: string;
  extractedDates: string[];
  extractedNames: string[];
  nextActions: string[];
}

export default function UploadStoryFlowSecure({ user, houses, initialHouseId, onClose, onComplete }: UploadStoryFlowProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [formData, setFormData] = useState({
    fileName: '',
    whatHappened: '',
    whyItMatters: '',
    houseId: initialHouseId || '',
    whoIsInvolved: '',
    source: '',
    actionNeeded: false,
    deadline: '',
  });

  const selectedHouse = houses.find(h => h.id === formData.houseId);
  const suggestedHouse = houses.find(h => h.id === aiSuggestions?.suggestedHouseId);

  const handleAnalyze = async () => {
    setError('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: formData.fileName,
          whatHappened: formData.whatHappened,
          whyItMatters: formData.whyItMatters,
          houses,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Newcastle could not analyze this story.');
      }

      setAiSuggestions(data);
      if (!formData.houseId && data.suggestedHouseId) {
        setFormData(prev => ({ ...prev, houseId: data.suggestedHouseId }));
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Newcastle could not analyze this story.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    setError('');

    try {
      await addDoc(collection(db, 'vault'), {
        fileName: formData.fileName,
        houseId: formData.houseId || aiSuggestions?.suggestedHouseId || 'house-1',
        userId: user.uid,
        uploadDate: serverTimestamp(),
        fileUrl: '#',
        userSummary: formData.whatHappened,
        aiSummary: aiSuggestions?.summary || '',
        tags: [
          ...(formData.whoIsInvolved ? formData.whoIsInvolved.split(',').map(v => v.trim()).filter(Boolean) : []),
          ...(aiSuggestions?.extractedNames || []),
          ...(aiSuggestions?.extractedDates || []),
        ],
        confidentiality: 'private',
        source: formData.source || 'User Input',
        docDate: formData.deadline || '',
      });

      if (formData.actionNeeded) {
        await addDoc(collection(db, 'repairs'), {
          houseId: formData.houseId || aiSuggestions?.suggestedHouseId || 'house-1',
          title: `Action needed: ${formData.fileName}`,
          description: aiSuggestions?.nextActions?.join('\n') || 'Action required based on uploaded story.',
          severity: 'medium',
          status: 'open',
          deadline: formData.deadline ? new Date(formData.deadline) : null,
        });
      }

      onComplete();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'vault');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl heading-large italic lowercase tracking-tight">Upload <span className="text-slate-300">a</span> piece <span className="text-slate-300">of the</span> story</h2>
              <p className="system-tag text-slate-400 mt-2">NEW CASTLE Intelligence Intake</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 transition-colors">
            <X className="w-6 h-6 text-slate-300 hover:text-black" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-7">
            <div className="space-y-3">
              <label className="text-lg font-display font-bold italic">What is the name of this piece?</label>
              <input
                type="text"
                value={formData.fileName}
                onChange={e => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="e.g. 2024 Trust Amendment"
                className="w-full border-b-2 border-slate-100 py-4 text-2xl font-display focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-display font-bold italic">What happened?</label>
              <textarea
                value={formData.whatHappened}
                onChange={e => setFormData(prev => ({ ...prev, whatHappened: e.target.value }))}
                placeholder="Describe the event or document context..."
                rows={5}
                className="w-full bg-slate-50 p-6 text-lg font-display italic focus:outline-none focus:bg-white border border-transparent focus:border-slate-100 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-display font-bold italic">Why does this matter?</label>
              <textarea
                value={formData.whyItMatters}
                onChange={e => setFormData(prev => ({ ...prev, whyItMatters: e.target.value }))}
                placeholder="Explain the significance..."
                rows={4}
                className="w-full bg-slate-50 p-6 text-lg font-display italic focus:outline-none focus:bg-white border border-transparent focus:border-slate-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.whoIsInvolved}
                onChange={e => setFormData(prev => ({ ...prev, whoIsInvolved: e.target.value }))}
                placeholder="Who is involved?"
                className="w-full border border-slate-100 p-4 focus:outline-none focus:border-black transition-all"
              />
              <input
                type="text"
                value={formData.source}
                onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Source"
                className="w-full border border-slate-100 p-4 focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-display font-bold italic">Which house should it belong to?</label>
              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2">
                {houses.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setFormData(prev => ({ ...prev, houseId: h.id }))}
                    className={cn(
                      'p-4 text-left border transition-all',
                      formData.houseId === h.id ? 'border-black bg-slate-50' : 'border-slate-100 hover:border-slate-300'
                    )}
                  >
                    <span className="system-tag block mb-1">House {h.id}</span>
                    <span className="text-sm font-display font-bold italic tracking-tight">{h.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between p-5 border border-slate-100 bg-slate-50">
              <button
                onClick={() => setFormData(prev => ({ ...prev, actionNeeded: !prev.actionNeeded }))}
                className={cn('flex items-center gap-3 system-tag', formData.actionNeeded ? 'text-black' : 'text-slate-400')}
              >
                <AlertCircle className="w-4 h-4" />
                {formData.actionNeeded ? 'Action needed' : 'No action task yet'}
              </button>
              {formData.actionNeeded && (
                <div className="relative flex-1 md:max-w-xs">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full border border-slate-100 p-4 pl-12 focus:outline-none focus:border-black transition-all bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 border border-slate-100 bg-slate-50 space-y-5 sticky top-0">
              <div className="flex items-center gap-4">
                <Home className="w-6 h-6" />
                <div>
                  <h3 className="system-tag text-slate-400">Current House</h3>
                  <p className="text-2xl heading-large italic lowercase">{selectedHouse?.name || 'Not selected'}</p>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!formData.fileName || !formData.whatHappened || isAnalyzing}
                className="w-full flex items-center justify-center gap-4 px-12 py-5 bg-black text-white system-tag hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Story'} <Sparkles className="w-3 h-3" />
              </button>

              {error && <p className="text-sm text-rose-600 font-display italic">{error}</p>}

              {aiSuggestions && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <h3 className="system-tag text-slate-300">AI Intelligence Summary</h3>
                    <p className="text-2xl heading-large italic lowercase">“{aiSuggestions.summary}”</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="system-tag text-slate-300">Suggested House</h3>
                    <div className="p-5 border border-black bg-white flex items-center gap-4">
                      <Home className="w-5 h-5" />
                      <span className="text-xl font-display font-bold italic lowercase tracking-tighter">
                        {suggestedHouse?.name || aiSuggestions.suggestedHouseId || 'Unknown House'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="system-tag text-slate-300">Recommended Next Actions</h3>
                    {(aiSuggestions.nextActions || []).map((action, index) => (
                      <div key={`${action}-${index}`} className="flex items-start gap-4 p-4 bg-white border border-slate-100">
                        <div className="w-5 h-5 bg-black text-white flex items-center justify-center system-tag shrink-0 mt-0.5">{index + 1}</div>
                        <p className="text-md font-display italic tracking-tight">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end items-center">
          <button
            onClick={handleSave}
            disabled={!formData.fileName || !formData.whatHappened}
            className="flex items-center gap-4 px-16 py-6 bg-black text-white system-tag hover:bg-slate-800 transition-all disabled:opacity-50 shadow-2xl"
          >
            Confirm <span className="text-slate-400 font-display italic lowercase tracking-normal mx-1">and</span> Save to Vault <Check className="w-4 h-4 ml-2" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
