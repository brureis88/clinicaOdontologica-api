const request = require('supertest')
const { expect } = require('chai')
const testUtils = require('./test-utils');
const postAgendarConsultas = require('../fixtures/postAgendarConsultas.json')

require('dotenv').config()

describe('GET /api/consultas', async () => {
    it('Validar agendamento com horário disponível', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.horario = testUtils.getValidTime()

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseTrueConsult(response, 201, 'Consulta agendada com sucesso')
        expect(response.body.data.horario).to.equal(bodyAgendarConsultas.horario)
    })

    it('Validar agendamento com horário indisponível', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.horario = '16:00'

        const resp = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        expect(resp.status).to.equal(201)

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Horário já está ocupado para este profissional')
    })

    it('Validar agendamento com horário fora do expediente', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.horario = '22:00'

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Horário inválido')
    })

    it('Validar agendamento com paciente inexistente', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.pacienteId = 9999

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 404, 'Paciente não encontrado')
    })

    it('Validar agendamento sem informar o profissional', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.profissionalId = null

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Todos os campos obrigatórios devem ser preenchidos')
    })

    it('Validar agendamento sem informar o paciente', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.pacienteId = null

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Todos os campos obrigatórios devem ser preenchidos')
    })

    it('Validar agendamento sem informar o horário', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = testUtils.getFutureDate(1)
        bodyAgendarConsultas.horario = null

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Todos os campos obrigatórios devem ser preenchidos')
    })

    it('Validar agendamento sem informar a data', async () => {
        const bodyAgendarConsultas = { ...postAgendarConsultas }
        bodyAgendarConsultas.data = null
        bodyAgendarConsultas.horario = testUtils.getFutureDate(1)

        const response = await request(process.env.BASE_URL)
            .post('/api/consultas/agendar')
            .set('Content-Type', 'application/json')
            .send(bodyAgendarConsultas)

        testUtils.validateResponseFalseConsult(response, 400, 'Todos os campos obrigatórios devem ser preenchidos')
    })
})