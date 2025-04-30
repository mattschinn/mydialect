// src/components/ContentTypes/InlineGlossedText.jsx
import React from 'react';
import GlossedText from './GlossedText';

function InlineGlossedText({ content, style, folderPath }) {
  // This wrapper component ensures proper styling when the glossed text is used inline
  return (
    <div className="glossed-inline-wrapper" style={{ marginBottom: '12px' }}>
      <GlossedText content={content} style={style} folderPath={folderPath} />
    </div>
  );
}

export default InlineGlossedText;
