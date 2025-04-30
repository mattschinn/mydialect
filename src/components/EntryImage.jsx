// src/components/EntryImage.jsx
import React, { useState } from 'react';
import '../styles/components/EntryImage.css';

function EntryImage({ src, alt }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Handle image loading success
  const handleImageLoaded = () => {
    setImageLoaded(true);
  };
  
  // Handle image loading error
  const handleImageError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  return (
    <div className="entry-image-container">
      {!imageLoaded && !error && (
        <div className="image-placeholder">
          <span>Loading...</span>
        </div>
      )}
      
      {error && (
        <div className="image-error">
          <span>Image not found</span>
        </div>
      )}
      
      <img 
        src={src} 
        alt={alt || "Entry image"} 
        className={`entry-image ${imageLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleImageLoaded}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
    </div>
  );
}

export default EntryImage;


