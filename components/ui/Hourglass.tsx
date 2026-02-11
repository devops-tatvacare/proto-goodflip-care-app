"use client";

export default function Hourglass() {
  return (
    <span className="inline-flex relative items-center justify-center w-5 h-5 align-[-2px]">
      <span className="material-symbols-outlined absolute animate-hourglass-a">hourglass_top</span>
      <span className="material-symbols-outlined absolute animate-hourglass-b">hourglass_bottom</span>
      <style jsx>{`
        .animate-hourglass-a {
          animation: hgA 1200ms ease-in-out infinite;
        }
        .animate-hourglass-b {
          animation: hgB 1200ms ease-in-out infinite;
        }
        @keyframes hgA {
          0% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes hgB {
          0% { opacity: 0; transform: translateY(-2px); }
          50% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-2px); }
        }
      `}</style>
    </span>
  );
}