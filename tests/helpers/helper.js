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
        token: res.body.token,
        email: payload.email,
        rawResponse: res
    }
}

let increment = 0

export async function createExpenses(token, count){
    increment += 1;

    const payload = {
        description: `subscription ${increment}`,
        amount: `${increment} * 100`,
        category: 'others'
    }
    for(let i = 1; i <= count; i++){
        await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send(payload)
    }
}