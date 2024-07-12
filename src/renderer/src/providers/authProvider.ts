import { HEADER } from '../consts/access';
import { getClientCookieValue } from '../utils/cookies';
import type { AuthProvider } from 'react-admin';
import { fetchUtils } from 'react-admin';
import { generateRole } from '../core/role/permissions';

// const apiUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http:local: 3000'}/api/cms`;

const apiUrl = `http:3200/api/cms`;
const httpClient = fetchUtils.fetchJson;

const authProvider: AuthProvider = {
  // authentication
  login: async (params) => {
    const { username, password } = params;
    const request = new Request(`${apiUrl}/access/login`, {
      method: 'POST',
      body: JSON.stringify({ userName: username, password }),
      // headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    try {
      const { json } = await httpClient(request);

      const {
        metadata: {
          user: { id },
          tokens: { accessToken, refreshToken },
        },
      } = json;

      // Set cookie
      document.cookie = `${HEADER.CLIENT_ID}=${id}; path=/`;
      document.cookie = `${HEADER.AUTHORIZATION}=${accessToken}; path=/`;
      document.cookie = `${HEADER.REFRESHTOKEN}=${refreshToken}; path=/`;

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  checkError: (error) => Promise.resolve(/* ... */),
  checkAuth: async () => {
    const request = new Request(`${apiUrl}/access/auth`, {
      method: 'POST',
    });

    try {
      const { json } = await httpClient(request);
      console.log({ json });

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
    // return Promise.resolve();
  },
  logout: async () => {
    const request = new Request(`${apiUrl}/access/logout`, {
      method: 'POST',
    });

    try {
      const { json } = await httpClient(request);
      console.log({ json });

      return Promise.resolve();
    } catch (error) {
      console.log({ error });
    }
  },
  getIdentity: async () => {
    const userId = getClientCookieValue(HEADER.CLIENT_ID);

    const request = new Request(`${apiUrl}/users/${userId}`, {
      method: 'GET',
    });

    try {
      const {
        json: {
          metadata: { id, name },
        },
      } = await httpClient(request);

      return Promise.resolve({
        id,
        fullName: name,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // authorization
  getPermissions: async () => {
    const request = new Request(`${apiUrl}/access/permission`, {
      method: 'GET',
    });

    try {
      const { json } = await httpClient(request);
      console.log({ json });

      return Promise.resolve(generateRole(json.metadata.role));
    } catch (error) {
      return Promise.reject(error);
    }
    // return Promise.resolve(generateRole(1));
  },
};

export default authProvider;
