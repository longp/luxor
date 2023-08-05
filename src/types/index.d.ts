
export type Pokemon = {
    id?: string,
    number?: number,
    name?: string,
    weight?: {
        minimum?: string,
        maximum?: string,
    },
    height?: {
        minimum?: string,
        maximum?: string,
    },
    classification?: string,
    types?: string[],
    resistant?: string[],
    attacks?: {
        fast?: Array<{
            name?: string,
            type?: string,
            damage?: string,
        }>, 
        special?: Array<{
            name?: string,
            type?: string,
            damage?: string,
        }>
    },
    weaknesses?: string,
    fleeRate?: string,
    maxCP?: string,
    evolutions?: {
        id?: string,
    },
    evolutionRequirements?: {
        amount?: string,
        name?: string,
    },
    maxHP?: string,
    image?: string,
}

export type searchPokemon = searchPokemonById | searchPokemonByName

export type searchPokemonById = {
    id:string
}

export type searchPokemonByName = {
    name:string | Record<string,unknown>
}
export type searchPokemons = {
    first:number
}

type pokemonsResponse = {
    pokemons: Pokemon[]
}

type pokemonResponse = {
    pokemon: Pokemon
}