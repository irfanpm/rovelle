export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <span className={"brand" + (compact ? " brand-compact" : "")}>
    <svg className="brand-symbol" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M24 19c-5-7-6-11-3-14 4 4 5 8 3 14Zm4 3c7-5 11-6 14-3-4 4-8 5-14 3Zm-2 7c5 7 6 11 3 14-4-4-5-8-3-14Zm-6-2c-7 5-11 6-14 3 4-4 8-5 14-3Z"/>
        <path d="m19 18-7-8m18 8 7-7m-7 19 7 7m-19-7-7 7M22 24h4m-2-2v4"/>
        <path d="M10 16c-4-1-6-4-5-7m26-4c3 0 5 2 5 5M43 30c0 4-2 6-5 6M16 42c-4 1-7-1-7-4"/>
      </g><circle cx="24" cy="24" r="4.2" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="23" r="1.1" fill="currentColor"/><circle cx="40" cy="10" r="1.1" fill="currentColor"/>
    </svg><span className="brand-type">ROVELLE<small>J E W E L S</small></span>
  </span>;
}
