 import apiService from './apiService';

class AuthService {
  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(token, refreshToken) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      
      if (response.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await apiService.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      
      if (response.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return response.data.user;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiService.post('/auth/refresh', { refreshToken });
      
      if (response.success) {
        this.setTokens(response.data.token, response.data.refreshToken);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearTokens();
      return false;
    }
  }

  async logout() {
    try {
      if (this.isAuthenticated()) {
        await apiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async verifyToken() {
    try {
      const response = await apiService.get('/auth/verify');
      return response.success ? response.data.user : null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }
}

export default new AuthService();

// import apiService from './apiService';

// class AuthService {
//   getToken() {
//     return localStorage.getItem('token');
//   }

//   getRefreshToken() {
//     return localStorage.getItem('refreshToken');
//   }

//   setTokens(token, refreshToken) {
//     localStorage.setItem('token', token);
//     localStorage.setItem('refreshToken', refreshToken);
//   }

//   clearTokens() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//   }

//   isAuthenticated() {
//     const token = this.getToken();
//     if (!token) return false;

//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const currentTime = Date.now() / 1000;
//       return payload.exp > currentTime;
//     } catch {
//       return false;
//     }
//   }

//   async login(email, password) {
//     try {
//       const response = await apiService.post('/auth/login', { email, password });

//       if (response.success) {
//         this.setTokens(response.data.token, response.data.refreshToken);
//         return response.data.user;
//       }
//       throw new Error(response.message);
//     } catch (error) {
//       console.error('Login error:', error.message || error);
//       throw error;
//     }
//   }

//   async register(username, email, password) {
//     try {
//       const response = await apiService.post('/auth/register', {
//         username,
//         email,
//         password,
//       });

//       if (response.success) {
//         this.setTokens(response.data.token, response.data.refreshToken);
//         return response.data.user;
//       }
//       throw new Error(response.message);
//     } catch (error) {
//       console.error('Registration error:', error.message || error);
//       throw error;
//     }
//   }

//   async refreshToken() {
//     try {
//       const refreshToken = this.getRefreshToken();
//       if (!refreshToken) return false;

//       const response = await apiService.post('/auth/refresh', { refreshToken });

//       if (response.success) {
//         this.setTokens(response.data.token, response.data.refreshToken);
//         return true;
//       }
//       this.clearTokens();
//       return false;
//     } catch (error) {
//       console.error('Token refresh error:', error.message || error);
//       this.clearTokens();
//       return false;
//     }
//   }

//   async logout() {
//     try {
//       if (this.isAuthenticated()) {
//         await apiService.post('/auth/logout');
//       }
//     } catch (error) {
//       console.error('Logout error:', error.message || error);
//     } finally {
//       this.clearTokens();
//     }
//   }

//   async verifyToken() {
//     try {
//       const response = await apiService.get('/auth/verify');
//       return response.success ? response.data.user : null;
//     } catch (error) {
//       console.error('Token verification error:', error.message || error);
//       return null;
//     }
//   }
// }

// export default new AuthService();
