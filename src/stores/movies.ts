import { defineStore } from 'pinia';
import axios from 'axios';
import type { Movie, MovieDetails } from '@/utils/movie';

interface MovieCategoryData {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export default defineStore({
    id: 'movies',
    state: () => ({
        movies: [],
    }),
    getters: {},
    actions: {
        getMovies: (category: string, page = '1'): Promise<MovieCategoryData> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getMovies/?category=${category}&page=${page}`)
                    .then((resp) => {
                        resolve(resp.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
        getMovie: (id: string): Promise<MovieDetails> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getMovie/?id=${id}`)
                    .then((resp) => {
                        resolve(resp.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
    },
});

// const apiClient = axios.create({
//     baseURL: 'https://example.com/api',
//     withCredentials: false,
//     timeout: 1000,
   
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic ' + btoa('api_username_here' + ':' + 'api_password_here')     
//     }
// })

// export default {
//     getOrders(){
//         return apiClient.get('/orders?status=processing')
//     },
//     getProducts(id){
//         return apiClient.get('/products/' + id)
//     },
// }