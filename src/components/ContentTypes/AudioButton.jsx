// AudioButton.jsx - Component for audio playback
import React, { useRef, useState } from 'react';
// Create AudioButton.css and uncomment this line
// import '../../styles/components/ContentTypes/AudioButton.css';

function AudioButton({ content, style, audioSrc }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
 
  function getEmoji(str) {
    if (!str || str.length === 0) {
      const emojis = ["🍄", "🌻", "🌵", "☘️", "🪅", "🍌", "🌳"];
      const randomIndex = Math.floor(Math.random() * emojis.length);
      return emojis[randomIndex];
    }
    const lastChar = str.slice(-1).toLowerCase();
    switch (lastChar) {
      case "a":
        return "🐏";
      case "b":
        return "🐿️";
      case "c":
        return "🐁";
      default:
        const emojis = ["🍄", "🌻", "🌵", "☘️", "🪅", "🍌", "🌳"];
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    }
  }
 
  function handlePlayClick() {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }
 
  function handleAudioEnded() {
    setIsPlaying(false);
  }
 
  // Use a span with display: inline or inline-block instead of a fragment
  return (
    <span className="audio-button-container" style={{ display: 'inline' }}>
      <span
        className={`audio-button ${isPlaying ? 'playing' : ''}`}
        onClick={handlePlayClick}
      >
        <span className={style}>{getEmoji(content)}</span>
      </span>
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleAudioEnded}
      />
    </span>
  );
}

export default AudioButton;