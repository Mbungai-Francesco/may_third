import type { LoginDTO } from '@/types/User'
import { api, link } from '.'
import type { User, UserCreateDTO } from '@/types'

const route = 'api/auth'

// Register a new user
export const register = async (registerDto: UserCreateDTO) => {
  try {
    const res = await api.post(`${link}/${route}/register`, registerDto)
    console.log('message', res.statusText)
    return res.data.data as User
  } catch (error) {
    console.error('Error:', error)
    if (String(error).includes('409')) {
      throw new Error('User already exists', { cause: error })
    }
    return null
  }
}

// Login user
export const login = async (loginDto: LoginDTO) => {
  try {
    const res = await api.post(`${link}/${route}/login`, loginDto)
    console.log('message', res.statusText)
    return res.data.data as User
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// Login user
export const logout = async () => {
  try {
    const res = await api.post(`${link}/${route}/logout`)
    console.log('message', res.statusText)
    return res.data.data.message as string
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}
