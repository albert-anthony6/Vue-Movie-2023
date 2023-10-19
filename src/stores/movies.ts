import { defineStore } from 'pinia';

import axios from 'axios'

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
axios.defaults.headers.common['Authorization'] = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQ';

export default defineStore({
    id: 'movies',
    state: () => ({
        movies: [],
    }),
    getters: {},
    actions: {
        getMovies: () =>
            new Promise ((resolve, reject) => {
                axios.get(`https://api.themoviedb.org/3/movie/popular/?api_key=${import.meta.env.VITE_API_KEY}`)
                    .then((resp) => {
                        resolve(resp)
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