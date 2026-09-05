const request = require('supertest')
const { expect } = require('chai')

describe.only('teste gerais', () => {
    it('deve realizar login com credenciais validas', async () => {
       const response = await request('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                            }
                        }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "123456"
                } 
            })
            expect(response.status).to.eq(200);
            expect(response.body.data.login.token).not.be.empty;
            expect(response.body.data.login.token).to.be.a.string;
    })

    it('nao deve realizar login com credenciais invalidas', async () => {
       const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                            }
                        }`,
                variables: {
                    email: "admin@admin.com",
                    senha: "1234567"
                }
            })
            expect(response.status).to.eq(200);
            expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    })

    it('nao deve realizar login com senha numerica', async () => {
       const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                            }
                        }`,
                variables: {
                    email: "admin@admin.com",
                    senha: 123
                }
            })
            expect(response.status).to.eq(400);
            expect(response.body.errors[0]).to.have.property('message', `Variable \"$senha\" got invalid value 123; String cannot represent a non string value: 123`);
    })

    it('nao deve realizar login com imail invalido', async () => {
       const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                            }
                        }`,
                variables: {
                    email: "admin@admin",
                    senha: "1234567"
                }
            })
            expect(response.status).to.eq(200);
            expect(response.body.errors[0]).to.have.property('message', 'Credenciais inválidas ou usuário inativo.');
    })

    it('nao deve realizar login com e-mail numerico', async () => {
       const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .send({
                query: `mutation Login($email: String!, $senha: String!) {
                        login(email: $email, senha: $senha) {
                            token
                            }
                        }`,
                variables: {
                    email: 1111,
                    senha: "1234567"
                }
            })

            expect(response.status).to.eq(400);
            expect(response.body.errors[0]).to.have.property('message', `Variable \"$email\" got invalid value 1111; String cannot represent a non string value: 1111`);
            expect(response.body.errors[0].extensions).to.have.property('code', `BAD_USER_INPUT`);
    })
})