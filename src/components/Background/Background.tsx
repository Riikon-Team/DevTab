import React, { useEffect,  useState } from "react";
import "./Background.css";
import type { BackgroundProps } from "../../constants/Background";

const IMAGE_COUNT = 10;

const Background: React.FC<BackgroundProps> = ({ brightness = 0.5, selectImage = [] }) => {
  const [randomImage, setRandomImage] = useState<string>("");
  useEffect(() => {
    const images = Array.from({ length: IMAGE_COUNT }, (_, i) => `/assets/img/bg/${i}.jpg`);
    if (selectImage.length > 0) {
      setRandomImage(selectImage[Math.floor(Math.random() * selectImage.length)]);
      return;
    }
    setRandomImage(images[Math.floor(Math.random() * images.length)]);
  }, []);

  return (
    <div className="background-container">
      <img src={randomImage} alt="Background" className="background-image" style={{ filter: `brightness(${brightness})` }} />
    </div>
  );
};

export default Background;
