import { useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for implementing infinite scrolling functionality
 * 
 * @param {Function} onLoadMore - Callback function to load more items
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Distance from bottom in pixels to trigger loading (default: 200)
 * @param {boolean} options.disabled - Whether infinite scrolling is disabled (default: false)
 * @param {Element|null} options.scrollContainer - Element to attach scroll listener to (default: window)
 * @returns {Object} - Object containing ref to attach to scrollable container
 */
function useInfiniteScroll({
  onLoadMore,
  threshold = 200,
  disabled = false,
  scrollContainer = null
}) {
  // Create a ref for the scrollable container
  const containerRef = useRef(null);
  
  // Function to check if we should load more content
  const checkScrollPosition = useCallback(() => {
    // Skip if disabled
    if (disabled) return;
    
    // Get the container element
    const container = scrollContainer || containerRef.current;
    if (!container) return;
    
    let scrollHeight, scrollTop, clientHeight;
    
    // Handle window vs DOM element scrolling
    if (container === window || container === document) {
      scrollHeight = document.documentElement.scrollHeight;
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      clientHeight = window.innerHeight;
    } else {
      scrollHeight = container.scrollHeight;
      scrollTop = container.scrollTop;
      clientHeight = container.clientHeight;
    }
    
    // If we're near the bottom, load more content
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onLoadMore();
    }
  }, [onLoadMore, threshold, disabled, scrollContainer]);
  
  // Set up scroll event listener
  useEffect(() => {
    // Skip if disabled
    if (disabled) return;
    
    // Determine which element to attach the scroll listener to
    const container = scrollContainer || 
                      (containerRef.current ? containerRef.current : window);
    
    // Add event listener
    container.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Also check when window is resized
    window.addEventListener('resize', checkScrollPosition, { passive: true });
    
    // Initial check in case the content doesn't fill the screen
    setTimeout(checkScrollPosition, 100);
    
    // Clean up event listeners
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, disabled, scrollContainer]);
  
  return { containerRef };
}

export default useInfiniteScroll;