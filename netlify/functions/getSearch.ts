import type { Context } from "@netlify/functions"
import axios from 'axios'

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = process.env.VITE_API_AUTH_TOKEN;

async function getSearch(showType: string, searchValue: string, page = '1') {
  try {
    const resp = await axios.get(`search/${showType}?api_key=${process.env.VITE_API_KEY}`, { params: { query: searchValue, page } });
    return resp;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context: Context) => {
    try {
      const param = event.queryStringParameters;
      const data = await getSearch(param.showType, param.searchValue, param.page);
  
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