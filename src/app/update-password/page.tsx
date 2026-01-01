"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' | 'loading' | null }>({
    text: '',
    type: null,
  });

  // セッション確認
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setIsSessionLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ text: 'パスワードが一致していません', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ text: 'パスワードは6文字以上で設定してください', type: 'error' });
      return;
    }

    setStatus({ text: 'セキュリティ情報を更新中...', type: 'loading' });

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setStatus({ text: '更新エラー: ' + error.message, type: 'error' });
    } else {
      setStatus({ text: 'パスワードの更新が完了しました。ログイン画面へ移動します...', type: 'success' });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-16 h-1 bg-[#E2E8F0] overflow-hidden rounded-full">
          <div className="h-full bg-[#85BCC7] w-1/2 animate-[shimmer_1s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
        body { font-family: 'Noto Sans JP', 'Manrope', sans-serif; background-color: #F8FAFC; color: #334155; }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden selection:bg-[#85BCC7] selection:text-white">
        
        {/* 背景装飾 */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#85BCC7] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-sky-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        {/* メインカード */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-[480px] bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-2xl overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-[#85BCC7] to-slate-300"></div>
          
          <div className="p-8 md:p-12">
            <header className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#85BCC7]/10 text-[#85BCC7] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">新しいパスワードの設定</h1>
              <p className="text-sm text-slate-500">
                セキュリティのため、推測されにくい<br/>パスワードを設定してください。
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* 新しいパスワード */}
              <div className="space-y-2">
                <label htmlFor="new-password" className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <input 
                    type="password" 
                    id="new-password" 
                    placeholder="6文字以上"
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 pl-11 text-slate-700 font-medium placeholder-slate-300 focus:outline-none focus:border-[#85BCC7] focus:bg-white transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={status.type === 'loading' || status.type === 'success'}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#85BCC7] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                </div>
              </div>

              {/* 確認用パスワード */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-xs font-bold text-slate-400 uppercase tracking-wider block ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input 
                    type="password" 
                    id="confirm-password" 
                    placeholder="再入力してください"
                    required
                    minLength={6}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3.5 pl-11 text-slate-700 font-medium placeholder-slate-300 focus:outline-none focus:border-[#85BCC7] focus:bg-white transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={status.type === 'loading' || status.type === 'success'}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#85BCC7] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
              </div>

              {/* ステータスメッセージ */}
              <AnimatePresence mode="wait">
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`text-sm p-4 rounded-xl border flex items-start gap-3 ${
                      status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                      status.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-100' :
                      'bg-blue-50 text-blue-800 border-blue-100'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {status.type === 'success' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      {status.type === 'error' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {status.type === 'loading' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    <span>{status.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={status.type === 'loading' || status.type === 'success'}
                className="w-full bg-[#2C333A] text-white p-4 rounded-xl font-bold hover:bg-[#85BCC7] hover:shadow-lg hover:shadow-[#85BCC7]/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {status.type === 'loading' ? '更新処理中...' : 'パスワードを更新する'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}