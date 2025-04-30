// GlossedText.jsx - Component for glossed text with hover functionality
import React, { useState, useEffect, useRef } from 'react';
import AudioButton from './AudioButton';
import '../../styles/components/ContentTypes/GlossedText.css';

function GlossedText({ content, style, folderPath }) {
  const containerRef = useRef(null);
  const [parsedContent, setParsedContent] = useState({
    originalText: [],
    glossText: [],
    translation: ''
  });
  const [audioIds, setAudioIds] = useState([]);
  const [showDividers, setShowDividers] = useState(false);
  const sectionId = useRef(`glossed-${Math.random().toString(36).substring(2, 10)}`);
  
  // Parse the glossed content when it changes
  useEffect(() => {
    // Check if content is a string (old format) or an object (new format)
    if (typeof content === 'object' && content !== null) {
      // Handle new format with object structure
      const glossed = content.glossed || '';
      const parse = content.parse || '';
      const translation = content.translation || '';
      const dividers = content.dividers === 'true' || content.dividers === true;
      
      // Replace backticks with commas and pipes with new lines in all strings
      const processedGlossed = glossed.replace(/`/g, ',').replace(/\|/g, '\n');
      const processedParse = parse.replace(/`/g, ',').replace(/\|/g, '\n');
      const processedTranslation = translation.replace(/`/g, ',').replace(/\|/g, '\n');
      
      // Instead of removing audio IDs first, let's track their presence alongside parentheses
      const parseWithAudio = parseWithAudioMarkers(processedGlossed);
      
      setParsedContent({
        originalText: parseWithAudio,
        glossText: parseParentheses(processedParse),
        translation: processedTranslation
      });
      setShowDividers(dividers);
      setAudioIds([]); // We no longer need separate audioIds
    } else if (typeof content === 'string') {
      // Handle old pipe-delimited format for backward compatibility
      const processedContent = content.replace(/`/g, ',');
      const parts = processedContent.split('|');
      
      if (parts.length >= 2) {
        const string1 = parts[0].trim().replace(/\|/g, '\n');
        const string2 = parts[1].trim().replace(/\|/g, '\n');
        const string3 = parts.length >= 3 ? parts[2].trim().replace(/\|/g, '\n') : '';
        
        // Parse with audio markers for the first string
        const parseWithAudio = parseWithAudioMarkers(string1);
        
        setParsedContent({
          originalText: parseWithAudio,
          glossText: parseParentheses(string2),
          translation: string3
        });
        setAudioIds([]);
        setShowDividers(false);
      }
    }
  }, [content]);
  
  // New function that handles both parentheses and audio markers in one pass
  function parseWithAudioMarkers(str) {
    if (!str) return [];
    
    // Handle line breaks first
    const lines = str.split('\n');
    const result = [];
    
    lines.forEach((line, lineIndex) => {
      // Add a line break before each line (except the first)
      if (lineIndex > 0) {
        result.push({ isLineBreak: true });
      }
      
      // Process the line character by character to handle both parentheses and audio markers
      let currentText = '';
      let inParens = false;
      let parensContent = '';
      let parensCount = 0;
      let inAudio = false;
      let audioContent = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // Handle audio markers
        if (char === '{' && !inAudio) {
          // Start of audio marker
          if (currentText) {
            result.push({
              text: currentText,
              isParens: false,
              index: -1
            });
            currentText = '';
          }
          inAudio = true;
          continue;
        }
        
        if (char === '}' && inAudio) {
          // End of audio marker
          result.push({
            isAudio: true,
            audioId: audioContent
          });
          audioContent = '';
          inAudio = false;
          continue;
        }
        
        if (inAudio) {
          // Inside audio marker
          audioContent += char;
          continue;
        }
        
        // Handle parentheses
        if (char === '(' && !inParens) {
          // Start of parentheses
          if (currentText) {
            result.push({
              text: currentText,
              isParens: false,
              index: -1
            });
            currentText = '';
          }
          inParens = true;
          continue;
        }
        
        if (char === ')' && inParens) {
          // End of parentheses
          result.push({
            text: parensContent,
            isParens: true,
            index: parensCount++
          });
          parensContent = '';
          inParens = false;
          continue;
        }
        
        // Inside parentheses or normal text
        if (inParens) {
          parensContent += char;
        } else {
          currentText += char;
        }
      }
      
      // Add any remaining text
      if (currentText) {
        result.push({
          text: currentText,
          isParens: false,
          index: -1
        });
      }
    });
    
    return result;
  }
  
  // Function to parse content in parentheses with improved handling of line breaks
  function parseParentheses(str) {
    if (!str) return [];
    
    // Handle line breaks first
    const lines = str.split('\n');
    const result = [];
    
    lines.forEach((line, lineIndex) => {
      // Add a line break before each line (except the first)
      if (lineIndex > 0) {
        result.push({ isLineBreak: true });
      }
      
      let currentPos = 0;
      let parensCount = 0;
      
      // Regular expression to match content in parentheses
      const parensRegex = /\(([^)]+)\)/g;
      let match;
      
      while ((match = parensRegex.exec(line)) !== null) {
        // If there's text before the parentheses, add it
        if (match.index > currentPos) {
          result.push({
            text: line.substring(currentPos, match.index),
            isParens: false,
            index: -1
          });
        }
        
        // Add the parenthesized content
        result.push({
          text: match[1], // The content inside parentheses
          isParens: true,
          index: parensCount // Keep track of which parenthesized group this is
        });
        
        currentPos = match.index + match[0].length;
        parensCount++;
      }
      
      // If there's text after the last parentheses, add it
      if (currentPos < line.length) {
        result.push({
          text: line.substring(currentPos),
          isParens: false,
          index: -1
        });
      }
    });
    
    return result;
  }
  
  function handleMouseEnter(index) {
    if (containerRef.current) {
      const matchingSegments = containerRef.current.querySelectorAll(`[data-index="${index}"]`);
      matchingSegments.forEach(seg => seg.classList.add('segment-highlight'));
    }
  }
  
  function handleMouseLeave(index) {
    if (containerRef.current) {
      const matchingSegments = containerRef.current.querySelectorAll(`[data-index="${index}"]`);
      matchingSegments.forEach(seg => seg.classList.remove('segment-highlight'));
    }
  }
  
  // Fixed: Only apply style if it's a valid object and not null/undefined
  const containerStyle = typeof style === 'object' && style !== null ? style : {};
  
  return (
    <div ref={containerRef} className="glossed-container" style={containerStyle}>
      {/* First line with audio button(s) and original language integrated */}
      <div className="glossed-line dialogue">
        {/* Display original text with audio buttons interspersed at their original positions */}
        {parsedContent.originalText.map((segment, idx) => (
          segment.isLineBreak ? (
            <br key={`br-s1-${idx}`} />
          ) : segment.isAudio ? (
            <span key={`audio-${idx}`} className="glossed-audio-button">
              <AudioButton 
                content={segment.audioId} 
                style={typeof style === 'string' ? style : "dialogue"} 
                audioSrc={`${folderPath || ''}audio${segment.audioId}.mp3`} 
              />
            </span>
          ) : segment.isParens ? (
            <span 
              key={`s1-${idx}`}
              className={`string-segment parens entry-dialogue`}
              data-section={sectionId.current}
              data-index={segment.index}
              onMouseEnter={() => handleMouseEnter(segment.index)}
              onMouseLeave={() => handleMouseLeave(segment.index)}
            >
              {segment.text}
            </span>
          ) : (
            <span 
              key={`s1-${idx}`}
              className="string-segment non-parens entry-dialogue"
            >
              {segment.text}
            </span>
          )
        ))}
      </div>
      
      {/* Divider between original text and gloss if showDividers is true */}
      {showDividers && (
        <div className="glossed-divider">
          <span className="divider-asterisk"></span>
        </div>
      )}
      
      {/* Second line (morpheme-by-morpheme gloss) */}
      <div className="glossed-line parse">
        {parsedContent.glossText.map((segment, idx) => (
          segment.isLineBreak ? (
            <br key={`br-s2-${idx}`} />
          ) : segment.isParens ? (
            <span 
              key={`s2-${idx}`}
              className={`string-segment parens entry-parse`}
              data-section={sectionId.current}
              data-index={segment.index}
              onMouseEnter={() => handleMouseEnter(segment.index)}
              onMouseLeave={() => handleMouseLeave(segment.index)}
            >
              {segment.text}
            </span>
          ) : (
            <span 
              key={`s2-${idx}`}
              className="string-segment non-parens entry-parse"
            >
              {segment.text}
            </span>
          )
        ))}
      </div>
      
      {/* Divider between gloss and translation if showDividers is true and translation exists */}
      {showDividers && parsedContent.translation && parsedContent.translation.trim() !== '' && (
        <div className="glossed-divider">
          <span className="divider-asterisk"></span>
        </div>
      )}
      
      {/* Third line (full translation) - only render if exists and has content */}
      {parsedContent.translation && parsedContent.translation.trim() !== '' && (
        <div className="glossed-line translation">
          <span className="string-segment non-parens"><i>
            {/* Replace '\n' with <br> tags for line breaks in translation */}
            {parsedContent.translation.split('\n').map((line, i) => (
              <React.Fragment key={`trans-${i}`}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </i></span>
        </div>
      )}
    </div>
  );
}

export default GlossedText;