
import AuthService from '../services/Authservice';

class AuthSyncService {
  // Emit auth change event
  static emitAuthChange() {
    const event = new CustomEvent('authStateChanged');
    window.dispatchEvent(event);
  }
  
  // Check and refresh auth status before navigation
  static refreshAuthState() {
    const user = AuthService.getCurrentUser();
    
    // Check if token is expired or about to expire
    if (user?.accessToken) {
      try {
        // Validate token (optional - you can add token validation logic here)
        
        // Force a refresh of the auth state after validation
        this.emitAuthChange();
        return true;
      } catch (error) {
        console.error('Auth refresh error:', error);
        return false;
      }
    }
    
    return !!user?.accessToken;
  }
  
  // Set up listeners for route changes to ensure auth is checked
//   static setupNavListeners(history : any) {
//     // Listen for navigation events
//     const handleNavigation = () => {
//       this.refreshAuthState();
//     };
    
//     // Clean up on unmount
//     return () => {
//       // Clean up code if needed
//     };
//   }
}

export default AuthSyncService;