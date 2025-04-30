// src/components/ContentTypes/Separator.jsx
import React from 'react';
import '../../styles/components/ContentTypes/Separator.css';

function Separator({ content }) {
  // Return different separator based on content
  if (content === "*") {
    return (
      <div className="asterisk-separator">⁎⁎⁎</div>
    );
  }
  
  // Default newline
  return <br />;
}

export default Separator;

