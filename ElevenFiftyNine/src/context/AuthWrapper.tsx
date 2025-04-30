// // AuthWrapper.tsx
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthService from './Authservice';

// export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!AuthService.isLoggedIn()) {
//       navigate('/auth');
//     }
//   }, [navigate]);

//   return <>{children}</>;
// };