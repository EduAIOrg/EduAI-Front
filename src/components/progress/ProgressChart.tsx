'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ProgressData } from '@/types/api';

interface ProgressChartProps {
  data: ProgressData[];
}

/**
 * Graphique de progression avec sélecteur de période (7j/30j).
 * Affiche un LineChart recharts avec gradient.
 */
const ProgressChart = ({ data }: ProgressChartProps) => {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  const filteredData = period === '7d' ? data.slice(-7) : data;

  return (
    <motion.div
      className="rounded-2xl border border-[#1E1E2E] bg-[#13131A] p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#F0F0F8]">Progression</h3>
        <div className="flex gap-1 rounded-xl bg-[#0A0A0F] p-1">
          {(['7d', '30d'] as const).map((p) => (
            <motion.button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                  : 'text-[#8888AA] hover:text-[#F0F0F8]'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {p === '7d' ? '7 jours' : '30 jours'}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E1E2E" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="#8888AA"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#8888AA"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: '#13131A',
                border: '1px solid #1E1E2E',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#F0F0F8',
              }}
              labelStyle={{ color: '#8888AA' }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6C63FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProgressChart;
