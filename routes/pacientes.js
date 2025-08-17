const express = require('express');
const { pacientes, consultas } = require('../data/database');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do paciente
 *         nome:
 *           type: string
 *           description: Nome completo do paciente
 *         cpf:
 *           type: string
 *           description: CPF do paciente
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *         email:
 *           type: string
 *           description: Email de contato
 *         telefone:
 *           type: string
 *           description: Telefone de contato
 *         endereco:
 *           type: string
 *           description: Endereço completo
 */

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Lista todos os pacientes
 *     tags: [Pacientes]
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: pacientes,
      total: pacientes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pacientes',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Busca um paciente específico
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const paciente = pacientes.find(p => p.id === parseInt(id));
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente não encontrado'
      });
    }

    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar paciente',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}/consultas:
 *   get:
 *     summary: Lista todas as consultas de um paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Lista de consultas retornada com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/:id/consultas', (req, res) => {
  try {
    const { id } = req.params;

    const paciente = pacientes.find(p => p.id === parseInt(id));
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente não encontrado'
      });
    }

    const consultasPaciente = consultas.filter(c => c.pacienteId === parseInt(id));

    res.json({
      success: true,
      data: {
        paciente: {
          id: paciente.id,
          nome: paciente.nome,
          cpf: paciente.cpf
        },
        consultas: consultasPaciente,
        total: consultasPaciente.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar consultas do paciente',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}/historico:
 *   get:
 *     summary: Busca histórico completo de um paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Histórico do paciente retornado com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/:id/historico', (req, res) => {
  try {
    const { id } = req.params;

    const paciente = pacientes.find(p => p.id === parseInt(id));
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente não encontrado'
      });
    }

    const consultasPaciente = consultas.filter(c => c.pacienteId === parseInt(id));

    // Separar consultas por status
    const consultasAgendadas = consultasPaciente.filter(c => c.status === 'agendada');
    const consultasCanceladas = consultasPaciente.filter(c => c.status === 'cancelada');
    const consultasRealizadas = consultasPaciente.filter(c => c.status === 'realizada');

    res.json({
      success: true,
      data: {
        paciente: {
          id: paciente.id,
          nome: paciente.nome,
          cpf: paciente.cpf,
          dataNascimento: paciente.dataNascimento,
          email: paciente.email,
          telefone: paciente.telefone,
          endereco: paciente.endereco
        },
        historico: {
          totalConsultas: consultasPaciente.length,
          consultasAgendadas: {
            total: consultasAgendadas.length,
            consultas: consultasAgendadas
          },
          consultasCanceladas: {
            total: consultasCanceladas.length,
            consultas: consultasCanceladas
          },
          consultasRealizadas: {
            total: consultasRealizadas.length,
            consultas: consultasRealizadas
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico do paciente',
      message: error.message
    });
  }
});

module.exports = router;
