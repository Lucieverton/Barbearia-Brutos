// 🛠️ HOPWEB DEBUGGER - Analisador Estrutural
// Autor: [Seu Nome]
// Descrição: Verifica HTML, CSS e JavaScript, apontando erros e sugerindo correções detalhadas.

// 🔹 Mensagens educativas para aprendizado
const MENSAGENS_EDUCATIVAS = [
  "💡 JavaScript é uma linguagem baseada em eventos. Sempre trate eventos como cliques e teclas pressionadas!",
  "⚠️ Evite manipular o DOM em loops grandes, pois pode afetar a performance do navegador.",
  "🔧 O `console.log()` é seu melhor amigo para debug. Use-o para entender o fluxo do código.",
  "📌 Use `let` e `const` em vez de `var` para evitar problemas de escopo.",
  "🚀 As funções assíncronas (`async/await`) tornam seu código mais limpo e fácil de ler.",
  "🔍 Para evitar bugs, sempre verifique se um elemento existe antes de manipulá-lo!",
  "📂 Separe seu código em arquivos pequenos e reutilizáveis para melhor manutenção."
];

// Exibir uma mensagem educativa aleatória
console.info("%c📢 Dica de JavaScript:", "color: blue; font-weight: bold;", MENSAGENS_EDUCATIVAS[Math.floor(Math.random() * MENSAGENS_EDUCATIVAS.length)]);

// 🔹 Analisador de HTML
function verificarHTML() {
    console.group("%c🔍 Analisando HTML...", "color: green; font-weight: bold;");
    let ids = new Set();
    let erros = 0;

    document.querySelectorAll("[id]").forEach(el => {
        if (ids.has(el.id)) {
            console.error(`🚨 ERRO: ID duplicado encontrado: #${el.id}. IDs devem ser únicos!`);
            erros++;
        } else {
            ids.add(el.id);
        }
    });

    document.querySelectorAll("button, input, select, textarea").forEach(el => {
        if (!el.id) {
            console.warn(`⚠️ Atenção: O elemento <${el.tagName.toLowerCase()}> não tem um ID. Isso pode dificultar sua manipulação no JavaScript.`);
        }
    });

    if (erros === 0) {
        console.info("✅ Nenhum erro crítico encontrado no HTML.");
    }
    console.groupEnd();
}

// 🔹 Analisador de CSS
function verificarCSS() {
    console.group("%c🎨 Analisando CSS...", "color: purple; font-weight: bold;");
    let erros = 0;
    const styles = document.styleSheets;

    for (let sheet of styles) {
        try {
            for (let rule of sheet.cssRules) {
                if (rule.selectorText && rule.selectorText.includes("#")) {
                    let id = rule.selectorText.replace("#", "").split(" ")[0];
                    if (!document.getElementById(id)) {
                        console.warn(`⚠️ O seletor CSS '${rule.selectorText}' está apontando para um ID inexistente no HTML.`);
                        erros++;
                    }
                }
            }
        } catch (err) {
            console.error("❌ Erro ao acessar regras CSS:", err.message);
        }
    }

    if (erros === 0) {
        console.info("✅ Nenhum erro crítico encontrado no CSS.");
    }
    console.groupEnd();
}

// 🔹 Analisador de JavaScript
function verificarJavaScript() {
    console.group("%c🛠️ Analisando JavaScript...", "color: orange; font-weight: bold;");
    let erros = 0;

    // Verifica chamadas a funções inexistentes
    document.querySelectorAll("[onclick]").forEach(el => {
        let funcaoChamada = el.getAttribute("onclick").split("(")[0].trim();
        if (typeof window[funcaoChamada] !== "function") {
            console.error(`🚨 ERRO: A função '${funcaoChamada}()' foi chamada, mas não está definida!`);
            erros++;
        }
    });

    // Verifica chamadas a elementos inexistentes
    document.querySelectorAll("*").forEach(el => {
        if (el.id && !document.getElementById(el.id)) {
            console.warn(`⚠️ O JavaScript pode estar tentando acessar #${el.id}, mas ele não existe no HTML.`);
        }
    });

    if (erros === 0) {
        console.info("✅ Nenhum erro crítico encontrado no JavaScript.");
    }
    console.groupEnd();
}

// 🔹 Resumo dos erros
function mostrarResumo() {
    console.log("%c📊 RESUMO DA ANÁLISE:", "background: #000; color: #fff; font-size: 16px; font-weight: bold; padding: 4px;");

    let totalErros = document.querySelectorAll(".error-log").length;

    if (totalErros === 0) {
        console.log("%c🚀 Parabéns! Nenhum erro crítico foi encontrado no seu código.", "color: green; font-weight: bold;");
    } else {
        console.log("%c⚠️ Foram detectados erros que podem impactar o funcionamento do seu sistema. Revise os logs acima!", "color: red; font-weight: bold;");
    }
}

// 🔹 Executar todas as análises após o carregamento da página
window.addEventListener("load", () => {
    console.log("%c 🛠️ HOPWEB DEBUGGER: Iniciando análise completa...", "background: #222; color: #fff; font-size: 14px; font-weight: bold;");
    
    verificarHTML();
    verificarCSS();
    verificarJavaScript();
    mostrarResumo();
});