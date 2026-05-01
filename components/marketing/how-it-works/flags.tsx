/**
 * Stylised inline SVG flags for the seven currencies traded.
 * Sized via the parent — viewBox is 0 0 24 16 (3:2). Decorative only;
 * the pair code beside them is what carries the meaning.
 */
const FLAG = "h-3.5 w-auto rounded-[2px] shadow-sm ring-1 ring-white/10";

function Flag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 16"
      width="20"
      height="14"
      aria-hidden="true"
      className={`${FLAG} ${className ?? ""}`.trim()}
    >
      {children}
    </svg>
  );
}

export function FlagUSD() {
  return (
    <Flag>
      {/* 7 horizontal stripes alternating red/white */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={0}
          y={i * (16 / 7)}
          width={24}
          height={16 / 7}
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      {/* Canton */}
      <rect x={0} y={0} width={10} height={8} fill="#3C3B6E" />
      {/* simplified stars */}
      {[
        [2, 2],
        [5, 2],
        [8, 2],
        [3.5, 4],
        [6.5, 4],
        [2, 6],
        [5, 6],
        [8, 6],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={0.6} fill="#FFFFFF" />
      ))}
    </Flag>
  );
}

export function FlagEUR() {
  return (
    <Flag>
      <rect width={24} height={16} fill="#003399" />
      {/* 12 yellow stars in a circle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const cx = 12 + 4.5 * Math.sin(angle);
        const cy = 8 - 4.5 * Math.cos(angle);
        return <circle key={i} cx={cx} cy={cy} r={0.8} fill="#FFCC00" />;
      })}
    </Flag>
  );
}

export function FlagGBP() {
  return (
    <Flag>
      <rect width={24} height={16} fill="#012169" />
      {/* white diagonals */}
      <line x1={0} y1={0} x2={24} y2={16} stroke="#FFFFFF" strokeWidth={2} />
      <line x1={24} y1={0} x2={0} y2={16} stroke="#FFFFFF" strokeWidth={2} />
      {/* red diagonals */}
      <line x1={0} y1={0} x2={24} y2={16} stroke="#C8102E" strokeWidth={1} />
      <line x1={24} y1={0} x2={0} y2={16} stroke="#C8102E" strokeWidth={1} />
      {/* white cross */}
      <rect x={0} y={6} width={24} height={4} fill="#FFFFFF" />
      <rect x={10} y={0} width={4} height={16} fill="#FFFFFF" />
      {/* red cross */}
      <rect x={0} y={7} width={24} height={2} fill="#C8102E" />
      <rect x={11} y={0} width={2} height={16} fill="#C8102E" />
    </Flag>
  );
}

export function FlagJPY() {
  return (
    <Flag>
      <rect width={24} height={16} fill="#FFFFFF" />
      <circle cx={12} cy={8} r={4} fill="#BC002D" />
    </Flag>
  );
}

export function FlagAUD() {
  return (
    <Flag>
      <rect width={24} height={16} fill="#012169" />
      {/* simplified union jack canton (top-left quarter) */}
      <rect x={0} y={0} width={12} height={8} fill="#012169" />
      <rect x={0} y={3} width={12} height={2} fill="#FFFFFF" />
      <rect x={5} y={0} width={2} height={8} fill="#FFFFFF" />
      <rect x={0} y={3.5} width={12} height={1} fill="#C8102E" />
      <rect x={5.5} y={0} width={1} height={8} fill="#C8102E" />
      {/* commonwealth star + southern cross */}
      <circle cx={6} cy={12} r={1} fill="#FFFFFF" />
      <circle cx={17} cy={4} r={0.5} fill="#FFFFFF" />
      <circle cx={20} cy={6} r={0.6} fill="#FFFFFF" />
      <circle cx={18} cy={9} r={0.7} fill="#FFFFFF" />
      <circle cx={20} cy={11} r={0.5} fill="#FFFFFF" />
      <circle cx={16} cy={12} r={0.5} fill="#FFFFFF" />
    </Flag>
  );
}

export function FlagCAD() {
  return (
    <Flag>
      <rect width={6} height={16} fill="#D52B1E" />
      <rect x={6} width={12} height={16} fill="#FFFFFF" />
      <rect x={18} width={6} height={16} fill="#D52B1E" />
      {/* simplified maple leaf — diamond + stem */}
      <polygon points="12,4 14,7 13,8 14,11 12,10 10,11 11,8 10,7" fill="#D52B1E" />
    </Flag>
  );
}

export function FlagCHF() {
  return (
    <Flag>
      <rect width={24} height={16} fill="#DA291C" />
      {/* white plus */}
      <rect x={10} y={4} width={4} height={8} fill="#FFFFFF" />
      <rect x={8} y={6} width={8} height={4} fill="#FFFFFF" />
    </Flag>
  );
}

const MAP: Record<string, React.ComponentType> = {
  USD: FlagUSD,
  EUR: FlagEUR,
  GBP: FlagGBP,
  JPY: FlagJPY,
  AUD: FlagAUD,
  CAD: FlagCAD,
  CHF: FlagCHF,
};

export function CurrencyFlag({ code }: { code: string }) {
  const Component = MAP[code];
  if (!Component) return null;
  return <Component />;
}
