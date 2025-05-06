export const Footer = () => {
  return (

  <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Your destination for premium footwear and athletic gear.</h3>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Home</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Shop</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Brands</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Shipping</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Stay updated with our latest releases</h3>
              <div className="flex mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 ElevenFiftyNine. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
