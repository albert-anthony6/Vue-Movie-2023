interface Show {
    backdrop_path: string;
    id: string;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    title: string;
    name: string;
}

interface ShowDetails {
    actors: {
        cast: [{
            character: string;
            name: string;
            profile_path: string;
            id: string;
        }];
    },
    showDetails: {
        adult: Boolean;
        backdrop_path: string;
        id: string;
        budget: Number;
        homepage: string;
        genres: [{ id: string; name: string }];
        original_language: string;
        overview: string;
        popularity: Number;
        poster_path: string;
        release_date: string;
        title: string;
        name: string;
        revenue: Number;
        runtime: Number;
        status: Number;
        vote_average: Number;
    }
}

export type { Show, ShowDetails };