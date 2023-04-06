import { QueryConfig, QueryResult } from 'pg';

interface iMovieRequest {
    name: string;
    category: string;
    duration: number;
    price: number;
}

interface iMovie extends iMovieRequest {
    id: number;
}

type MovieResult = QueryResult<iMovie>

export {
    iMovieRequest,
    iMovie,
    MovieResult
}