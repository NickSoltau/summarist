"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function PlayerPage() {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="player__page">
      <h1 className="player__book--title">{book.title}</h1>
      <p className="player__book--author">{book.author}</p>
      <div className="player__summary" style={{ whiteSpace: "pre-line" }}>
        {book.summary}
      </div>
      <audio
        ref={audioRef}
        src={book.audioLink}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />
      <div className="player__bar">
        <img src={book.imageLink} alt={book.title} className="player__bar--img" />
        <div className="player__bar--info">
          <span className="player__bar--title">{book.title}</span>
          <span className="player__bar--author">{book.author}</span>
        </div>
        <div className="player__bar--controls">
          <button className="player__btn" onClick={() => handleSkip(-10)}>⏪ 10</button>
          <button className="player__btn player__btn--play" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="player__btn" onClick={() => handleSkip(10)}>10 ⏩</button>
        </div>
        <div className="player__bar--progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = Number(e.target.value);
              setCurrentTime(Number(e.target.value));
            }}
            className="player__progress"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}