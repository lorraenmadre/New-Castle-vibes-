import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_HOUSES } from '../constants';
import { House } from '../types';
import { cn } from '../lib/utils';
import { Users, Library, Database, Wrench, Search, Sparkles, ArrowRight, Upload } from 'lucide-react';

const DESIGN_URL = 'https://lorraenmadre.app';

export default function CastleMap({ onSelectHouse, onUpload, activePresences }: { 
  onSelectHouse: (house: House) => void,
  onUpload: () => void,
  activePresences: Record<string, number>
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Map houses to their positions in a 4x4 grid (clockwise perimeter)
  const gridPositions = [
    0, 1, 2, 3,
    11, 'X', 'X', 4,
    10, 'X', 'X', 5,
    9, 8, 7, 6
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans selection:bg-black selection:text-white">
      <div className="mb-32 flex flex-col items-start text-left space-y-12">
        <div className="space-y-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-black leading-none">
            AI Intelligence Core for the Wishwell System
          </p>
          <p className="font-display italic text-sm text-slate-500 leading-none">
            Vibe your way to Happily Ever After
          </p>
          <p className="font-sans text-base uppercase tracking-widest text-black leading-none">
            With the <span className="font-black">Universal Family Office</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href={DESIGN_URL}
            target="_blank"
            rel="noreferrer"
            className="px-16 py-8 border border-black bg-white text-black system-tag hover:bg-black hover:text-white transition-all shadow-xl rounded-full"
          >
            design
          </a>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 aspect-square max-w-4xl mx-auto relative">
        {gridPositions.map((pos, idx) => {
          if (pos === 'X') {
            // Only render the X once (it spans 2x2)
            if (idx === 5) {
              return (
                <div 
                  key="center-x"
                  className="col-start-2 col-end-4 row-start-2 row-end-4 bg-white flex flex-col items-center justify-center p-10 z-10"
                >
                  <div className="w-full space-y-8">
                    <div className="text-center space-y-3">
                      <h3 className="text-4xl heading-large italic lowercase tracking-tight">
                        ask the castle
                      </h3>
                      <p className="system-tag text-slate-300 text-[9px] tracking-[0.2em]">seek with ai core intelligence</p>
                    </div>
                    
                    <div className={cn(
                      "relative group transition-all duration-700",
                      isFocused ? "scale-105" : "scale-100"
                    )}>
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className={cn(
                          "w-4 h-4 transition-colors duration-300",
                          isFocused ? "text-black" : "text-slate-200"
                        )} />
                      </div>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Find what matters..."
                        className="w-full bg-slate-50 border border-slate-100 py-6 pl-12 pr-12 text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-black focus:bg-white transition-all shadow-sm"
                      />
                      <div className="absolute inset-y-0 right-4 flex items-center">
                        <Sparkles className={cn(
                          "w-3.5 h-3.5 transition-colors duration-300",
                          query ? "text-black" : "text-slate-100"
                        )} />
                      </div>
                    </div>

                    <div className="flex justify-center gap-8">
                      <button 
                        onClick={onUpload}
                        className="flex items-center gap-3 px-6 py-3 bg-black text-white system-tag hover:bg-slate-800 transition-all shadow-xl"
                      >
                        <Upload className="w-3 h-3" />
                        Upload Piece
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }

          const house = INITIAL_HOUSES[pos as number];
          const presenceCount = activePresences[house.id] || 0;

          return (
            <motion.button
              key={house.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => onSelectHouse(house)}
              className="relative aspect-square border border-slate-100 bg-white p-8 flex flex-col items-center justify-center text-center group hover:border-black hover:shadow-3xl transition-all duration-700"
            >
              <div className="absolute top-4 left-4 system-tag text-slate-200 group-hover:text-black transition-colors">
                {house.label}
              </div>
              
              {presenceCount > 0 && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-black rounded-full animate-pulse" />
              )}

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em] group-hover:italic transition-all leading-tight">
                  {house.name.replace(/ \+ /g, '\n').replace(/, /g, '\n')}
                </h4>
                <p className="text-[9px] text-slate-400 font-display italic opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {house.mantra}
                </p>
              </div>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <Users className="w-3 h-3 text-slate-300 hover:text-black transition-colors" />
                <Library className="w-3 h-3 text-slate-300 hover:text-black transition-colors" />
                <Database className="w-3 h-3 text-slate-300 hover:text-black transition-colors" />
                <Wrench className="w-3 h-3 text-slate-300 hover:text-black transition-colors" />
              </div>

              {house.status !== 'clear' && (
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500",
                  house.status === 'active' && "bg-slate-200",
                  house.status === 'attention' && "bg-amber-400",
                  house.status === 'critical' && "bg-red-500"
                )} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
