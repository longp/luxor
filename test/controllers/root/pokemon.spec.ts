import app from '../../../src/app'
import request from 'supertest'

describe('GET /pokemon?name=squirtle', () => {
  it('try to get squirtle from api using name', async () => {
    const name = 'squirtle'
    const result = await request(app).get('/pokemon?name=' + name).expect(200)
    console.log(result.body)
    expect(result.body.pokemon.name.toLowerCase()).toEqual(name.toLowerCase())
  })

  it('try to get squirtle from api using id', async () => {
    const id = 'UG9rZW1vbjowMDc='
    const result = await request(app).get('/pokemon?id=' + id).expect(200)
    console.log(result.body)
    expect(result.body.pokemon.id).toEqual(id)
  })
  
})

