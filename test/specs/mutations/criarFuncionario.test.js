const request = require('supertest')
const { expect } = require('chai')

describe('Criar funcionarios', () => {

    let cpf = Date.now()
    let nome = "teste funcionanrio"
    let salario_base = 10000
    let admissao = "2026-09-04"
    let desligamento = ""

    let token

    before(async ()=>{
        token = await request('http://localhost:4000/graphql')
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
        expect(token.status).to.eq(200);
        expect(token.body.data.login.token).not.be.empty;
        expect(token.body.data.login.token).to.be.a.string;
    })
    it('deve criar um funcionario com os dados validos', async () => {

        const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .set('Authorization', `Bearer ${token.body.data.login.token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
  }
}`,
                variables: {
                    "input": {
                        cpf: cpf.toString(),
                        nome: nome,
                        salario_base: salario_base,
                        admissao: admissao,
                        desligamento: desligamento
                    }
                }
            })
        expect(response.status).to.eq(200);
        expect(response.body.data.criarFuncionario.id).not.be.empty;
        expect(response.body.data.criarFuncionario.id).to.be.a.string;
        expect(response.body.data.criarFuncionario.cpf).to.be.eq(cpf.toString());
        expect(response.body.data.criarFuncionario.nome).to.be.eq(nome);
        expect(response.body.data.criarFuncionario.salario_base).to.be.eq(salario_base);
        expect(response.body.data.criarFuncionario.admissao).to.be.eq(admissao);
    })

    it('nao deve criar um funcionario com o salario base vazio', async () => {

        const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .set('Authorization', `Bearer ${token.body.data.login.token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
  }
}`,
                variables: {
                    "input": {
                        cpf: cpf.toString(),
                        nome: nome,
                        salario_base: "",
                        admissao: admissao,
                        desligamento: desligamento
                    }
                }
            })
        expect(response.status).to.eq(400);
        expect(response.body.errors[0]).to.have.property('message', `Variable \"$input\" got invalid value \"\" at \"input.salario_base\"; Float cannot represent non numeric value: \"\"`);
    })

    it('nao deve criar um funcionario com a admissão vazia', async () => {

        const response = await request('http://localhost:4000/graphql')
            .post('/graphql')
            .set('Authorization', `Bearer ${token.body.data.login.token}`)
            .send({
                query: `mutation CriarFuncionario($input: CriarFuncionarioInput!) {
                    criarFuncionario(input: $input) {
                        id
                        cpf
                        nome
                        salario_base
                        admissao
                        desligamento
  }
}`,
                variables: {
                    "input": {
                        cpf: cpf.toString(),
                        nome: nome,
                        salario_base: salario_base,
                        admissao: "",
                        desligamento: desligamento
                    }
                }
            })
        expect(response.status).to.eq(200);
        expect(response.body.errors[0]).to.have.property('message', `CPF, nome, salário base e admissão são obrigatórios.`);
    })
})
