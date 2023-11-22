import { defineStore } from 'pinia';
import axios from 'axios';
import type { Show, ShowDetails } from '@/utils/show';

interface ShowCategoryData {
    page: number;
    results: Show[];
    total_pages: number;
    total_results: number;
}

export default defineStore({
    id: 'shows',
    state: () => ({
        shows: [],
    }),
    getters: {},
    actions: {
        getShows: (showType: string, category: string, page = '1'): Promise<ShowCategoryData> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getShows/?showType=${showType}&category=${category}&page=${page}`)
                    .then((resp) => {
                        resolve(resp.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
        getShow: (id: string): Promise<ShowDetails> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getShow/?id=${id}`)
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