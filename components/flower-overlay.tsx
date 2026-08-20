function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

interface ChrysanthemumProps {
  /** 완전히 똑같은 흰 국화가 반복되면 스티커처럼 보여서, 살짝 아이보리 톤을 섞는다 */
  warm: boolean;
}

function WhiteChrysanthemum({ warm }: ChrysanthemumProps) {
  const outerPetals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const innerPetals = Array.from({ length: 12 }, (_, i) => i * (360 / 12) + 15);
  const petalFill = warm ? '#fffbf2' : '#ffffff';

  return (
    <svg
      viewBox="0 0 40 54"
      width="26"
      height="35"
      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
    >
      {/* 줄기 — 꽃이 놓인 느낌을 주려면 머리만 있는 것보다 훨씬 자연스럽다 */}
      <line
        x1="20"
        y1="27"
        x2="20"
        y2="51"
        stroke="#7f9c72"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M20 37 Q27 35 28 41 Q21 41.5 20 37" fill="#8caa7c" />

      {outerPetals.map((angle, i) => (
        <ellipse
          key={`o-${i}`}
          cx="20"
          cy="10"
          rx="2"
          ry="9"
          fill={petalFill}
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
          fill={petalFill}
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
    left: seededRandom(i * 5) * 82 + 4,
    bottom: seededRandom(i * 5 + 1) * 28 + 2,
    rotate: seededRandom(i * 5 + 2) * 60 - 30,
    scale: seededRandom(i * 5 + 3) * 0.5 + 0.8,
    warm: seededRandom(i * 5 + 4) > 0.5,
  }));

  return (
    <>
      {flowers.map((flower, i) => (
        <span
          key={i}
          className="absolute origin-bottom select-none"
          style={{
            left: `${flower.left}%`,
            bottom: `${flower.bottom}%`,
            transform: `rotate(${flower.rotate}deg) scale(${flower.scale})`,
          }}
        >
          <WhiteChrysanthemum warm={flower.warm} />
        </span>
      ))}
    </>
  );
}
