import supertest from 'supertest';
import app from '../../server/app.js';
const request = supertest(app)

describe('requireUser middleware', () => {
    it('should prevent access to endpoint the if user is not logged in', async () => {       
        const { status, body } = await request
        .get('/api/users')

        expect(status).toBe(401);
        expect(body.message).toMatch('Must be logged in to access this route.')
    })
    it('should allow logged out users access to endpoint if endpoint does not call requireUser', async () => {       
        const { status } = await request
            .post('/api/auth/register')
            .send({
                email: "yet_another_email.com",
                username: "yet_another_username",
                password: "DefinitelyAGoodPassword"
            })
        expect(status).toBe(200);
    }),
    it('should allow access to endpoint that calls requireUser if user us logged in', async () => {       
        const { body } = await request
            .post('/api/auth/register')
            .send({
                email: "another_email.com",
                username: "another_username",
                password: "TheMostSecurePassword"
            })

            const token = body.token

            const { status} = await request
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)

        expect(status).toBe(200);
    })
})

