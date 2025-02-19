/* uiManager.js - Funções para gerenciar as interfaces das demais telas (Serviços, Financeiro, Corte, Barbeiros e Agendamentos)
   Nota: Esta parte contém as funções consolidadas que já existem,
         e agora corrigidas para evitar duplicações e melhorar a manutenção.
*/

/* =========================================
   FUNÇÃO AUXILIAR PARA OCULTAR SEÇÕES
   =========================================
   - Certifique-se de que ela exista também
     no escopo global (ex.: main.js).
*/
function ocultarSecoes() {
  const sections = ['dashboard-section', 'extra-dashboard-section', 'form-container', 'table-container'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
}

/* ─────────────── Serviços ─────────────── */

/**
 * Exibe o formulário para cadastrar um novo serviço.
 */
function mostrarFormularioNovoServico() {
  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Novo Serviço';
  document.getElementById('section-controls').innerHTML = '';

  formContainer.innerHTML = `
    <form id="novoServicoForm">
      <div>
        <label for="nomeServico">Nome do Serviço:</label>
        <input type="text" id="nomeServico" required />
      </div>
      <div>
        <label for="precoServico">Preço (R$):</label>
        <input type="number" step="0.01" id="precoServico" placeholder="Ex: 30.00" />
      </div>
      <div>
        <label for="duracaoServico">Duração (min):</label>
        <input type="number" id="duracaoServico" placeholder="Ex: 30" />
      </div>
      <button type="submit">Salvar Serviço</button>
    </form>
  `;

  const form = document.getElementById('novoServicoForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const servico = {
      nome: document.getElementById('nomeServico').value,
      preco: parseFloat(document.getElementById('precoServico').value) || 0,
      duracao: parseInt(document.getElementById('duracaoServico').value) || 0
    };

    await cadastrarServico(servico);
    showNotification('Serviço salvo com sucesso!', 'success');
    form.reset();
  });
}

/**
 * Exibe a tela para gerenciar os serviços cadastrados (listar, editar e excluir).
 */
async function mostrarGerenciarServicos() {
  ocultarSecoes();
  const tableContainer = document.getElementById('table-container');
  tableContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Gerenciar Serviços';
  document.getElementById('section-controls').innerHTML = '';

  const servicos = await listarServicos();

  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Duração (min)</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${servicos.map(s => `
          <tr>
            <td>${s.id}</td>
            <td>${s.nome}</td>
            <td>R$ ${s.preco || 0}</td>
            <td>${s.duracao || 0}</td>
            <td>
              <button data-editar="${s.id}">Editar</button>
              <button data-excluir="${s.id}">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  tableContainer.innerHTML = html;

  // Excluir serviço
  document.querySelectorAll('button[data-excluir]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-excluir'));
      await deletarServico(id);
      mostrarGerenciarServicos();
    });
  });

  // Editar serviço
  document.querySelectorAll('button[data-editar]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-editar'));
      mostrarFormularioEditarServico(id);
    });
  });
}

/**
 * Exibe o formulário para editar um serviço existente.
 * @param {number} servicoId - ID do serviço a ser editado.
 */
async function mostrarFormularioEditarServico(servicoId) {
  const servico = await buscarServico(servicoId);
  if (!servico) {
    showNotification('Serviço não encontrado.', 'error');
    return;
  }

  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = `Editar Serviço #${servicoId}`;
  document.getElementById('section-controls').innerHTML = '';

  formContainer.innerHTML = `
    <form id="editarServicoForm">
      <div>
        <label for="nomeServicoEdit">Nome do Serviço:</label>
        <input type="text" id="nomeServicoEdit" value="${servico.nome}" required />
      </div>
      <div>
        <label for="precoServicoEdit">Preço (R$):</label>
        <input type="number" step="0.01" id="precoServicoEdit" value="${servico.preco || 0}" />
      </div>
      <div>
        <label for="duracaoServicoEdit">Duração (min):</label>
        <input type="number" id="duracaoServicoEdit" value="${servico.duracao || 0}" />
      </div>
      <button type="submit">Salvar Alterações</button>
    </form>
  `;

  const form = document.getElementById('editarServicoForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    servico.nome = document.getElementById('nomeServicoEdit').value;
    servico.preco = parseFloat(document.getElementById('precoServicoEdit').value) || 0;
    servico.duracao = parseInt(document.getElementById('duracaoServicoEdit').value) || 0;

    await cadastrarServico(servico);
    showNotification('Serviço atualizado!', 'success');
    mostrarGerenciarServicos();
  });
}

/* ─────────────── Financeiro ─────────────── */

/**
 * Exibe o formulário para cadastrar uma nova despesa.
 */
function mostrarNovaDespesa() {
  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Nova Despesa';
  document.getElementById('section-controls').innerHTML = '';

  formContainer.innerHTML = `
    <form id="novaDespesaForm">
      <div>
        <label for="descricaoDespesa">Descrição:</label>
        <input type="text" id="descricaoDespesa" required />
      </div>
      <div>
        <label for="valorDespesa">Valor (R$):</label>
        <input type="number" step="0.01" id="valorDespesa" placeholder="Ex: 20.00" />
      </div>
      <button type="submit">Salvar</button>
    </form>
  `;

  const form = document.getElementById('novaDespesaForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const despesa = {
      descricao: document.getElementById('descricaoDespesa').value,
      valor: parseFloat(document.getElementById('valorDespesa').value) || 0
    };

    await saveData('despesas', despesa);
    showNotification('Despesa salva com sucesso!', 'success');
    form.reset();
  });
}

/**
 * Exibe um relatório financeiro (ainda em desenvolvimento).
 */
async function mostrarRelatorioFinanceiro() {
  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Relatório Financeiro';
  document.getElementById('section-controls').innerHTML = '';

  // Caso já tenha uma função gerarRelatorioFinanceiro() em relatorios.js
  const relatorioHTML = await gerarRelatorioFinanceiro(); 
  formContainer.innerHTML = `<div>${relatorioHTML}</div>`;
}

/* ─────────────── Corte ─────────────── */

/**
 * Exibe o formulário para cadastrar um novo corte.
 */
async function mostrarFormularioNovoCorte() {
  // Oculta as seções de dashboard
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('extra-dashboard-section').classList.add('hidden');

  // Mostra apenas o form-container
  document.getElementById('form-container').classList.remove('hidden');
  document.getElementById('table-container').classList.add('hidden');

  // Atualiza títulos
  document.getElementById('section-title').textContent = 'Novo Corte';
  document.getElementById('section-controls').innerHTML = '';

  // Carrega serviços e funcionários em paralelo
  const [servicos, funcionarios] = await Promise.all([listarServicos(), listarFuncionarios()]);
  const barbeiros = ['Brutos', ...funcionarios.map(f => f.nome)];

  // Monta options
  const optionsBarbeiros = barbeiros.map(b => `<option value="${b}">${b}</option>`).join('');
  const optionsServicos = servicos.map(s => `<option value="${s.id}" data-valor="${s.preco || 0}">${s.nome}</option>`).join('');

  // Formulário
  document.getElementById('form-container').innerHTML = `
    <form id="novoCorteForm">
      <div>
        <label for="servicoCorte">Serviço:</label>
        <select id="servicoCorte" required>
          <option value="">--Selecione--</option>
          ${optionsServicos}
        </select>
      </div>
      <div>
        <label for="barbeiroCorte">Barbeiro:</label>
        <select id="barbeiroCorte" required>
          <option value="">--Selecione--</option>
          ${optionsBarbeiros}
        </select>
      </div>
      <div>
        <label for="formaPagamento">Forma de Pagamento:</label>
        <select id="formaPagamento" required>
          <option value="">--Selecione--</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão">Cartão</option>
          <option value="Pix">Pix</option>
        </select>
      </div>
      <div>
        <label for="valorCorte">Valor (R$):</label>
        <input type="number" step="0.01" id="valorCorte" placeholder="Ex: 25.00" />
      </div>
      <div>
        <label for="comissaoValor">Comissão do Barbeiro (R$):</label>
        <input type="number" id="comissaoValor" readonly />
      </div>
      <div>
        <label for="lucroBrutos">Lucro da Barbearia (R$):</label>
        <input type="number" id="lucroBrutos" readonly />
      </div>
      <button type="submit">Salvar Corte</button>
    </form>
  `;

  // Função para recalcular comissão e lucro
  function calcularComissao() {
    const valorCorte = parseFloat(document.getElementById('valorCorte').value) || 0;
    const barbeiroSelecionado = document.getElementById('barbeiroCorte').value;

    const funcionario = funcionarios.find(f => f.nome === barbeiroSelecionado);
    const comissaoPercentual = funcionario ? funcionario.comissao : 0;

    const comissaoValor = (valorCorte * comissaoPercentual) / 100;
    const lucroBrutos = valorCorte - comissaoValor;

    document.getElementById('comissaoValor').value = comissaoValor.toFixed(2);
    document.getElementById('lucroBrutos').value = lucroBrutos.toFixed(2);
  }

  // Event listeners para recalcular
  document.getElementById('servicoCorte').addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const valorServico = selectedOption.getAttribute('data-valor') || '0';
    document.getElementById('valorCorte').value = valorServico;
    calcularComissao();
  });
  document.getElementById('barbeiroCorte').addEventListener('change', calcularComissao);
  document.getElementById('valorCorte').addEventListener('input', calcularComissao);

  // Lógica de submissão
  document.getElementById('novoCorteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const servicoId = parseInt(document.getElementById('servicoCorte').value);
    const barbeiro = document.getElementById('barbeiroCorte').value;
    const formaPagamento = document.getElementById('formaPagamento').value;
    const valor = parseFloat(document.getElementById('valorCorte').value) || 0;
    const comissao = parseFloat(document.getElementById('comissaoValor').value) || 0;
    const lucro = parseFloat(document.getElementById('lucroBrutos').value) || 0;

    if (!servicoId || !barbeiro || !formaPagamento) {
      showNotification('Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    const novoCorte = {
      servicoId,
      barbeiro,
      formaPagamento,
      valor,
      comissao,
      lucro,
      data: new Date().toISOString()
    };

    await saveData('cortes', novoCorte);
    showNotification('Corte salvo com sucesso!', 'success');

    // Se quiser voltar ao dashboard, chame mostrarDashboard() se definido;
    // ou então exiba algo como "mostrarGerenciarCortes()".
    // aqui vamos apenas ocultar secões e exibir uma notificação:
    // ocultarSecoes();
    // Ou defina a sua preferência de navegação
  });
}

/* ─────────────── Agendamentos ─────────────── */

/**
 * Exibe o formulário para cadastrar um novo agendamento.
 * Campos: Serviço, Horário, Nome do Cliente e Barbeiro.
 */
async function mostrarFormularioNovoAgendamento() {
  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Novo Agendamento';
  document.getElementById('section-controls').innerHTML = '';

  // Recupera dados dos serviços e funcionários em paralelo
  const [servicos, funcionarios] = await Promise.all([listarServicos(), listarFuncionarios()]);

  const optionsServicos = servicos.map(s => `<option value="${s.id}">${s.nome}</option>`).join('');
  const barbeiros = ['Brutos', ...funcionarios.map(f => f.nome)];
  const optionsBarbeiros = barbeiros.map(b => `<option value="${b}">${b}</option>`).join('');

  formContainer.innerHTML = `
    <form id="novoAgendamentoForm">
      <div>
        <label for="servicoAgendamento">Serviço:</label>
        <select id="servicoAgendamento" required>
          <option value="">--Selecione--</option>
          ${optionsServicos}
        </select>
      </div>
      <div>
        <label for="horarioAgendamento">Horário:</label>
        <input type="datetime-local" id="horarioAgendamento" required />
      </div>
      <div>
        <label for="clienteAgendamento">Nome do Cliente:</label>
        <input type="text" id="clienteAgendamento" required />
      </div>
      <div>
        <label for="barbeiroAgendamento">Barbeiro:</label>
        <select id="barbeiroAgendamento" required>
          <option value="">--Selecione--</option>
          ${optionsBarbeiros}
        </select>
      </div>
      <button type="submit">Salvar Agendamento</button>
    </form>
  `;

  document.getElementById('novoAgendamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const servicoId = parseInt(document.getElementById('servicoAgendamento').value);
    const horario = document.getElementById('horarioAgendamento').value;
    const cliente = document.getElementById('clienteAgendamento').value.trim();
    const barbeiro = document.getElementById('barbeiroAgendamento').value;

    if (!servicoId || !horario || !cliente || !barbeiro) {
      showNotification('Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    const novoAgendamento = {
      servicoId,
      horario,
      cliente,
      barbeiro,
      data: new Date().toISOString()
    };

    try {
      await saveData('agendamentos', novoAgendamento);
      showNotification('Agendamento salvo com sucesso!', 'success');
      mostrarAgendamentos();  // Exibe a lista de agendamentos após o cadastro
    } catch (err) {
      console.error('Erro ao salvar agendamento:', err);
      showNotification('Erro ao salvar agendamento.', 'error');
    }
  });
}

/**
 * Exibe a lista de agendamentos cadastrados em formato de tabela.
 */
async function mostrarAgendamentos() {
  ocultarSecoes();
  const tableContainer = document.getElementById('table-container');
  tableContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Agendamentos';
  document.getElementById('section-controls').innerHTML = '';

  // Recupera todos os agendamentos
  const agendamentos = await getAllData('agendamentos');

  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Serviço</th>
          <th>Horário</th>
          <th>Cliente</th>
          <th>Barbeiro</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${agendamentos.map(a => `
          <tr>
            <td>${a.id}</td>
            <td>${a.servicoId}</td>
            <td>${a.horario}</td>
            <td>${a.cliente}</td>
            <td>${a.barbeiro}</td>
            <td>
              <button data-editar-agendamento="${a.id}">Editar</button>
              <button data-excluir-agendamento="${a.id}">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  tableContainer.innerHTML = html;

  // Excluir agendamento
  document.querySelectorAll('button[data-excluir-agendamento]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-excluir-agendamento'));
      await deleteData('agendamentos', id);
      mostrarAgendamentos();
    });
  });

  // Editar agendamento
  document.querySelectorAll('button[data-editar-agendamento]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-editar-agendamento'));
      mostrarFormularioEditarAgendamento(id);
    });
  });
}

/**
 * Exibe o formulário para editar um agendamento existente.
 * @param {number} agendamentoId - ID do agendamento a ser editado.
 */
async function mostrarFormularioEditarAgendamento(agendamentoId) {
  const agendamento = await getDataById('agendamentos', agendamentoId);
  if (!agendamento) {
    showNotification('Agendamento não encontrado.', 'error');
    return;
  }

  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = `Editar Agendamento #${agendamentoId}`;
  document.getElementById('section-controls').innerHTML = '';

  // Carrega serviços e funcionários
  const [servicos, funcionarios] = await Promise.all([listarServicos(), listarFuncionarios()]);

  const optionsServicos = servicos.map(s =>
    `<option value="${s.id}" ${s.id === agendamento.servicoId ? 'selected' : ''}>${s.nome}</option>`
  ).join('');

  const barbeiros = ['Brutos', ...funcionarios.map(f => f.nome)];
  const optionsBarbeiros = barbeiros.map(b =>
    `<option value="${b}" ${b === agendamento.barbeiro ? 'selected' : ''}>${b}</option>`
  ).join('');

  formContainer.innerHTML = `
    <form id="editarAgendamentoForm">
      <div>
        <label for="servicoAgendamentoEdit">Serviço:</label>
        <select id="servicoAgendamentoEdit" required>
          <option value="">--Selecione--</option>
          ${optionsServicos}
        </select>
      </div>
      <div>
        <label for="horarioAgendamentoEdit">Horário:</label>
        <input type="datetime-local" id="horarioAgendamentoEdit" value="${agendamento.horario}" required />
      </div>
      <div>
        <label for="clienteAgendamentoEdit">Nome do Cliente:</label>
        <input type="text" id="clienteAgendamentoEdit" value="${agendamento.cliente}" required />
      </div>
      <div>
        <label for="barbeiroAgendamentoEdit">Barbeiro:</label>
        <select id="barbeiroAgendamentoEdit" required>
          <option value="">--Selecione--</option>
          ${optionsBarbeiros}
        </select>
      </div>
      <button type="submit">Salvar Alterações</button>
    </form>
  `;

  document.getElementById('editarAgendamentoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    agendamento.servicoId = parseInt(document.getElementById('servicoAgendamentoEdit').value);
    agendamento.horario = document.getElementById('horarioAgendamentoEdit').value;
    agendamento.cliente = document.getElementById('clienteAgendamentoEdit').value.trim();
    agendamento.barbeiro = document.getElementById('barbeiroAgendamentoEdit').value;

    await saveData('agendamentos', agendamento);
    showNotification('Agendamento atualizado!', 'success');
    mostrarAgendamentos();
  });
}

/* ─────────────── Barbeiros ─────────────── */

/**
 * Exibe o formulário para cadastrar um novo barbeiro.
 */
function mostrarFormularioNovoBarbeiro() {
  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Novo Barbeiro';
  document.getElementById('section-controls').innerHTML = '';

  formContainer.innerHTML = `
    <form id="novoBarbeiroForm">
      <div>
        <label for="nomeBarbeiro">Nome do Barbeiro:</label>
        <input type="text" id="nomeBarbeiro" required />
      </div>
      <div>
        <label for="especialidadeBarbeiro">Especialidade:</label>
        <input type="text" id="especialidadeBarbeiro" placeholder="Ex: Corte, Barba" required />
      </div>
      <div>
        <label for="comissaoBarbeiro">Comissão (%):</label>
        <input type="number" step="0.01" id="comissaoBarbeiro" placeholder="Ex: 10" />
      </div>
      <button type="submit">Salvar Barbeiro</button>
    </form>
  `;

  const form = document.getElementById('novoBarbeiroForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const barbeiro = {
      nome: document.getElementById('nomeBarbeiro').value,
      especialidade: document.getElementById('especialidadeBarbeiro').value,
      comissao: parseFloat(document.getElementById('comissaoBarbeiro').value) || 0
    };

    await cadastrarFuncionario(barbeiro);
    showNotification('Barbeiro salvo com sucesso!', 'success');
    form.reset();
  });
}

/**
 * Exibe a tela para gerenciar os barbeiros cadastrados.
 */
async function mostrarGerenciarBarbeiros() {
  ocultarSecoes();
  const tableContainer = document.getElementById('table-container');
  tableContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = 'Gerenciar Barbeiros';
  document.getElementById('section-controls').innerHTML = '';

  const barbeiros = await listarFuncionarios();
  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Especialidade</th>
          <th>Comissão</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${barbeiros.map(b => `
          <tr>
            <td>${b.id}</td>
            <td>${b.nome}</td>
            <td>${b.especialidade || 'N/A'}</td>
            <td>${b.comissao}%</td>
            <td>
              <button data-editar-barbeiro="${b.id}">Editar</button>
              <button data-excluir-barbeiro="${b.id}">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  tableContainer.innerHTML = html;

  // Excluir barbeiro
  document.querySelectorAll('button[data-excluir-barbeiro]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-excluir-barbeiro'));
      await deletarFuncionario(id);
      mostrarGerenciarBarbeiros();
    });
  });

  // Editar barbeiro
  document.querySelectorAll('button[data-editar-barbeiro]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.getAttribute('data-editar-barbeiro'));
      mostrarFormularioEditarBarbeiro(id);
    });
  });
}

/**
 * Exibe o formulário para editar um barbeiro.
 * @param {number} barbeiroId - ID do barbeiro a ser editado.
 */
async function mostrarFormularioEditarBarbeiro(barbeiroId) {
  const barbeiro = await buscarFuncionario(barbeiroId);
  if (!barbeiro) {
    showNotification('Barbeiro não encontrado.', 'error');
    return;
  }

  ocultarSecoes();
  const formContainer = document.getElementById('form-container');
  formContainer.classList.remove('hidden');
  document.getElementById('section-title').textContent = `Editar Barbeiro #${barbeiroId}`;
  document.getElementById('section-controls').innerHTML = '';

  formContainer.innerHTML = `
    <form id="editarBarbeiroForm">
      <div>
        <label for="nomeBarbeiroEdit">Nome do Barbeiro:</label>
        <input type="text" id="nomeBarbeiroEdit" value="${barbeiro.nome}" required />
      </div>
      <div>
        <label for="especialidadeBarbeiroEdit">Especialidade:</label>
        <input type="text" id="especialidadeBarbeiroEdit" value="${barbeiro.especialidade || ''}" required />
      </div>
      <div>
        <label for="comissaoBarbeiroEdit">Comissão (%):</label>
        <input type="number" step="0.01" id="comissaoBarbeiroEdit" value="${barbeiro.comissao || 0}" />
      </div>
      <button type="submit">Salvar Alterações</button>
    </form>
  `;

  const form = document.getElementById('editarBarbeiroForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    barbeiro.nome = document.getElementById('nomeBarbeiroEdit').value;
    barbeiro.especialidade = document.getElementById('especialidadeBarbeiroEdit').value;
    barbeiro.comissao = parseFloat(document.getElementById('comissaoBarbeiroEdit').value) || 0;

    await cadastrarFuncionario(barbeiro);
    showNotification('Barbeiro atualizado!', 'success');
    mostrarGerenciarBarbeiros();
  });
}