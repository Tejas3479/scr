import axios from 'axios'

// Prefer calling the API Gateway if available, otherwise fall back to user-service directly.
const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const USER_BASE = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3001'

const gatewayClient = axios.create({ baseURL: API_GATEWAY, headers: { 'Content-Type': 'application/json' } })
const userClient = axios.create({ baseURL: USER_BASE, headers: { 'Content-Type': 'application/json' } })

async function tryGateway(path: string, data: any) {
  // Gateway auth endpoints are mounted under /api/v1/users/auth
  const url = `/api/v1/users/auth${path}`
  return gatewayClient.post(url, data)
}

async function tryUser(path: string, data: any) {
  // Direct user service endpoints
  const url = `/api/auth${path}`
  return userClient.post(url, data)
}

export async function login(phone: string, password: string) {
  const payload = { phone, password }
  try {
    const res = await tryGateway('/login', payload)
    return res.data
  } catch (gErr) {
    // fallback to user service
    try {
      const res = await tryUser('/login', payload)
      return res.data
    } catch (uErr) {
      // prefer to throw gateway error if available, otherwise user error
      throw (gErr.response ? gErr : uErr)
    }
  }
}

export async function register(payload: any) {
  try {
    const res = await tryGateway('/register', payload)
    return res.data
  } catch (gErr) {
    try {
      const res = await tryUser('/register', payload)
      return res.data
    } catch (uErr) {
      throw (gErr.response ? gErr : uErr)
    }
  }
}

export default { login, register }
