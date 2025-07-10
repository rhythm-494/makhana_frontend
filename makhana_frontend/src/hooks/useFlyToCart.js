// hooks/useFlyToCart.js
import { useCallback } from 'react';

export const useFlyToCart = () => {
  const flyToCart = useCallback((productImageElement, cartIconElement) => {
    if (!productImageElement || !cartIconElement) return;

    // Clone the product image
    const clone = productImageElement.cloneNode(true);
    const productRect = productImageElement.getBoundingClientRect();
    const cartRect = cartIconElement.getBoundingClientRect();

    // Style the clone
    clone.style.position = 'fixed';
    clone.style.top = `${productRect.top}px`;
    clone.style.left = `${productRect.left}px`;
    clone.style.width = `${productRect.width}px`;
    clone.style.height = `${productRect.height}px`;
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    clone.style.borderRadius = '8px';

    // Add to body
    document.body.appendChild(clone);

    // Trigger animation
    requestAnimationFrame(() => {
      clone.style.top = `${cartRect.top + cartRect.height / 2}px`;
      clone.style.left = `${cartRect.left + cartRect.width / 2}px`;
      clone.style.width = '0px';
      clone.style.height = '0px';
      clone.style.opacity = '0';
    });

    // Remove clone after animation
    setTimeout(() => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    }, 800);

    // Animate cart icon
    cartIconElement.style.transform = 'scale(1.2)';
    cartIconElement.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
      cartIconElement.style.transform = 'scale(1)';
    }, 200);

  }, []);

  return flyToCart;
};
