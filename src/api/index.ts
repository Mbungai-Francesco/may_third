import axios from 'axios'

export const link = "http://localhost:5000";

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
