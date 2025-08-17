const express = require('express');
const moment = require('moment');
const { consultas, profissionais, pacientes, bloqueios, horariosDisponiveis } = require('../data/database');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Consulta:
 *       type: object
 *       required:
 *         - pacienteId
 *         - profissionalId
 *         - data
 *         - horario
 *         - tipoConsulta
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da consulta
 *         pacienteId:
 *           type: integer
 *           description: ID do paciente
 *         profissionalId:
 *           type: integer
 *           description: ID do profissional
 *         data:
 *           type: string
 *           format: date
 *           description: Data da consulta (YYYY-MM-DD)
 *         horario:
 *           type: string
 *           description: Horário da consulta (HH:MM)
 *         tipoConsulta:
 *           type: string
 *           description: Tipo da consulta
 *         observacoes:
 *           type: string
 *           description: Observações adicionais
 *         status:
 *           type: string
 *           enum: [agendada, cancelada, realizada]
 *           description: Status da consulta
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: Data de criação do agendamento
 *         paciente:
 *           type: object
 *           description: Informações do paciente
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do paciente
 *             nome:
 *               type: string
 *               description: Nome do paciente
 *             cpf:
 *               type: string
 *               description: CPF do paciente
 *         profissional:
 *           type: object
 *           description: Informações do profissional
 *           properties:
 *             id:
 *               type: integer
 *               description: ID do profissional
 *             nome:
 *               type: string
 *               description: Nome do profissional
 *             especialidade:
 *               type: string
 *               description: Especialidade do profissional
 */

/**
 * @swagger
 * /api/consultas:
 *   get:
 *     summary: Lista todas as consultas agendadas
 *     tags: [Consultas]
 *     responses:
 *       200:
 *         description: Lista de consultas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consulta'
 */
router.get('/', (req, res) => {
  try {
    // Enriquecer as consultas com dados do paciente e profissional
    const consultasEnriquecidas = consultas.map(consulta => {
      const paciente = pacientes.find(p => p.id === consulta.pacienteId);
      const profissional = profissionais.find(p => p.id === consulta.profissionalId);
      
      return {
        ...consulta,
        paciente: paciente ? {
          id: paciente.id,
          nome: paciente.nome,
          cpf: paciente.cpf
        } : null,
        profissional: profissional ? {
          id: profissional.id,
          nome: profissional.nome,
          especialidade: profissional.especialidade
        } : null
      };
    });

    res.json({
      success: true,
      data: consultasEnriquecidas,
      total: consultas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar consultas',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/consultas/agendar:
 *   post:
 *     summary: Agenda uma nova consulta
 *     tags: [Consultas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - profissionalId
 *               - data
 *               - horario
 *               - tipoConsulta
 *             properties:
 *               pacienteId:
 *                 type: integer
 *               profissionalId:
 *                 type: integer
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               tipoConsulta:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consulta agendada com sucesso
 *       400:
 *         description: Dados inválidos ou horário indisponível
 *       404:
 *         description: Paciente ou profissional não encontrado
 */
router.post('/agendar', (req, res) => {
  try {
    const { pacienteId, profissionalId, data, horario, tipoConsulta, observacoes } = req.body;

    // Validações básicas
    if (!pacienteId || !profissionalId || !data || !horario || !tipoConsulta) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    // Verificar se paciente existe
    const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente não encontrado'
      });
    }

    // Verificar se profissional existe
    const profissional = profissionais.find(p => p.id === parseInt(profissionalId));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    // Verificar se a data é válida e não é passada
    const dataConsulta = moment(data);
    if (!dataConsulta.isValid() || dataConsulta.isBefore(moment(), 'day')) {
      return res.status(400).json({
        success: false,
        error: 'Data inválida ou passada'
      });
    }

    // Verificar se o horário está disponível
    if (!horariosDisponiveis.includes(horario)) {
      return res.status(400).json({
        success: false,
        error: 'Horário inválido'
      });
    }

    // Verificar se já existe consulta no mesmo horário para o profissional
    const consultaExistente = consultas.find(c => 
      c.profissionalId === parseInt(profissionalId) &&
      c.data === data &&
      c.horario === horario &&
      c.status !== 'cancelada'
    );

    if (consultaExistente) {
      return res.status(400).json({
        success: false,
        error: 'Horário já está ocupado para este profissional'
      });
    }

    // Verificar se há bloqueio no horário
    const bloqueioExistente = bloqueios.find(b => 
      b.profissionalId === parseInt(profissionalId) &&
      b.data === data &&
      b.horario === horario
    );

    if (bloqueioExistente) {
      return res.status(400).json({
        success: false,
        error: 'Horário bloqueado para este profissional'
      });
    }

    // Criar nova consulta
    const novaConsulta = {
      id: consultas.length > 0 ? Math.max(...consultas.map(c => c.id)) + 1 : 1,
      pacienteId: parseInt(pacienteId),
      profissionalId: parseInt(profissionalId),
      data,
      horario,
      tipoConsulta,
      observacoes: observacoes || '',
      status: 'agendada',
      dataCriacao: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    consultas.push(novaConsulta);

    // Enriquecer a resposta com dados do paciente e profissional
    const consultaEnriquecida = {
      ...novaConsulta,
      paciente: {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf
      },
      profissional: {
        id: profissional.id,
        nome: profissional.nome,
        especialidade: profissional.especialidade
      }
    };

    res.status(201).json({
      success: true,
      message: 'Consulta agendada com sucesso',
      data: consultaEnriquecida
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao agendar consulta',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/consultas/horarios-disponiveis:
 *   get:
 *     summary: Consulta horários disponíveis
 *     tags: [Consultas]
 *     parameters:
 *       - in: query
 *         name: profissionalId
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
 *         description: Horários disponíveis retornados com sucesso
 */
router.get('/horarios-disponiveis', (req, res) => {
  try {
    const { profissionalId, data } = req.query;

    if (!profissionalId || !data) {
      return res.status(400).json({
        success: false,
        error: 'ProfissionalId e data são obrigatórios'
      });
    }

    // Verificar se profissional existe
    const profissional = profissionais.find(p => p.id === parseInt(profissionalId));
    if (!profissional) {
      return res.status(404).json({
        success: false,
        error: 'Profissional não encontrado'
      });
    }

    // Verificar se a data é válida
    const dataConsulta = moment(data);
    if (!dataConsulta.isValid()) {
      return res.status(400).json({
        success: false,
        error: 'Data inválida'
      });
    }

    // Filtrar horários ocupados por consultas
    const horariosOcupados = consultas
      .filter(c => 
        c.profissionalId === parseInt(profissionalId) &&
        c.data === data &&
        c.status !== 'cancelada'
      )
      .map(c => c.horario);

    // Filtrar horários bloqueados
    const horariosBloqueados = bloqueios
      .filter(b => 
        b.profissionalId === parseInt(profissionalId) &&
        b.data === data
      )
      .map(b => b.horario);

    // Calcular horários disponíveis
    const horariosDisponiveisProfissional = horariosDisponiveis.filter(horario => 
      !horariosOcupados.includes(horario) && 
      !horariosBloqueados.includes(horario)
    );

    res.json({
      success: true,
      data: {
        profissional: {
          id: profissional.id,
          nome: profissional.nome,
          especialidade: profissional.especialidade
        },
        data,
        horariosDisponiveis: horariosDisponiveisProfissional,
        totalHorarios: horariosDisponiveisProfissional.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar horários disponíveis',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/consultas/{id}:
 *   put:
 *     summary: Edita uma consulta já agendada
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da consulta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: date
 *               horario:
 *                 type: string
 *               tipoConsulta:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Consulta editada com sucesso
 *       404:
 *         description: Consulta não encontrada
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { data, horario, tipoConsulta, observacoes } = req.body;

    const consultaIndex = consultas.findIndex(c => c.id === parseInt(id));
    if (consultaIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Consulta não encontrada'
      });
    }

    const consulta = consultas[consultaIndex];

    // Verificar se a consulta não foi cancelada
    if (consulta.status === 'cancelada') {
      return res.status(400).json({
        success: false,
        error: 'Não é possível editar uma consulta cancelada'
      });
    }

    // Se estiver alterando data/horário, verificar disponibilidade
    if ((data && data !== consulta.data) || (horario && horario !== consulta.horario)) {
      const novaData = data || consulta.data;
      const novoHorario = horario || consulta.horario;

      // Verificar se já existe consulta no novo horário
      const consultaExistente = consultas.find(c => 
        c.id !== parseInt(id) &&
        c.profissionalId === consulta.profissionalId &&
        c.data === novaData &&
        c.horario === novoHorario &&
        c.status !== 'cancelada'
      );

      if (consultaExistente) {
        return res.status(400).json({
          success: false,
          error: 'Novo horário já está ocupado'
        });
      }

      // Verificar se há bloqueio no novo horário
      const bloqueioExistente = bloqueios.find(b => 
        b.profissionalId === consulta.profissionalId &&
        b.data === novaData &&
        b.horario === novoHorario
      );

      if (bloqueioExistente) {
        return res.status(400).json({
          success: false,
          error: 'Novo horário está bloqueado'
        });
      }
    }

    // Atualizar consulta
    if (data) consulta.data = data;
    if (horario) consulta.horario = horario;
    if (tipoConsulta) consulta.tipoConsulta = tipoConsulta;
    if (observacoes !== undefined) consulta.observacoes = observacoes;

    // Enriquecer a resposta com dados do paciente e profissional
    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    const profissional = profissionais.find(p => p.id === consulta.profissionalId);
    
    const consultaEnriquecida = {
      ...consulta,
      paciente: paciente ? {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf
      } : null,
      profissional: profissional ? {
        id: profissional.id,
        nome: profissional.nome,
        especialidade: profissional.especialidade
      } : null
    };

    res.json({
      success: true,
      message: 'Consulta editada com sucesso',
      data: consultaEnriquecida
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao editar consulta',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/consultas/{id}/cancelar:
 *   patch:
 *     summary: Cancela um agendamento
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta cancelada com sucesso
 *       404:
 *         description: Consulta não encontrada
 */
router.patch('/:id/cancelar', (req, res) => {
  try {
    const { id } = req.params;

    const consulta = consultas.find(c => c.id === parseInt(id));
    if (!consulta) {
      return res.status(404).json({
        success: false,
        error: 'Consulta não encontrada'
      });
    }

    if (consulta.status === 'cancelada') {
      return res.status(400).json({
        success: false,
        error: 'Consulta já foi cancelada'
      });
    }

    consulta.status = 'cancelada';

    // Enriquecer a resposta com dados do paciente e profissional
    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    const profissional = profissionais.find(p => p.id === consulta.profissionalId);
    
    const consultaEnriquecida = {
      ...consulta,
      paciente: paciente ? {
        id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf
      } : null,
      profissional: profissional ? {
        id: profissional.id,
        nome: profissional.nome,
        especialidade: profissional.especialidade
      } : null
    };

    res.json({
      success: true,
      message: 'Consulta cancelada com sucesso',
      data: consultaEnriquecida
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao cancelar consulta',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/consultas/{id}:
 *   get:
 *     summary: Busca uma consulta específica
 *     tags: [Consultas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da consulta
 *     responses:
 *       200:
 *         description: Consulta encontrada com sucesso
 *       404:
 *         description: Consulta não encontrada
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const consulta = consultas.find(c => c.id === parseInt(id));
    if (!consulta) {
      return res.status(404).json({
        success: false,
        error: 'Consulta não encontrada'
      });
    }

    // Buscar informações do paciente e profissional
    const paciente = pacientes.find(p => p.id === consulta.pacienteId);
    const profissional = profissionais.find(p => p.id === consulta.profissionalId);

    res.json({
      success: true,
      data: {
        ...consulta,
        paciente: paciente ? {
          id: paciente.id,
          nome: paciente.nome,
          cpf: paciente.cpf
        } : null,
        profissional: profissional ? {
          id: profissional.id,
          nome: profissional.nome,
          especialidade: profissional.especialidade
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar consulta',
      message: error.message
    });
  }
});

module.exports = router;
