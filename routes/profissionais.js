const express = require('express');
const moment = require('moment');
const { profissionais, bloqueios, consultas, horariosDisponiveis } = require('../data/database');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profissional:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do profissional
 *         nome:
 *           type: string
 *           description: Nome completo do profissional
 *         especialidade:
 *           type: string
 *           description: Especialidade odontológica
 *         crm:
 *           type: string
 *           description: Número do CRM
 *         email:
 *           type: string
 *           description: Email de contato
 *         telefone:
 *           type: string
 *           description: Telefone de contato
 *         horarioTrabalho:
 *           type: object
 *           properties:
 *             inicio:
 *               type: string
 *               description: Horário de início do trabalho
 *             fim:
 *               type: string
 *               description: Horário de fim do trabalho
 *     Bloqueio:
 *       type: object
 *       required:
 *         - profissionalId
 *         - data
 *         - horario
 *         - tipo
 *         - motivo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do bloqueio
 *         profissionalId:
 *           type: integer
 *           description: ID do profissional
 *         data:
 *           type: string
 *           format: date
 *           description: Data do bloqueio
 *         horario:
 *           type: string
 *           description: Horário bloqueado
 *         tipo:
 *           type: string
 *           description: Tipo do bloqueio
 *         motivo:
 *           type: string
 *           description: Motivo do bloqueio
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do bloqueio
 */

/**
 * @swagger
 * /api/profissionais:
 *   get:
 *     summary: Lista todos os profissionais
 *     tags: [Profissionais]
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profissional'
 */
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: profissionais,
      total: profissionais.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar profissionais',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profissionais/{id}:
 *   get:
 *     summary: Busca um profissional específico
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const profissional = profissionais.find(p => p.id === parseInt(id));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    res.json({
      success: true,
      data: profissional
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar profissional',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profissionais/{id}/agenda:
 *   get:
 *     summary: Consulta agenda de um profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *         description: Data para consultar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Agenda retornada com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id/agenda', (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.query;

    const profissional = profissionais.find(p => p.id === parseInt(id));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    let consultasProfissional = [];
    let bloqueiosProfissional = [];

    if (data) {
      // Filtrar por data específica
      consultasProfissional = consultas.filter(c => 
        c.profissionalId === parseInt(id) && 
        c.data === data
      );
      bloqueiosProfissional = bloqueios.filter(b => 
        b.profissionalId === parseInt(id) && 
        b.data === data
      );
    } else {
      // Todas as consultas e bloqueios do profissional
      consultasProfissional = consultas.filter(c => c.profissionalId === parseInt(id));
      bloqueiosProfissional = bloqueios.filter(b => b.profissionalId === parseInt(id));
    }

    res.json({
      success: true,
      data: {
        profissional: {
          id: profissional.id,
          nome: profissional.nome,
          especialidade: profissional.especialidade
        },
        data: data || 'Todas as datas',
        consultas: consultasProfissional,
        bloqueios: bloqueiosProfissional,
        totalConsultas: consultasProfissional.length,
        totalBloqueios: bloqueiosProfissional.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar agenda',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profissionais/{id}/bloquear-horario:
 *   post:
 *     summary: Bloqueia um horário na agenda do profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - horario
 *               - tipo
 *               - motivo
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               tipo:
 *                 type: string
 *               motivo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Horário bloqueado com sucesso
 *       400:
 *         description: Dados inválidos ou horário já bloqueado
 *       404:
 *         description: Profissional não encontrado
 */
router.post('/:id/bloquear-horario', (req, res) => {
  try {
    const { id } = req.params;
    const { data, horario, tipo, motivo } = req.body;

    // Validações básicas
    if (!data || !horario || !tipo || !motivo) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Verificar se profissional existe
    const profissional = profissionais.find(p => p.id === parseInt(id));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    // Verificar se a data é válida
    const dataBloqueio = moment(data);
    if (!dataBloqueio.isValid()) {
      return res.status(400).json({
        success: false,
        error: 'Data inválida'
      });
    }

    // Verificar se o horário está disponível
    if (!horariosDisponiveis.includes(horario)) {
      return res.status(400).json({
        success: false,
        error: 'Horário inválido'
      });
    }

    // Verificar se já existe bloqueio no mesmo horário
    const bloqueioExistente = bloqueios.find(b => 
      b.profissionalId === parseInt(id) &&
      b.data === data &&
      b.horario === horario
    );

    if (bloqueioExistente) {
      return res.status(400).json({
        success: false,
        error: 'Horário já está bloqueado'
      });
    }

    // Verificar se há consulta agendada no horário
    const consultaExistente = consultas.find(c => 
      c.profissionalId === parseInt(id) &&
      c.data === data &&
      c.horario === horario &&
      c.status !== 'cancelada'
    );

    if (consultaExistente) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível bloquear horário com consulta agendada'
      });
    }

    // Criar novo bloqueio
    const novoBloqueio = {
      id: bloqueios.length > 0 ? Math.max(...bloqueios.map(b => b.id)) + 1 : 1,
      profissionalId: parseInt(id),
      data,
      horario,
      tipo,
      motivo,
      dataCriacao: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    bloqueios.push(novoBloqueio);

    res.status(201).json({
      success: true,
      message: 'Horário bloqueado com sucesso',
      data: novoBloqueio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao bloquear horário',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profissionais/{id}/desbloquear-horario:
 *   delete:
 *     summary: Remove bloqueio de um horário na agenda do profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *               - horario
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Horário desbloqueado com sucesso
 *       404:
 *         description: Profissional ou bloqueio não encontrado
 */
router.delete('/:id/desbloquear-horario', (req, res) => {
  try {
    const { id } = req.params;
    const { data, horario } = req.body;

    // Validações básicas
    if (!data || !horario) {
      return res.status(400).json({
        success: false,
        error: 'Data e horário são obrigatórios'
      });
    }

    // Verificar se profissional existe
    const profissional = profissionais.find(p => p.id === parseInt(id));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    // Buscar bloqueio para remover
    const bloqueioIndex = bloqueios.findIndex(b => 
      b.profissionalId === parseInt(id) &&
      b.data === data &&
      b.horario === horario
    );

    if (bloqueioIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bloqueio não encontrado'
      });
    }

    const bloqueioRemovido = bloqueios.splice(bloqueioIndex, 1)[0];

    res.json({
      success: true,
      message: 'Horário desbloqueado com sucesso',
      data: bloqueioRemovido
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao desbloquear horário',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profissionais/{id}/bloqueios:
 *   get:
 *     summary: Lista todos os bloqueios de um profissional
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Lista de bloqueios retornada com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id/bloqueios', (req, res) => {
  try {
    const { id } = req.params;

    const profissional = profissionais.find(p => p.id === parseInt(id));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    const bloqueiosProfissional = bloqueios.filter(b => b.profissionalId === parseInt(id));

    res.json({
      success: true,
      data: {
        profissional: {
          id: profissional.id,
          nome: profissional.nome,
          especialidade: profissional.especialidade
        },
        bloqueios: bloqueiosProfissional,
        total: bloqueiosProfissional.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar bloqueios',
      message: error.message
    });
  }
});

module.exports = router;
