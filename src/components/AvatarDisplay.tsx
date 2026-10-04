import React from 'react';
import { AvatarConfig } from '../types/game';

interface Props {
  avatar: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showFullBody?: boolean;
}

export const AvatarDisplay: React.FC<Props> = ({
  avatar,
  size = 'md',
  className = '',
  showFullBody = false,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    full: 'w-48 h-72 sm:w-56 sm:h-80',
  };

  const skin = avatar.skinTone || '#a76a42';
  const hair = avatar.hairColor || '#0f172a';
  const topColor = avatar.clothingColor || (
    avatar.clothing === 'gold_embroidered' ? '#d97706' :
    avatar.clothing === 'silk_blazer' ? '#6366f1' :
    avatar.clothing === 'suit' ? '#0f172a' :
    avatar.clothing === 'leather' ? '#18181b' :
    avatar.clothing === 'designer_tracksuit' ? '#e11d48' : '#334155'
  );
  const pantsColor = avatar.pantsColor || (
    avatar.pants === 'cargos' ? '#3f3f46' :
    avatar.pants === 'sweats' ? '#52525b' :
    avatar.pants === 'leather_pants' ? '#18181b' : '#1e3a8a'
  );
  const shoesColor = avatar.shoesColor || (
    avatar.shoes === 'luxury_loafers' ? '#78350f' :
    avatar.shoes === 'high_tops' ? '#dc2626' :
    avatar.shoes === 'oxfords' ? '#1c1917' : '#f8fafc'
  );

  const isFull = showFullBody || size === 'full';

  return (
    <div
      className={`relative rounded-3xl overflow-hidden flex items-center justify-center border-2 border-white/10 shadow-2xl ${sizeMap[size]} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      }}
    >
      <svg
        viewBox={isFull ? '0 0 100 150' : '0 0 100 100'}
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Ambient background aura */}
        <circle cx="50" cy={isFull ? '65' : '50'} r={isFull ? '60' : '45'} fill="rgba(59, 130, 246, 0.12)" />

        {/* --- FULL BODY: LOWER SECTION (Pants & Shoes) --- */}
        {isFull && (
          <g>
            {/* Pants / Trousers */}
            <path d="M34 94 L31 132 L46 132 L48 102 L52 102 L54 132 L69 132 L66 94 Z" fill={pantsColor} />
            <line x1="50" y1="102" x2="50" y2="132" stroke="#09090b" strokeWidth="1" opacity="0.4" />
            {avatar.pants === 'cargos' && (
              <>
                <rect x="30" y="108" width="6" height="8" rx="1.5" fill="#27272a" />
                <rect x="64" y="108" width="6" height="8" rx="1.5" fill="#27272a" />
              </>
            )}

            {/* Shoes */}
            {avatar.shoes === 'high_tops' ? (
              <g fill={shoesColor}>
                <path d="M28 132 L46 132 L46 142 L25 142 Q25 137 28 132 Z" />
                <path d="M54 132 L72 132 Q75 137 75 142 L54 142 Z" />
                <rect x="25" y="140" width="21" height="2" fill="#ffffff" />
                <rect x="54" y="140" width="21" height="2" fill="#ffffff" />
              </g>
            ) : avatar.shoes === 'luxury_loafers' ? (
              <g fill={shoesColor}>
                <path d="M29 132 L45 132 L45 140 L26 140 Q26 135 29 132 Z" />
                <path d="M55 132 L71 132 Q74 135 74 140 L55 140 Z" />
                <circle cx="37" cy="136" r="1.5" fill="#fbbf24" />
                <circle cx="63" cy="136" r="1.5" fill="#fbbf24" />
              </g>
            ) : (
              /* Default White Sneakers */
              <g fill={shoesColor}>
                <path d="M28 133 L45 133 L45 141 L25 141 Q25 137 28 133 Z" />
                <path d="M55 133 L72 133 Q75 137 75 141 L55 141 Z" />
                <line x1="28" y1="139" x2="45" y2="139" stroke="#94a3b8" strokeWidth="1" />
                <line x1="55" y1="139" x2="72" y2="139" stroke="#94a3b8" strokeWidth="1" />
              </g>
            )}
          </g>
        )}

        {/* --- CLOTHING / TOP --- */}
        {avatar.clothing === 'gold_embroidered' ? (
          <g>
            <path d="M22 100 Q50 65 78 100 Z" fill="#18181b" />
            <path d="M38 78 L50 95 L62 78 Z" fill="#0f172a" />
            <path d="M32 78 Q50 95 68 78" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" />
            <circle cx="50" cy="88" r="2.5" fill="#eab308" />
          </g>
        ) : avatar.clothing === 'silk_blazer' ? (
          <g>
            <path d="M20 100 Q50 65 80 100 Z" fill={topColor} />
            <path d="M38 75 L50 94 L62 75 Z" fill="#0f172a" />
            <path d="M47 82 L53 82 L51 98 L49 98 Z" fill="#f43f5e" />
          </g>
        ) : avatar.clothing === 'suit' ? (
          <g>
            <path d="M20 100 Q50 65 80 100 Z" fill={topColor} />
            <path d="M38 78 L50 95 L62 78 Z" fill="#f8fafc" />
            <path d="M47 82 L53 82 L51 98 L49 98 Z" fill="#dc2626" />
          </g>
        ) : avatar.clothing === 'leather' ? (
          <g>
            <path d="M20 100 Q50 65 80 100 Z" fill="#18181b" />
            <path d="M46 75 L50 90 L54 75 Z" fill="#71717a" />
            <path d="M32 82 L42 98" stroke="#a1a1aa" strokeWidth="1.5" />
          </g>
        ) : avatar.clothing === 'designer_tracksuit' ? (
          <g>
            <path d="M20 100 Q50 65 80 100 Z" fill={topColor} />
            <line x1="24" y1="88" x2="28" y2="100" stroke="#ffffff" strokeWidth="2" />
            <line x1="76" y1="88" x2="72" y2="100" stroke="#ffffff" strokeWidth="2" />
          </g>
        ) : (
          /* Streetwear Hoodie / Tee */
          <g>
            <path d="M20 100 Q50 65 80 100 Z" fill={topColor} />
            <path d="M35 78 Q50 88 65 78" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
          </g>
        )}

        {/* Neck */}
        <rect x="44" y="62" width="12" height="15" rx="3" fill={skin} />

        {/* Head */}
        <ellipse cx="50" cy="50" rx="20" ry="24" fill={skin} />

        {/* Facial Hair (Beard, Goatee, Mustache, Stubble) */}
        {avatar.facialHair === 'full_beard' ? (
          <g fill={hair}>
            <path d="M35 52 Q35 74 50 75 Q65 74 65 52 Q60 68 50 69 Q40 68 35 52 Z" />
            <path d="M43 60 Q50 64 57 60 Q50 62 43 60 Z" />
          </g>
        ) : avatar.facialHair === 'goatee' ? (
          <g fill={hair}>
            <ellipse cx="50" cy="67" rx="8" ry="7" />
            <path d="M43 60 Q50 64 57 60" stroke={hair} strokeWidth="1.5" />
          </g>
        ) : avatar.facialHair === 'mustache' ? (
          <path d="M42 59 Q50 63 58 59 Q50 57 42 59 Z" fill={hair} />
        ) : avatar.facialHair === 'stubble' ? (
          <path d="M36 56 Q36 72 50 73 Q64 72 64 56 Q59 66 50 67 Q41 66 36 56 Z" fill={hair} opacity="0.35" />
        ) : null}

        {/* Eyes & Pupils */}
        <ellipse cx="43" cy="48" rx="2.5" ry="3" fill="#0f172a" />
        <ellipse cx="57" cy="48" rx="2.5" ry="3" fill="#0f172a" />
        <circle cx="44" cy="47" r="1" fill="#ffffff" />
        <circle cx="58" cy="47" r="1" fill="#ffffff" />

        {/* Eyebrows */}
        <path d="M39 42 Q44 40 48 42" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M52 42 Q56 40 61 42" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <path d="M50 51 L48 56 L52 56" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />

        {/* Mouth expression */}
        {avatar.expression === 'happy' ? (
          <path d="M43 62 Q50 69 57 62" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : avatar.expression === 'smirk' ? (
          <path d="M43 63 Q52 66 58 60" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : avatar.expression === 'cool' ? (
          <path d="M44 63 Q50 64 56 61" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : avatar.expression === 'focused' ? (
          <line x1="44" y1="63" x2="56" y2="63" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        ) : (
          /* confident smile */
          <path d="M43 62 Q50 67 57 62" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* --- HAIRSTYLES --- */}
        {avatar.hairStyle === 'dreads' ? (
          <g fill={hair}>
            <circle cx="50" cy="30" r="14" />
            <rect x="27" y="32" width="4" height="24" rx="2" transform="rotate(-8 27 32)" />
            <rect x="34" y="28" width="4" height="28" rx="2" />
            <rect x="42" y="24" width="4" height="30" rx="2" />
            <rect x="50" y="24" width="4" height="30" rx="2" />
            <rect x="58" y="28" width="4" height="28" rx="2" />
            <rect x="65" y="32" width="4" height="24" rx="2" transform="rotate(8 65 32)" />
          </g>
        ) : avatar.hairStyle === 'waves' ? (
          <g fill={hair}>
            <path d="M30 38 Q50 22 70 38 Q68 28 50 25 Q32 28 30 38 Z" />
            <path d="M34 32 Q50 36 66 32" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            <path d="M36 36 Q50 40 64 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
          </g>
        ) : avatar.hairStyle === 'curly' ? (
          <g fill={hair}>
            <circle cx="50" cy="27" r="12" />
            <circle cx="38" cy="32" r="10" />
            <circle cx="62" cy="32" r="10" />
            <circle cx="32" cy="42" r="8" />
            <circle cx="68" cy="42" r="8" />
          </g>
        ) : avatar.hairStyle === 'afro' ? (
          <circle cx="50" cy="38" r="24" fill={hair} />
        ) : avatar.hairStyle === 'platinum_braids' ? (
          <g fill="#e2e8f0">
            <circle cx="50" cy="28" r="13" />
            <rect x="28" y="32" width="4" height="34" rx="2" />
            <rect x="36" y="28" width="4" height="36" rx="2" />
            <rect x="44" y="26" width="4" height="38" rx="2" />
            <rect x="52" y="26" width="4" height="38" rx="2" />
            <rect x="60" y="28" width="4" height="36" rx="2" />
            <rect x="68" y="32" width="4" height="34" rx="2" />
          </g>
        ) : avatar.hairStyle === 'buzz' ? (
          <path d="M31 40 Q50 25 69 40 Q67 30 50 28 Q33 30 31 40 Z" fill={hair} />
        ) : avatar.hairStyle === 'slick' ? (
          <path d="M30 38 Q50 20 70 38 Q65 24 50 22 Q35 24 30 38 Z" fill={hair} />
        ) : (
          /* Clean Skin Fade */
          <path d="M30 38 Q50 22 70 38 Q68 28 50 26 Q32 28 30 38 Z" fill={hair} />
        )}

        {/* --- ACCESSORIES --- */}
        {avatar.accessory === 'diamond_chain' ? (
          <path d="M36 78 Q50 90 64 78" stroke="url(#diamondGrad)" strokeWidth="3" fill="none" strokeDasharray="2 2" />
        ) : avatar.accessory === 'gold_chain' ? (
          <path d="M38 78 Q50 88 62 78" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" strokeDasharray="3 2" />
        ) : avatar.accessory === 'sunglasses' ? (
          <g fill="#09090b">
            <rect x="37" y="44" width="12" height="9" rx="2" fill="#18181b" />
            <rect x="51" y="44" width="12" height="9" rx="2" fill="#18181b" />
            <line x1="48" y1="47" x2="52" y2="47" stroke="#fbbf24" strokeWidth="2" />
          </g>
        ) : avatar.accessory === 'glasses' ? (
          <g stroke="#d97706" strokeWidth="1.5" fill="rgba(255,255,255,0.2)">
            <circle cx="43" cy="48" r="6" />
            <circle cx="57" cy="48" r="6" />
            <line x1="49" y1="48" x2="51" y2="48" />
          </g>
        ) : avatar.accessory === 'airpods' ? (
          <g fill="#ffffff">
            <circle cx="30" cy="52" r="2.5" />
            <rect x="29" y="53" width="2" height="6" rx="1" />
            <circle cx="70" cy="52" r="2.5" />
            <rect x="69" y="53" width="2" height="6" rx="1" />
          </g>
        ) : avatar.accessory === 'snapback' ? (
          <g>
            <path d="M28 36 Q50 18 72 36 Z" fill="#0f172a" />
            <ellipse cx="64" cy="36" rx="14" ry="4" fill="#1e293b" />
          </g>
        ) : null}

        {/* Rolex watch on arm if full body */}
        {isFull && avatar.accessory === 'rolex_watch' && (
          <rect x="68" y="90" width="4" height="6" rx="1.5" fill="url(#goldGrad)" />
        )}
      </svg>
    </div>
  );
};
