import { defineStore } from 'pinia';
import axios from 'axios';
import type { Show, ShowDetails } from '@/utils/show';

interface ShowCategoryData {
    page: number;
    results: Show[];
    total_pages: number;
    total_results: number;
}

interface VideoData {
    id: string;
    official: boolean;
    key: string;
    site: string;
    type: string;
}

export default defineStore({
    id: 'shows',
    state: () => ({
        searchInfo: {
            searchValue: '',
            dropdownValue: 'movie'
        },
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
        getShow: (showType: string, id: string): Promise<ShowDetails> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getShow/?id=${id}&showType=${showType}`)
                    .then((resp) => {
                        resolve(resp.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
        getVideos: (id: string): Promise<VideoData> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getVideos/?id=${id}`)
                    .then((resp) => {
                        // Only return one official trailer
                        const trailer = resp.data.results.find((video: VideoData) => video.official === true && video.type === 'Trailer' && video.site === 'YouTube')
                        resolve(trailer)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
        getSearch: (showType: string, searchValue: string, page = '1'): Promise<ShowCategoryData> =>
            new Promise ((resolve, reject) => {
                axios.get(`/.netlify/functions/getSearch/?showType=${showType}&searchValue=${searchValue}&page=${page}`)
                    .then((resp) => {
                        resolve(resp.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        }),
    },
});
