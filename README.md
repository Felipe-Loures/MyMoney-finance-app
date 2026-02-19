# 💰 MyMoney — Sistema de Gestão Financeira
 O **MyMoney** é um sistema moderno de gestão financeira desenvolvido para centralizar, organizar e analisar informações financeiras de forma simples, segura e eficiente. Ideal para empresas, pequenos negócios e projetos que precisam de **controle financeiro em tempo real**.

## 1. Visão Geral
O sistema permite que o usuário registre movimentações financeiras, categorize-as entre ganhos e gastos, e visualize em tempo real o balanço total através de um dashboard responsivo.

## 2. Tecnologias Utilizadas
- HTML5
- CSS3
- BootStrap 5
- BootStrap Icons
- JavaScript (ES6+)

## 3. Arquitetura da Interface (Frontend)
O projeto segue uma estrutura de Single Page Application (SPA) simplificada, dividida em três seções principais:

## 🔝 Header (Navegação)

### 🎨 Identidade Visual
- Logotipo dinâmico **"MyMoney"**, reforçando a identidade visual da aplicação.
- Design limpo e moderno, alinhado à proposta de controle financeiro.

### 🎯 Acessibilidade e Usabilidade
- Botão **"Novo"** para criação de transações.
- Implementação de **foco automático** no campo de valor ao acionar o botão.
- Redução de cliques e otimização do fluxo de entrada de dados.

---

## 📊 Dashboard de Resumo

O dashboard utiliza um sistema de **cores semânticas** para facilitar a leitura e interpretação rápida das informações financeiras.

### 🟢 Ganhos
- Exibe a soma total de todas as entradas registradas.

### 🔴 Gastos
- Exibe a soma total de todas as saídas registradas.

### 🔵 Saldo Atual
- Exibe o resultado líquido da aplicação.
- Cálculo realizado dinamicamente:

```text
Saldo = Ganhos - Gastos
```

## 📝 Formulário de Transação

Responsável pelo registro das movimentações financeiras.

## 🧠 Inputs Inteligentes

- O campo de categoria utiliza <optgroup> para separar visualmente tipos de receitas e despesas.

- Organização clara entre ganhos e gastos para evitar erros de classificação.

## 🛡️ Validação

- Campos obrigatórios utilizando atributo required.

- Controle de casas decimais para valores monetários.

- Prevenção de envio com dados inválidos.

- Processamento via JavaScript sem recarregamento da página.

## 🗂️ Histórico Dinâmico

- Responsável por exibir todas as transações registradas.

## 📱💻 Dual View (Adaptação por Dispositivo)

O sistema detecta o tipo de dispositivo do usuário e adapta a visualização:

## 🖥️ Desktop

- Exibição em tabela para melhor aproveitamento de espaço.

- Organização estruturada em colunas (descrição, valor, tipo).

## 📱 Mobile 

- Exibição em lista de cards empilhados.

- Melhor usabilidade para interação por toque.

- Layout otimizado para telas menores.

## 🚫 Empty State

- Feedback visual quando não há registros.

- Exibição da mensagem: "Nenhum registro encontrado".

---

## 4. ⚙️ Funcionalidades

- Registro de novas transações (ganhos e gastos).
- Atualização automática do dashboard após cada inserção.
- Cálculo dinâmico do saldo total.
- Interface responsiva para diferentes dispositivos.
- Organização visual baseada em cores semânticas.
- Foco automático no campo de valor para agilizar o cadastro.

---

## 5. Estrutura de Funcionamento

A aplicação opera com renderização dinâmica dos dados no frontend, utilizando JavaScript para:

- 🔄 Manipulação do DOM.
- 🧮 Cálculo das somas de entradas e saídas.
- ⚡ Atualização em tempo real dos cards de resumo.
- 🗃️ Controle do estado das transações em memória.

---

## 📱 6. Responsividade

A interface foi desenvolvida com **Bootstrap 5**, garantindo:

- 📐 Layout adaptável para desktop, tablet e mobile.
- 🧩 Sistema de grid responsivo.
- ♻️ Componentes reutilizáveis e padronizados.

---

## 🎨 7. Experiência do Usuário (UX)

O design prioriza:

- 👁️ Clareza visual.
- ⚡ Rapidez na inserção de dados.
- 🔔 Feedback imediato após ações do usuário.
- 🧭 Organização intuitiva das informações financeiras.

---

# 🧠 Motor de Visualização (Dashboard)

O dashboard é composto por cards informativos que utilizam cores semânticas de reforço visual:

- 🟢 `border-success` → Indica fluxo de caixa positivo (Ganhos).
- 🔴 `border-danger` → Indica fluxo de caixa negativo (Gastos).
- 🔵 `border-primary` → Indica a liquidez total (Saldo Atual).

### 🎯 Hierarquia Visual

A hierarquia é reforçada por classes utilitárias personalizadas como:

- `ls-1` → Controle de letter-spacing.
- `fs-28` → Ajuste específico de font-size para destaque numérico.

Os valores principais são tratados como ponto focal da interface.

---

## 📜 Licença 
Este projeto está sob a licença MIT.
  
Copyright © 2026 - Felipe Loures
