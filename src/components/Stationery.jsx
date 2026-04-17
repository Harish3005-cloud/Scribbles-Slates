import React from 'react';

/* ─── Stationery SVG Items ─── */

const Pencil = () => (
  <svg width="110" height="22" viewBox="0 0 110 22" fill="none">
    <rect x="0" y="7" width="76" height="8" rx="2" fill="#264653"/>
    <rect x="76" y="7" width="12" height="8" fill="#e8c5a0"/>
    <polygon points="88,5 88,17 110,11" fill="#ea580c"/>
    <rect x="2" y="8.5" width="8" height="5" rx="1" fill="#3a6074"/>
    <line x1="76" y1="7" x2="76" y2="15" stroke="#c9aa86" strokeWidth="1"/>
    <line x1="88" y1="7" x2="88" y2="15" stroke="#c9aa86" strokeWidth="0.8"/>
  </svg>
);

const Notebook = () => (
  <svg width="58" height="74" viewBox="0 0 58 74" fill="none">
    <rect x="8" y="0" width="50" height="74" rx="4" fill="#264653"/>
    <rect x="8" y="0" width="7" height="74" rx="2 0 0 2" fill="#ea580c"/>
    {/* Spiral rings */}
    {[10, 22, 34, 46, 58].map((y, i) => (
      <ellipse key={i} cx="8" cy={y} rx="4" ry="3.5" fill="none" stroke="#FDFCF0" strokeWidth="1.5" opacity="0.5"/>
    ))}
    {/* Ruled lines */}
    {[22, 32, 42, 52, 62].map((y, i) => (
      <line key={i} x1="20" y1={y} x2="52" y2={y} stroke="#FDFCF0" strokeWidth="1.2" opacity="0.3"/>
    ))}
  </svg>
);

const FountainPen = () => (
  <svg width="18" height="80" viewBox="0 0 18 80" fill="none">
    <rect x="3" y="0" width="12" height="8" rx="4" fill="#2A9D8F"/>
    <rect x="3" y="8" width="12" height="46" rx="1" fill="#264653"/>
    <rect x="4" y="52" width="10" height="12" rx="1" fill="#ea580c"/>
    <polygon points="4,64 14,64 9,80" fill="#264653"/>
    <line x1="9" y1="64" x2="9" y2="78" stroke="#aaa" strokeWidth="0.5" opacity="0.6"/>
  </svg>
);

const PaperClip = () => (
  <svg width="24" height="54" viewBox="0 0 24 54" fill="none">
    <path d="M12 4 C4 4 4 50 12 50 C20 50 20 18 12 18 C7 18 7 42 12 42"
      stroke="#264653" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
  </svg>
);

const WaxSeal = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    {/* Outer star shape */}
    <polygon points="21,2 24,14 36,7 29,18 42,19 31,25 38,36 27,31 26,44 21,33 16,44 15,31 4,36 11,25 0,19 13,18 6,7 18,14"
      fill="#ea580c" opacity="0.15"/>
    <circle cx="21" cy="21" r="16" fill="#ea580c"/>
    <circle cx="21" cy="21" r="12" fill="none" stroke="#FDFCF0" strokeWidth="1.2" opacity="0.5"/>
    <text x="21" y="25" textAnchor="middle" fontSize="9" fill="#FDFCF0"
      fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700">S&amp;S</text>
  </svg>
);

const Ruler = () => (
  <svg width="100" height="20" viewBox="0 0 100 20" fill="none">
    <rect width="100" height="20" rx="2" fill="#264653"/>
    {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x, i) => (
      <line key={i} x1={x} y1="0" x2={x} y2={i % 2 === 0 ? 10 : 6}
        stroke="#FDFCF0" strokeWidth="1" opacity={i % 2 === 0 ? 0.5 : 0.3}/>
    ))}
  </svg>
);

const InkBottle = () => (
  <svg width="38" height="56" viewBox="0 0 38 56" fill="none">
    {/* Cap */}
    <rect x="12" y="0" width="14" height="7" rx="2" fill="#1a3340"/>
    {/* Neck */}
    <rect x="14" y="7" width="10" height="8" rx="1" fill="#264653"/>
    {/* Body */}
    <rect x="6" y="15" width="26" height="38" rx="5" fill="#264653"/>
    {/* Ink level */}
    <rect x="6" y="35" width="26" height="18" rx="0 0 5 5" fill="#ea580c" opacity="0.75"/>
    {/* Shine */}
    <rect x="10" y="19" width="5" height="12" rx="2" fill="white" opacity="0.08"/>
    {/* Label */}
    <rect x="10" y="22" width="18" height="10" rx="2" fill="white" opacity="0.12"/>
  </svg>
);

const PaperSheet = () => (
  <svg width="48" height="62" viewBox="0 0 48 62" fill="none">
    {/* Dog-ear fold */}
    <path d="M0 0 L36 0 L48 12 L48 62 L0 62 Z" fill="white" stroke="#264653" strokeWidth="0.8" opacity="0.9"/>
    <path d="M36 0 L36 12 L48 12" fill="#e8e4d8" stroke="#264653" strokeWidth="0.6" opacity="0.7"/>
    {/* Lines */}
    {[20, 28, 36, 44, 52].map((y, i) => (
      <line key={i} x1="8" y1={y} x2={i === 2 ? 28 : 40} y2={y}
        stroke="#264653" strokeWidth="0.7" opacity="0.2"/>
    ))}
  </svg>
);

const Eraser = () => (
  <svg width="52" height="22" viewBox="0 0 52 22" fill="none">
    <rect width="52" height="22" rx="3" fill="#f2a07b"/>
    <rect x="36" y="0" width="16" height="22" rx="0 3 3 0" fill="#264653"/>
    <line x1="36" y1="0" x2="36" y2="22" stroke="#d4886a" strokeWidth="1"/>
  </svg>
);

const Scissors = () => (
  <svg width="28" height="68" viewBox="0 0 28 68" fill="none">
    {/* Handles */}
    <circle cx="8" cy="56" r="10" fill="none" stroke="#264653" strokeWidth="2.2"/>
    <circle cx="20" cy="56" r="10" fill="none" stroke="#264653" strokeWidth="2.2"/>
    {/* Blades */}
    <line x1="8" y1="46" x2="14" y2="20" stroke="#264653" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="20" y1="46" x2="14" y2="20" stroke="#264653" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Pivot */}
    <circle cx="14" cy="30" r="2.5" fill="#ea580c"/>
  </svg>
);

const Tape = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="26" fill="none" stroke="#264653" strokeWidth="5" opacity="0.7"/>
    <circle cx="28" cy="28" r="14" fill="none" stroke="#264653" strokeWidth="3" opacity="0.3"/>
    <circle cx="28" cy="28" r="8" fill="#FDFCF0"/>
    {/* Label strip */}
    <rect x="14" y="24" width="28" height="8" rx="1" fill="#fce4b3" opacity="0.6"/>
  </svg>
);

/* ─── Floating Stationery Layer ─── */

const stationeryItems = [
  { id: 'pencil-1',   Component: Pencil,      style: { top: '6%',   left: '4%'   }, cls: 'stat-item stat-pencil-1'   },
  { id: 'notebook-1', Component: Notebook,    style: { top: '8%',   right: '5%'  }, cls: 'stat-item stat-notebook-1' },
  { id: 'pen-1',      Component: FountainPen, style: { top: '18%',  left: '14%'  }, cls: 'stat-item stat-pen-1'      },
  { id: 'clip-1',     Component: PaperClip,   style: { bottom: '18%', left: '8%' }, cls: 'stat-item stat-clip-1'     },
  { id: 'seal-1',     Component: WaxSeal,     style: { bottom: '12%', left: '34%'}, cls: 'stat-item stat-seal-1'     },
  { id: 'ruler-1',    Component: Ruler,       style: { top: '42%',  left: '2%'   }, cls: 'stat-item stat-ruler-1'    },
  { id: 'ink-1',      Component: InkBottle,   style: { bottom: '8%',  right: '8%'}, cls: 'stat-item stat-ink-1'      },
  { id: 'paper-1',    Component: PaperSheet,  style: { top: '28%',  left: '6%'   }, cls: 'stat-item stat-paper-1'    },
  { id: 'eraser-1',   Component: Eraser,      style: { top: '72%',  right: '12%' }, cls: 'stat-item stat-eraser-1'   },
  { id: 'scissors-1', Component: Scissors,    style: { top: '14%',  right: '16%' }, cls: 'stat-item stat-scissors-1' },
  { id: 'tape-1',     Component: Tape,        style: { bottom: '22%', right: '4%'}, cls: 'stat-item stat-tape-1'     },
  { id: 'pencil-2',   Component: Pencil,      style: { bottom: '6%', left: '18%' }, cls: 'stat-item stat-pencil-2'   },
  { id: 'pen-2',      Component: FountainPen, style: { top: '6%',   right: '28%' }, cls: 'stat-item stat-pen-2'      },
  { id: 'clip-2',     Component: PaperClip,   style: { top: '55%',  right: '6%'  }, cls: 'stat-item stat-clip-2'     },
  { id: 'eraser-2',   Component: Eraser,      style: { bottom: '30%', left: '12%' }, cls: 'stat-item stat-eraser-2'   },
  { id: 'ruler-2',    Component: Ruler,       style: { bottom: '10%', right: '25%' }, cls: 'stat-item stat-ruler-2'   },
  { id: 'tape-2',     Component: Tape,        style: { top: '25%', right: '20%' }, cls: 'stat-item stat-tape-2'   },
  { id: 'ink-2',      Component: InkBottle,   style: { top: '35%', left: '18%' }, cls: 'stat-item stat-ink-2'   },
  { id: 'notebook-2', Component: Notebook,    style: { bottom: '40%', right: '15%' }, cls: 'stat-item stat-notebook-2'   },
  { id: 'scissors-2', Component: Scissors,    style: { bottom: '45%', left: '5%' }, cls: 'stat-item stat-scissors-2'   },
  { id: 'paper-2',    Component: PaperSheet,  style: { top: '60%', left: '22%' }, cls: 'stat-item stat-paper-2'   },
  { id: 'seal-2',     Component: WaxSeal,     style: { top: '80%', right: '35%' }, cls: 'stat-item stat-seal-2'   },
  { id: 'pencil-3',   Component: Pencil,      style: { top: '85%', left: '8%' }, cls: 'stat-item stat-pencil-3'   },
  { id: 'pen-3',      Component: FountainPen, style: { top: '50%', right: '8%' }, cls: 'stat-item stat-pen-3'   },
  { id: 'clip-3',     Component: PaperClip,   style: { top: '35%', left: '40%' }, cls: 'stat-item stat-clip-3'   },
  { id: 'ruler-3',    Component: Ruler,       style: { bottom: '5%', left: '45%' }, cls: 'stat-item stat-ruler-3'   },
  { id: 'paper-3',    Component: PaperSheet,  style: { top: '75%', right: '22%' }, cls: 'stat-item stat-paper-3'   },
  { id: 'tape-3',     Component: Tape,        style: { top: '15%', left: '30%' }, cls: 'stat-item stat-tape-3'   },
];

const FloatingStationery = () => (
  <div className="stationery-layer" aria-hidden="true">
    {stationeryItems.map(({ id, Component, style, cls }) => (
      <div key={id} className={cls} style={{ position: 'absolute', ...style }}>
        <Component />
      </div>
    ))}
  </div>
);

export default FloatingStationery;
