// Replaces the shared chalk filter (same id "chalk") with crisp gold-leaf ink + soft glow,
// so every ChalkLine / DashedArrow / Sparks in this client's scenes renders as gold line art.
export const GoldInkDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="chalk" filterUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="0 0 0 0 0.86  0 0 0 0 0.70  0 0 0 0 0.36  0 0 0 1 0"
          result="gold"
        />
        <feGaussianBlur in="gold" stdDeviation={6} result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="gold" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);
