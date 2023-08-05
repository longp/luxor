import express, { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
// Controllers (route handlers)
import * as rootController from './controllers/root'
import * as pokemonController from './controllers/pokemon'
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
// Create Express server
const app = express()
console.log(process.env.DB_URL)
// Express configuration
app.set('port', process.env.PORT)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(morgan('tiny'))
/**
 * Primary app routes.
 */
app.get('/', rootController.index)
app.get('/pokemon', pokemonController.get)
app.get('/pokemons', pokemonController.getAll)


app.get('*', (req: Request, res: Response) => {
  res.status(404).send('woah not found')
})

export default app
