// src/components/ContentTypes/RefLink.jsx
import React, { useRef, useEffect } from 'react';
import '../../styles/components/ContentTypes/RefLink.css';

function RefLink({ content, style, onClick }) {
  const linkRef = useRef(null);
  
  // Function to determine which emoji to display
  function getEmoji(str) {
    if (!str || str.length === 0) {
      const emojis = ["🍄", "🌻", "🌵", "☘️", "🪅", "🍌", "🌳"];
      const randomIndex = Math.floor(Math.random() * emojis.length);
      return emojis[randomIndex];
    }

    const lastChar = str ? str.slice(-1).toLowerCase() : '';

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
  
  // Handle click event
  function handleClick() {
    if (onClick && content) {
      onClick(content);
      
      // Scroll to the new entry after a brief delay to ensure it's rendered
      setTimeout(() => {
        // Find the last entry and scroll to it
        const allEntries = document.querySelectorAll('.result');
        if (allEntries.length > 0) {
          const lastEntry = allEntries[allEntries.length - 1];
          lastEntry.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, 100);
    }
  }
  
  return (
    <span 
      ref={linkRef}
      className={`reflink ${style}`}
      onClick={handleClick}
      title={`Navigate to ${content}`}
    >
      <span className={style}>{getEmoji(content)}</span>
    </span>
  );
}

export default RefLink;
