
// src/components/EntryContainer.jsx - Now using the hybrid approach with decentralized configs
import React from 'react';
import EntryImage from './EntryImage';
import EntryContent from './EntryContent';
import '../styles/components/EntryContainer.css';

function EntryContainer({ entry, folderPath, contents, onRefLink }) {
  return (
    <div className="result">
      <div className="entry-container">
        <div className="entry-left">
          <EntryImage src={`${folderPath}img.png`} alt={entry.name} />
        </div>
        <div className="entry-right">
          {contents.map((content, index) => (
            <EntryContent
              key={`content-${index}`}
              content={content}
              folderPath={folderPath}
              onRefLink={onRefLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EntryContainer;