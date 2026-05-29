import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Sparkles, Calendar, Users, Home, Info, AlertCircle, Check, Globe } from 'lucide-react';
import { House, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface UploadStoryFlowProps {
  user: UserProfile;
  houses: House[];
  initialHouseId?: string;
  onClose: () => void;
  onComplete: () => void;
}

export default function UploadStoryFlow({ user, houses, initialHouseId, onClose, onComplete }: UploadStoryFlowProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const [aiSuggestions, setAiSuggestions] = useState<{
    summary: string;
    suggestedHouseId: string;
    extractedDates: string[];
    extractedNames: string[];
    nextActions: string[];
  } | null>(null);

  const steps = [
    { id: 1, title: 'What is this?', icon: Info },
    { id: 2, title: 'The Story', icon: Sparkles },
    { id: 3, title: 'Context', icon: Home },
    { id: 4, title: 'Action', icon: AlertCircle },
    { id: 5, title: 'Review', icon: Check },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `
        Analyze the following piece of a life story/document description and provide structured intelligence.
        
        File Name: ${formData.fileName}
        What Happened: ${formData.whatHappened}
        Why It Matters: ${formData.whyItMatters}
        
        Available Houses:
        ${houses.map(h => `${h.id}: ${h.name} (${h.description})`).join('\n')}
        
        Provide a concise summary, suggest the best house ID, extract any dates or names mentioned, and suggest 2-3 next actions.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestedHouseId: { type: Type.STRING },
              extractedDates: { type: Type.ARRAY, items: { type: Type.STRING } },
              extractedNames: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["summary", "suggestedHouseId", "extractedDates", "extractedNames", "nextActions"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setAiSuggestions(data);
      if (!formData.houseId) {
        setFormData(prev => ({ ...prev, houseId: data.suggestedHouseId }));
      }
      setStep(5);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'vault'), {
        fileName: formData.fileName,
        houseId: formData.houseId,
        userId: user.uid,
        uploadDate: serverTimestamp(),
        fileUrl: '#', // Placeholder
        userSummary: formData.whatHappened,
        aiSummary: aiSuggestions?.summary || '',
        tags: [...(aiSuggestions?.extractedNames || []), ...(aiSuggestions?.extractedDates || [])],
        confidentiality: 'private',
        source: formData.source || 'User Input',
        docDate: formData.deadline || '',
      });

      // Also add a repair if action is needed
      if (formData.actionNeeded) {
        await addDoc(collection(db, 'repairs'), {
          houseId: formData.houseId,
          title: `Action needed: ${formData.fileName}`,
          description: aiSuggestions?.nextActions.join('\n') || 'Action required based on uploaded story.',
          severity: 'medium',
          status: 'open',
          deadline: formData.deadline ? new Date(formData.deadline) : null,
        });
      }

      onComplete();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vault');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-6">
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

        {/* Progress Bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {steps.map((s) => (
            <div 
              key={s.id}
              className={cn(
                "flex-1 py-4 px-6 flex items-center gap-3 transition-all border-b-2",
                step === s.id ? "border-black bg-white" : "border-transparent text-slate-300 opacity-50"
              )}
            >
              <s.icon className={cn("w-3 h-3", step === s.id ? "text-black" : "text-slate-200")} />
              <span className={cn("system-tag", step === s.id ? "text-black" : "text-slate-300")}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl mx-auto"
              >
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">What is the name of this piece?</label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={e => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="e.g. 2024 Trust Amendment"
                    className="w-full border-b-2 border-slate-100 py-4 text-2xl font-display focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-2xl mx-auto"
              >
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">What happened?</label>
                  <textarea
                    value={formData.whatHappened}
                    onChange={e => setFormData(prev => ({ ...prev, whatHappened: e.target.value }))}
                    placeholder="Describe the event or document context..."
                    rows={4}
                    className="w-full bg-slate-50 p-6 text-lg font-display italic focus:outline-none focus:bg-white border border-transparent focus:border-slate-100 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">Why does this matter?</label>
                  <textarea
                    value={formData.whyItMatters}
                    onChange={e => setFormData(prev => ({ ...prev, whyItMatters: e.target.value }))}
                    placeholder="Explain the significance..."
                    rows={4}
                    className="w-full bg-slate-50 p-6 text-lg font-display italic focus:outline-none focus:bg-white border border-transparent focus:border-slate-100 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-2xl mx-auto"
              >
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">Which house should it belong to?</label>
                  <div className="grid grid-cols-2 gap-4">
                    {houses.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setFormData(prev => ({ ...prev, houseId: h.id }))}
                        className={cn(
                          "p-4 text-left border transition-all",
                          formData.houseId === h.id ? "border-black bg-slate-50" : "border-slate-100 hover:border-slate-300"
                        )}
                      >
                        <span className="system-tag block mb-1">House {h.id}</span>
                        <span className="text-sm font-display font-bold italic tracking-tight">{h.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">Who is involved?</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type="text"
                      value={formData.whoIsInvolved}
                      onChange={e => setFormData(prev => ({ ...prev, whoIsInvolved: e.target.value }))}
                      placeholder="Names, entities, or roles..."
                      className="w-full border border-slate-100 p-4 pl-12 focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-lg font-display font-bold italic">What is the source?</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input
                      type="text"
                      value={formData.source}
                      onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g. Government, Bank, Personal Record..."
                      className="w-full border border-slate-100 p-4 pl-12 focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between p-8 border border-slate-100 bg-slate-50">
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold italic">Is action needed?</h4>
                    <p className="text-xs text-slate-400">This will create a repair task in the house.</p>
                  </div>
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, actionNeeded: !prev.actionNeeded }))}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative",
                      formData.actionNeeded ? "bg-black" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-6 h-6 bg-white rounded-full transition-all",
                      formData.actionNeeded ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
                {formData.actionNeeded && (
                  <div className="space-y-4">
                    <label className="text-lg font-display font-bold italic">Is there a deadline?</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full border border-slate-100 p-4 pl-12 focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12 max-w-3xl mx-auto"
              >
                {isAnalyzing ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-black rounded-full animate-spin" />
                    <p className="text-xl font-display italic animate-pulse">Newcastle is analyzing the story...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="system-tag text-slate-300">AI Intelligence Summary</h3>
                        <p className="text-2xl heading-large italic lowercase">"{aiSuggestions?.summary}"</p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="system-tag text-slate-300">Suggested House</h3>
                        <div className="p-6 border border-black bg-slate-50 flex items-center gap-6">
                          <Home className="w-6 h-6" />
                          <span className="text-xl font-display font-bold italic lowercase tracking-tighter">
                            {houses.find(h => h.id === aiSuggestions?.suggestedHouseId)?.name || 'Unknown House'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="system-tag text-slate-300">Extracted Intelligence</h3>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions?.extractedNames.map(n => (
                            <span key={n} className="px-4 py-2 bg-slate-50 border border-slate-100 system-tag text-black">{n}</span>
                          ))}
                          {aiSuggestions?.extractedDates.map(d => (
                            <span key={d} className="px-4 py-2 bg-slate-50 border border-slate-100 system-tag text-black">{d}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="system-tag text-slate-300">Recommended Next Actions</h3>
                        <div className="space-y-3">
                          {aiSuggestions?.nextActions.map((a, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-100">
                              <div className="w-5 h-5 bg-black text-white flex items-center justify-center system-tag shrink-0 mt-0.5">{i + 1}</div>
                              <p className="text-md font-display italic tracking-tight">{a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-10 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          {step > 1 && step < 5 ? (
            <button 
              onClick={() => setStep(prev => prev - 1)}
              className="flex items-center gap-3 system-tag text-slate-400 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              onClick={() => setStep(prev => prev + 1)}
              disabled={step === 1 && !formData.fileName}
              className="flex items-center gap-4 px-12 py-5 bg-black text-white system-tag hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl"
            >
              Continue <ArrowRight className="w-3 h-3" />
            </button>
          ) : step === 4 ? (
            <button 
              onClick={handleAnalyze}
              className="flex items-center gap-4 px-12 py-5 bg-black text-white system-tag hover:bg-slate-800 transition-all shadow-xl"
            >
              Analyze Story <Sparkles className="w-3 h-3" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="flex items-center gap-4 px-16 py-6 bg-black text-white system-tag hover:bg-slate-800 transition-all shadow-2xl"
            >
              Confirm <span className="text-slate-400 font-display italic lowercase tracking-normal mx-1">and</span> Save to Vault <Check className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
