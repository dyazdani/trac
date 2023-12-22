import supertest from 'supertest';
import app from '../../server/app.js';
const request = supertest(app)
import prisma from '../../utils/test/prisma.js';
import jwt from 'jsonwebtoken';

describe('api/auth', () => {

    describe('[POST] api/auth/register', () => {
        it('should respond with a `200` status code and user details', async () => {
            const { status, body } = await request
                .post('/api/auth/register')
                .send({
                    email: 'test@email.com',
                    username: 'testusername',
                    password: 'testpassword'
                })

            const newUser = await prisma.user.findFirst()

            expect(status).toBe(200)
            expect(newUser).not.toBeNull()
            expect(body.user.id).toBe(newUser?.id);
            expect(body.user.dateCreated).toBeTruthy();
            expect(body.user.username).toBe('testusername');
            expect(body.user.email).toBe('test@email.com');
            //excludePassword helper function should make password return undefined
            expect(body.user.password).toBeUndefined();
            expect(body.user.isAdmin).toBe(false);
        }),
        it('should respond with a valid session token when successful', async () => {
            const { body } = await request
                .post('/api/auth/register')
                .send({
                    email: 'test2@email.com',
                    username: 'testusername2',
                    password: 'testpassword2'
                })
            
            expect(body).toHaveProperty('token')
            expect(jwt.verify(body.token, process.env.ACCESS_TOKEN_SECRET as string))
        }),
        it('should respond with a `400` status code if a user exists with the provided email', async () => {
            await prisma.user.create({
                data: {
                  email: 'test3@email.com',
                  username: 'testusername3',
                  password: 'somepassword3'
                }
              })

            const { status, body } = await request
                .post('/api/auth/register')
                .send({
                    email: 'test3@email.com',
                    username: 'testusername3',
                    password: 'somepassword3'
                })
    
            const count = await prisma.user.count()
            expect(status).toBe(400)
            expect(body.message).toBe("The server could not complete the request because a user with this email already exists." )
            expect(body).not.toHaveProperty('user')
            expect(count).toBe(1)
        })
    })
})