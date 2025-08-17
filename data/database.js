// Dados em memória para simular banco de dados
// Em produção, estes dados viriam de um banco de dados real

// Lista de profissionais dentistas
const profissionais = [
  {
    id: 1,
    nome: 'Dr. Carlos Silva',
    especialidade: 'Ortodontia',
    crm: '12345',
    email: 'carlos.silva@clinica.com',
    telefone: '(11) 99999-1111',
    horarioTrabalho: {
      inicio: '09:00',
      fim: '18:00'
    }
  },
  {
    id: 2,
    nome: 'Dra. Ana Paula Santos',
    especialidade: 'Endodontia',
    crm: '12346',
    email: 'ana.santos@clinica.com',
    telefone: '(11) 99999-2222',
    horarioTrabalho: {
      inicio: '09:00',
      fim: '18:00'
    }
  },
  {
    id: 3,
    nome: 'Dr. Roberto Oliveira',
    especialidade: 'Periodontia',
    crm: '12347',
    email: 'roberto.oliveira@clinica.com',
    telefone: '(11) 99999-3333',
    horarioTrabalho: {
      inicio: '09:00',
      fim: '18:00'
    }
  },
  {
    id: 4,
    nome: 'Dra. Mariana Costa',
    especialidade: 'Implantodontia',
    crm: '12348',
    email: 'mariana.costa@clinica.com',
    telefone: '(11) 99999-4444',
    horarioTrabalho: {
      inicio: '09:00',
      fim: '18:00'
    }
  }
];

// Lista de pacientes
const pacientes = [
  {
    id: 1,
    nome: 'João Pedro Almeida',
    cpf: '123.456.789-00',
    dataNascimento: '1985-03-15',
    email: 'joao.almeida@email.com',
    telefone: '(11) 88888-1111',
    endereco: 'Rua das Flores, 123 - São Paulo/SP'
  },
  {
    id: 2,
    nome: 'Maria Fernanda Lima',
    cpf: '987.654.321-00',
    dataNascimento: '1992-07-22',
    email: 'maria.lima@email.com',
    telefone: '(11) 88888-2222',
    endereco: 'Av. Paulista, 456 - São Paulo/SP'
  },
  {
    id: 3,
    nome: 'Pedro Henrique Santos',
    cpf: '456.789.123-00',
    dataNascimento: '1978-11-08',
    email: 'pedro.santos@email.com',
    telefone: '(11) 88888-3333',
    endereco: 'Rua Augusta, 789 - São Paulo/SP'
  },
  {
    id: 4,
    nome: 'Carolina Silva',
    cpf: '789.123.456-00',
    dataNascimento: '1990-05-12',
    email: 'carolina.silva@email.com',
    telefone: '(11) 88888-4444',
    endereco: 'Rua Oscar Freire, 321 - São Paulo/SP'
  }
];

// Lista de tipos de bloqueios
const tiposBloqueio = [
  'Feriado',
  'Férias',
  'Almoço',
  'Não Disponível'
];

// Lista de consultas agendadas
let consultas = [];

// Lista de bloqueios de horários
let bloqueios = [];

// Lista de horários disponíveis (gerados dinamicamente)
const gerarHorariosDisponiveis = () => {
  const horarios = [];
  for (let hora = 9; hora <= 18; hora++) {
    const horaStr = hora.toString().padStart(2, '0');
    horarios.push(`${horaStr}:00`);
  }
  return horarios;
};

const horariosDisponiveis = gerarHorariosDisponiveis();

module.exports = {
  profissionais,
  pacientes,
  tiposBloqueio,
  consultas,
  bloqueios,
  horariosDisponiveis
};
