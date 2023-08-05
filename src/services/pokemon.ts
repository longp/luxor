import { request, gql } from 'graphql-request';
import { Pokemon, pokemonResponse, pokemonsResponse, searchPokemon } from '../types';
import prisma from '../prisma';

const getPokemon = async (argString: string): Promise<pokemonResponse | null> => {
    const document = gql`
    {
        pokemon(${argString}) {
            id
            number
            name
            weight {
                minimum
                maximum
            }
            height {
                minimum
                maximum
            }
            classification
            types
            resistant
            attacks {
                fast {
                    name
                    type
                    damage
                } 
                special {
                    name
                    type
                    damage
                }
            }
            weaknesses
            fleeRate
            maxCP
            evolutions {
                id
            }
            evolutionRequirements {
                amount
                name
            }
            maxHP
            image
        }
    }
    `

    try {
        const data: pokemonResponse = await request({
            url: 'https://graphql-pokemon2.vercel.app/',
            document,
            variables: {},
            requestHeaders: {},
        })
        if (data && data.pokemon) {
            let converted = convertPokemonObjectForPrisma(data.pokemon)
            const dbResponse = await prisma.pokemon.create({ data: converted })

            if (!dbResponse) throw new Error('Unable to store pokemon data')
            return data
        }
        else {
            throw new Error('Unable to retrieve data from pokemon graphql api')
        }
    } catch (error) {
        console.log(error)
        return null
    }
}


export const getPokemonByName = async (name: string) => {
    // pre check if pokemon is in our db first
    const qs = {
        name: {
            equals: name,
            mode: 'insensitive',
        },

    }
    const dbResponse = await getPokemonFromDB(qs)
    if (dbResponse) return dbResponse
    const argString = `name:"${name}"`
    return await getPokemon(argString)
}

export const getPokemonById = async (id: string) => {
    const dbResponse = await getPokemonFromDB({ id: id })
    if (dbResponse) return dbResponse

    const argString = `id:"${id}"`
    return await getPokemon(argString)
}

const getPokemonFromDB = async (qs: any) => {

    const data = await prisma.pokemon.findFirst({
        where: qs,
        include: { attacks: true }
    })

    if (data) {
        return { pokemon: revertPokemonObjectFromPrisma(data) }
    }

    return null

}
export const getPokemons = async (first: number): Promise<pokemonsResponse> => {
    const document = gql`
    {
        pokemons(first:${first}) {
            id
            number
            name
            weight {
                minimum
                maximum
            }
            height {
                minimum
                maximum
            }
            classification
            types
            resistant
            attacks {
                fast {
                    name
                    type
                    damage
                } 
                special {
                    name
                    type
                    damage
                }
            }
            weaknesses
            fleeRate
            maxCP
            evolutions {
                id
            }
            evolutionRequirements {
                amount
                name
            }
            maxHP
            image
        }
    }
    `
    try {
        const data: pokemonsResponse = await request({
            url: 'https://graphql-pokemon2.vercel.app/',
            document,
            variables: {},
            requestHeaders: {},
        })
        await insertNewPokemons(data)
        return data
    } catch (error) {
        console.log(error)
        return { pokemons: [] }
    }
}

const insertNewPokemons = async (data: pokemonsResponse) => {
    // insertPokemons that we dont have in DB
    const pokemonIds = data.pokemons.map((p: Pokemon) => p.id as string).filter(a => a)
    const storedPokemons = await prisma.pokemon.findMany({
        where: {
            id: { in: pokemonIds },
        },
        select: {
            id: true
        },
    })
    const storedPokemonIds = storedPokemons.map((p: Pokemon) => p.id as string)
    
    // for now just loop over and create the pokemons and the relational tables
    // @TODO maybe find a better way to bulk insert using createMany
    for (const pokemon of data.pokemons) {

        if (!storedPokemonIds.includes(pokemon.id as string)) {
            await prisma.pokemon.create({ data: convertPokemonObjectForPrisma(pokemon) })

        }

    }
}


const revertPokemonObjectFromPrisma = (data: any) => {
    let formattedAttack: any = { fast: [], special: [] }

    for (const attack of data.attacks) {
        if (formattedAttack[attack.attackType as keyof typeof formattedAttack]) {
            formattedAttack[attack.attackType as keyof typeof formattedAttack].push({
                name: attack.name,
                type: attack.type,
                damage: attack.damage
            })
        }
    }
    data.attacks = formattedAttack
    return data
}


const convertPokemonObjectForPrisma = (pokemon: Pokemon) => {
    let attacks = []
    if (pokemon.attacks?.fast) {
        for (const fast of pokemon.attacks.fast) {
            if(!fast.name) continue
            attacks.push({
                name: fast.name,
                type: fast.type,
                damage: fast.damage,
                attackType: "fast"
            })
        }
    }


    if (pokemon.attacks?.special) {
        for (const special of pokemon.attacks.special) {
            if(!special.name) continue
            attacks.push({
                name: special.name,
                type: special.type,
                damage: special.damage,
                attackType: "special"
            })
        }
    }
    return {
        id: pokemon.id!,
        name: pokemon.name!,
        number: pokemon.number!,
        weight: pokemon.weight!,
        height: pokemon.height!,
        classification: pokemon.classification!,
        types: pokemon.types!,
        resistant: pokemon.resistant!,
        weaknesses: pokemon.weaknesses!,
        fleeRate: pokemon.fleeRate!,
        maxCP: pokemon.maxCP!,
        evolutions: pokemon.evolutions!,
        evolutionRequirements: pokemon.evolutionRequirements!,
        maxHP: pokemon.maxHP!,
        image: pokemon.image!,
        attacks: {
            create:attacks
        }
    }
}


