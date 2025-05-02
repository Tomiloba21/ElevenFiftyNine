import React, { useState } from 'react';
import redShirt from "../assets/images/redShirt.png";

import ashShirt from "../assets/images/ashShirt.png";
import blackShirt from "../assets/images/blackShirt.png";
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';
import { Link } from 'react-router-dom';

// Type definitions
interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  colors: string[];
}

// Placeholder product data
const featuredProducts: Product[] = [
  {
    id: 1,
    brand: 'Red Shirt',
    name: 'Red Shirt',
    price: 150.00,
    image: redShirt,
    colors: ['#FFFFFF', '#000000', '#808080']
  },
  {
    id: 2,
    brand: 'Ash SHirt',
    name: 'Ultraboost Light',
    price: 180.00,
    image: ashShirt,
    colors: ['#FFFFFF', '#000000', '#0000FF']
  },
  {
    id: 3,
    brand: 'Black Shirt',
    name: 'Fresh Foam X',
    price: 160.00,
    image: blackShirt,
    colors: ['#FFFFFF', '#808080', '#A52A2A']
  }
];

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: string[] = ['All', 'Running', 'Training', 'Casual'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <Nav />

      {/* Hero Section */}
      <header className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-stone-600">
            Discover Your Perfect Style
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore the latest in fashion apparel. Comfort, style, and quality come together at ElevenFiftyNine.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
              Shop Now
            </Link>
            <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100 transition">
              Explore Brands
            </button>
          </div>
        </div>
      </header>

      {/* Product Categories */}
      <section className="mb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center space-x-4 md:space-x-8 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md transition ${
                  activeCategory === category 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4"
              >
                <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{product.brand}</p>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="font-bold">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex space-x-1">
                    {product.colors.map((color) => (
                      <div 
                        key={color} 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    to="/product" 
                    className="w-full block text-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Shirts', 'Pants', 'Accessories', 'Footwear'].map((category) => (
              <div key={category} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <Link to="/products" className="text-black font-medium hover:underline mt-2 inline-block">
                    Browse Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );

};

export default HomePage;