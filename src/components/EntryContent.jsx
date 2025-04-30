// src/components/EntryContent.jsx
import React from 'react';
import TextContent from './ContentTypes/TextContent';
import AudioButton from './ContentTypes/AudioButton';
import GlossedText from './ContentTypes/GlossedText';
import InlineGlossedText from './ContentTypes/InlineGlossedText';
import RefLink from './ContentTypes/RefLink';
import Separator from './ContentTypes/Separator';
import '../styles/components/EntryContent.css';

function EntryContent({ content, folderPath, onRefLink }) {
  // Select the appropriate component based on content type
  switch (content.type) {
    case "html":
      // Use className to apply CSS styles for inline display
      return (
        <span className="entry-content entry-content-html">
          <TextContent content={content.content} style={content.style} />
        </span>
      );
     
    case "audio":
    case "dialogue":
      // Apply the CSS class that has the inline-block display property
      return (
        <span className="entry-content entry-content-audio" style={{ display: 'inline' }}>
          <AudioButton
            content={content.content}
            style={content.style}
            audioSrc={`${folderPath}audio${content.content}.mp3`}
          />
        </span>
      );
     
    case "glossed":
      // Pass the folderPath to GlossedText for audio handling
      return (
        <span className="entry-content entry-content-glossed" style={{ display: 'inline' }}>
          <InlineGlossedText
            content={content.content}
            style={content.style}
            folderPath={folderPath}
          />
        </span>
      );
     
    case "newline":
      return <Separator content={content.content} className="entry-content entry-content-newline" />;
     
    case "reflink":
      return (
        <span className="entry-content entry-content-reflink">
          <RefLink
            content={content.content}
            style={content.style}
            onClick={onRefLink}
          />
        </span>
      );
     
    default:
      return (
        <div className="entry-content unknown-content-type">
          Unknown content type: {content.type}
        </div>
      );
  }
}

export default EntryContent;
