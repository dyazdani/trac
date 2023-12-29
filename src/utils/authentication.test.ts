import supertest from 'supertest';
import app from '../server/app.js';
const request = supertest(app)

describe('jsonwebtoken authentication middleware', () => {
    it('should allow access to routes that do not requireUser, and send 200 status code if user has a valid JSON web token', async () => {       
        let response;
        expect(response).toBeFalsy()

        response = await request
            .post('/api/auth/register')
            .send({
                email: "an_email.com",
                username: "a_username",
                password: "Definitely not a BORING password"
            })

        // Ensure that response was successful and that token was returned
        expect(response).toBeTruthy();
        expect(response.body.token).toBeTruthy();
        expect(response.status).toBe(200);

        // Ensure successful HTTP request if token is valid
        const { status } = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${response.body.token}`)

        expect(status).toBe(200);
    }),
    it('should respond with 401 status and error message if user uses invalid JSON web token', async () => {
        // Random JWT obtained from https://www.javainuse.com/jwtgenerator
        let invalidToken = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwMzc4NDc4MiwiaWF0IjoxNzAzNzg0NzgyfQ.16IB7vwOMSALWMrZncFvIZmkScoiIP605g4NSxbt4DM"

        const response = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${invalidToken}`)
        
        expect(response.status).toBe(401);
        expect(response.body.name).toMatch('JsonWebTokenError');
        expect(response.body.message).toMatch('invalid signature');
    }),
    it('should respond with 1 status and error message if user uses string that is not a token', async () => {
        let nonTokenString = "abcdefg"

        const response = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${nonTokenString}`)
        
        expect(response.status).toBe(401);
        expect(response.body.name).toMatch('JsonWebTokenError');
        expect(response.body.message).toMatch('jwt malformed');
    })
})