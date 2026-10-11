import React, { useEffect, useRef } from 'react';

interface ClaudeCursorAuraProps {
  reducedMotion?: boolean;
}

export const ClaudeCursorAura: React.FC<ClaudeCursorAuraProps> = ({ reducedMotion = false }) => {
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const innerSpotlightRef = useRef<HTMLDivElement>(null);
  const secondaryAuraRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let outerX = mouseX;
    let outerY = mouseY;
    let innerX = mouseX;
    let innerY = mouseY;
    let spotX = mouseX;
    let spotY = mouseY;
    let secX = mouseX;
    let secY = mouseY;

    let t1X = mouseX, t1Y = mouseY;
    let t2X = mouseX, t2Y = mouseY;
    let t3X = mouseX, t3Y = mouseY;

    let isHoveringInteractive = false;
    let isPressed = false;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], .cursor-pointer'
        );
        isHoveringInteractive = Boolean(interactive);
      }
    };

    const handlePointerDown = () => {
      isPressed = true;
    };

    const handlePointerUp = () => {
      isPressed = false;
    };

    const animate = () => {
      outerX += (mouseX - outerX) * 0.14;
      outerY += (mouseY - outerY) * 0.14;

      innerX += (mouseX - innerX) * 0.25;
      innerY += (mouseY - innerY) * 0.25;

      spotX += (mouseX - spotX) * 0.08;
      spotY += (mouseY - spotY) * 0.08;

      secX += (mouseX - secX) * 0.04;
      secY += (mouseY - secY) * 0.04;

      t1X += (mouseX - t1X) * 0.18;
      t1Y += (mouseY - t1Y) * 0.18;

      t2X += (t1X - t2X) * 0.18;
      t2Y += (t1Y - t2Y) * 0.18;

      t3X += (t2X - t3X) * 0.18;
      t3Y += (t2Y - t3Y) * 0.18;

      const ringScale = isPressed ? 0.82 : isHoveringInteractive ? 1.5 : 1;
      const innerScale = isPressed ? 1.3 : isHoveringInteractive ? 0.65 : 1;

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${outerX - 24}px, ${outerY - 24}px, 0) scale(${ringScale})`;
        outerRingRef.current.style.borderColor = isHoveringInteractive
          ? 'rgba(245, 158, 11, 0.85)'
          : 'rgba(56, 189, 248, 0.45)';
        outerRingRef.current.style.boxShadow = isHoveringInteractive
          ? '0 0 28px rgba(245, 158, 11, 0.45), inset 0 0 12px rgba(245, 158, 11, 0.25)'
          : '0 0 18px rgba(56, 189, 248, 0.25)';
      }

      if (innerRingRef.current) {
        innerRingRef.current.style.transform = `translate3d(${innerX - 12}px, ${innerY - 12}px, 0) scale(${innerScale})`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0) scale(${
          isHoveringInteractive ? 1.4 : 1
        })`;
      }

      if (trail1Ref.current) {
        trail1Ref.current.style.transform = `translate3d(${t1X - 3}px, ${t1Y - 3}px, 0)`;
      }
      if (trail2Ref.current) {
        trail2Ref.current.style.transform = `translate3d(${t2X - 2.5}px, ${t2Y - 2.5}px, 0)`;
      }
      if (trail3Ref.current) {
        trail3Ref.current.style.transform = `translate3d(${t3X - 2}px, ${t3Y - 2}px, 0)`;
      }

      if (innerSpotlightRef.current) {
        innerSpotlightRef.current.style.transform = `translate3d(${spotX - 320}px, ${spotY - 320}px, 0)`;
      }

      if (secondaryAuraRef.current) {
        secondaryAuraRef.current.style.transform = `translate3d(${secX - 420}px, ${secY - 420}px, 0)`;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100] overflow-hidden hidden sm:block"
      aria-hidden="true"
    >
      <div
        ref={secondaryAuraRef}
        className="fixed top-0 left-0 w-[840px] h-[840px] rounded-full opacity-35 blur-3xl will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 70%)',
        }}
      />
      <div
        ref={innerSpotlightRef}
        className="fixed top-0 left-0 w-[640px] h-[640px] rounded-full opacity-45 blur-3xl will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 35%, transparent 70%)',
        }}
      />
      <div
        ref={trail3Ref}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-emerald-400/50 blur-[0.5px] will-change-transform"
      />
      <div
        ref={trail2Ref}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-sky-400/60 blur-[0.5px] will-change-transform"
      />
      <div
        ref={trail1Ref}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-amber-300/75 will-change-transform"
      />
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-sky-400/50 transition-colors duration-200 will-change-transform flex items-center justify-center"
      >
        <div className="w-full h-full rounded-full border border-dashed border-amber-400/35 animate-spin [animation-duration:8s]" />
      </div>
      <div
        ref={innerRingRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-amber-400/60 bg-amber-400/10 will-change-transform transition-transform duration-150"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,1)] will-change-transform transition-transform duration-150"
      />
    </div>
  );
};
