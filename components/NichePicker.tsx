'use client';

import { useState } from 'react';
import {
  Laptop,
  GraduationCap,
  HeartPulse,
  DollarSign,
  ShoppingCart,
  Video,
  Sprout,
  Bot,
  Wifi,
  Globe,
  Sparkles,
  Target,
} from 'lucide-react';

// ============================================
// NICHE DEFINITIONS
// ============================================

export const NICHES = [
  {
    id: 'all',
    name: 'All Niches',
    icon: Globe,
    description: 'Browse ideas from all industries',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'saas',
    name: 'SaaS',
    icon: Laptop,
    description: 'Software as a Service',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'edtech',
    name: 'EdTech',
    icon: GraduationCap,
    description: 'Educational Technology',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'healthtech',
    name: 'HealthTech',
    icon: HeartPulse,
    description: 'Healthcare & Wellness',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'fintech',
    name: 'FinTech',
    icon: DollarSign,
    description: 'Financial Technology',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    description: 'Online Retail & Marketplaces',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'creator',
    name: 'Creator Economy',
    icon: Video,
    description: 'Content Creation Tools',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'climate',
    name: 'Climate Tech',
    icon: Sprout,
    description: 'Sustainability & Environment',
    color: 'from-green-600 to-lime-500',
  },
  {
    id: 'b2b',
    name: 'B2B Automation',
    icon: Bot,
    description: 'Business Process Automation',
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 'ai',
    name: 'AI/ML',
    icon: Sparkles,
    description: 'Artificial Intelligence',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'web3',
    name: 'Web3',
    icon: Wifi,
    description: 'Blockchain & Crypto',
    color: 'from-cyan-500 to-blue-600',
  },
] as const;

export type NicheId = typeof NICHES[number]['id'];

interface NichePickerProps {
  selectedNiche: NicheId;
  onNicheChange: (nicheId: NicheId) => void;
}

export function NichePicker({ selectedNiche, onNicheChange }: NichePickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedNicheData = NICHES.find(n => n.id === selectedNiche) || NICHES[0];

  return (
    <div className="w-full">
      {/* Selected Niche Display */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedNicheData.color}`}>
            <selectedNicheData.icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-400">Select Niche</span>
            </div>
            <div className="text-lg font-semibold text-white">
              {selectedNicheData.name}
            </div>
          </div>
        </div>
        <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Niche Grid (Expanded) */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const isSelected = selectedNiche === niche.id;

            return (
              <button
                key={niche.id}
                onClick={() => {
                  onNicheChange(niche.id);
                  setIsExpanded(false);
                }}
                className={`
                  relative p-4 rounded-lg border transition-all group
                  ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 scale-105'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50 hover:bg-gray-800'
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${niche.color} transition-transform ${
                      isSelected ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{niche.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{niche.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Niche Description (when collapsed) */}
      {!isExpanded && selectedNiche !== 'all' && (
        <div className="mt-2 text-sm text-gray-400 text-center">
          {selectedNicheData.description}
        </div>
      )}
    </div>
  );
}
