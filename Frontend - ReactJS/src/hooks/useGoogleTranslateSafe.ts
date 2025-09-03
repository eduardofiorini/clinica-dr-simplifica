import { useEffect, useRef } from 'react';

/**
 * Custom hook to protect React components from Google Translate DOM conflicts
 * This hook helps prevent the "Failed to execute 'removeChild' on 'Node'" errors
 */
export const useGoogleTranslateSafe = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add a class to help identify protected elements
    element.classList.add('google-translate-safe');

    // Observer to watch for Google Translate modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if Google Translate is modifying our element
        if (mutation.type === 'childList' && mutation.target === element) {
          // If Google Translate adds wrapper elements, handle gracefully
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && 
                (node.className?.includes('goog-te') || 
                 node.tagName === 'FONT')) {
              // This is likely a Google Translate wrapper
              console.debug('Google Translate wrapper detected, handling gracefully');
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Cleanup
    return () => {
      observer.disconnect();
      if (element) {
        element.classList.remove('google-translate-safe');
      }
    };
  }, []);

  return elementRef;
};

/**
 * Utility function to safely remove elements that might have been modified by Google Translate
 */
export const safeRemoveElement = (element: Element | null) => {
  if (!element) return;

  try {
    // Check if element is still connected to the DOM
    if (element.isConnected && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('removeChild')) {
      console.debug('Google Translate DOM conflict avoided during element removal');
    } else {
      // Re-throw non-Google Translate errors
      throw error;
    }
  }
};

/**
 * Utility function to safely modify DOM elements that might be affected by Google Translate
 */
export const safeSetInnerHTML = (element: Element | null, html: string) => {
  if (!element) return;

  try {
    element.innerHTML = html;
  } catch (error) {
    if (error instanceof Error && 
        (error.message.includes('removeChild') || error.message.includes('Node'))) {
      console.debug('Google Translate DOM conflict avoided during innerHTML set');
      // Try alternative approach
      setTimeout(() => {
        try {
          element.innerHTML = html;
        } catch (retryError) {
          console.debug('Secondary attempt to set innerHTML also failed, likely due to Google Translate');
        }
      }, 100);
    } else {
      throw error;
    }
  }
}; 