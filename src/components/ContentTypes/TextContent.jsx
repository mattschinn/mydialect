// src/components/ContentTypes/TextContent.jsx
import React from 'react';
import '../../styles/components/ContentTypes/TextContent.css';

function TextContent({ content, style }) {
  // For safety, check if content contains HTML
  const isHTML = /<[a-z][\s\S]*>/i.test(content);
  
  // Render HTML content safely
  if (isHTML) {
    return (
      <span 
        className={`entry-${style}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  // Render plain text
  return (
    <span className={`entry-${style}`}>
      {content}
    </span>
  );
}

export default TextContent;