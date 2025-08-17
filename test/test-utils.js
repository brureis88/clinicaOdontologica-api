const moment = require('moment');
const { expect } = require('chai')

// Utilitários para os testes
const testUtils = {
    // Gerar data futura para testes
    getFutureDate: (days = 1) => {
        return moment().add(days, 'days').format('YYYY-MM-DD');
    },

    getValidTime: () => {
        const hours = [9, 10, 11, 14, 15, 16, 17];
        const randomHour = hours[Math.floor(Math.random() * hours.length)];
        return `${randomHour.toString().padStart(2, '0')}:00`;
    },

    validateResponseFalseConsult: (res, statusCode, message) => {
        expect(res.status).to.equal(statusCode)
        expect(res.body.success).to.be.false
        expect(res.body.error).to.equal(message)
    },
    
    validateResponseTrueConsult: (res, statusCode, message) => {
        expect(res.status).to.equal(statusCode)
        expect(res.body.success).to.be.true
        expect(res.body.message).to.equal(message)
    },

}
module.exports = testUtils