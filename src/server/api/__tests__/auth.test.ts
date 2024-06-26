import supertest from 'supertest';
import app from '../../app.js';
const request = supertest(app)
import prisma from '../../../utils/test/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

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

                const newUser = await prisma.user.findUnique({
                    where: {
                        email: 'test@email.com'
                    }
                })

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
            expect(jwt.verify(body.token, process.env.ACCESS_TOKEN_SECRET as string)).toHaveProperty('username');
            expect(jwt.verify(body.token, process.env.ACCESS_TOKEN_SECRET as string)).toBeTruthy();
        }),
        describe('Responses with 401 status codes', () => {
            it('should respond with a `401` status code if a user exists with the provided username', async () => {
                await prisma.user.create({
                    data: {
                      email: 'test4@email.com',
                      username: 'testusername4',
                      password: 'somepassword4'
                    }
                  })
        
                const { status, body } = await request
                    .post('/api/auth/register')
                    .send({
                        email: 'test3000@email.com',
                        username: 'testusername4',
                        password: 'somepassword4'
                    })
        
                expect(status).toBe(401)
                expect(body.name).toBe("RequestError")
                expect(body).not.toHaveProperty('user')
        
            }),
            it('should respond with a `401` status code if a user exists with the provided email', async () => {
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
                        username: 'testusername300',
                        password: 'somepassword3'
                    })
        
                expect(status).toBe(401)
                expect(body.name).toBe("RequestError")
                expect(body).not.toHaveProperty('user')
            }),
            it('should respond with a `401` status code if the email field is missing from request body', async () => {
                const { status, body } = await request
                    .post('/api/auth/register')
                    .send({
                        username: 'testusername5',
                        password: 'somepassword5'
                    })
        
                expect(status).toBe(401)
                expect(body.name).toBe("ValidationError")
                expect(body).not.toHaveProperty('user')
            }),
            it('should respond with a `401` status code if the username field is missing from request body', async () => {
                const { status, body } = await request
                    .post('/api/auth/register')
                    .send({
                        email: 'test77@email.com',
                        password: 'somepassword5'
                    })
        
                expect(status).toBe(401)
                expect(body.name).toBe("ValidationError")
                expect(body).not.toHaveProperty('user')
            }),
            it('should respond with a `401` status code if the password field is missing from request body', async () => {
                const { status, body } = await request
                    .post('/api/auth/register')
                    .send({
                        email: 'test88@email.com',
                        username: 'testuser88'
                    })
        
                expect(status).toBe(401)
                expect(body.name).toBe("MissingPassword")
                expect(body.message).toBe("Must include password when registering" )
                expect(body).not.toHaveProperty('user')
            })
        }),
        it('should encrypt password in the database', async () => {
            await request
                .post('/api/auth/register')
                .send({
                    email: 'test6@email.com',
                    username: 'testusername6',
                    password: 'somepassword6'
                })

            const user = await prisma.user.findUnique({
                where: {
                    email: 'test6@email.com'
                }
            })

            if (user) {
                expect(user.password).not.toBe('somepassword6');

                const match = await bcrypt.compare('somepassword6', user.password) 

                expect(match).toBe(true);
            }   
        })
    })

    describe('[POST] api/auth/login', () => {

        beforeAll( async () => { 
            await request
                 .post('/api/auth/register')
                 .send({
                        email: 'test100@email.com',
                        username: 'testusername100',
                        password: 'testpassword100'
                  })
        })
        
        it('should respond with a `200` status code and user details', async () => {
            const { status, body } = await request
                .post('/api/auth/login')
                .send({
                    email: 'test100@email.com',
                    password: 'testpassword100'
                })

            expect(status).toBe(200)
            expect(body.user.username).toBe('testusername100');
            expect(body.user.email).toBe('test100@email.com');
            //excludePassword helper function should make password return undefined
            expect(body.user.password).toBeUndefined();
            expect(body.user.isAdmin).toBe(false);
        }),
        it('should respond with a valid session token when successful', async () => {
            const { status, body } = await request
                .post('/api/auth/login')
                .send({
                    email: 'test100@email.com',
                    password: 'testpassword100'
                })
            
            expect(status).toBe(200);
            expect(body).toHaveProperty('token')
            expect(jwt.verify(body.token, process.env.ACCESS_TOKEN_SECRET as string)).toHaveProperty('username');
            expect(jwt.verify(body.token, process.env.ACCESS_TOKEN_SECRET as string)).toBeTruthy();
        }),
        it('should respond with a `401` status code if the provided email is not in the database', async () => {
            
            const { status, body } = await request
                .post('/api/auth/login')
                .send({
                    email: 'test110@email.com',
                    password: 'testpassword100'
                })
    
            expect(status).toBe(401)
            expect(body.name).toBe("RequestError")
            expect(body.message).toBe("Could not find the provided email")
            expect(body).not.toHaveProperty('user')
        }),
        it('should respond with a `401` status code if the provided password does not match', async () => {
            
            const { status, body } = await request
                .post('/api/auth/login')
                .send({
                    email: 'test100@email.com',
                    password: 'testpassword110'
                })
    
            expect(status).toBe(401)
            expect(body.name).toBe("IncorrectPassword")
            expect(body.message).toBe("The password you entered is incorrect")
            expect(body).not.toHaveProperty('user')
        })
    })
    
})