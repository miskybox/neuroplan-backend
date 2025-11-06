import { useState, useCallback, useEffect } from "react";
import { logger } from "@/utils/logger";

/**
 * Custom hook for text-to-speech functionality
 * Provides speech synthesis capabilities with play/pause control
 */
export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    setIsSupported("speechSynthesis" in globalThis);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) {
        logger.warn("Speech synthesis is not supported in this browser");
        return;
      }

      // Stop any current speech
      globalThis.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure speech settings
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = "es-ES"; // Spanish language

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        logger.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
      };

      globalThis.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stopSpeaking = useCallback(() => {
    if (isSupported) {
      globalThis.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    isSupported,
  };
};
