"use client";

import React from 'react';

type LabCardProps = {
  lab: any;
  applicants: any[];
  user: any;
  isMyLab: boolean;
  myRank?: number;
  onClick: () => void;
};

export const LabCard = ({ lab, applicants, user, isMyLab, myRank, onClick }: LabCardProps) => {
  const count = applicants.length;
  const capacity = lab.capacity || 1;
  const ratio = count / capacity;

  // カラーロジック
  let barColor = "bg-[#85BCC7]"; // 通常: ティーラル
  let statusText = "text-[#5A8D96]";
  
  if (ratio >= 1.5) {
    barColor = "bg-rose-400"; // 高倍率
    statusText = "text-rose-500";
  } else if (ratio >= 1.0) {
    barColor = "bg-amber-400"; // 定員超過
    statusText = "text-amber-600";
  }

  const shortMajor = lab.major.replace('主専攻', '');

  return (
    <div 
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer
        bg-white border border-slate-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)]
        hover:shadow-[0_20px_40px_-12px_rgba(133,188,199,0.2)] hover:-translate-y-1
        ${isMyLab ? 'ring-2 ring-[#85BCC7] ring-offset-2' : ''}
      `}
    >
      {/* 背景エフェクト */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#85BCC7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 relative z-10">
        {/* ヘッダー: 専攻タグと倍率 */}
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-slate-50 text-slate-500 border border-slate-100">
            {shortMajor}
          </span>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-bold font-mono ${statusText}`}>
              x{ratio.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 研究室名と教授名 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 group-hover:text-[#4A7C85] transition-colors">
            {lab.name}
          </h3>
          <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#85BCC7]"></span>
            {lab.professor || '教員未定'}
          </p>
        </div>

        {/* データ可視化エリア */}
        <div className="space-y-3">
          {/* 定員バー */}
          <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
              style={{ width: `${Math.min((count / capacity) * 100, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>定員: <strong className="text-slate-700">{capacity}</strong></span>
            <span>志望者: <strong className="text-slate-700">{count}</strong></span>
          </div>
        </div>

        {/* 自分のステータス */}
        {isMyLab && (
          <div className="mt-6 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#85BCC7] tracking-wider">あなたの順位</span>
              <span className={`text-lg font-bold font-mono ${myRank && myRank <= capacity ? 'text-[#85BCC7]' : 'text-rose-500'}`}>
                {myRank}位 <span className="text-xs text-slate-300 font-normal">/ {count}名</span>
              </span>
            </div>
            {myRank && myRank > capacity && (
              <p className="text-[10px] text-rose-400 text-right mt-1 font-bold">※ 定員圏外です</p>
            )}
          </div>
        )}
      </div>

      {/* 詳細ボタンアイコン */}
      <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <div className="bg-slate-800 text-white p-2 rounded-full shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  );
};