import React, { useEffect,  useState } from "react";
import "./Background.css";
import type { BackgroundProps } from "../../constants/Background";
import { useBackgroundSettings } from "../../contexts/SettingsContext";

const IMAGE_COUNT = 10;

const Background: React.FC<BackgroundProps> = () => {
  const { backgroundSettings } = useBackgroundSettings();
  const [randomImage, setRandomImage] = useState<string>("");
  useEffect(() => {
    const images = Array.from({ length: IMAGE_COUNT }, (_, i) => `/assets/img/bg/${i}.jpg`);
    if (backgroundSettings.selectedImages.length > 0) {
      setRandomImage(backgroundSettings.selectedImages[Math.floor(Math.random() * backgroundSettings.selectedImages.length)]);
      return;
    }
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  return (
    <div className="background-container">
      <img src={randomImage} alt="Background" className="background-image" style={{ filter: `brightness(${backgroundSettings.brightness})` }} />
    </div>
  );
};

export default Background;
