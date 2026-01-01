"use client";

import { motion } from 'framer-motion';

export const RegistrationForm = ({ gpa, setGpa, selectedLabId, setSelectedLabId, labs, onSubmit, student }) => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 p-8 shadow-sm relative"
    >
      {/* 申請書のタグのような演出 */}
      <div className="absolute top-0 right-0 bg-[#85BCC7] text-white text-[10px] px-4 py-1 font-bold tracking-widest">
        REGISTRATION
      </div>

      <h2 className="text-2xl mb-8 text-[#1a2c2f] flex items-center gap-3">
        志望情報の登録
        <span className="text-[10px] font-normal text-gray-400 tracking-normal">
          （GPAと希望研究室を入力してください）
        </span>
      </h2>

      <form onSubmit={onSubmit} className="space-y-10">
        {/* GPA入力 */}
        <div className="relative group">
          <div className="flex justify-between items-end mb-2">
            <label className="text-sm font-semibold text-[#5e7175]">
              GPA <span className="text-red-400 ml-1">*</span>
            </label>
            <span className="text-[10px] text-gray-400">0.00 〜 4.30 の範囲</span>
          </div>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            max="4.30" 
            required
            placeholder="例: 3.45"
            className="w-full text-2xl font-light py-3 border-b-2 border-gray-100 focus:border-[#85BCC7] focus:outline-none transition-all bg-transparent"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
          />
        </div>

        {/* 研究室選択 */}
        <div className="relative group">
          <label className="block text-sm font-semibold text-[#5e7175] mb-4">
            第1志望研究室 <span className="text-red-400 ml-1">*</span>
          </label>
          <div className="relative">
            <select 
              required
              className="w-full appearance-none bg-gray-50 border-none p-4 pr-10 text-gray-700 text-sm focus:ring-2 focus:ring-[#85BCC7]/20 transition-all outline-none"
              value={selectedLabId}
              onChange={(e) => setSelectedLabId(e.target.value)}
            >
              <option value="">研究室を選択してください</option>
              {/* 主専攻ごとにグループ化するなら optgroup を活用 */}
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name}（{lab.professor || '未定'}）
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#85BCC7]">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#1a2c2f] text-[#85BCC7] py-4 text-sm font-bold tracking-[0.2em] hover:bg-[#85BCC7] hover:text-white transition-all duration-500"
        >
          {student ? "登録情報を更新する" : "この内容で新規登録する"}
        </button>
      </form>

      {/* 現在の状況（登録済みの場合のみ） */}
      {student && (
        <div className="mt-12 pt-8 border-t border-dashed border-gray-200">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Current Status</p>
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">現在のGPA</p>
              <p className="text-xl font-light">{student.gpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">現在の志望先</p>
              <p className="text-xl font-light">
                {labs.find(l => l.id === student.lab_id)?.name || '未登録'}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};