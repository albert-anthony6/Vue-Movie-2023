import { defineStore } from 'pinia';
import axios from 'axios';
import type Movie from '@/utils/movie';

export default defineStore({
    id: 'movies',
    state: () => ({
        movies: [],
    }),
    getters: {},
    actions: {
        getMovies: (category: string): Promise<Movie[]> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getMovies/?category=${category}`)
                    .then((resp) => {
                        resolve(resp.data.results)
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