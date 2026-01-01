"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { LabCard } from './LabCard';

type Lab = Database['public']['Tables']['labs']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [filterMajor, setFilterMajor] = useState("");
  const [gpa, setGpa] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async (userId: string) => {
    const [labsRes, studentRes, viewRes] = await Promise.all([
      supabase.from('labs').select('*').order('major').order('name'),
      supabase.from('students').select('*').eq('id', userId).single(),
      supabase.from('view_lab_applicants').select('*')
    ]);

    if (labsRes.data) setLabs(labsRes.data);
    if (studentRes.data) {
      setStudent(studentRes.data);
      setGpa(studentRes.data.gpa.toString());
      setSelectedLabId(studentRes.data.lab_id || "");
    }
    if (viewRes.data) setApplicants(viewRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user.email?.endsWith('@u.tsukuba.ac.jp')) {
        await supabase.auth.signOut();
        router.push('/');
        return;
      }
      setUser(session.user);
      fetchData(session.user.id);
    };
    checkUser();
  }, [router, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabId) return alert("研究室を選択してください");
    setIsSubmitting(true);

    const studentData = {
      id: user.id, email: user.email, gpa: parseFloat(gpa), lab_id: selectedLabId
    };

    const { error } = student 
      ? await supabase.from('students').update(studentData).eq('id', user.id)
      : await supabase.from('students').insert([studentData]);

    if (!error) {
      await fetchData(user.id);
      alert("登録情報を更新しました"); 
    } else {
      alert("エラーが発生しました: " + error.message);
    }
    setIsSubmitting(false);
  };

  const filteredLabs = filterMajor ? labs.filter(l => l.major === filterMajor) : labs;

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-1 bg-[#E2E8F0] overflow-hidden rounded-full">
          <div className="h-full bg-[#85BCC7] w-1/2 animate-[shimmer_1s_infinite]"></div>
        </div>
        <p className="text-slate-400 text-sm font-medium">読み込み中...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* 日本語フォント (Noto Sans JP) と欧文フォントの読み込み */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
        
        body { 
          font-family: 'Noto Sans JP', 'Manrope', sans-serif; 
          background-color: #F8FAFC; 
          color: #334155; 
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #85BCC7; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      <div className="min-h-screen relative overflow-x-hidden selection:bg-[#85BCC7] selection:text-white">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#85BCC7] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
          
          {/* ヘッダー */}
          <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#85BCC7]"></span>
                <p className="text-[#85BCC7] font-bold tracking-widest text-xs">2026年度</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                Dashboard
                <span className="block text-slate-400 text-lg font-normal mt-1">Lab Allocation System</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/60 shadow-sm">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold">ログイン中</p>
                <p className="text-sm font-bold text-slate-700 font-mono">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
                title="ログアウト"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* 左カラム: 登録フォーム */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl overflow-hidden relative">
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#85BCC7] to-slate-300"></div>

                  <div className="p-8">
                    <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#85BCC7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      志望登録
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="group">
                        <label className="block text-xs font-bold text-slate-400 mb-2 group-focus-within:text-[#85BCC7] transition-colors">
                          現在のGPA <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="number" step="0.01" min="0" max="4.3" required
                          className="w-full bg-slate-50 border-b-2 border-slate-200 px-4 py-3 text-2xl font-mono font-bold text-slate-700 focus:outline-none focus:border-[#85BCC7] focus:bg-white transition-all rounded-t-lg"
                          placeholder="0.00"
                          value={gpa}
                          onChange={(e) => setGpa(e.target.value)}
                        />
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-slate-400 mb-2 group-focus-within:text-[#85BCC7] transition-colors">
                          第1志望研究室 <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <select 
                            className="w-full bg-slate-50 border-b-2 border-slate-200 pl-4 pr-10 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#85BCC7] focus:bg-white transition-all rounded-t-lg appearance-none cursor-pointer"
                            value={selectedLabId}
                            onChange={(e) => setSelectedLabId(e.target.value)}
                            required
                          >
                            <option value="">選択してください...</option>
                            {labs.map(lab => (
                              <option key={lab.id} value={lab.id}>
                                {lab.name} ({lab.professor})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#2C333A] text-white font-bold rounded-xl hover:bg-[#85BCC7] hover:text-white hover:shadow-lg hover:shadow-[#85BCC7]/30 transition-all duration-300 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? '処理中...' : 'この内容で登録する'}
                      </button>
                    </form>
                  </div>

                  {/* ステータス表示 */}
                  {student && (
                    <div className="bg-[#85BCC7]/10 p-6 border-t border-[#85BCC7]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#85BCC7] animate-pulse"></div>
                        <span className="text-xs font-bold text-[#4A7C85]">登録済み</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        現在 <strong className="text-slate-800">{labs.find(l => l.id === student.lab_id)?.name || '...'}</strong> を志望中。<br/>
                        登録GPA: <span className="font-mono font-bold">{Number(student.gpa).toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 px-4">
                  <p className="text-xs text-slate-400 leading-relaxed text-center">
                    ※ 登録内容は何度でも変更可能です。<br/>
                    締切直前は混雑が予想されます。
                  </p>
                </div>
              </div>
            </aside>

            {/* 右カラム: 研究室一覧 */}
            <main className="lg:col-span-8 xl:col-span-9">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                  募集研究室 <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-sm">{filteredLabs.length}</span>
                </h2>
                
                <div className="relative z-20 w-full sm:w-auto">
                  <select 
                    className="w-full sm:w-64 appearance-none bg-white pl-4 pr-10 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-full hover:border-[#85BCC7] focus:outline-none focus:ring-1 focus:ring-[#85BCC7] transition-colors cursor-pointer shadow-sm"
                    value={filterMajor}
                    onChange={(e) => setFilterMajor(e.target.value)}
                  >
                    <option value="">すべての専攻を表示</option>
                    <option value="応用物理主専攻">応用物理主専攻</option>
                    <option value="電子・量子工学主専攻">電子・量子工学主専攻</option>
                    <option value="物性工学主専攻">物性工学主専攻</option>
                    <option value="物質・分子工学主専攻">物質・分子工学主専攻</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* カードグリッド */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLabs.map(lab => {
                  const labApplicants = applicants.filter(a => a.lab_id === lab.id);
                  const myApplication = labApplicants.find(a => a.id === user?.id);
                  
                  return (
                    <LabCard 
                      key={lab.id} 
                      lab={lab} 
                      applicants={labApplicants}
                      user={user}
                      isMyLab={!!myApplication}
                      myRank={myApplication?.rank}
                      onClick={() => router.push(`/lab/${lab.id}`)}
                    />
                  );
                })}
              </div>

              {filteredLabs.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                  <p className="text-slate-400">該当する研究室が見つかりませんでした。</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}