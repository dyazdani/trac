import supertest from 'supertest';
import app from '../../server/app.js';
const request = supertest(app)
import prisma from '../../utils/test/prisma.js';

describe('api/auth', () => {
    afterAll( async () => {
        await prisma.$disconnect();
    })

    describe('[POST] api/auth/register', () => {
        it('should respond with a `200` status code and user details', async () => {
            await prisma.$connect();
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
            expect(body.user.username).toBe('testusername');
            expect(body.user.email).toBe('test@email.com');
        })
    })
})