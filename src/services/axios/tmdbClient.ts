import axios from 'axios'

export const axiosClientTmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    api_key: process.env.TMDB_API_KEY
  }
})
