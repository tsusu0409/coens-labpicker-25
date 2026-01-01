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
          <p className="text-lg font-light tracking-widest uppercase">2025 Edition</p>
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
          <h2 className="text-3xl mb-2 text-[#1a2c2f] font-serif">
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-xs text-[#5e7175] mb-10 tracking-wide">
            {isLogin ? "アカウントにログインしてください" : "新規アカウントを作成します"}
          </p>
          
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-8">
            <div className="group">
              <label className="text-xs uppercase tracking-widest text-[#5e7175] group-focus-within:text-[#85BCC7] transition-colors block mb-2">
                University Email
              </label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 px-2 transition-all duration-300 focus:outline-none focus:border-[#85BCC7] text-[#1a2c2f]"
                placeholder="s2xxxxx@u.tsukuba.ac.jp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern=".*@u\.tsukuba\.ac\.jp$"
              />
            </div>
            
            <div className="group">
              <label className="text-xs uppercase tracking-widest text-[#5e7175] group-focus-within:text-[#85BCC7] transition-colors block mb-2">
                Password
              </label>
              <input 
                type="password" 
                className="w-full bg-transparent border-b-2 border-gray-200 py-3 px-2 transition-all duration-300 focus:outline-none focus:border-[#85BCC7] text-[#1a2c2f]"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {/* 新規登録時のみ表示する利用規約チェックボックス */}
            {!isLogin && (
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 text-[#85BCC7] border-gray-300 rounded focus:ring-[#85BCC7]"
                />
                <label htmlFor="agree-terms" className="text-xs text-[#5e7175]">
                  <Link href="/terms" target="_blank" className="text-[#85BCC7] hover:underline underline-offset-2">
                    利用規約
                  </Link>
                  に同意します
                </label>
              </div>
            )}

            <button 
              type="submit" 
              className="relative w-full overflow-hidden bg-[#85BCC7] text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#74a5af] transition-colors shadow-lg shadow-[#85BCC7]/20"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* メッセージ表示エリア */}
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 text-xs text-center border-l-2 ${
                message.type === 'success' ? 'bg-[#e7f2f4] border-[#85BCC7] text-[#1a2c2f]' :
                message.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                'bg-gray-50 border-gray-400 text-gray-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="mt-12 flex justify-between items-center text-xs text-[#5e7175] border-t border-gray-100 pt-8">
            <button onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: '', type: null });
            }} className="hover:text-[#85BCC7] transition-colors uppercase tracking-wider">
              {isLogin ? "Create an account" : "Back to login"}
            </button>
            <Link href="/reset-password" className="hover:text-[#85BCC7] transition-colors">
              Forgot password?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}