import React, { useState, useRef, useEffect } from 'react';

interface TimeDrumProps {
  total: number;
  value: number;
  onChange: (val: number) => void;
  step?: number;
}

function getWindow(current: number, total: number, step: number): number[] {
  return [-2, -1, 0, 1, 2].map((offset) => {
    let v = current + offset * step;
    return ((v % total) + total) % total;
  });
}

function TimeDrum({ total, value, onChange, step = 1 }: TimeDrumProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef(0);

  const windowValues = getWindow(value, total, step);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        onChange((((value + step) % total) + total) % total);
      } else if (e.deltaY < 0) {
        onChange((((value - step) % total) + total) % total);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [value, total, step, onChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartY.current = e.clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;

    // Threshold de 20px
    if (Math.abs(deltaY) > 20) {
      const units = Math.floor(Math.abs(deltaY) / 20);
      const direction = deltaY > 0 ? -1 : 1; // Down = scroll up (previous value)

      let nextValue = value + direction * units * step;
      nextValue = ((nextValue % total) + total) % total;

      onChange(nextValue);
      const remainder = deltaY % 20;
      dragStartY.current = e.clientY - remainder;
      setDragOffset(remainder);
    } else {
      setDragOffset(deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[200px] w-14 overflow-hidden cursor-ns-resize flex items-center justify-center select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* Highlight bar no centro */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-[40px] border-t-[0.5px] border-b-[0.5px] border-emerald-500/40 pointer-events-none" />

      {/* Fades nas bordas */}
      <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      {/* Track */}
      <div
        className="flex flex-col items-center w-full"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {windowValues.map((val, idx) => {
          const offset = idx - 2;
          const isCenter = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;
          const isExtreme = Math.abs(offset) === 2;

          let fontSize = 'text-[26px]';
          let fontWeight = 'font-medium';
          let textColor = 'text-emerald-600';
          let opacity = 'opacity-100';

          if (isAdjacent) {
            fontSize = 'text-[20px]';
            fontWeight = 'font-normal';
            textColor = 'text-gray-500';
            opacity = 'opacity-80';
          } else if (isExtreme) {
            fontSize = 'text-[17px]';
            fontWeight = 'font-normal';
            textColor = 'text-gray-300';
            opacity = 'opacity-40';
          }

          return (
            <div
              key={`${idx}-${val}`}
              className={`h-[40px] w-full flex items-center justify-center tabular-nums leading-none transition-all duration-150 ${fontSize} ${fontWeight} ${textColor} ${opacity}`}
            >
              {String(val).padStart(2, '0')}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface TimePickerProps {
  label: string;
  value: { hour: number; minute: number };
  onChange: (value: { hour: number; minute: number }) => void;
  minuteStep?: number;
}

export function TimePicker({ label, value, onChange, minuteStep = 1 }: TimePickerProps) {
  const setHour = (h: number) => onChange({ ...value, hour: h });
  const setMinute = (m: number) => onChange({ ...value, minute: m });

  return (
    <div className="flex flex-col">
      {label && <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-3 ml-1">{label}</span>}
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-2xl p-2 w-fit shadow-inner">
        <TimeDrum total={24} value={value.hour} onChange={setHour} step={1} />
        <span className="text-xl font-bold text-gray-400 pb-1">:</span>
        <TimeDrum total={60} value={value.minute} onChange={setMinute} step={minuteStep} />
      </div>
    </div>
  );
}
