

export const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 border-t">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
      <div>
        <h4 className="font-bold mb-4">BR.</h4>
        <p className="text-gray-600">Your destination for premium footwear and athletic gear.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Quick Links</h4>
        <nav className="space-y-2">
          {['Home', 'Shop', 'Brands'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="block text-gray-600 hover:text-black"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div>
        <h4 className="font-bold mb-4">Customer Service</h4>
        <nav className="space-y-2">
          {['Contact', 'Shipping', 'Returns'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="block text-gray-600 hover:text-black"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <div>
        <h4 className="font-bold mb-4">Newsletter</h4>
        <p className="text-gray-600 mb-4">Stay updated with our latest releases</p>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-black text-stone-800"
          />
          <button className="bg-black text-white px-4 rounded-r-md hover:bg-gray-800">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </footer>
  )
}
