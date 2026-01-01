"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Lab = Database['public']['Tables']['labs']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'labs' | 'students'>('labs');
  
  const [labs, setLabs] = useState<Lab[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // 1. 管理者チェックとデータ取得
  const fetchAdminData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // 管理者制限 (ここではあなたのメールアドレスを例にします)
    if (!session || session.user.email !== 'tsusu0409@gmail.com') {
      alert("管理者権限がありません");
      router.push('/dashboard');
      return;
    }

    setIsAdmin(true);

    // データの並列取得
    const [labsRes, studentsRes] = await Promise.all([
      supabase.from('labs').select('*').order('major').order('name'),
      supabase.from('view_lab_applicants').select('*').order('lab_id').order('rank')
    ]);

    if (labsRes.data) setLabs(labsRes.data);
    if (studentsRes.data) setStudents(studentsRes.data);
    
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // 2. 研究室の定員変更などの処理
  const updateLabCapacity = async (id: string, newCapacity: number) => {
    const { error } = await supabase
      .from('labs')
      .update({ capacity: newCapacity })
      .eq('id', id);

    if (error) alert("更新失敗: " + error.message);
    else {
      setLabs(labs.map(l => l.id === id ? { ...l, capacity: newCapacity } : l));
      alert("定員を更新しました");
    }
  };

  if (loading) return <div className="p-10 text-center">権限確認中...</div>;
  if (!isAdmin) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🛠 管理者パネル</h1>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 hover:underline">
          一般ダッシュボードに戻る
        </button>
      </header>

      {/* タブ切り替え */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('labs')}
          className={`px-4 py-2 font-bold ${activeTab === 'labs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          研究室管理
        </button>
        <button 
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 font-bold ${activeTab === 'students' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          志望学生一覧
        </button>
      </div>

      {activeTab === 'labs' ? (
        <section className="bg-white shadow-sm border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-4 border-b">研究室名 / 教授</th>
                <th className="p-4 border-b">主専攻</th>
                <th className="p-4 border-b">定員設定</th>
                <th className="p-4 border-b">操作</th>
              </tr>
            </thead>
            <tbody>
              {labs.map(lab => (
                <tr key={lab.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">
                    <div className="font-bold">{lab.name}</div>
                    <div className="text-xs text-gray-500">{lab.professor}</div>
                  </td>
                  <td className="p-4 border-b text-sm">{lab.major}</td>
                  <td className="p-4 border-b">
                    <input 
                      type="number" 
                      defaultValue={lab.capacity}
                      className="w-16 p-1 border"
                      onBlur={(e) => updateLabCapacity(lab.id, parseInt(e.target.value))}
                    /> 名
                  </td>
                  <td className="p-4 border-b">
                    <button className="text-xs bg-gray-100 px-2 py-1 hover:bg-gray-200">編集</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="bg-white shadow-sm border">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="p-4 border-b">メールアドレス</th>
                <th className="p-4 border-b">志望先</th>
                <th className="p-4 border-b">GPA</th>
                <th className="p-4 border-b">学内順位</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st, i) => (
                <tr key={i} className="hover:bg-gray-50 text-sm">
                  <td className="p-4 border-b">{st.email}</td>
                  <td className="p-4 border-b font-medium">{st.lab_name}</td>
                  <td className="p-4 border-b">{st.gpa.toFixed(2)}</td>
                  <td className="p-4 border-b text-blue-600 font-bold">{st.rank}位</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}