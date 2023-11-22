import type { Context } from "@netlify/functions"
import axios from 'axios'

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = process.env.VITE_API_AUTH_TOKEN;

async function getShow(id: string) {
  try {
    const showDetails = await axios.get(`movie/${id}?api_key=${process.env.VITE_API_KEY}`);
    const actors = await axios.get(`movie/${id}/credits?api_key=${process.env.VITE_API_KEY}`);
    return { showDetails, actors };
  } catch (err) {
    throw new Error(err.message);
  }
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context: Context) => {
    try {
      const data = await getShow(event.queryStringParameters.id);
  
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({showDetails: data.showDetails.data, actors: data.actors.data}),
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