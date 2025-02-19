// relatorios.js

/**
 * Gera um relatório de serviços
 */
async function gerarRelatorioServicos() {
  try {
    const servicos = await listarServicos();
    let html = '<h3>Relatório de Serviços</h3><ul>';
    servicos.forEach(s => {
      html += `<li>Nome: ${s.nome} - Preço: R$ ${s.preco || 0} - Duração: ${s.duracao || 0} min</li>`;
    });
    html += '</ul>';
    return html;
  } catch (err) {
    console.error('Erro ao gerar relatório de serviços:', err);
    return '<p>Não foi possível gerar o relatório.</p>';
  }
}

/**
 * Gera relatório financeiro simples
 */
async function gerarRelatorioFinanceiro() {
  try {
    const despesas = await getAllData('despesas');
    const cortes = await getAllData('cortes');

    // Somar despesas
    const totalDespesas = despesas.reduce((acc, d) => acc + (d.valor || 0), 0);

    // Somar receita dos cortes
    const totalReceita = cortes.reduce((acc, c) => acc + (c.valor || 0), 0);

    let html = '<h3>Relatório Financeiro</h3>';
    html += `<p>Total de Despesas: R$ ${totalDespesas.toFixed(2)}</p>`;
    html += `<p>Total de Receitas (Cortes): R$ ${totalReceita.toFixed(2)}</p>`;
    html += `<p>Saldo: R$ ${(totalReceita - totalDespesas).toFixed(2)}</p>`;

    return html;
  } catch (err) {
    console.error('Erro ao gerar relatório financeiro:', err);
    return '<p>Não foi possível gerar o relatório financeiro.</p>';
  }
}