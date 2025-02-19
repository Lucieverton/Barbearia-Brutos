/* AI Debugger - Inteligência Avançada para Análise de Código JavaScript */

class AIDebugger {
  constructor() {
    this.previousCodeState = {}; // Armazena o estado anterior dos arquivos analisados
  }

  /**
   * Analisa um código JavaScript e retorna informações detalhadas.
   * @param {string} fileName - Nome do arquivo analisado.
   * @param {string} code - Código-fonte do arquivo.
   */
  analyzeCode(fileName, code) {
    const analysis = {
      file: fileName,
      missingFunctions: [],
      missingIds: [],
      syntaxErrors: [],
      logicIssues: [],
      duplicateLines: [],
      poorlyStructuredLines: [],
      changes: []
    };

    try {
      const lines = code.split("\n");

      // 1️⃣ Verifica funções ausentes
      const functionCalls = code.match(/(\w+)/g) || [];
      functionCalls.forEach(call => {
        const functionName = call.replace("(", "").trim();
        if (!window[functionName] && !this.isNativeFunction(functionName)) {
          analysis.missingFunctions.push(functionName);
        }
      });

      // 2️⃣ Verifica IDs não encontrados no HTML
      const idMatches = code.match(/document.getElementById['"`](.*?)['"`]/g) || [];
      idMatches.forEach(match => {
        const id = match.match(/['"`](.*?)['"`]/)[1];
        if (!document.getElementById(id)) {
          analysis.missingIds.push(id);
        }
      });

      // 3️⃣ Detecta linhas duplicadas
      const uniqueLines = new Set();
      lines.forEach((line, index) => {
        if (line.trim() && uniqueLines.has(line.trim())) {
          analysis.duplicateLines.push(`Linha ${index + 1}: "${line.trim()}" está repetida.`);
        }
        uniqueLines.add(line.trim());
      });

      // 4️⃣ Detecta linhas mal estruturadas
      lines.forEach((line, index) => {
        if (line.trim().length < 4 && line.trim() !== "" && line.trim() !== "{") {
          analysis.poorlyStructuredLines.push(`Linha ${index + 1}: "${line.trim()}" pode estar incompleta ou errada.`);
        }
      });

      // 5️⃣ Detecta diferenças entre versões do código
      if (this.previousCodeState[fileName]) {
        analysis.changes = this.getCodeDifferences(this.previousCodeState[fileName], code);
      }
      this.previousCodeState[fileName] = code;

    } catch (error) {
      analysis.syntaxErrors.push(`Erro de sintaxe no arquivo ${fileName}: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Compara a versão anterior e atual do código para detectar mudanças.
   */
  getCodeDifferences(previous, current) {
    const prevLines = previous.split("\n");
    const currLines = current.split("\n");

    let changes = [];
    currLines.forEach((line, index) => {
      if (prevLines[index] !== line) {
        changes.push(`Linha ${index + 1}: Antes → "${prevLines[index] || "[vazio]"}", Agora → "${line}"`);
      }
    });

    return changes;
  }

  /**
   * Verifica se uma função é nativa do JavaScript.
   */
  isNativeFunction(name) {
    return ["setTimeout", "setInterval", "fetch", "console", "Math", "Date"].includes(name);
  }

  /**
   * Gera um relatório detalhado com explicações sobre os erros e melhorias no código.
   */
  generateReport(analysis) {
    console.log(`🔍 **Relatório de Análise para:** ${analysis.file}`);

    if (analysis.missingFunctions.length) {
      console.warn(`⚠️ **Funções ausentes:**`, analysis.missingFunctions);
    }
    if (analysis.missingIds.length) {
      console.warn(`❗ **IDs não encontrados:**`, analysis.missingIds);
    }
    if (analysis.duplicateLines.length) {
      console.warn(`♻️ **Linhas duplicadas:**`, analysis.duplicateLines);
    }
    if (analysis.poorlyStructuredLines.length) {
      console.warn(`🔄 **Linhas mal estruturadas:**`, analysis.poorlyStructuredLines);
    }
    if (analysis.syntaxErrors.length) {
      console.error(`🚨 **Erros de sintaxe:**`, analysis.syntaxErrors);
    }
    if (analysis.changes.length) {
      console.log(`📌 **Mudanças detectadas:**`, analysis.changes);
    } else {
      console.log(`✅ Nenhuma mudança detectada.`);
    }

    console.log(`⚡ **Análise concluída!**`);
  }
}

// Inicializa a IA
const aiDebugger = new AIDebugger();