export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" />
      <path d="M 16 58 L 33 26 L 45.8 50.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 84 58 L 67 26 L 54.2 50.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="55" r="6" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}
