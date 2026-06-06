import { useState, useEffect } from "react";

export default function useAudioDuration(audioLink: string) {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!audioLink) return;

    const audio = new Audio(audioLink);
    audio.addEventListener("loadedmetadata", () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    });

    return () => {
      audio.src = "";
    };
  }, [audioLink]);

  return duration;
}