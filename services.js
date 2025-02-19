/* ==========================================
   SERVICES - CRUD para "servicos"
========================================== */

/**
 * Cadastra ou atualiza um serviço.
 * @param {Object} servico - Objeto contendo { nome, preco, duracao, ... }.
 */
async function cadastrarServico(servico) {
  try {
    const id = await saveData('servicos', servico);
    showNotification('Serviço salvo com sucesso!', 'success');
    return id;
  } catch (err) {
    console.error('Erro ao salvar serviço:', err);
    showNotification('Erro ao salvar serviço.', 'error');
  }
}

/**
 * Retorna todos os serviços cadastrados.
 * @returns {Array} Array de objetos de serviço.
 */
async function listarServicos() {
  try {
    const servicos = await getAllData('servicos');
    return servicos;
  } catch (err) {
    console.error('Erro ao listar serviços:', err);
    showNotification('Erro ao listar serviços.', 'error');
    return [];
  }
}

/**
 * Deleta um serviço com base no ID.
 * @param {number} id - ID do serviço.
 */
async function deletarServico(id) {
  try {
    await deleteData('servicos', id);
    showNotification('Serviço excluído!', 'info');
  } catch (err) {
    console.error('Erro ao excluir serviço:', err);
    showNotification('Erro ao excluir serviço.', 'error');
  }
}

/**
 * Busca um serviço pelo ID.
 * @param {number} id - ID do serviço.
 * @returns {Object|null} Objeto do serviço ou null se não encontrado.
 */
async function buscarServico(id) {
  try {
    const servico = await getDataById('servicos', id);
    return servico;
  } catch (err) {
    console.error('Erro ao buscar serviço:', err);
    showNotification('Erro ao buscar serviço.', 'error');
    return null;
  }
}

/* ==========================================
   FUNCIONÁRIOS - CRUD para "funcionarios"
========================================== */

/**
 * Cadastra ou atualiza um funcionário.
 * @param {Object} funcionario - Objeto contendo { nome, funcao, comissao, ... }.
 */
async function cadastrarFuncionario(funcionario) {
  try {
    const id = await saveData('funcionarios', funcionario);
    showNotification('Funcionário salvo com sucesso!', 'success');
    return id;
  } catch (err) {
    console.error('Erro ao salvar funcionário:', err);
    showNotification('Erro ao salvar funcionário.', 'error');
  }
}

/**
 * Retorna todos os funcionários cadastrados.
 * @returns {Array} Array de objetos de funcionário.
 */
async function listarFuncionarios() {
  try {
    const funcionarios = await getAllData('funcionarios');
    return funcionarios;
  } catch (err) {
    console.error('Erro ao listar funcionários:', err);
    showNotification('Erro ao listar funcionários.', 'error');
    return [];
  }
}

/**
 * Deleta um funcionário pelo ID.
 * @param {number} id - ID do funcionário.
 */
async function deletarFuncionario(id) {
  try {
    await deleteData('funcionarios', id);
    showNotification('Funcionário excluído!', 'info');
  } catch (err) {
    console.error('Erro ao excluir funcionário:', err);
    showNotification('Erro ao excluir funcionário.', 'error');
  }
}

/**
 * Busca um funcionário pelo ID.
 * @param {number} id - ID do funcionário.
 * @returns {Object|null} Objeto do funcionário ou null se não encontrado.
 */
async function buscarFuncionario(id) {
  try {
    const funcionario = await getDataById('funcionarios', id);
    return funcionario;
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    showNotification('Erro ao buscar funcionário.', 'error');
    return null;
  }
}

/* ==========================================
   CORTES - CRUD para "cortes"
========================================== */

/**
 * Retorna todos os cortes cadastrados.
 * @returns {Array} Array de objetos de corte.
 */
async function listarCortes() {
  try {
    const cortes = await getAllData('cortes');
    return cortes;
  } catch (err) {
    console.error('Erro ao listar cortes:', err);
    showNotification('Erro ao listar cortes.', 'error');
    return [];
  }
}