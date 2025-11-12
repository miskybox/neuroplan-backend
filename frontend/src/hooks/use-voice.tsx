import { useState, useCallback, useEffect } from "react";
import { logger } from "../utils/logger";

/**
 * Custom hook for text-to-speech functionality
 * Provides speech synthesis capabilities with play/pause control
 */
export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const getSpeechSynthesis = (): SpeechSynthesis | undefined => {
    if (
      typeof globalThis !== "undefined" &&
      (globalThis as unknown as { speechSynthesis?: SpeechSynthesis })
        .speechSynthesis
    ) {
      return (globalThis as unknown as { speechSynthesis: SpeechSynthesis })
        .speechSynthesis;
    }
    return undefined;
  };

  // Check if speech synthesis is supported
  useEffect(() => {
    const supported =
      typeof globalThis !== "undefined" &&
      !!(globalThis as unknown as { speechSynthesis?: SpeechSynthesis })
        .speechSynthesis &&
      typeof (globalThis as unknown as { SpeechSynthesisUtterance?: unknown })
        .SpeechSynthesisUtterance === "function";

    setIsSupported(supported);
    if (!supported) {
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      const synth = getSpeechSynthesis();

      if (!isSupported || !synth) {
        logger.warn("Speech synthesis is not supported in this browser");
        return;
      }

      // Stop any current speech
      synth.cancel();

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

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        logger.error("Speech synthesis error:", event.error);
        setIsSpeaking(false);
      };

      synth.speak(utterance);
    },
    [isSupported]
  );

  const stopSpeaking = useCallback(() => {
    const synth = getSpeechSynthesis();
    if (isSupported && synth) {
      synth.cancel();
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
