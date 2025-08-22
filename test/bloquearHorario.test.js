const request = require('supertest')
const { expect } = require('chai')
const testUtils = require('./test-utils');
const postBloquearHorario = require('../fixtures/postBloquearHorario.json')

require('dotenv').config()

describe('POST /api/profissionais/{id}/bloquear-horario', async () => {
    it('Validar bloqueio de horário disponível', async () => {
        const bodyBloquearHorario = { ...postBloquearHorario }
        bodyBloquearHorario.data = testUtils.getFutureDate(1)
        bodyBloquearHorario.horario = '11:00'

        const response = await request(process.env.BASE_URL)
            .post('/api/profissionais/2/bloquear-horario')
            .set('Content-Type', 'application/json')
            .send(bodyBloquearHorario)

        testUtils.validateResponseTrueConsult(response, 201, 'Horário bloqueado com sucesso')
        expect(response.body.data.horario).to.equal(bodyBloquearHorario.horario)
    })
    
    it('Validar bloqueio de horário já bloqueado', async () => {
        const bodyBloquearHorario = { ...postBloquearHorario }
        bodyBloquearHorario.data = testUtils.getFutureDate(1)
        bodyBloquearHorario.horario = '11:00'

        const response = await request(process.env.BASE_URL)
            .post('/api/profissionais/2/bloquear-horario')
            .set('Content-Type', 'application/json')    
            .send(bodyBloquearHorario)

        testUtils.validateResponseFalseConsult(response, 400, 'Horário já está bloqueado')
    })

})