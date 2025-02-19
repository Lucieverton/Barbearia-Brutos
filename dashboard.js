/* dashboard.js - Funções específicas para o Dashboard */

/**
 * Atualiza os indicadores (widgets) do dashboard.
 * Recupera dados de 'servicos', 'despesas' e 'cortes' do IndexedDB
 * e atualiza os valores exibidos.
 */
async function atualizarIndicadoresDashboard() {
  try {
    // Recupera os dados do banco
    const servicos = await getAllData('servicos');
    const despesas = await getAllData('despesas');
    const cortes = await getAllData('cortes');

    // Contagens dos registros
    const totalServicos = servicos.length;
    const totalCortes = cortes.length;

    // Cálculo de despesas totais, convertendo valores para número
    const totalDespesas = despesas.reduce((acc, d) => acc + (parseFloat(d.valor) || 0), 0);

    // Cálculo de receita total, total de comissões pagas e lucro da barbearia
    let receitaTotal = 0, totalComissoes = 0, lucroBrutos = 0;
    cortes.forEach(c => {
      receitaTotal += parseFloat(c.valor) || 0;
      totalComissoes += parseFloat(c.comissao) || 0;
      lucroBrutos += parseFloat(c.lucro) || 0;
    });

    // Atualiza os widgets com os valores calculados
    document.querySelector('#total-servicos .widget-value').textContent = totalServicos;
    document.querySelector('#total-cortes .widget-value').textContent = totalCortes;
    document.querySelector('#receita-total .widget-value').textContent = `R$ ${receitaTotal.toFixed(2)}`;
    document.querySelector('#despesas-total .widget-value').textContent = `R$ ${totalDespesas.toFixed(2)}`;
    document.querySelector('#total-comissoes .widget-value').textContent = `R$ ${totalComissoes.toFixed(2)}`;
    document.querySelector('#lucro-brutos .widget-value').textContent = `R$ ${lucroBrutos.toFixed(2)}`;
  } catch (err) {
    console.error('Erro ao atualizar indicadores do dashboard:', err);
  }
}

/**
 * Inicializa os gráficos utilizando Chart.js.
 * Se Chart.js não estiver disponível, exibe um aviso.
 */
function initGraficos() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js não está disponível. Os gráficos não serão renderizados.');
    return;
  }

  // Atualiza o gráfico de ranking dos barbeiros com medalhas
  atualizarGraficoBarbeirosRanking();

  // Outras chamadas para gráficos podem ser adicionadas aqui:
  // ex.: initGraficoComissoes(); initGraficoFinanceiro();
}

/**
 * Atualiza o gráfico de ranking dos barbeiros com base na quantidade de cortes realizados.
 * Os três primeiros recebem ícones de medalha (ouro, prata e bronze) e cores especiais.
 */
async function atualizarGraficoBarbeirosRanking() {
  try {
    // Verifica se a função listarCortes() está definida
    if (typeof listarCortes !== 'function') {
      console.error('A função listarCortes() não está definida.');
      return;
    }

    // Recupera os cortes do banco de dados
    const cortes = await listarCortes();

    // Agrupa os cortes por barbeiro usando a propriedade "barbeiro"
    const barbeiroCounts = {};
    cortes.forEach(corte => {
      const nome = corte.barbeiro || 'Desconhecido';
      barbeiroCounts[nome] = (barbeiroCounts[nome] || 0) + 1;
    });

    // Converte o objeto em array e ordena em ordem decrescente pela quantidade de cortes
    let ranking = Object.entries(barbeiroCounts)
      .map(([barbeiro, qtd]) => ({ barbeiro, qtd }))
      .sort((a, b) => b.qtd - a.qtd);

    // Define os ícones de medalha para os três primeiros
    const medalIcons = ['🥇', '🥈', '🥉'];
    const labels = ranking.map((item, index) => {
      return index < 3 ? `${medalIcons[index]} ${item.barbeiro}` : item.barbeiro;
    });

    // Obtém os valores (número de cortes) para cada barbeiro
    const dataValues = ranking.map(item => item.qtd);

    // Define as cores: os três primeiros têm cores especiais, os demais uma cor padrão
    const backgroundColors = ranking.map((item, index) => {
      if (index === 0) return 'rgba(212, 175, 55, 0.9)';   // Ouro
      if (index === 1) return 'rgba(192, 192, 192, 0.9)';  // Prata
      if (index === 2) return 'rgba(205, 127, 50, 0.9)';   // Bronze
      return 'rgba(46, 196, 182, 0.8)';                    // Padrão
    });

    // Seleciona o canvas para o gráfico
    const ctx = document.getElementById('grafico-servicos');
    if (!ctx) {
      console.error('Canvas "grafico-servicos" não encontrado.');
      return;
    }

    // Se já existir um gráfico, destrói-o para evitar conflitos
    if (window.barbeirosChart) {
      window.barbeirosChart.destroy();
    }

    // Cria o gráfico de pizza com os dados de ranking
    window.barbeirosChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Ranking dos Barbeiros (Cortes Realizados)'
          }
        }
      }
    });
  } catch (err) {
    console.error('Erro ao atualizar gráfico de ranking dos barbeiros:', err);
  }
}

/**
 * Atualiza todo o dashboard: indicadores e gráficos.
 */
async function atualizarDashboard() {
  await atualizarIndicadoresDashboard();
  initGraficos();
}