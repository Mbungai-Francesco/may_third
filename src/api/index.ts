import axios from 'axios'

export const link = import.meta.env.LINK || 'http://localhost:5000'

export const api = axios.create({
  baseURL: link,
  withCredentials: true, // THIS IS THE KEY: It sends cookies with every request
})
