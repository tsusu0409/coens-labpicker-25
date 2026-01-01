export const InfoBanner = ({ title, message }) => (
  <div className="bg-[#e7f2f4] border-l-4 border-[#85BCC7] p-6 my-8">
    <div className="flex gap-4">
      <span className="text-[#85BCC7] text-xl">!</span>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#1a2c2f]">{title}</h4>
        <p className="text-xs text-[#5e7175] leading-relaxed">{message}</p>
      </div>
    </div>
  </div>
);