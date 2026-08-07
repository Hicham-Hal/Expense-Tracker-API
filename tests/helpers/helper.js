import request from 'supertest'
import app from '../../app.js'


let counter = 0

export async function createAuthedUser(override = {}){
    counter += 1

    const payload = {
        name: `user ${counter}`,
        email: `user${counter}@example.com`,
        password: 'userpwd123'
    }

    const res = await request(app).post('/register').send(payload)

    return {
        token: res.body.accessToken,
        email: payload.email,
        rawResponse: res
    }
}