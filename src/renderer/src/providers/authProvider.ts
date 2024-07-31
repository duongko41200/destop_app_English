import type { AuthProvider } from 'react-admin'
import { fetchUtils } from 'react-admin'
import { generateRole } from '../core/role/permissions'

// const apiUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http:local: 3000'}/api/cms`;

const apiUrl = `https://bot-app-english-apiss.vercel.app/v1/api`
const httpClient = fetchUtils.fetchJson
const API_KEY =
  '4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556'

const authProvider: AuthProvider = {
  // authentication
  login: async (params) => {
    const { username, password } = params

    try {
      const request = new Request(`${apiUrl}/access/login`, {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
        headers: new Headers({ 'Content-Type': 'application/json', 'x-api-key': API_KEY })
      })
      const response = await fetch(request)

      const data = await response.json()

      console.log({ data })

      const {
        metadata: {
          user: { _id },
          tokens: { accessToken, refreshToken }
        }
      } = data

      // Set cookie
      // document.cookie = `${HEADER.CLIENT_ID}=${_id}; path=/`
      // document.cookie = `${HEADER.AUTHORIZATION}=${accessToken}; path=/`
      // document.cookie = `${HEADER.REFRESHTOKEN}= ${refreshToken}; path=/`
      // let { password, ...userToPersist } = user;
      localStorage.setItem('userId', data.metadata?.user?._id)
      localStorage.setItem('accessToken', data.metadata?.tokens?.accessToken)
      localStorage.setItem('refreshToken', data.metadata?.tokens?.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.metadata.user))

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  },
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return Promise.resolve()
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => (localStorage.getItem('user') ? Promise.resolve() : Promise.reject()),
  getPermissions: () => {
    return Promise.resolve(generateRole(1))
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem('user')
    const user = persistedUser ? JSON.parse(persistedUser) : null

    return Promise.resolve(user)
  }
}

export default authProvider
