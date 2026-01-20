export function Footer() {
  return (
    <footer className="border-t border-[#2d2d2d] bg-[#1e1e1e] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-[#858585]">
            <span className="text-[#6a9955]">// </span>
            Built with React, TypeScript & Tailwind CSS
          </div>

          <div className="font-mono text-xs text-[#858585]">
            <span className="text-[#c586c0]">const</span>{' '}
            <span className="text-[#9cdcfe]">year</span>{' '}
            <span className="text-[#d4d4d4]">=</span>{' '}
            <span className="text-[#b5cea8]">{new Date().getFullYear()}</span>
            <span className="text-[#d4d4d4]">;</span>
            <span className="text-[#6a9955] ml-2">// © Alex Morgan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
