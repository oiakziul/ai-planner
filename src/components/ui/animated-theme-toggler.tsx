import { useCallback, useRef } from "react"
import { RiMoonCloudyLine, RiSunCloudyFill } from 'react-icons/ri'
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { useTheme } from "@/context/ThemeContext" 
import { Atualizar } from "../../pages/componentes/Atualizar"

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  variant?: TransitionVariant
  fromCenter?: boolean
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => `${cx}px ${cy}px`).join(", ")
  return `polygon(${pairs})`
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  switch (variant) {
    case "circle":
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`]
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx)
      const halfH = Math.max(cy, viewportHeight - cy)
      const halfSide = Math.max(halfW, halfH) * 1.05
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.03
      const innerRatio = 0.42
      const starPolygon = (radius: number) => {
        const verts: string[] = []
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5
          verts.push(`${Math.round(cx + radius * Math.cos(outerA))}px ${Math.round(cy + radius * Math.sin(outerA))}px`)
          const innerA = outerA + Math.PI / 5
          verts.push(`${Math.round(cx + radius * innerRatio * Math.cos(innerA))}px ${Math.round(cy + radius * innerRatio * Math.sin(innerA))}px`)
        }
        return `polygon(${verts.join(", ")})`
      }
      return [starPolygon(Math.max(2, Math.round(R * 0.025))), starPolygon(Math.round(R))]
    }
    default:
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`]
  }
}

export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  variant = "circle",
  fromCenter = true,
  ...props
}: AnimatedThemeTogglerProps) => {
  const shape = variant
  const { theme, toggleTheme } = useTheme() as any; 
  const isDark = theme === "dark"
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x: number, y: number;

    if (fromCenter) {
      x = Math.round(viewportWidth / 2);
      y = Math.round(viewportHeight / 2);
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      x = Math.round(left + width / 2);
      y = Math.round(top + height / 2);
    }

    const maxRadius = Math.round(
      Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y))
    );

    if (typeof document.startViewTransition !== "function") {
      toggleTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      const clipPath = getThemeTransitionClipPaths(
        shape,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
      );
      document.documentElement.animate(
        { clipPath },
        {
          duration,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }, [shape, fromCenter, duration, toggleTheme])

  return (
    <div className={cn("flex items-center justify-center gap-4 text-3xl", className)}>
      <button
        type="button"
        ref={buttonRef}
        onClick={handleToggle}
        className="hover:scale-110 hover:text-textHoverHeader transition-all duration-500"
        {...props}
      >
        {isDark ? <RiSunCloudyFill className="" /> : <RiMoonCloudyLine />}
      </button> 
      <Atualizar />
    </div>
  )
}