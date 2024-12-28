import { useEffect, useState } from "react";

interface TypingAnimationProps {
  content: string;
  onComplete: () => void;
}

export const TypingAnimation = ({ content, onComplete }: TypingAnimationProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust typing speed here

      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [content, currentIndex, onComplete]);

  return <>{displayedContent}</>;
};