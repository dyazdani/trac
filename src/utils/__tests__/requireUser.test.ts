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
                email: "an_email.com",
                username: "a_username",
                password: "Definitely not a BORING password"
            })
        expect(status).toBe(200);
    })
    // it('should allow access to endpoint that calls requireUser if user us logged in', async () => {       
    //     const { status } = await request
    //         .post('/api/auth/register')
    //         .send({
    //             email: "an_email.com",
    //             username: "a_username",
    //             password: "Definitely not a BORING password"
    //         })

    //     expect(status).toBe(200);
    // })
})

