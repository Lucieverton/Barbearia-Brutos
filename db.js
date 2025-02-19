// Nome e versão do banco de dados
const DB_NAME = 'barbeariaBrutosDB';
const DB_VERSION = 3;
let db = null;

/**
 * Inicializa o banco IndexedDB.
 * Retorna uma Promise que resolve com o objeto "db" se tudo ocorrer bem,
 * ou rejeita com o erro correspondente.
 */
function initDB() {
  return new Promise((resolve, reject) => {
    // Verifica se o navegador suporta IndexedDB
    if (!window.indexedDB) {
      alert('Seu navegador não suporta IndexedDB. Alguns recursos podem não funcionar.');
      return reject('IndexedDB não suportado');
    }

    // Abre o banco de dados com o nome e a versão especificados
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Evento: onupgradeneeded - cria ou atualiza ObjectStores
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      console.log(`Upgrading DB: ${DB_NAME} para a versão ${DB_VERSION}`);

      // ObjectStore para serviços
      if (!db.objectStoreNames.contains('servicos')) {
        const servicosStore = db.createObjectStore('servicos', { keyPath: 'id', autoIncrement: true });
        servicosStore.createIndex('nome', 'nome', { unique: false });
      }

      // ObjectStore para funcionários
      if (!db.objectStoreNames.contains('funcionarios')) {
        const funcionariosStore = db.createObjectStore('funcionarios', { keyPath: 'id', autoIncrement: true });
        funcionariosStore.createIndex('nome', 'nome', { unique: false });
      }

      // ObjectStore para despesas
      if (!db.objectStoreNames.contains('despesas')) {
        db.createObjectStore('despesas', { keyPath: 'id', autoIncrement: true });
      }

      // ObjectStore para cortes
      if (!db.objectStoreNames.contains('cortes')) {
        const cortesStore = db.createObjectStore('cortes', { keyPath: 'id', autoIncrement: true });
        cortesStore.createIndex('barbeiro', 'barbeiro', { unique: false });
      }

      // ObjectStore para agendamentos
      if (!db.objectStoreNames.contains('agendamentos')) {
        db.createObjectStore('agendamentos', { keyPath: 'id', autoIncrement: true });
      }

      console.log('ObjectStores criadas/atualizadas com sucesso.');
    };

    // Evento: onsuccess - banco aberto com sucesso
    request.onsuccess = (e) => {
      db = e.target.result;
      console.log('Banco carregado com sucesso:', DB_NAME);

      // Trata a atualização do banco em outra aba (versionchange)
      db.onversionchange = () => {
        db.close();
        alert('Uma nova versão do site foi aberta. Por favor, recarregue a página.');
      };

      resolve(db);
    };

    // Evento: onerror - erro ao abrir o banco de dados
    request.onerror = (e) => {
      console.error('Erro ao abrir o banco:', e.target.error);
      reject(e.target.error);
    };
  });
}

/**
 * Insere ou atualiza um registro em uma ObjectStore.
 * @param {string} storeName - Nome da ObjectStore (ex: "servicos", "funcionarios", etc.)
 * @param {Object} data - Objeto contendo os dados a serem salvos.
 * @returns {Promise<number|string>} Promise que resolve com o ID do registro salvo.
 */
function saveData(storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não inicializado');

    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      console.error(`Erro ao salvar dados na store "${storeName}":`, e.target.error);
      reject(e.target.error);
    };

    tx.oncomplete = () => {
      // Transação concluída
    };

    tx.onerror = (e) => {
      console.error(`Transação com erro na store "${storeName}":`, e.target.error);
    };
  });
}

/**
 * Recupera todos os registros de uma ObjectStore.
 * @param {string} storeName - Nome da ObjectStore.
 * @returns {Promise<Array>} Promise que resolve com um array de registros.
 */
function getAllData(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não inicializado');

    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      console.error(`Erro ao recuperar dados da store "${storeName}":`, e.target.error);
      reject(e.target.error);
    };
  });
}

/**
 * Recupera um registro por ID de uma ObjectStore.
 * @param {string} storeName - Nome da ObjectStore.
 * @param {number|string} id - ID do registro.
 * @returns {Promise<Object|null>} Promise que resolve com o registro ou null se não encontrado.
 */
function getDataById(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não inicializado');

    const tx = db.transaction([storeName], 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      console.error(`Erro ao buscar registro na store "${storeName}":`, e.target.error);
      reject(e.target.error);
    };
  });
}

/**
 * Remove um registro por ID de uma ObjectStore.
 * @param {string} storeName - Nome da ObjectStore.
 * @param {number|string} id - ID do registro.
 * @returns {Promise} Promise que resolve quando o registro é removido.
 */
function deleteData(storeName, id) {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Banco de dados não inicializado');

    const tx = db.transaction([storeName], 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (e) => {
      console.error(`Erro ao deletar registro na store "${storeName}":`, e.target.error);
      reject(e.target.error);
    };
  });
}