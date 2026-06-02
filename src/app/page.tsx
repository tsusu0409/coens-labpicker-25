"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({
    text: '',
    type: null,
  });

  // セッション確認（既にログイン済みならダッシュボードへ）
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.email?.endsWith('@u.tsukuba.ac.jp')) {
        router.refresh(); // セッションがある場合は念のためリフレッシュ
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@u.tsukuba.ac.jp')) {
      showMessage('筑波大学のメールアドレス (@u.tsukuba.ac.jp) を使用してください', 'error');
      return;
    }

    showMessage('ログイン中...', 'info');
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showMessage('ログイン失敗: ' + error.message, 'error');
    } else {
      showMessage('ログイン成功！リダイレクト中...', 'success');
      // 重要: Cookieをサーバーに認識させるためにリフレッシュする
      router.refresh();
      setTimeout(() => router.push('/dashboard'), 500);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@u.tsukuba.ac.jp')) {
      showMessage('筑波大学のメールアドレス (@u.tsukuba.ac.jp) を使用してください', 'error');
      return;
    }
    if (!agreeTerms) {
      showMessage('利用規約に同意してください', 'error');
      return;
    }

    showMessage('登録中...', 'info');
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      showMessage('登録失敗: ' + error.message, 'error');
    } else {
      showMessage('登録成功！確認メールを送信しました。', 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* 左側：ビジュアルセクション */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:w-1/2 bg-[#85BCC7] p-12 flex flex-col justify-between text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl leading-none mb-8 font-serif">
            Coens<br />Lab<br />Picker
          </h1>
          <div className="w-20 h-1 bg-white mb-8" />
          <p className="text-lg font-light tracking-widest uppercase">version 2026</p>
        </div>
        
        {/* 装飾的な背景円 */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <p className="text-sm opacity-80 max-w-xs leading-relaxed relative z-10">
          筑波大学 理工学群応用理工学類<br />研究室配属支援システム
        </p>
      </motion.div>

      {/* 右側：フォームセクション */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-24 bg-[#fdfdfd]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* 実施期間終了の告知 */}
          <div className="mb-10 p-5 bg-amber-50 border border-amber-300 rounded-sm">
            <p className="text-sm font-bold text-amber-800 mb-1">実施期間終了のお知らせ</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              2025年度の研究室配属支援システムの実施期間は終了しました。<br />
              ご利用いただきありがとうございました。
            </p>
          </div>

          <h2 className="text-3xl mb-2 text-[#1a2c2f] font-serif opacity-40">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-xs text-[#5e7175] mb-10 tracking-wide opacity-40">
            {isLogin ? "アカウントにログインしてください" : "新規アカウントを作成します"}
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8 opacity-40 pointer-events-none select-none">
            <div className="group">
              <label className="text-xs uppercase tracking-widest text-[#5e7175] block mb-2">
                University Email
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 px-2 text-[#1a2c2f] cursor-not-allowed"
                placeholder="s2xxxxx@u.tsukuba.ac.jp"
                value={email}
                disabled
              />
            </div>

            <div className="group">
              <label className="text-xs uppercase tracking-widest text-[#5e7175] block mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 px-2 text-[#1a2c2f] cursor-not-allowed"
                placeholder="••••••"
                value={password}
                disabled
              />
            </div>

            <button
              type="button"
              disabled
              className="relative w-full overflow-hidden bg-[#85BCC7] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase cursor-not-allowed"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}