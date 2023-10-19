import type { Context } from "@netlify/functions"
import axios from 'axios'

axios.defaults.baseURL = process.env.VITE_BASE_API_URL;
axios.defaults.headers.common['Authorization'] = process.env.VITE_API_AUTH_TOKEN;

async function getMovies() {
  try {
    const resp = await axios.get(`movie/popular/?api_key=${process.env.VITE_API_KEY}`);
    return resp;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (req: Request, context: Context) => {
    try {
      const data = await getMovies();
  
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.data),
      }
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: err.message,
        })
      }
    }
  }