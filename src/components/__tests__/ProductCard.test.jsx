import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from '../ProductCard';

// Mock contexts
const mockCartContext = {
  addToCart: vi.fn(),
  items: []
};

const mockWishlistContext = {
  wishlist: [],
  toggleWishlist: vi.fn()
};

// Mock the contexts
vi.mock('../../context/CartContext', () => ({
  useCart: () => mockCartContext
}));

vi.mock('../../context/WishlistContext', () => ({
  useWishlist: () => mockWishlistContext
}));

// Mock API
vi.mock('../../lib/api', () => ({
  BASE_URL: 'https://api.test.com'
}));

const mockProduct = {
  _id: '1',
  name: 'Test Product',
  price: 29.99,
  image: '/test-image.jpg',
  images: ['/test-image1.jpg', '/test-image2.jpg']
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('€29,99')).toBeInTheDocument();
  });

  it('displays product image', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('test-image1.jpg');
  });

  it('has correct link to product detail', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/1');
  });
});
