# Plano e Estratégia de Testes Adaptada

Baseado na ISO-29119-3.

## 1. Épico e Estimativa Geral de Esforço em Testes

**Épico:** Gestão Completa de Agendamento de Consulta
**Estimativa de Esforço:** Alta

## 2. User Stories e Estimativa de Esforço em Testes

| Código | Descrição                                     | Esforço (Pontos) |
|--------|-----------------------------------------------|------------------|
| US-01  | Agendar nova consulta                         | 5                |
| US-02  | Consultar horários disponíveis                | 3                |
| US-03  | Editar agendamento existente                  | 5                |
| US-04  | Cancelar agendamento                          | 5                |
| US-05  | Bloquear horários na agenda do profissional   | 3                |
| US-06  | Desbloquear horários na agenda do profissional| 3                |
| US-07  | Consultar agenda da clínica ou do profissional| 5                |

## 3. Condições de Teste e Camadas

### US-01: Agendar nova consulta

| ID    | Condição                                                  | Resultado Esperado | Camada |
|-------|-----------------------------------------------------------|--------------------|--------|
| 01.01 | Validar agendamento com horário disponível                | Sucesso            | API    |
| 01.02 | Validar agendamento com horário indisponível (sobrepondo) | Recusado           | API    |
| 01.03 | Validar agendamento com horário fora do expediente        | Recusado           | API    |
| 01.04 | Validar agendamento com paciente inexistente              | Recusado           | API    |
| 01.05 | Validar agendamento sem informar o profissional           | Recusado           | API    |
| 01.06 | Validar agendamento sem informar o paciente               | Recusado           | API    |
| 01.07 | Validar agendamento sem informar o horário                | Recusado           | API    |
| 01.08 | Validar agendamento sem informar a data                   | Recusado           | API    |

### US-02: Consultar horários disponíveis

| ID    | Condição                                                           | Resultado Esperado         | Camada |
|-------|--------------------------------------------------------------------|----------------------------|--------|
| 02.01 | Validar horários disponíveis para o profissional                   | Retorna na lista           | API    |
| 02.02 | Validar horários ocupados para o profissional                      | Não devem constar na lista | API    |

### US-03: Editar agendamento existente

| ID    | Condição                                                              | Resultado Esperado | Camada |
|-------|-----------------------------------------------------------------------|--------------------|--------|
| 03.01 | Validar edição de agendamento com horário disponível                  | Sucesso            | API    |
| 03.02 | Validar edição de agendamento com horário indisponível (sobrepondo)   | Recusado           | API    |
| 03.03 | Validar edição de agendamento com horário fora do expediente          | Recusado           | API    |
| 03.04 | Validar edição de agendamento com paciente inexistente                | Recusado           | API    |
| 03.05 | Validar edição de agendamento sem informar o profissional             | Recusado           | API    |
| 03.06 | Validar edição de agendamento sem informar o paciente                 | Recusado           | API    |
| 03.07 | Validar edição de agendamento sem informar o horário                  | Recusado           | API    |

### US-04: Cancelar agendamento

| ID    | Condição                                             | Resultado Esperado         | Camada |
|-------|------------------------------------------------------|----------------------------|--------|
| 04.01 | Validar Cancelamento                                 | Status fica como cancelada | API    |

### US-05: Bloquear horário na agenda do profissional

| ID    | Condição                                                          | Resultado Esperado | Camada |
|-------|-------------------------------------------------------------------|--------------------|--------|
| 05.01 | Validar bloqueio de horário disponível                            | Sucesso            | API    |
| 05.02 | Validar bloqueio de horário já bloqueado                          | Recusado           | API    |
| 05.03 | Validar bloqueio de horário com tipo de bloqueio não cadastrado   | Recusado           | API    |

### US-06: Desbloquear horário na agenda do profissional

| ID    | Condição                                        | Resultado Esperado | Camada |
|-------|-------------------------------------------------|--------------------|--------|
| 06.01 | Validar desbloqueio de horário bloqueado        | Retorna na lista   | API    |
| 06.02 | Validar desbloqueio de horário já disponível    | Recusado           | API    |

### US-07: Consultar agenda da clínica ou do profissional

| ID    | Condição                                                                  | Resultado Esperado | Camada |
|-------|---------------------------------------------------------------------------|--------------------|--------|
| 07.01 | Validar consulta de agendamento por data                                  | Sucesso            | API    |
| 07.02 | Validar consulta de agendamento por profissional                          | Sucesso            | API    |
| 07.03 | Validar consulta de agendamento por data e profissional                   | Sucesso            | API    |
| 07.04 | Validar consulta de agendamento por ordem ascendente                      | Sucesso            | API    |
| 07.05 | Validar consulta de agendamento por ordem descendente                     | Sucesso            | API    |

## 4. Missões de Teste Exploratório

- **Missão 1:** Explore o ciclo de vida completo das operações de agendamento (Criar, Consultar, Editar e Cancelar) e de bloqueio/desbloqueio de horários. Utilize heurísticas gerais de CRUD (Create, Read, Update e Delete) e siga os dados para descobrir a integridade e consistência dos dados de agendamento e suas dependências.

## 5. Testes Não-Funcionais

| Tipo      | Teste                                                               | Resultado Esperado             |
|-----------|---------------------------------------------------------------------|--------------------------------|
| Performance | Listagem de horários disponíveis para um profissional e uma data  | p90 de consulta < 500ms        |
| Performance | Agendamento de consultas                                          | p90 de agendamento < 300ms     |

## 6. Automação de Testes

| ID    | Condição                                                                  | Resultado Esperado                        | Camada  |
|-------|---------------------------------------------------------------------------|-------------------------------------------|---------|
| 01.01 | Validar agendamento com horário disponível                                | Sucesso                                   | API/WEB |
| 01.02 | Validar agendamento com horário indisponível (sobrepondo)                 | Recusado                                  | API     |
| 01.03 | Validar agendamento com horário fora do expediente                        | Recusado                                  | API     |
| 01.04 | Validar agendamento com paciente inexistente                              | Recusado                                  | API     |
| 01.05 | Validar agendamento sem informar o profissional                           | Recusado                                  | API/WEB |
| 01.06 | Validar agendamento sem informar o paciente                               | Recusado                                  | API/WEB |
| 01.07 | Validar agendamento sem informar o horário                                | Recusado                                  | API/WEB |
| 01.08 | Validar agendamento sem informar a data                                   | Recusado                                  | API/WEB |
| 02.01 | Validar horários disponíveis para o profissional                          | Retorna na lista                          | WEB     |
| 02.02 | Validar horários ocupados para o profissional                             | Não devem constar na lista                | WEB     |
| 03.01 | Validar edição de agendamento com horário disponível                      | Sucesso                                   | WEB     |
| 03.02 | Validar edição de agendamento com horário indisponível (sobrepondo)       | Recusado                                  | API    |
| 03.03 | Validar edição de agendamento com horário fora do expediente              | Recusado                                  | API    |
| 03.04 | Validar edição de agendamento com paciente inexistente                    | Recusado                                  | API    |
| 03.05 | Validar edição de agendamento sem informar o profissional                 | Recusado                                  | API    |
| 03.06 | Validar edição de agendamento sem informar o paciente                     | Recusado                                  | API    |
| 03.07 | Validar edição de agendamento sem informar o horário                      | Recusado                                  | API    |
| 04.01 | Validar Cancelamento                                                      | Status fica como cancelada                | WEB     |
| 05.01 | Validar bloqueio de horário disponível                                    | Sucesso                                   | API    |
| 05.02 | Validar bloqueio de horário já bloqueado                                  | Recusado                                  | API    |
| 06.01 | Validar desbloqueio de horário bloqueado                                  | Retorna na lista                          | API    |
| 06.02 | Validar desbloqueio de horário já disponível                              | Recusado                                  | API    |
| 07.01 | Validar consulta de agendamento por data                                  | Sucesso                                   | API    |
| 07.02 | Validar consulta de agendamento por profissional                          | Sucesso                                   | API    |
| 07.03 | Validar consulta de agendamento por data e profissional                   | Sucesso                                   | API    |
| 07.04 | Validar consulta de agendamento por ordem ascendente                      | Sucesso                                   | API    |
| 07.05 | Validar consulta de agendamento por ordem descendente                     | Sucesso                                   | API    |

## 7. Mapeamento dos Dados de Teste

| Dado                                                  | Tipo                  | Responsável        | Status     |
|-------------------------------------------------------|-----------------------|--------------------|------------|
| Paciente Existente                                    | Válido (Entidade)     | Analista de Testes | Concluído  |
| Paciente Inexistente                                  | Inválido (Entidade)   | Analista de Testes | Concluído  |
| Profissional Existente                                | Válido (Entidade)     | Analista de Testes | Concluído  |
| Profissional Inexistente                              | Inválido (Entidade)   | Analista de Testes | Concluído  |
| Horário Bloqueado (para tentativa de novo bloqueio)   | Inválido              | Analista de Testes | Em criação |
| Horário Disponível (para tentativa de bloqueio)       | Inválido              | Analista de Testes | Em criação |
| Horário Disponível (para realizar agendamento)        | Válido                | Analista de Testes | Concluído  |
| Agendamento Cancelado                                 | Válido                | Analista de Testes | Em criação |
| Horário Agendado (para tentativa de editar)           | Válido                | Analista de Testes | Concluído  |

## 8. Defeitos Conhecidos

| ID | Defeito                                                                                              | Camada |
|----|------------------------------------------------------------------------------------------------------|--------|
| 01 | Está sendo possível bloquear horário na agenda do profissional com "tipo de bloqueio" não cadastrado | API    |

```
Material extraído do curso Liderança em Testes de Software com Júlio de Lima. Saiba mais em www.juliodelima.com.br.