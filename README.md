# 🏥 API Clínica Odontológica

API REST completa para agendamento de consultas odontológicas, desenvolvida em JavaScript com Express.js.

## 📋 Funcionalidades

### ✅ Consultas
- **Agendar nova consulta** - Cria um novo agendamento
- **Consultar horários disponíveis** - Verifica disponibilidade por profissional e data
- **Editar consulta já agendada** - Modifica dados de consultas existentes
- **Cancelar agendamento** - Cancela consultas agendadas
- **Listar consultas** - Visualiza todas as consultas ou uma específica

### ✅ Profissionais
- **Listar profissionais** - Visualiza todos os dentistas cadastrados
- **Consultar agenda** - Verifica agenda completa ou por data específica
- **Bloquear horários** - Bloqueia horários na agenda (Feriado, Férias, Almoço, Não Disponível)
- **Desbloquear horários** - Remove bloqueios de horários
- **Visualizar bloqueios** - Lista todos os bloqueios de um profissional

### ✅ Pacientes
- **Listar pacientes** - Visualiza todos os pacientes cadastrados
- **Consultar histórico** - Verifica histórico completo de consultas
- **Visualizar consultas** - Lista consultas de um paciente específico

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Swagger** - Documentação da API
- **Moment.js** - Manipulação de datas
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
projetoClinica/
├── data/
│   └── database.js          # Dados em memória
├── routes/
│   ├── consultas.js         # Rotas de consultas
│   ├── profissionais.js     # Rotas de profissionais
│   └── pacientes.js         # Rotas de pacientes
├── server.js                # Servidor principal
├── package.json             # Dependências
├── .gitignore              # Arquivos ignorados pelo Git
└── README.md               # Documentação
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Git (para controle de versão)

### Configuração do Git
O projeto inclui um arquivo `.gitignore` configurado para ignorar:
- **Dependências**: `node_modules/`, `package-lock.json`
- **Logs**: Arquivos de log e debug
- **Arquivos temporários**: Cache, arquivos de build
- **Arquivos do sistema**: `.DS_Store`, `Thumbs.db`
- **Arquivos de ambiente**: `.env`, `.env.local`
- **Arquivos de editor**: `.vscode/`, `.idea/`

### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd projetoClinica
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   # Modo produção
   npm start
   
   # Modo desenvolvimento (com nodemon)
   npm run dev
   ```

4. **Acesse a API**
   - **API Base**: `http://localhost:3000`
   - **Documentação Swagger**: `http://localhost:3000/api-docs`

## 📚 Documentação da API

### 🔗 Endpoints Principais

#### Consultas
- `GET /api/consultas` - Lista todas as consultas (inclui nomes do paciente e profissional)
- `POST /api/consultas/agendar` - Agenda nova consulta (inclui nomes do paciente e profissional)
- `GET /api/consultas/horarios-disponiveis` - Consulta horários disponíveis
- `PUT /api/consultas/:id` - Edita consulta existente (inclui nomes do paciente e profissional)
- `PATCH /api/consultas/:id/cancelar` - Cancela consulta (inclui nomes do paciente e profissional)
- `GET /api/consultas/:id` - Busca consulta específica (inclui nomes do paciente e profissional)

#### Profissionais
- `GET /api/profissionais` - Lista todos os profissionais
- `GET /api/profissionais/:id` - Busca profissional específico
- `GET /api/profissionais/:id/agenda` - Consulta agenda do profissional
- `POST /api/profissionais/:id/bloquear-horario` - Bloqueia horário
- `DELETE /api/profissionais/:id/desbloquear-horario` - Remove bloqueio
- `GET /api/profissionais/:id/bloqueios` - Lista bloqueios do profissional

#### Pacientes
- `GET /api/pacientes` - Lista todos os pacientes
- `GET /api/pacientes/:id` - Busca paciente específico
- `GET /api/pacientes/:id/consultas` - Lista consultas do paciente
- `GET /api/pacientes/:id/historico` - Histórico completo do paciente

## 📊 Dados Pré-cadastrados

### 👨‍⚕️ Profissionais (4 dentistas)
1. **Dr. Carlos Silva** - Ortodontia
2. **Dra. Ana Paula Santos** - Endodontia
3. **Dr. Roberto Oliveira** - Periodontia
4. **Dra. Mariana Costa** - Implantodontia

### 👥 Pacientes (4 pacientes)
1. **João Pedro Almeida** - CPF: 123.456.789-00
2. **Maria Fernanda Lima** - CPF: 987.654.321-00
3. **Pedro Henrique Santos** - CPF: 456.789.123-00
4. **Carolina Silva** - CPF: 789.123.456-00

### 🚫 Tipos de Bloqueio
- Feriado
- Férias
- Almoço
- Não Disponível

## 🔧 Exemplos de Uso

### Agendar uma consulta
```bash
curl -X POST http://localhost:3000/api/consultas/agendar \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": 1,
    "profissionalId": 1,
    "data": "2024-01-15",
    "horario": "14:00",
    "tipoConsulta": "Limpeza",
    "observacoes": "Primeira consulta"
  }'
```

### Consultar horários disponíveis
```bash
curl "http://localhost:3000/api/consultas/horarios-disponiveis?profissionalId=1&data=2024-01-15"
```

### Bloquear horário para profissional
```bash
curl -X POST http://localhost:3000/api/profissionais/1/bloquear-horario \
  -H "Content-Type: application/json" \
  -d '{
    "data": "2024-01-15",
    "horario": "12:00",
    "tipo": "Almoço",
    "motivo": "Pausa para almoço"
  }'
```

## 📖 Swagger

A documentação interativa da API está disponível através do Swagger UI:

**URL**: `http://localhost:3000/api-docs`

O Swagger permite:
- Visualizar todos os endpoints disponíveis
- Testar as APIs diretamente na interface
- Ver os schemas de dados
- Entender os parâmetros e respostas de cada endpoint

## 🧪 Testando a API

### 1. Verificar se o servidor está rodando
```bash
curl http://localhost:3000
```

### 2. Listar profissionais
```bash
curl http://localhost:3000/api/profissionais
```

### 3. Listar pacientes
```bash
curl http://localhost:3000/api/pacientes
```

### 4. Verificar horários disponíveis
```bash
curl "http://localhost:3000/api/consultas/horarios-disponiveis?profissionalId=1&data=2024-01-15"
```

## ⚠️ Observações Importantes

- **Dados em memória**: Esta API é para estudos de teste de software. Os dados são armazenados em memória e são perdidos quando o servidor é reiniciado.
- **Validações**: A API inclui validações básicas para evitar conflitos de horários e dados inválidos.
- **Horários**: Os horários disponíveis são de 9:00 às 18:00, com intervalos de 1 hora (9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00).
- **Datas**: A API não permite agendamentos em datas passadas.

## 🔄 Modificações Recentes

### Endpoints de Consultas Enriquecidos
Todos os endpoints de consultas agora retornam informações completas incluindo:
- **Paciente**: ID, nome e CPF
- **Profissional**: ID, nome e especialidade

**Benefícios:**
- ✅ Informações completas em uma única requisição
- ✅ Facilita o desenvolvimento de frontends
- ✅ Reduz o número de chamadas à API
- ✅ Melhora a experiência do desenvolvedor
- ✅ Padroniza o formato de resposta

### Horários de Agendamento Padronizados
Os horários de agendamento foram padronizados para todos os profissionais:
- **Horário de funcionamento**: 09:00 às 18:00
- **Intervalo entre consultas**: 1 hora
- **Horários disponíveis**: 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00
- **Total de horários**: 10 consultas por dia por profissional

**Benefícios:**
- ✅ Horários padronizados para todos os profissionais
- ✅ Facilita o agendamento e gestão da agenda
- ✅ Melhora a eficiência operacional
- ✅ Reduz conflitos de horários

## 🐛 Solução de Problemas

### Erro de porta em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Dependências não instaladas
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Licença

Este projeto é destinado exclusivamente para estudos de teste de software.

## 👨‍💻 Desenvolvimento

Para contribuir com o desenvolvimento:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido para estudos de teste de software** 🧪
