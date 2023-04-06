import express,{Application} from 'express'
import { startDatabase } from './database'
import { createMovie, deleteMovie, listMovieById, listMovies } from './logics'
import { ensureCategoryExists, ensureDataIsValid, ensureMovieExists, ensureMovieNameIsUniqueMiddleware } from './middlewares'

const app = express()
app.use(express.json())

app.get('/movies',ensureCategoryExists, listMovies)
app.get('/movies/:id', ensureMovieExists, listMovieById)
app.post('/movies',ensureMovieNameIsUniqueMiddleware, ensureDataIsValid, createMovie)
app.delete('/movies/:id',ensureMovieExists, deleteMovie)
app.listen (3000, async() => {
    await startDatabase(),
    console.log('Server is running');
}) 

