import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CursorState {
  x: number;
  y: number;
  isActive: boolean;
  isVisible: boolean;
  isHovering: boolean;
  hoverElement: string | null;
  isText: boolean;
}

export function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isActive: false,
    isVisible: false,
    isHovering: false,
    hoverElement: null,
    isText: false
  });
  
  // For smooth cursor movement
  const cursorRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    ease: 0.16,
  });
  
  // For tracking the previous position for trail effect
  const trailPositions = useRef<Array<{x: number, y: number}>>([]);
  const [trails, setTrails] = useState<Array<{x: number, y: number}>>([]);
  const trailCount = 5; // Number of trail elements
  
  // Animation frame ref
  const requestRef = useRef<number>();
  
  // Detect interactive elements for hover state
  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth < 768) return;
    
    // Initialize trail positions
    trailPositions.current = Array(trailCount).fill({ x: 0, y: 0 });
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.targetX = e.clientX;
      cursorRef.current.targetY = e.clientY;
      
      if (!cursor.isVisible) {
        setCursor(prev => ({ ...prev, isVisible: true }));
      }
    };
    
    const handleMouseDown = () => {
      setCursor(prev => ({ ...prev, isActive: true }));
    };
    
    const handleMouseUp = () => {
      setCursor(prev => ({ ...prev, isActive: false }));
    };
    
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.tagName === "BUTTON" || 
                       target.closest("button") || 
                       target.classList.contains("button") ||
                       target.getAttribute("role") === "button";
                       
      const isLink = target.tagName === "A" || target.closest("a");
      const isText = target.tagName === "P" || 
                     target.tagName === "H1" || 
                     target.tagName === "H2" || 
                     target.tagName === "H3" || 
                     target.tagName === "SPAN" || 
                     target.tagName === "LI";
      
      // Check for interactive elements
      if (isButton || isLink) {
        setCursor(prev => ({ 
          ...prev, 
          isHovering: true, 
          hoverElement: isButton ? 'button' : 'link',
          isText: false
        }));
      } else if (isText) {
        setCursor(prev => ({ 
          ...prev, 
          isText: true
        }));
      }
    };
    
    const handleMouseLeave = () => {
      setCursor(prev => ({ ...prev, isHovering: false, hoverElement: null, isText: false }));
    };
    
    // Set up event listeners for cursor state
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Add listeners to detect hover states on interactive elements
    document.querySelectorAll("a, button, .button, [role='button'], p, h1, h2, h3, span, li").forEach(element => {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
    });
    
    // Start animation loop
    startAnimation();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      document.querySelectorAll("a, button, .button, [role='button'], p, h1, h2, h3, span, li").forEach(element => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
      
      // Cancel animation frame on cleanup
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [cursor.isVisible]);
  
  const startAnimation = () => {
    const animateCursor = () => {
      // Smooth cursor movement with easing
      cursorRef.current.x += (cursorRef.current.targetX - cursorRef.current.x) * cursorRef.current.ease;
      cursorRef.current.y += (cursorRef.current.targetY - cursorRef.current.y) * cursorRef.current.ease;
      
      // Update cursor position state
      setCursor(prev => ({ 
        ...prev, 
        x: cursorRef.current.x, 
        y: cursorRef.current.y 
      }));
      
      // Update trail positions
      const newTrailPosition = { 
        x: cursorRef.current.x, 
        y: cursorRef.current.y 
      };
      
      // Update trail positions for trail effect
      trailPositions.current.unshift(newTrailPosition);
      trailPositions.current = trailPositions.current.slice(0, trailCount);
      setTrails([...trailPositions.current]);
      
      // Continue animation loop
      requestRef.current = requestAnimationFrame(animateCursor);
    };
    
    requestRef.current = requestAnimationFrame(animateCursor);
  };
  
  // Don't render anything on mobile
  if (!cursor.isVisible || window.innerWidth < 768) return null;
  
  // Calculate sizes and states based on cursor state
  const cursorSize = cursor.isHovering ? 56 : cursor.isActive ? 16 : 24;
  const cursorOpacity = cursor.isHovering ? 0.7 : 0.5;
  const cursorBorder = cursor.isHovering ? "2px solid rgba(255, 255, 255, 0.8)" : "none";
  const cursorBackgroundColor = cursor.isHovering 
    ? "rgba(139, 92, 246, 0.2)" 
    : cursor.isActive 
      ? "#8b5cf6" 
      : "rgba(139, 92, 246, 0.5)";
  
  // Text indicator style
  const textIndicatorScale = cursor.isText ? 1 : 0;
  
  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="custom-cursor"
        style={{
          position: "fixed",
          left: cursor.x,
          top: cursor.y,
          width: cursorSize,
          height: cursorSize,
          borderRadius: "50%",
          border: cursorBorder,
          backgroundColor: cursorBackgroundColor,
          backdropFilter: cursor.isHovering ? "blur(4px)" : "none",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
          opacity: cursorOpacity,
          transition: { 
            type: "spring", 
            stiffness: 500, 
            damping: 28,
            opacity: { duration: 0.2 } 
          }
        }}
        initial={false}
      >
        {cursor.hoverElement === 'button' && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ fontSize: "10px", color: "white" }}
          >
            Click
          </motion.span>
        )}
      </motion.div>

      {/* Text indicator dot */}
      <motion.div
        className="text-indicator"
        style={{
          position: "fixed",
          left: cursor.x,
          top: cursor.y,
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#fff",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)"
        }}
        animate={{
          scale: textIndicatorScale,
          opacity: cursor.isText ? 1 : 0,
        }}
      />
      
      {/* Cursor trails */}
      {trails.map((trail, index) => (
        <motion.div
          key={index}
          className="cursor-trail"
          style={{
            position: "fixed",
            left: trail.x,
            top: trail.y,
            width: Math.max(4, 12 - index * 2),
            height: Math.max(4, 12 - index * 2),
            borderRadius: "50%",
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            pointerEvents: "none",
            zIndex: 9998,
            opacity: 1 - (index / (trailCount + 2)),
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
      
      {/* Magnetic field for buttons and links - purely visual */}
      {cursor.isHovering && (
        <motion.div
          className="magnetic-field"
          style={{
            position: "fixed",
            left: cursor.x,
            top: cursor.y,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 9997,
            transform: "translate(-50%, -50%)"
          }}
          animate={{
            width: 120,
            height: 120,
            opacity: [0.15, 0.1, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-600/20 rounded-full" />
        </motion.div>
      )}
    </>
  );
}