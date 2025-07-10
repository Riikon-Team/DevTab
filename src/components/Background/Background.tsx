import React, { useEffect, useState, useRef } from "react";
import "./Background.css";
import { useBackgroundSettings } from "../../hooks/useSettings";
import { IMAGE_LIST } from "../../constants/Background";

const Background: React.FC = () => {
  const { backgroundSettings } = useBackgroundSettings();
  const [backgroundSrc, setBackgroundSrc] = useState<string>("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (backgroundSettings.customUrl) {
      setBackgroundSrc(backgroundSettings.customUrl);
      return;
    }
    
    const images = backgroundSettings.selectedImages.length > 0 
      ? backgroundSettings.selectedImages 
      : IMAGE_LIST;
    
    setBackgroundSrc(images[Math.floor(Math.random() * images.length)]);
  }, [backgroundSettings.customUrl, backgroundSettings.selectedImages]);
  
  useEffect(() => {
    if (!backgroundSettings.enableGyro) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [backgroundSettings.enableGyro]);
  
  const getTransformStyle = () => {
    if (!backgroundSettings.enableGyro) return {};
    
    const sensitivity = backgroundSettings.gyroSensitivity / 10; 
    const translateX = -mousePosition.x * 20 * sensitivity;
    const translateY = -mousePosition.y * 20 * sensitivity;
    
    return {
      transform: `scale(1.1) translate(${translateX}px, ${translateY}px)`,
      transition: 'transform 0.1s ease-out'
    };
  };
  
  const isVideo = backgroundSettings.contentType === 'video' || 
                 (backgroundSrc && /\.(mp4|webm|ogg)$/i.test(backgroundSrc));
  
  return (
    <div 
      className="background-container" 
      ref={containerRef} 
      data-gyro={backgroundSettings.enableGyro}
    >
      {isVideo ? (
        <video 
          className="background-video"
          src={backgroundSrc}
          autoPlay
          loop
          muted
          playsInline
          style={{ 
            filter: `brightness(${backgroundSettings.brightness})`,
            ...getTransformStyle()
          }}
        />
      ) : (
        <img 
          src={backgroundSrc} 
          alt="Background" 
          className="background-image"
          style={{ 
            filter: `brightness(${backgroundSettings.brightness})`,
            ...getTransformStyle()
          }} 
        />
      )}
    </div>
  );
};

export default Background;
