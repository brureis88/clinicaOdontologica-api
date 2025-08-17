const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const consultasRoutes = require('./routes/consultas');
const profissionaisRoutes = require('./routes/profissionais');
const pacientesRoutes = require('./routes/pacientes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Clínica Odontológica',
      version: '1.0.0',
      description: 'API REST para agendamento de consultas odontológicas',
      contact: {
        name: 'Suporte',
        email: 'suporte@clinica.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de Desenvolvimento'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Rotas
app.use('/api/consultas', consultasRoutes);
app.use('/api/profissionais', profissionaisRoutes);
app.use('/api/pacientes', pacientesRoutes);

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Clínica Odontológica - Bem-vindo!',
    documentation: `/api-docs`,
    endpoints: {
      consultas: '/api/consultas',
      profissionais: '/api/profissionais',
      pacientes: '/api/pacientes'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 API Clínica Odontológica iniciada com sucesso!`);
});
