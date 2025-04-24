export const Navigation: React.FC = () => {
    return (
      <nav className="px-4 py-2">
        <ul className="flex space-x-6">
          <li className="cursor-pointer">Women</li>
          <li className="cursor-pointer">Men</li>
          <li className="cursor-pointer">Kids</li>
          <li className="cursor-pointer">Sports</li>
          <li className="cursor-pointer">Brands</li>
          <li className="cursor-pointer">New</li>
          <li className="cursor-pointer text-red-500">Sale</li>
        </ul>
        
        <div className="flex text-sm text-gray-500 mt-4 space-x-2">
          <span>Clothes and shoes</span>
          <span>&gt;</span>
          <span>Shoes</span>
          <span>&gt;</span>
          <span>Reebok</span>
        </div>
      </nav>
    );
  };