import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { createAuthedUser, createExpenses } from "../helpers/helper.js";
import { connectTestDb, clearTestDb, closeTestDb } from "../setup.js";
import request from "supertest";
import app from "../../app.js";

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

describe('POST /Expense', () => {
    it('return a new expense with valid tokens', async() => {
        const { token } = await createAuthedUser()
        const res = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'others'
        })

        expect(res.status).toBe(201)
        expect(res.body.data).toBeDefined()
    })

    it('return 401 for unauthorized user', async() => {
        const res = await request(app).post('/expense').send({
            description: 'subscription',
            amount: 1500,
            category: 'others'
        })

        expect(res.status).toBe(401)
    })

    it('returns 400 for empty description', async() => {
        const {token} = await createAuthedUser()

        const res = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: '',
            amount: 1500,
            category: 'others'
        })

        expect(res.status).toBe(400)
    })

    it('returns 400 for empty amount', async() => {
        const {token} = await createAuthedUser()

        const res = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            category: 'others'
        })

        expect(res.status).toBe(400)
    })

    it('returns 400 for no existed category', async() => {
        const {token} = await createAuthedUser()

        const res = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'ok'
        })

        expect(res.status).toBe(400)
    })
})

describe('PUT /Expense (update)', () => {
    it('update successfully with the correct user', async() => {
        const {token} = await createAuthedUser()
        const created = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'others',
        })
        const res = await request(app).put(`/expense/${created.body.data._id}`).set('Authorization', `Bearer ${token}`).send({
            description: 'subMonth',
            amount: 1200,
            category: 'others'
        })

        expect(res.status).toBe(200)
        expect(res.body.data).toBeDefined()
    })

    it('reject update another user\'s expense', async() => {
        const userA = await createAuthedUser()
        const userB = await createAuthedUser()

        const created = await request(app).post('/expense').set('Authorization', `Bearer ${userA.token}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'others'
        })

        const res = await request(app).put(`/expense/${created.body.data._id}`).set('Authorization', `Bearer ${userB.token}`).send({
            description: 'subMonth',
            amount: 1900,
            category: 'others'
        })

        expect(res.status).toBe(403)
    })

    it('reject update with no tokens', async() => {
        const {token} = await createAuthedUser()
        const created = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subMonth',
            amount: 1900,
            category: 'others'
        })

        const res = await request(app).put(`/expense/${created._id}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'others'
        })

        expect(res.status).toBe(401)
    })

    it('returns 404 for a no found expense', async() => {
        const { token } = await createAuthedUser()

        const res = await request(app).put(`/expense/507f1f77bcf86cd799439011`).set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1500,
            category: 'others'
        })

        expect(res.status).toBe(404)
    })
})

describe('DELETE /Expense (delete)', () => {
    it('delete successfully with the correct user', async() => {
        const {token} = await createAuthedUser()
        const created = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1900,
            category: 'others'
        })

        const res = await request(app).delete(`/expense/${created.body.data._id}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(204)
    })

    it('reject when a user try to delete another user\'s expense', async() => {
        const userA = await createAuthedUser()
        const userB = await createAuthedUser()

        const created = await request(app).post('/expense').set('Authorization', `Bearer ${userA.token}`).send({
            description: 'subscription',
            amount: 1900,
            category: 'others'
        })

        const res = await request(app).delete(`/expense/${created.body.data._id}`).set('Authorization', `Bearer ${userB.token}`)

        expect(res.status).toBe(403)
    })

    it('reject when the expense does not exist', async() => {
        const { token } = await createAuthedUser()

        const res = await request(app).delete(`/expense/507f1f77bcf86cd799439011`).set('Authorization', `Bearer ${token}`)
    
        expect(res.status).toBe(404)
    })

    it('reject when the user is not authenticated', async() => {
        const {token} = await createAuthedUser()

        const created = await request(app).post('/expense').set('Authorization', `Bearer ${token}`).send({
            description: 'subscription',
            amount: 1900,
            category: 'others'
        })

        const res = await request(app).delete(`/expense/${created.body.data._id}`)

        expect(res.status).toBe(401)
    })
})

describe('GET /Expense', () => {
    it('returns expenses for the requister user', async() => {
        const {token} = await createAuthedUser()
        const create = await createExpenses(token, 1)

        const res = await request(app).get('/expense').set('Authorization', `Bearer ${token}`)
        
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
    })

    it('rejects getting another user\'s expenses', async() => {
        const userA = await createAuthedUser()
        const userB = await createAuthedUser()

        const create = await createExpenses(userA.token, 2)

        const res = await request(app).get('/expense').set('Authorization', `Bearer ${userB.toekn}`)
    
        expect(res.status).toBe(403)
    })

    it('rejects getting expenses for unauthenticated user', async() => {
        const {token} = await createAuthedUser()
        const create = await createExpenses(token, 2)
    
        const res = await request(app).get('/expense')

        expect(res.status).toBe(401)
    })
})