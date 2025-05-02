
import { useState } from 'react';
import { Clock } from 'lucide-react';
import { UserData } from '../../context/UserApi';

interface ProfileTabProps {
  userData: UserData;
  onSaveChanges: (updatedData: Partial<UserData>) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ userData, onSaveChanges }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      await onSaveChanges(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input 
              id="firstName"
              name="firstName"
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input 
              id="lastName"
              name="lastName"
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email"
            name="email"
            type="email" 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Member Since</label>
          <div className="flex items-center mt-1 text-gray-500">
            <Clock size={16} className="mr-2" />
            <span>{userData.joinDate}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Membership Tier</label>
          <div className="mt-1 text-gray-700 font-medium">
            {userData.membershipTier}
            {userData.membershipTier !== 'Premium' && (
              <span className="ml-2 text-sm text-blue-600">
                <button type="button" className="underline">Upgrade</button>
              </span>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Loyalty Points</label>
          <div className="mt-1 text-gray-700 font-medium">
            {userData.loyaltyPoints} points
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};