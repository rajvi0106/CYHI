// class ApiService {
//   constructor() {
//     this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseUrl}${endpoint}`;
//     const token = localStorage.getItem('token');

//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { 'Authorization': Bearer `${token}` }),
//         ...options.headers
//       },
//       ...options
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (response.headers.get('content-type')?.includes('application/json')) {
//         const data = await response.json();
        
//         if (!response.ok) {
//           throw new Error(data.message || HTTP `error! status: ${response.status}`);
//         }
        
//         return data;
//       } else {
//         if (!response.ok) {
//           throw new Error(HTTP `error! status : ${response.status}`);
//         }
//         return response;
//       }
//     } catch (error) {
//       console.error(API `request failed for ${endpoint}:, error`);
//       throw error;
//     }
//   }

//   async get(endpoint, params = {}) {
//     const queryString = new URLSearchParams(params).toString();
//     const url = queryString ? `${endpoint}?${queryString}`  :endpoint;
    
//     return this.request(url, {
//       method: 'GET'
//     });
//   }

//   async post(endpoint, data = {}) {
//     return this.request(endpoint, {
//       method: 'POST',
//       body: JSON.stringify(data)
//     });
//   }

//   async put(endpoint, data = {}) {
//     return this.request(endpoint, {
//       method: 'PUT',
//       body: JSON.stringify(data)
//     });
//   }

//   async delete(endpoint) {
//     return this.request(endpoint, {
//       method: 'DELETE'
//     });
//   }

//   async healthCheck() {
//     return this.get('/health');
//   }
// }

// export default new ApiService();


class ApiService {
  constructor() {
    // Base URL points to /api only (not /auth, not /tasks etc.)
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
      } else {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async healthCheck() {
    return this.get('/health');
  }
}

export default new ApiService();

