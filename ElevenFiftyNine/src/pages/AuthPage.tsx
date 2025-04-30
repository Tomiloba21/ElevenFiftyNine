// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, Home} from 'lucide-react';
// import { Footer } from '../components/Footer';

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: ''
//     }
//   });

//   const handleChange = (e : any) => {
//     const { name, value } = e.target;
    
//     // Handle nested address properties
//     if (name.startsWith('address.')) {
//       const addressField = name.split('.')[1];
//       setFormData({
//         ...formData,
//         address: {
//           ...formData.address,
//           [addressField]: value
//         }
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     // Form submission logic would go here
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <button className="mr-4 text-gray-600 hover:text-gray-900">
//               {/* <ChevronLeft size={20} /> */}
//             </button>
//             <h1 className="text-xl font-bold text-gray-800">ElevenFiftyNine</h1>
//           </div>
//           <nav className="hidden md:block">
//             <ul className="flex space-x-6">
//               <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li>
//               <li><a href="product" className="text-gray-600 hover:text-gray-900">Products</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
//               <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
//             </ul>
//           </nav>
//         </div>
//       </header>
  

//       {/* Main Content */}
//       <div className="flex-1 flex py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex">
//           {/* Left Side Content */}
//           <div className="hidden lg:block lg:w-1/2 pr-12">
//             <div className="h-full flex flex-col justify-center">
//               <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to ElevenFiftyNine</h2>
//               <p className="text-xl text-gray-600 mb-8">
//                 Join our community today and get access to exclusive content, personalized recommendations,
//                 and much more.
//               </p>
//               <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">Why choose us?</h3>
//                 <ul className="space-y-3">
//                   <li className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <p className="ml-2 text-gray-600">Secure and reliable service</p>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <p className="ml-2 text-gray-600">24/7 customer support</p>
//                   </li>
//                   <li className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <p className="ml-2 text-gray-600">Easy-to-use interface</p>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Right Side Form */}
//           <div className="w-full lg:w-1/2 lg:pl-12">
//             <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
//               {/* Toggle Buttons */}
//               <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
//                 <button
//                   className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
//                     isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
//                   }`}
//                   onClick={() => setIsLogin(true)}
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
//                     !isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
//                   }`}
//                   onClick={() => setIsLogin(false)}
//                 >
//                   Create Account
//                 </button>
//               </div>

//               {/* Form Title */}
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                 {isLogin ? 'Welcome Back' : 'Create Your Account'}
//               </h2>

//               {/* Form */}
//               <form onSubmit={handleSubmit}>
//                 {isLogin ? (
//                   // Login Form
//                   <>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 gap-4">
//                         <div>
//                           <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <User size={18} className="text-gray-400" />
//                             </div>
//                             <input
//                               type="text"
//                               id="username"
//                               name="username"
//                               value={formData.username}
//                               onChange={handleChange}
//                               className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Username"
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <Lock size={18} className="text-gray-400" />
//                             </div>
//                             <input
//                               type={showPassword ? "text" : "password"}
//                               id="password"
//                               name="password"
//                               value={formData.password}
//                               onChange={handleChange}
//                               className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Password"
//                               required
//                             />
//                             <button
//                               type="button"
//                               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                               onClick={() => setShowPassword(!showPassword)}
//                             >
//                               {showPassword ? (
//                                 <EyeOff size={18} className="text-gray-400" />
//                               ) : (
//                                 <Eye size={18} className="text-gray-400" />
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <input
//                             id="remember-me"
//                             name="remember-me"
//                             type="checkbox"
//                             className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
//                           />
//                           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                             Remember me
//                           </label>
//                         </div>

//                         <div className="text-sm">
//                           <a href="#" className="font-medium text-black hover:underline">
//                             Forgot your password?
//                           </a>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6">
//                       <button
//                         type="submit"
//                         className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
//                       >
//                         Sign In
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   // Registration Form
//                   <>
//                     <div className="space-y-4">
//                       {/* Basic Info */}
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                             First Name
//                           </label>
//                           <input
//                             type="text"
//                             id="firstName"
//                             name="firstName"
//                             value={formData.firstName}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                             placeholder="First Name"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                             Last Name
//                           </label>
//                           <input
//                             type="text"
//                             id="lastName"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                             placeholder="Last Name"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {/* Username and Email */}
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
//                             Username
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <User size={18} className="text-gray-400" />
//                             </div>
//                             <input
//                               type="text"
//                               id="reg-username"
//                               name="username"
//                               value={formData.username}
//                               onChange={handleChange}
//                               className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Username"
//                               required
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                           </label>
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <Mail size={18} className="text-gray-400" />
//                             </div>
//                             <input
//                               type="email"
//                               id="email"
//                               name="email"
//                               value={formData.email}
//                               onChange={handleChange}
//                               className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Email"
//                               required
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Password */}
//                       <div>
//                         <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
//                           Password
//                         </label>
//                         <div className="relative">
//                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Lock size={18} className="text-gray-400" />
//                           </div>
//                           <input
//                             type={showPassword ? "text" : "password"}
//                             id="reg-password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                             placeholder="Password"
//                             required
//                           />
//                           <button
//                             type="button"
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? (
//                               <EyeOff size={18} className="text-gray-400" />
//                             ) : (
//                               <Eye size={18} className="text-gray-400" />
//                             )}
//                           </button>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Password must be at least 8 characters with at least one number and one special character.
//                         </p>
//                       </div>

//                       {/* Address */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Address
//                         </label>
//                         <div className="space-y-2">
//                           <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                               <Home size={18} className="text-gray-400" />
//                             </div>
//                             <input
//                               type="text"
//                               name="address.street"
//                               value={formData.address.street}
//                               onChange={handleChange}
//                               className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Street Address"
//                             />
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <input
//                               type="text"
//                               name="address.city"
//                               value={formData.address.city}
//                               onChange={handleChange}
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="City"
//                             />
//                             <input
//                               type="text"
//                               name="address.state"
//                               value={formData.address.state}
//                               onChange={handleChange}
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="State"
//                             />
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <input
//                               type="text"
//                               name="address.zip"
//                               value={formData.address.zip}
//                               onChange={handleChange}
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="ZIP Code"
//                             />
//                             <input
//                               type="text"
//                               name="address.country"
//                               value={formData.address.country}
//                               onChange={handleChange}
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
//                               placeholder="Country"
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center">
//                         <input
//                           id="terms"
//                           name="terms"
//                           type="checkbox"
//                           className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
//                           required
//                         />
//                         <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                           I agree to the <a href="#" className="text-black font-medium hover:underline">Terms and Conditions</a>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="mt-6">
//                       <button
//                         type="submit"
//                         className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
//                       >
//                         Create Account
//                       </button>
//                     </div>
//                   </>
//                 )}

//                 {/* Social Login */}
//                 <div className="mt-6">
//                   <div className="relative">
//                     <div className="absolute inset-0 flex items-center">
//                       <div className="w-full border-t border-gray-300"></div>
//                     </div>
//                     <div className="relative flex justify-center text-sm">
//                       <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                     </div>
//                   </div>

//                   <div className="mt-6 grid grid-cols-3 gap-3">
//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                     >
//                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M12.0003 2.00098C6.47031 2.00098 2.00031 6.47098 2.00031 12.001C2.00031 16.991 5.65731 21.127 10.4373 21.884V14.968H7.89831V12.001H10.4373V9.79798C10.4373 7.29098 11.9323 5.90698 14.2153 5.90698C15.3103 5.90698 16.4543 6.10198 16.4543 6.10198V8.56198H15.1913C13.9503 8.56198 13.5633 9.33298 13.5633 10.124V11.999H16.3363L15.8923 14.966H13.5633V21.882C18.3433 21.129 22.0003 16.992 22.0003 12.001C22.0003 6.47098 17.5303 2.00098 12.0003 2.00098Z" />
//                       </svg>
//                     </button>

//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                     >
//                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M21.8 12.2C21.8 11.4 21.7 10.8 21.6 10.1H12V13.8H17.5C17.3 14.8 16.7 15.7 15.6 16.3V18.5H18.6C20.2 17 21.8 14.8 21.8 12.2Z" fill="#4285F4"/>
//                         <path d="M12 22C14.9 22 17.3 21.1 18.6 18.5L15.6 16.3C14.7 17 13.5 17.5 12 17.5C9.3 17.5 7 15.7 6.1 13.2H3V15.4C4.4 19.3 8 22 12 22Z" fill="#34A853"/>
//                         <path d="M6.1 13.2C5.8 12.5 5.6 11.7 5.6 11C5.6 10.3 5.8 9.5 6.1 8.8V6.6H3C2.2 7.9 1.8 9.4 1.8 11C1.8 12.6 2.2 14.1 3 15.4L6.1 13.2Z" fill="#FBBC05"/>
//                         <path d="M12 5.5C13.5 5.5 14.9 6 16 7.1L18.6 4.5C17.3 3.2 14.9 2 12 2C8 2 4.4 4.7 3 8.6L6.1 10.8C7 8.3 9.3 5.5 12 5.5Z" fill="#EA4335"/>
//                       </svg>
//                     </button>

//                     <button
//                       type="button"
//                       className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
//                     >
//                       <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M16.1998 2H7.7998C4.6998 2 2.3998 4.3 2.3998 7.4V16.6C2.3998 19.7 4.6998 22 7.7998 22H16.1998C19.2998 22 21.5998 19.7 21.5998 16.6V7.4C21.5998 4.3 19.2998 2 16.1998 2ZM7.6998 10L8.9998 10.1L8.5998 11.4C8.3998 11.9 8.5998 12.4 9.0998 12.7C9.2998 12.8 9.4998 12.8 9.6998 12.8C9.9998 12.8 10.2998 12.7 10.4998 12.5L11.6998 11.2L12.8998 12.5C13.1998 12.8 13.6998 12.9 14.1998 12.7C14.6998 12.5 14.9998 12 14.9998 11.5L14.6998 10.1L15.9998 10C16.4998 10 16.8998 9.7 16.9998 9.2C17.0998 8.7 16.8998 8.2 16.3998 8L15.1998 7.4L15.4998 6C15.5998 5.5 15.3998 5 14.8998 4.8C14.3998 4.6 13.8998 4.7 13.5998 5.1L12.5998 6.3L11.4998 5.1C11.0998 4.7 10.5998 4.6 10.0998 4.8C9.5998 5 9.3998 5.5 9.4998 6L9.7998 7.4L8.5998 8C8.0998 8.2 7.8998 8.7 7.9998 9.2C7.9998 9.6 8.2998 9.9 7.6998 10Z" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//   <Footer/>

//   </div>
//   );
// }


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Home } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Nav } from '../components/Nav';
import AuthService from '../context/Authservice';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const handleChange = ( e: any) => {
    const { name, value } = e.target;
    
    // Handle nested address properties
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e :any) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const response = await AuthService.login(formData.username, formData.password);
        localStorage.setItem('userToken', response.accessToken);
        navigate('/');
      } else {
        await AuthService.register(formData);
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error :any) {
      setMessage(error.message); // This will now show the server's error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Nav />
  
      {/* Main Content */}
      <div className="flex-1 flex py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex">
          {/* Left Side Content */}
          <div className="hidden lg:block lg:w-1/2 pr-12">
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to ElevenFiftyNine</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join our community today and get access to exclusive content, personalized recommendations,
                and much more.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Why choose us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-600">Secure and reliable service</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-600">24/7 customer support</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-gray-600">Easy-to-use interface</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-1/2 lg:pl-12">
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                    isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </button>
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                    !isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </button>
              </div>

              {/* Form Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isLogin ? 'Welcome Back' : 'Create Your Account'}
              </h2>

              {/* Display message if any */}
              {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {isLogin ? (
                  // Login Form
                  <>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={18} className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                              placeholder="Username"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="Password"
                              required
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={18} className="text-gray-400" />
                              ) : (
                                <Eye size={18} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>
                        </div>

                        <div className="text-sm">
                        <Link to="/forgotPassword" className="font-medium text-black hover:underline">
                          Forgot your password?
                        </Link>


                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        disabled={loading}
                      >
                        {loading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </div>
                  </>
                ) : (
                  // Registration Form
                  <>
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            placeholder="First Name"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            placeholder="Last Name"
                            required
                          />
                        </div>
                      </div>

                      {/* Username and Email */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={18} className="text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="reg-username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="Username"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 w-full px-4  text-gray-900 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="Email"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="reg-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 w-full px-4   text-gray-600 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                            placeholder="Password"
                            required
                          />
                                                    <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} className="text-gray-400" />
                            ) : (
                              <Eye size={18} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                          <Home size={18} className="mr-2" />
                          Address Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              id="address.street"
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="Street Address"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              id="address.city"
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="City"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                              State/Province
                            </label>
                            <input
                              type="text"
                              id="address.state"
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="State/Province"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              id="address.zip"
                              name="address.zip"
                              value={formData.address.zip}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="ZIP/Postal Code"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              id="address.country"
                              name="address.country"
                              value={formData.address.country}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border  text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                              placeholder="Country"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Create Account'}
                      </button>
                    </div>
                  </>
                )}
              </form>

              {/* Social Login or Other Options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm4.293 14.707a1 1 0 01-1.414 1.414L10 11.414l-2.879 2.879a1 1 0 01-1.414-1.414L8.586 10 5.707 7.121a1 1 0 011.414-1.414L10 8.586l2.879-2.879a1 1 0 011.414 1.414L11.414 10l2.879 2.879z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}