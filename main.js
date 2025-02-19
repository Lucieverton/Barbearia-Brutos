document.addEventListener('DOMContentLoaded', async () => {
  // 1. Inicializa o IndexedDB
  await initDB();

  /**
   * Função unificada para ocultar todas as seções da interface
   */
  function ocultarSecoes() {
    const sections = ['dashboard-section', 'extra-dashboard-section', 'form-container', 'table-container'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  // 2. Configura os event listeners dos itens do menu
  const elementosMenu = [
    {
      id: 'dashboard-link',
      funcao: () => {
        ocultarSecoes();
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.getElementById('extra-dashboard-section').classList.remove('hidden');
        atualizarIndicadoresDashboard();
        initGraficos();
      }
    },
    { id: 'servicos-link', funcao: toggleSubmenu },
    { id: 'novo-servico-link', funcao: mostrarFormularioNovoServico },
    { id: 'gerenciar-servicos-link', funcao: mostrarGerenciarServicos },
    { id: 'agendamentos-link', funcao: mostrarAgendamentos },
    { id: 'financeiro-link', funcao: toggleSubmenu },
    { id: 'nova-despesa-link', funcao: mostrarNovaDespesa },
    { id: 'extrato-detalhado-link', funcao: () => showNotification('Tela de Extrato Detalhado em desenvolvimento...', 'info') },
    { id: 'exportar-dados-link', funcao: () => showNotification('Tela de Exportar Dados em desenvolvimento...', 'info') },
    { id: 'configuracoes-link', funcao: toggleSubmenu },
    { id: 'novo-barbeiro-link', funcao: mostrarFormularioNovoBarbeiro },
    { id: 'gerencia-barbeiros-link', funcao: mostrarGerenciarBarbeiros }
  ];

  elementosMenu.forEach((item) => {
    const elemento = document.getElementById(item.id);
    if (elemento) {
      elemento.addEventListener('click', (e) => {
        e.preventDefault();
        const isSubmenuItem = !!e.target.closest('.submenu');
        const navItem = e.target.closest('.nav-item');

        if (navItem && navItem.classList.contains('has-submenu') && !isSubmenuItem) {
          toggleSubmenu(navItem);
        } else {
          fecharMenuMobile();
          ocultarSecoes();
          item.funcao();
        }
      });
    } else {
      console.warn(`Elemento ${item.id} não encontrado.`);
    }
  });

  // 3. Configura o botão de alternar tema (dark/light)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const htmlEl = document.documentElement;
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', newTheme);
    });
  }

  // 4. Configura a interação do logo
  const logoContainer = document.getElementById('logo-container');
  const logoImage = document.getElementById('logo-image');
  const logoText = document.getElementById('logo-text');

  if (logoContainer) {
    logoContainer.addEventListener('click', (e) => {
      const isImage = e.target === logoImage || logoImage.contains(e.target);
      const isText = e.target === logoText || logoText.contains(e.target);

      if (isImage) {
        // Navega para o dashboard
        ocultarSecoes();
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.getElementById('extra-dashboard-section').classList.remove('hidden');
        atualizarIndicadoresDashboard();
        initGraficos();
        fecharMenuMobile();
      } else if (isText) {
        // Abre/fecha o menu mobile
        const appNav = document.getElementById('appNav');
        const navOverlay = document.getElementById('navOverlay');
        if (appNav && navOverlay) {
          appNav.classList.toggle('show');
          navOverlay.classList.toggle('active');
        }
      }
    });
  }

  // 5. Configura o Botão Flutuante (FAB)
  const floatingBtn = document.getElementById('floatingBtn');
  const fabOptions = document.getElementById('fabOptions');
  if (floatingBtn && fabOptions) {
    floatingBtn.addEventListener('click', () => {
      fabOptions.classList.toggle('hidden');
    });

    document.getElementById('btnNovoAgendamento')?.addEventListener('click', () => {
      fabOptions.classList.add('hidden');
      mostrarFormularioNovoAgendamento();
    });

    document.getElementById('btnNovoCorte')?.addEventListener('click', () => {
      fabOptions.classList.add('hidden');
      mostrarFormularioNovoCorte();
    });
  }

  // 6. Exibe o dashboard inicialmente ao carregar a página
  ocultarSecoes();
  document.getElementById('dashboard-section').classList.remove('hidden');
  document.getElementById('extra-dashboard-section').classList.remove('hidden');
  atualizarIndicadoresDashboard();
  initGraficos();
});

/**
 * Alterna (abre/fecha) o submenu de um item do menu
 */
function toggleSubmenu(navItem) {
  const isOpen = navItem.classList.contains('open');
  document.querySelectorAll('.has-submenu').forEach(el => el.classList.remove('open'));
  if (!isOpen) {
    navItem.classList.add('open');
  }
}

/**
 * Fecha o menu mobile
 */
function fecharMenuMobile() {
  const appNav = document.getElementById('appNav');
  const navOverlay = document.getElementById('navOverlay');
  if (appNav) appNav.classList.remove('show');
  if (navOverlay) navOverlay.classList.remove('active');
}

/**
 * Exibe notificações personalizadas
 */
function showNotification(message, type = 'info') {
  const notificationCenter = document.querySelector('.notification-center');
  if (!notificationCenter) return;

  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <span class="notif-icon">${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ⓘ'}</span>
    <span class="notif-message">${message}</span>
    <button class="notif-close">&times;</button>
  `;

  notif.querySelector('.notif-close').addEventListener('click', () => {
    notif.remove();
  });

  notificationCenter.appendChild(notif);
  
  setTimeout(() => {
    if (document.body.contains(notif)) {
      notif.remove();
    }
  }, 5000);
}