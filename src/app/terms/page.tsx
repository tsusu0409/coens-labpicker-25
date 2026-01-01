import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約',
};

export default function TermsPage() {
  return (
    <div className="max-w-[800px] mx-auto py-12 px-6">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">利用規約</h1>
        <p className="text-gray-500 italic">最終更新日: 2025年12月15日</p>
      </header>

      <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm leading-relaxed text-gray-800 space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第1条（目的）
          </h2>
          <p>
            本規約は、筑波大学 理工学群応用理工学類の研究室配属支援システム「coens-labpicker-25」（以下「本システム」）の利用条件を定めるものです。本システムは、学生間の情報共有および志望状況の可視化を目的とした有志によるプロジェクトです。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第2条（利用資格）
          </h2>
          <p>
            本システムの利用は、筑波大学のメールアドレス（@u.tsukuba.ac.jp）を所有する、本学群・学類に所属する学生に限定されます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第3条（禁止事項）
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>虚偽のGPAや志望情報の登録</li>
            <li>他人になりすましての利用</li>
            <li>本システムの運用を妨げる行為（不正アクセス、過度な負荷をかける行為など）</li>
            <li>公序良俗に反する行為、または本システムの目的に反する利用</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第4条（免責事項）
          </h2>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>本システムは有志により運営されており、その正確性、完全性、最新性を保証するものではありません。</li>
            <li>本システムの利用により生じた直接的、間接的ないかなる損害についても、運営者は一切の責任を負いません。</li>
            <li>研究室配属の最終的な結果は、大学公式の選考プロセスに基づきます。本システムの情報はあくまで参考として利用してください。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第5条（プライバシーとデータ利用）
          </h2>
          <p>
            登録されたGPAおよび志望情報は、本システム内での統計および表示のために使用されます。個人を特定できるメールアドレスなどの情報は、認証および重要なお知らせの送信のみに使用され、第三者に公開されることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-green-500 pl-4 text-gray-900">
            第6条（規約の変更）
          </h2>
          <p>
            本規約は、必要に応じて予告なく変更される場合があります。変更後の規約は、本システム上に表示した時点から効力を生じるものとします。
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100 text-center">
          <Link 
            href="/" 
            className="inline-block bg-gray-100 text-gray-600 px-6 py-2 hover:bg-gray-200 transition-colors"
          >
            戻る
          </Link>
        </div>
      </div>
    </div>
  );
}