import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { MovieResult, iMovieRequest } from "./interfaces";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
    const data: iMovieRequest = req.body;

    const dataCorrection: iMovieRequest = {
        name: data.name,
        category: data.category,
        duration: data.duration,
        price: data.price,
    };

    const queryInsert: string = format(
        `
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(dataCorrection),
        Object.values(dataCorrection)
    );

    const queryResult: MovieResult = await client.query(queryInsert);

    return res.status(201).json(queryResult.rows[0]);
};

const listMovies = async (req: Request, res: Response): Promise<Response> => {
    const categoryMovies = res.locals.filteredCategory;
    const allMovies = res.locals.allMovies;

    if (categoryMovies.length > 0) {
        return res.status(200).json(categoryMovies);
    } else {
        const querySelect: string = `
            SELECT 
                *
            FROM
                movies mv;
        `;
        const querryResult: MovieResult = await client.query(querySelect);
        res.locals.allMovies = querryResult.rows;
        return res.status(200).json(querryResult.rows);
    }
};

const listMovieById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    return res.status(200).json(res.locals.movieFind);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const movieId: number = res.locals.movieFind.id;

    const querySelect: string = `
        DELETE FROM
            movies mv
        WHERE
            mv.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: querySelect,
        values: [movieId],
    };

    await client.query(queryConfig);

    return res.status(204).json();
};

const updadteMovie = async (req: Request, res: Response): Promise<Response> => {
    const id: number = res.locals.movieFind.id;
    const data: Partial<iMovieRequest> = req.body;
    const queryUpdate: string = format(
        `
            UPDATE 
                movies mv
                SET(%I) = ROW(%L)
            WHERE
                mv.id = $1
            RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    );

    const queryConfig: QueryConfig = {
        text: queryUpdate,
        values: [id],
    };

    const queryResult: MovieResult = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0]);
};

export { listMovies, createMovie, listMovieById, deleteMovie, updadteMovie };
