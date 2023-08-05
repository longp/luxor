import { Request, Response } from 'express'
import { getPokemons, getPokemonById, getPokemonByName } from '../services/pokemon'
import { Pokemon, pokemonsResponse } from '../types'
/**
 * @route GET /
 */
export const get = async (req: Request, res: Response): Promise<void> => {
  try {

    if (!req.query.id && !req.query.name) throw new Error('please supply either id or name in query')

    let data
    if (req.query.id)
      data = await getPokemonById(req.query.id as string)

    if (req.query.name && !data)
      data = await getPokemonByName(req.query.name as string)

    if (!data || !data?.pokemon) throw new Error('error fetching data')

    res.json(data)

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
    else {
      res.status(400).send("Unable to fulfill request")
    }

  }

}


export const getAll = async (req: Request, res: Response): Promise<void> => {

  try {
    const first: number = req.query.first ? +req.query.first : 151
    const page: number = req.query.page ? +req.query.page : 1
    const size: number = req.query.size ? +req.query.size : 10
    const startIdx = (page - 1) * size
    const endIdx = page * size

    const data: pokemonsResponse | null = await getPokemons(first)

    if (!data || !data?.pokemons) throw new Error('No Data')

    res.send(data.pokemons.slice(startIdx, endIdx))
  } catch (error) {

    res.status(400).send(error)

  }

}
