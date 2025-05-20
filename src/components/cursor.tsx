
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.innerWidth < 768) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible]);
  
  if (!isVisible || window.innerWidth < 768) return null;
  
  return (
    <motion.div
      className="custom-cursor bg-purple"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        position: "fixed",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)"
      }}
      animate={{
        scale: isActive ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}
