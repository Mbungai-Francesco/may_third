import axios from 'axios'

export const link = import.meta.env.VITE_LINK

export const conf = (jwt : string) => {
  return {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  }
}

export const api = axios.create({
  baseURL: link,
  withCredentials: true, // THIS IS THE KEY: It sends cookies with every request
})
