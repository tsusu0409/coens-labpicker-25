"use client";

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import type { Database } from '@/types/supabase';

type Lab = Database['public']['Tables']['labs']['Row'];

export default function LabDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lab, setLab] = useState<Lab | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/');
    setCurrentUser(session.user);

    const [labRes, appRes] = await Promise.all([
      supabase.from('labs').select('*').eq('id', id as string).single(),
      supabase.from('view_lab_applicants').select('*').eq('lab_id', id as string).order('gpa', { ascending: false })
    ]);

    if (labRes.data) setLab(labRes.data);
    if (appRes.data) setApplicants(appRes.data);
    
    setLoading(false);
  }, [id, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-1 bg-[#E2E8F0] overflow-hidden rounded-full">
          <div className="h-full bg-[#85BCC7] w-1/2 animate-[shimmer_1s_infinite]"></div>
        </div>
      </div>
    </div>
  );

  if (!lab) return null;

  const count = applicants.length;
  const capacity = lab.capacity || 1;
  const ratio = count / capacity;
  const myRecord = applicants.find(a => a.id === currentUser?.id);

  // --- GPAスケール計算ロジック ---
  // 2.0未満の志望者が一人でもいれば 0.0 スタート、いなければ 2.0 スタート
  const hasLowGpaApplicant = applicants.some(a => a.gpa < 2.0);
  const minScale = hasLowGpaApplicant ? 0.0 : 2.0;
  const maxScale = 4.3;
  const scaleRange = maxScale - minScale;

  // 位置計算ヘルパー関数
  const getPosition = (gpa: number) => {
    // 範囲外の値が来ても0-100に収まるようにclampする
    const val = Math.max(minScale, Math.min(gpa, maxScale));
    return ((val - minScale) / scaleRange) * 100;
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
        body { font-family: 'Noto Sans JP', 'Manrope', sans-serif; background-color: #F8FAFC; color: #334155; }
        .font-heading { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="min-h-screen relative overflow-x-hidden selection:bg-[#85BCC7] selection:text-white pb-20">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#85BCC7] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-12">
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#85BCC7] transition-colors group uppercase tracking-widest">
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              一覧に戻る
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* 左側: 研究室情報 */}
            <motion.header 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5"
            >
              <div className="sticky top-12">
                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-slate-100 text-slate-500 mb-6">
                  {lab.major}
                </span>
                
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-4">
                  {lab.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-10">
                  <span className="w-8 h-[1px] bg-[#85BCC7]"></span>
                  <p className="text-lg text-slate-500 font-medium">
                    担当: {lab.professor || '教員未定'}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">定員</p>
                    <p className="text-3xl font-heading font-light text-slate-700">{capacity}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">志望者数</p>
                    <p className="text-3xl font-heading font-light text-[#85BCC7]">{count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">倍率</p>
                    <p className={`text-3xl font-heading font-light ${ratio >= 1.5 ? 'text-rose-500' : ratio >= 1 ? 'text-amber-500' : 'text-[#85BCC7]'}`}>
                      {ratio.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* ステータス要約 */}
                {myRecord && (
                  <div className="mt-10 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">現在のあなたの順位</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-heading font-bold ${myRecord.rank <= capacity ? 'text-[#85BCC7]' : 'text-rose-500'}`}>
                        {myRecord.rank}
                      </span>
                      <span className="text-sm text-slate-400">/ {count}名中</span>
                    </div>
                    {myRecord.rank > capacity && (
                      <p className="text-xs text-rose-500 mt-2 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        定員圏外のため、志望変更を検討してください
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.header>

            {/* 右側: 詳細データ */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7 space-y-12"
            >
              {/* GPA分布 (Visualizer) */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-end mb-12">
                  <h2 className="text-xl font-bold text-slate-700">GPA 分布状況</h2>
                  <span className="text-[10px] text-slate-400 font-heading">DISTRIBUTION CHART</span>
                </div>
                
                <div className="relative h-32 flex items-center select-none">
                  {/* 目盛り線 */}
                  <div className="absolute inset-x-0 h-[1px] bg-slate-200" />
                  
                  {/* 動的なスケール表示 */}
                  <div className="absolute left-0 -bottom-8 text-xs font-mono text-slate-400">
                    {minScale.toFixed(1)}
                  </div>
                  <div className="absolute right-0 -bottom-8 text-xs font-mono text-slate-400">
                    {maxScale.toFixed(1)}
                  </div>

                  {/* 中間目盛り（目安として表示） */}
                  <div className="absolute left-1/2 -bottom-8 text-xs font-mono text-slate-300 transform -translate-x-1/2">
                    {((minScale + maxScale) / 2).toFixed(1)}
                  </div>
                  <div className="absolute left-1/2 top-[50%] h-2 w-[1px] bg-slate-100 -translate-y-1/2 transform -translate-x-1/2"></div>
                  
                  {/* 定員ライン (Border Line) */}
                  {count > capacity && applicants[capacity - 1] && (
                    <div 
                      className="absolute top-[-20px] bottom-[-20px] w-[2px] bg-rose-200 border-r border-rose-400 border-dashed z-0 flex flex-col items-center justify-start pt-0 transition-all duration-500"
                      style={{ left: `${getPosition(applicants[capacity - 1].gpa)}%` }}
                    >
                      <span className="text-[9px] text-rose-500 font-bold bg-white px-1 whitespace-nowrap -mt-3">
                        ボーダー
                      </span>
                    </div>
                  )}
                  
                  {/* 志望者のプロット */}
                  {applicants.map((app, i) => {
                    const position = getPosition(app.gpa);
                    const isMe = app.id === currentUser?.id;
                    const isSafe = i < capacity;
                    
                    return (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className={`
                          absolute w-4 h-4 rounded-full border-2 shadow-sm transition-all cursor-help
                          ${isMe 
                            ? 'bg-[#85BCC7] border-[#85BCC7] z-20 scale-125' 
                            : isSafe 
                              ? 'bg-white border-slate-300 z-10' 
                              : 'bg-slate-50 border-slate-200 z-0'
                          }
                        `}
                        style={{ left: `${position}%`, bottom: isMe ? '20px' : 'auto' }}
                        title={`Rank: ${i + 1} / GPA: ${app.gpa.toFixed(2)}`}
                      >
                        {isMe && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <span className="bg-[#85BCC7] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                              YOU
                            </span>
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#85BCC7]"></div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <p className="mt-12 text-[10px] text-center text-slate-400">
                  ※ 範囲: {minScale.toFixed(1)} 〜 {maxScale.toFixed(1)} GPA
                </p>
              </div>

              {/* 志望者一覧テーブル */}
              <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#85BCC7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  志望者リスト
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                        <th className="pb-4 pl-4">順位</th>
                        <th className="pb-4">GPAスコア</th>
                        <th className="pb-4 text-right pr-4">判定</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicants.map((app, i) => {
                        const isMe = app.id === currentUser?.id;
                        const isSafe = i < capacity;
                        
                        return (
                          <tr 
                            key={i} 
                            className={`
                              transition-colors
                              ${isMe ? 'bg-[#85BCC7]/10' : 'hover:bg-slate-50'}
                            `}
                          >
                            <td className="py-4 pl-4">
                              <span className={`
                                font-mono font-bold text-sm
                                ${isSafe ? 'text-slate-600' : 'text-slate-300'}
                              `}>
                                #{String(i + 1).padStart(2, '0')}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`font-mono ${isMe ? 'font-bold text-[#4A7C85]' : 'text-slate-600'}`}>
                                {app.gpa.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-right">
                              {isMe ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#85BCC7] text-white">
                                  あなた
                                </span>
                              ) : isSafe ? (
                                <span className="text-[10px] text-[#85BCC7] font-medium bg-[#85BCC7]/10 px-2 py-1 rounded">
                                  圏内
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-300">
                                  圏外
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
}