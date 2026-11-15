import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { clsx } from 'clsx';
import { animate } from 'motion/react';
import './GlowingEffect.css';

interface GlowingEffectProps {
  /* Desenfoque del anillo de brillo, en px. */
  blur?: number;
  /* Fracción del radio mínimo de la tarjeta que queda inactiva en el centro. */
  inactiveZone?: number;
  /* px extra alrededor de la tarjeta para activar el brillo. */
  proximity?: number;
  /* Grados de apertura del arco visible del brillo. */
  spread?: number;
  /* Duración de la animación del ángulo de inicio, en segundos. */
  movementDuration?: number;
  /* Grosor del anillo, en px. */
  borderWidth?: number;
  /* Si true, no renderiza nada ni adjunta listeners (opt-in como en el original). */
  disabled?: boolean;
  className?: string;
}

/* Puerto a CSS plano del GlowingEffect de Aceternity UI (sin Tailwind ni Next.js).
   Anillo de brillo cónico con tokens AETEME que sigue la posición del puntero
   alrededor del borde de la tarjeta. Si el usuario prefiere movimiento reducido
   (prefers-reduced-motion: reduce), el componente no renderiza nada. */
const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  movementDuration = 2,
  borderWidth = 1,
  disabled = true,
  className,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMove = useCallback(
    (event?: PointerEvent) => {
      if (!containerRef.current) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const { left, top, width, height } = element.getBoundingClientRect();
        const mouseX = event?.x ?? lastPosition.current.x;
        const mouseY = event?.y ?? lastPosition.current.y;

        if (event) {
          lastPosition.current = { x: mouseX, y: mouseY };
        }

        const centerX = left + width * 0.5;
        const centerY = top + height * 0.5;
        const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty('--active', '0');
          return;
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;

        element.style.setProperty('--active', isActive ? '1' : '0');

        if (!isActive) return;

        const currentAngle = parseFloat(element.style.getPropertyValue('--start')) || 0;
        const targetAngle = (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;

        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty('--start', String(value));
          },
        });
      });
    },
    [inactiveZone, proximity, movementDuration],
  );

  useEffect(() => {
    if (disabled || reducedMotion) return;

    const handleScroll = () => handleMove();
    const handlePointerMove = (event: PointerEvent) => handleMove(event);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.body.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
      document.body.removeEventListener('pointermove', handlePointerMove);
    };
  }, [handleMove, disabled, reducedMotion]);

  if (disabled || reducedMotion) {
    return null;
  }

  const style = {
    '--blur': `${blur}px`,
    '--spread': spread,
    '--start': '0',
    '--active': '0',
    '--glowingeffect-border-width': `${borderWidth}px`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={clsx('glowing-effect', blur > 0 && 'glowing-effect--blurred', className)}
      style={style}
    >
      <div className="glowing-effect__glow" />
    </div>
  );
});

export default GlowingEffect;
