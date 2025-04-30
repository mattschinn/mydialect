import React from 'react';
import EntryContainer from './EntryContainer';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../styles/components/EntryList.css';

/**
 * EntryList component that renders a list of entries with infinite scrolling
 * Implemented for the hybrid approach only
 * 
 * @param {Object[]} entries - Array of entry objects with their config
 * @param {Function} onLoadMore - Callback to load more entries
 * @param {Function} onRefLink - Callback when a reference link is clicked
 * @param {boolean} loading - Whether more entries are currently loading
 */
function EntryList({ entries, onLoadMore, onRefLink, loading }) {
  // Use the infinite scroll hook
  const { containerRef } = useInfiniteScroll({
    onLoadMore: onLoadMore,
    threshold: 300, // Load more when user is 300px from bottom
    disabled: loading // Disable while loading
  });
  
  return (
    <div 
      ref={containerRef}
      className="entry-list"
    >
      {entries.map((entry, index) => (
        <EntryContainer 
          key={`${entry.foldername}-${index}`}
          entry={entry}
          folderPath={entry.folderPath}
          contents={entry.config.contents}
          onRefLink={onRefLink}
        />
      ))}
      
      {loading && (
        <div className="loading-indicator">
          <span>Loading more entries...</span>
        </div>
      )}
      
      {entries.length === 0 && !loading && (
        <div className="no-entries">
          <p>No entries found. Please make sure you have config.json files in your entry folders.</p>
        </div>
      )}
    </div>
  );
}

export default EntryList;