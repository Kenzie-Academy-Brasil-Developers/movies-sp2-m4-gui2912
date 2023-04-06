import { NextFunction, Request, Response } from "express";
import { MovieResult, iMovieRequest } from "./interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

const ensureMovieNameIsUniqueMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const data: iMovieRequest = req.body;
    const movieName: string = data.name;

    const querySelect: string = `
        SELECT
            *
        FROM
            movies mv
        WHERE
            mv.name = $1;
    `;

    const queryConfig: QueryConfig = {
        text: querySelect,
        values: [movieName],
    };

    const { rowCount }: MovieResult = await client.query(queryConfig);

    if (rowCount > 0) {
        return res.status(409).json({
            error: "Movie name already exists!",
        });
    }

    return next();
};

const ensureMovieExists = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const movieId: number = +req.params.id;

    const querySelect: string = `
        SELECT
            *
        FROM
            movies mv
        WHERE
            mv.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: querySelect,
        values: [movieId],
    };

    const { rowCount, rows }: MovieResult = await client.query(queryConfig);

    if (rowCount === 0) {
        return res.status(404).json({
            error: "Movie not found!",
        });
    }

    res.locals.movieFind = rows[0];

    return next();
};

const ensureCategoryExists = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const queryParams = req.query;

    console.log(queryParams.category);

    if (queryParams) {
        const querySelect: string = `
        SELECT 
            *
        FROM
            movies mv
        WHERE
            mv."category" = $1;
    `;
        const queryConfig: QueryConfig = {
            text: querySelect,
            values: [queryParams.category],
        };
        const querryResult: MovieResult = await client.query(queryConfig);
        res.locals.filteredCategory = querryResult.rows;

        return next();
    }

    return next();
};

const ensureDataIsValid = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    let data: iMovieRequest | Partial<iMovieRequest> = req.body;
    // const method: string = req.method;

    console.log(res.locals.category);

    if (data.name && data.name.length > 50) {
        return res.status(400).json({
            error: "Too long name",
        });
    }else if(typeof(data.name) !== 'string'){
        return res.status(400).json({
            error: "Name input must be a string",
        });
    }

    if (data.category && data.category.length > 20) {
        return res.status(400).json({
            error: "Too long category name",
        });
    }else if(typeof(data.category) !== 'string'){
        return res.status(400).json({
            error: "Category input must be a string"
        })
    }

    if (typeof data.duration !== "number" || typeof data.price !== "number") {
        return res.status(400).json({
            error: "Duration and price inputs must have to be a number",
        });
    }


    // if(method === 'POST'){
    //     const dataConfigured
    // }

    return next();
};

export {
    ensureMovieNameIsUniqueMiddleware,
    ensureMovieExists,
    ensureCategoryExists,
    ensureDataIsValid,
};
