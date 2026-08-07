import request from 'supertest'
import app from '../../app.js'
import { createAuthedUser } from '../helpers/helper.js'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { clearTestDb, closeTestDb, connectTestDb } from '../setup.js'

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

describe('POST /register', () => {
    it('creates a user and returns an access token', async() => {
        const res = await request(app).post('/register').send({
            name: 'user',
            email: 'email@gmail.com',
            password: 'useradd123'
        })

        expect(res.status).toBe(201)
        expect(res.body.token).toBeDefined()
        expect(res.body.password).toBeUndefined()
    })

    it('rejects an invalid email', async() => {
        const res = await request(app).post('/register').send({
            name: 'user',
            email: 'invalide-addres',
            password: 'useradd123'
        })

        expect(res.status).toBe(400)
    })

    it('returns 409 when the email is already registered', async() => {
        await request(app).post('/register').send({
            name: 'jane',
            email: 'add@gmail.com',
            password: 'usreadd123'
        }) 

        const res = await request(app).post('/register').send({
            name: 'user',
            email: 'add@gmail.com',
            password: 'useradd123'
        })
        

        expect(res.status).toBe(409)
    })
})

describe('POST /login', () => {
    it('logs in with correct credentials', async() => {
        await request(app).post('/register').send({
            name: 'jane',
            email: 'jane@gmail.com',
            password: 'janeDoe123'
        })

        const res = await request(app).post('/login').send({
            email: 'jane@gmail.com',
            password: 'janeDoe123'
        })

        expect(res.status).toBe(200)
        expect(res.body.token).toBeDefined()
    })

    it('returns 401 for an email that does not exist', async() => {
        const user = await createAuthedUser()

        const res = await request(app).post('/login').send({
            email: 'jane@gmail.com',
            password: 'janeDoe123'
        })

        expect(res.status).toBe(401)
    })

    it('returns 401 for wrong password', async() => {
        const user = await createAuthedUser({ email: 'jane@gmail.com' })

        const res = await request(app).post('/login').send({
            email: 'jane@gmail.com',
            password: 'janeDoe123'
        })

        expect(res.status).toBe(401)
    })
})