// InfiniteScroll.jsx - Component for infinite scrolling
import React, { useEffect, useRef, useCallback } from 'react';

function InfiniteScroll({ children, loadMore, threshold = 200 }) {
  const containerRef = useRef(null);
  
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Load more content when user scrolls near the bottom
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMore();
    }
  }, [loadMore, threshold]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        height: '100vh', 
        overflowY: 'auto',
        padding: '0 20px'
      }}
    >
      {children}
    </div>
  );
}

export default InfiniteScroll;
