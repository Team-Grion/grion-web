function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function WhiteChrysanthemum() {
  const outerPetals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * (360 / 12) + 15);

  return (
    <svg viewBox="0 0 40 40" width="28" height="28">
      {outerPetals.map((angle, i) => (
        <ellipse
          key={`o-${i}`}
          cx="20"
          cy="10"
          rx="2"
          ry="9"
          fill="white"
          stroke="#d1d5db"
          strokeWidth="0.3"
          transform={`rotate(${angle} 20 20)`}
          opacity="0.95"
        />
      ))}
      {innerPetals.map((angle, i) => (
        <ellipse
          key={`i-${i}`}
          cx="20"
          cy="13"
          rx="1.6"
          ry="6"
          fill="white"
          stroke="#d1d5db"
          strokeWidth="0.3"
          transform={`rotate(${angle} 20 20)`}
          opacity="0.85"
        />
      ))}
      <circle cx="20" cy="20" r="4" fill="#fde047" />
      <circle cx="20" cy="20" r="2.5" fill="#facc15" />
    </svg>
  );
}

interface FlowerOverlayProps {
  count: number;
}

const MAX_FLOWERS = 24;

export function FlowerOverlay({ count }: FlowerOverlayProps) {
  if (count === 0) return null;

  const displayCount = Math.min(count, MAX_FLOWERS);

  const flowers = Array.from({ length: displayCount }, (_, i) => ({
    left: seededRandom(i * 4) * 82 + 4,
    bottom: seededRandom(i * 4 + 1) * 28 + 2,
    rotate: seededRandom(i * 4 + 2) * 60 - 30,
    scale: seededRandom(i * 4 + 3) * 0.5 + 0.8,
  }));

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/60 to-transparent" />
      {flowers.map((flower, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            left: `${flower.left}%`,
            bottom: `${flower.bottom}%`,
            transform: `rotate(${flower.rotate}deg) scale(${flower.scale})`,
          }}
        >
          <WhiteChrysanthemum />
        </span>
      ))}
    </>
  );
}
