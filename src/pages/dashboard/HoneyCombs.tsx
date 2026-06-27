'use client';

import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

// ─── CONFIGURAÇÃO DE CORES GRADIENTES ORIGINAIS ───────────────────────────────
const COLOR_GRADIENTS = [
  { light: '#5ba8f5', dark: '#1e4080' }, // 0: Swift
  { light: '#4ed9be', dark: '#136353' }, // 1: JavaScript
  { light: '#f2ac49', dark: '#a35615' }, // 2: HTML/CSS
  { light: '#e86493', dark: '#7d1540' }, // 3: Fortran
  { light: '#499ee6', dark: '#0d3d73' }, // 4: Ruby
  { light: '#26d9d9', dark: '#006b6b' }, // 5: SQL
  { light: '#f282a2', dark: '#941c45' }, // 6: Java
  { light: '#f29172', dark: '#91351a' }, // 7: Node.js
  { light: '#9188f0', dark: '#4232b3' }, // 8: TypeScript
  { light: '#b388ff', dark: '#4a148c' }, // 9: C#
  { light: '#a1abab', dark: '#3c4848' }, // 10: C
  { light: '#f56e6e', dark: '#8a1717' }, // 11: C++
  { light: '#e87d7d', dark: '#8f2929' }, // 12: PHP
  { light: '#4ee64e', dark: '#0b5e0b' }, // 13: Bash
  { light: '#4ed9f0', dark: '#005b70' }, // 14: Go
  { light: '#f2a15a', dark: '#85420a' }  // 15: Rust
];

// ─── BASE DE DADOS DO SEU LAYOUT ORIGINAL ─────────────────────────────────────
const DATA = [
  { name: 'Swift',      value: 56.07, grid: [1, 0] },
  { name: 'JavaScript', value: 64.96, grid: [2, 0] },
  { name: 'HTML/CSS',   value: 50.07, grid: [3, 0] },
  { name: 'Fortran',    value: 46.07, grid: [4, 0] },
  
  { name: 'Ruby',       value: 18.20, grid: [1, 1] }, 
  { name: 'SQL',        value: 47.08, grid: [2, 1] },
  { name: 'Java',       value: 35.35, grid: [3, 1] },
  { name: 'Node.js',    value: 33.91, grid: [4, 1] },
  
  { name: 'TypeScript', value: 30.19, grid: [1, 2] },
  { name: 'C#',         value: 27.86, grid: [2, 2] },
  { name: 'Bash',       value: 20.13, grid: [3, 2] },
  { name: 'C++',        value: 24.31, grid: [4, 2] },
  
  { name: 'PHP',        value: 23.98, grid: [1, 3] }, 
  { name: 'C',          value: 28.01, grid: [2, 3] }, 
  { name: 'Go',         value: 17.50, grid: [3, 3] }, 
  { name: 'Rust',       value: 13.20, grid: [4, 3] }, 
];

const COL_MIN = 1;
const COL_MAX = 4.5;
const ROW_MIN = 0;
const ROW_MAX = 3;

// ─── FUNÇÃO MATEMÁTICA PARA OS VÉRTICES DO HEXÁGONO ───────────────────────────
function getPoints(centerX: number, centerY: number, radius: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${centerX + radius * Math.cos(a)},${centerY + radius * Math.sin(a)}`);
  }
  return pts.join(' ');
}

export const Honeycombs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dim, setDim] = useState({ width: 800, height: 500 });
  const isMobile = dim.width < 768;

  // ─── CÁLCULO DE GRIDS E PROPORÇÕES ADAPTATIVAS ──
  const layout = useMemo(() => {
    const padding = isMobile ? 8 : 16;
    const hexGap = isMobile ? 1.5 : 2.5;

    const availW = Math.max(dim.width - padding * 2, 10);
    const availH = Math.max(dim.height - padding * 2, 10);

    const colsCount = COL_MAX - COL_MIN + 1;
    const rowsCount = ROW_MAX - ROW_MIN + 1;

    const rByW = availW / (colsCount * Math.sqrt(3));
    const rByH = availH / (rowsCount * 1.42 + 0.5);
    
    // 🌟 LIMITAÇÃO DO RAIO NO MOBILE: Encolhe os hexágonos de forma segura no celular
    const maxR = isMobile ? Math.min(availW / 7.6, 48) : 100;
    const r = Math.min(rByW, rByH, maxR);

    const drawR = Math.max(r - hexGap, 1);
    const hexWidth = Math.sqrt(3) * r;
    const hexHeight = r * 1.5;

    const canvasCenterX = dim.width / 2;
    const canvasCenterY = dim.height / 2;

    const clusterCenterX = ((COL_MIN + COL_MAX) / 2) * hexWidth;
    const clusterCenterY = ((ROW_MIN + ROW_MAX) / 2) * hexHeight;

    const offsetX = canvasCenterX - clusterCenterX;
    const offsetY = canvasCenterY - clusterCenterY;

    return { drawR, hexWidth, hexHeight, offsetX, offsetY };
  }, [dim, isMobile]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ─── COMPILAÇÃO MATEMÁTICA DAS CÉLULAS ─────────
  const cells = useMemo(() => {
    const { drawR, hexWidth, hexHeight, offsetX, offsetY } = layout;

    let fName = 12;
    let fVal  = 11;

    if (isMobile) {
      fName = Math.max(drawR * 0.28, 10);
      fVal  = Math.max(drawR * 0.22, 9);
    } else {
      fName = Math.max(drawR * 0.24, 13);
      fVal  = Math.max(drawR * 0.18, 11);
    }

    const borderThickness = isMobile ? Math.max(drawR * 0.04, 1) : Math.max(drawR * 0.04, 2);

    return DATA.map((item, i) => {
      const [col, row] = item.grid;

      let cx = col * hexWidth + offsetX;
      if (row % 2 !== 0) cx += hexWidth / 2;
      const cy = row * hexHeight + offsetY;

      const normalPts = getPoints(cx, cy, drawR);

      const pushOffsetCalculated = isMobile ? Math.max(drawR * 0.04, 1.2) : 4;
      const hoverTranslateY = pushOffsetCalculated * 0.4;
      const hoverScale = 0.98;

      const tyName = cy - fName * 0.99;
      const tyVal = cy + fVal * 0.75;

      const gradId = `hgrad-${i}`;
      const borderGradId = `bgrad-${i}`;
      const borderPressedId = `bgrad-pressed-${i}`;
      const shadowId = `drop-${i}`;
      const cavityShId = `cavity-sh-${i}`;

      const { light, dark } = COLOR_GRADIENTS[i % COLOR_GRADIENTS.length];

      return {
        i, item, cx, cy,
        normalPts,
        hoverTranslateY,
        hoverScale,
        gradId, borderGradId, borderPressedId, shadowId, cavityShId,
        light, dark,
        fName, fVal, borderThickness,
        tyName, tyVal,
        drawR,
      };
    });
  }, [layout, isMobile]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) setDim({ width, height });

    const ro = new ResizeObserver(entries => {
      const r = entries[0]?.contentRect;
      if (r && r.width > 0 && r.height > 0) {
        setDim({ width: r.width, height: r.height });
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMouseEnter = useCallback((i: number) => setHoveredIndex(i), []);
  const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: isMobile ? '280px' : '380px', display: 'block', overflow: 'hidden' }}
    >
      <svg
        width={dim.width}
        height={dim.height}
        style={{ display: 'block' }}
      >
        <defs>
          {cells.map(c => (
            <g key={`defs-${c.i}`}>
              <linearGradient id={c.gradId} x1="0.2" y1="0" x2="0.8" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor={c.light} />
                <stop offset="1" stopColor={c.dark} />
              </linearGradient>
              
              <linearGradient id={`${c.gradId}-p`} x1="0.3" y1="0" x2="0.7" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor={c.dark} />
                <stop offset="1" stopColor={c.light} />
              </linearGradient>
              
              {/* BORDA CRISTALINA */}
              <linearGradient id={c.borderGradId} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0"   stopColor={isDark ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.85)"} />
                <stop offset="0.2" stopColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"} />
                <stop offset="0.6" stopColor={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)"} />
                <stop offset="1"   stopColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.6)"} />
              </linearGradient>
              
              {/* BORDA PRESSIONADA */}
              <linearGradient id={c.borderPressedId} x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0"   stopColor={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.8)"} />
                <stop offset="0.6" stopColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"} />
                <stop offset="1"   stopColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.6)"} />
              </linearGradient>
              
              <filter id={c.shadowId} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx={0} dy={isMobile ? 2 : 6}
                  stdDeviation={isMobile ? 3 : 8}
                  floodColor={isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,40,80,0.2)'}
                />
              </filter>
              
              <filter id={`${c.shadowId}-p`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx={0} dy={isMobile ? 0.5 : 1.5}
                  stdDeviation={isMobile ? 1.5 : 3}
                  floodColor={isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)'}
                />
              </filter>
              
              <filter id={c.cavityShId} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx={0} dy={isMobile ? 1 : 3}
                  stdDeviation={isMobile ? 1.5 : 5}
                  floodColor={isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.15)'}
                />
              </filter>
            </g>
          ))}
        </defs>

        {/* 🌟 GRUPO CENTRALIZADO DINAMICAMENTE: Alinhamento vertical e horizontal corrigido para mobile */}
        <g transform="translate(0, 0)">
          {cells.map(c => {
            const isHovered = hoveredIndex === c.i;
            const activeGrad = isHovered ? `url(#${c.gradId}-p)` : `url(#${c.gradId})`;
            const activeBord = isHovered ? `url(#${c.borderPressedId})` : `url(#${c.borderGradId})`;
            const activeSh   = isHovered ? `url(#${c.shadowId}-p)` : `url(#${c.shadowId})`;

            const cavityNormalFill = isDark ? '#121214' : '#e4e7eb';
            const cavityEmphasisFill = isDark ? '#09090b' : '#d1d5db';
            const cavityFill = isHovered ? cavityEmphasisFill : cavityNormalFill;
            const cavityStroke = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

            return (
              <g
                key={c.i}
                onMouseEnter={() => handleMouseEnter(c.i)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                {/* CAVIDADE MECÂNICA */}
                <polygon
                  points={c.normalPts}
                  fill={cavityFill}
                  stroke={cavityStroke}
                  strokeWidth={1}
                  filter={`url(#${c.cavityShId})`}
                />

                {/* BLOCO PRINCIPAL */}
                <polygon
                  points={c.normalPts}
                  fill={activeGrad}
                  stroke={activeBord}
                  strokeWidth={c.borderThickness}
                  filter={activeSh}
                  style={{
                    transformOrigin: `${c.cx}px ${c.cy}px`,
                    transform: isHovered
                      ? `translate(0px, ${c.hoverTranslateY}px) scale(${c.hoverScale})`
                      : 'translate(0px, 0px) scale(1)',
                    transition: 'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                    willChange: 'transform',
                  }}
                />

                {/* TEXTO */}
                <g
                  style={{
                    transformOrigin: `${c.cx}px ${c.cy}px`,
                    transform: isHovered
                      ? `translate(0px, ${c.hoverTranslateY * 0.5}px)`
                      : 'translate(0px, 0px)',
                    transition: 'transform 200ms cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                    willChange: 'transform',
                  }}
                >
                  <text
                    x={c.cx}
                    y={c.tyName}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={c.fName}
                    fontWeight={600}
                    fontFamily="'Geist', 'Inter', sans-serif"
                    style={{
                      textShadow: '0 1.5px 3px rgba(0,0,0,0.55)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {c.item.name}
                  </text>

                  <text
                    x={c.cx}
                    y={c.tyVal}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(255,255,255,0.92)"
                    fontSize={c.fVal}
                    fontWeight={700}
                    fontFamily="'Geist', 'Inter', sans-serif"
                    style={{
                      textShadow: '0 1.5px 3.5px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {`${c.item.value}%`}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        <style>{`
          polygon, g {
            transition: all 200ms cubic-bezier(0.2, 0.9, 0.4, 1.1);
          }
        `}</style>
      </svg>
    </div>
  );
};