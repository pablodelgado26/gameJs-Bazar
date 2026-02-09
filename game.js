// Configuração do jogo
const CONFIG = {
    DINHEIRO_INICIAL: 30,
    PRODUTOS_PARA_COMPRAR: 4,
    NUM_CASAS: 30
};

// Produtos disponíveis
const PRODUTOS = [
    { id: 1, nome: 'BLUSA', preco: 4, icon: '👕' },
    { id: 2, nome: 'TÊNIS', preco: 6, icon: '👟' },
    { id: 3, nome: 'BONECA', preco: 12, icon: '🧸' },
    { id: 4, nome: 'BOLA', preco: 10, icon: '⚽' },
    { id: 5, nome: 'BALA', preco: 6, icon: '🍬' },
    { id: 6, nome: 'VESTIDO', preco: 8, icon: '👗' },
    { id: 7, nome: 'CALÇA', preco: 11, icon: '👖' },
    { id: 8, nome: 'BLUSA DE FRIO', preco: 15, icon: '🧥' },
    { id: 9, nome: 'PELÚCIA', preco: 12, icon: '🐻' }
];

// Cartas amarelas (ganhar/gastar)
const CARTAS_AMARELAS = [
    { texto: 'VOCÊ RECICLOU O LIXO!', valor: 1, tipo: 'ganho' },
    { texto: 'CHEGOU SUA CONTA DE LUZ!', valor: 5, tipo: 'gasto' },
    { texto: 'VOCÊ FEZ A ATIVIDADE!', valor: 1, tipo: 'ganho' },
    { texto: 'A BICICLETA QUEBROU!', valor: 2, tipo: 'gasto' },
    { texto: 'VOCÊ OBEDECEU NA AULA!', valor: 2, tipo: 'ganho' },
    { texto: 'CHEGOU O ALUGUEL!', valor: 4, tipo: 'gasto' },
    { texto: 'VOCÊ AJUDOU O AMIGO!', valor: 1, tipo: 'ganho' },
    { texto: 'CHEGOU A CONTA DE ÁGUA!', valor: 3, tipo: 'gasto' },
    { texto: 'VOCÊ AJUDOU A PROFESSORA!', valor: 2, tipo: 'ganho' }
];

// Cartas vermelhas (decisões)
const CARTAS_VERMELHAS = [
    { opcao1: { produto: 'BLUSA', casas: 2 }, opcao2: { produto: 'BONECA', casas: 0 } },
    { opcao1: { produto: 'CALÇA', casas: 0 }, opcao2: { produto: 'BALA', casas: 1 } },
    { opcao1: { produto: 'TÊNIS', casas: 2 }, opcao2: { produto: 'PELÚCIA', casas: 1 } },
    { opcao1: { produto: 'BLUSA DE FRIO', casas: 1 }, opcao2: { produto: 'BOLA', casas: 0 } },
    { opcao1: { produto: 'BALA', casas: 1 }, opcao2: { produto: 'BOLA', casas: 1 } },
    { opcao1: { produto: 'VESTIDO', casas: 0 }, opcao2: { produto: 'BONECA', casas: 1 } },
    { opcao1: { produto: 'TÊNIS', casas: 1 }, opcao2: { produto: 'BOLA', casas: 0 } },
    { opcao1: { produto: 'BLUSA', casas: 1 }, opcao2: { produto: 'PELÚCIA', casas: 0 } },
    { opcao1: { produto: 'CALÇA', casas: 0 }, opcao2: { produto: 'BONECA', casas: 1 } }
];

// Perguntas finais
const PERGUNTAS = [
    {
        pergunta: 'O QUE SIGNIFICA ECONOMIZAR DINHEIRO?',
        opcoes: [
            { texto: 'A) GASTAR TUDO ASSIM QUE RECEBER', correta: false },
            { texto: 'B) GUARDAR UMA PARTE DO DINHEIRO PARA O FUTURO', correta: true },
            { texto: 'C) EMPRESTAR DINHEIRO PARA TODOS', correta: false },
            { texto: 'D) COMPRAR APENAS COISAS CARAS', correta: false }
        ]
    },
    {
        pergunta: 'O QUE É UM ORÇAMENTO?',
        opcoes: [
            { texto: 'A) UMA LISTA DE DESEJOS', correta: false },
            { texto: 'B) UM TIPO DE BANCO', correta: false },
            { texto: 'C) UM PLANO DE COMO GASTAR E GUARDAR O DINHEIRO', correta: true },
            { texto: 'D) UM DESCONTO EM LOJAS', correta: false }
        ]
    },
    {
        pergunta: 'PARA QUE SERVE UMA POUPANÇA?',
        opcoes: [
            { texto: 'A) GASTAR MAIS RÁPIDO', correta: false },
            { texto: 'B) PERDER DINHEIRO', correta: false },
            { texto: 'C) GUARDAR DINHEIRO COM SEGURANÇA', correta: true },
            { texto: 'D) COMPRAR APENAS COMIDA', correta: false }
        ]
    }
];

// Estado do jogo
let estadoJogo = {
    jogadores: [],
    jogadorAtual: 0,
    casas: [],
    faseSelecionandoProdutos: true,
    jogadorSelecionandoProdutos: 0,
    fasePerguntas: false,
    perguntaAtual: 0,
    jogoFinalizado: false
};

// Estado do tutorial
let tutorialStep = 1;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-comecar').addEventListener('click', iniciarTutorial);
    document.getElementById('btn-proximo').addEventListener('click', proximoPassoTutorial);
    document.getElementById('btn-anterior').addEventListener('click', () => mudarPassoTutorial(-1));
    document.getElementById('btn-confirmar-config').addEventListener('click', iniciarEscolhaProdutos);
    document.getElementById('btn-confirmar-produtos').addEventListener('click', confirmarProdutos);
    document.getElementById('btn-rolar-dado').addEventListener('click', rolarDado);
    document.getElementById('btn-fechar-carta').addEventListener('click', fecharModalCarta);
    document.getElementById('btn-responder').addEventListener('click', responderPergunta);
    document.getElementById('btn-novo-jogo').addEventListener('click', () => location.reload());
});

function iniciarTutorial() {
    document.getElementById('boas-vindas-screen').style.display = 'none';
    document.getElementById('tutorial-screen').style.display = 'flex';
    tutorialStep = 1;
    mostrarPassoTutorial();
}

function mostrarPassoTutorial() {
    // Esconder todos os passos
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) step.style.display = 'none';
    }
    
    // Mostrar passo atual
    const stepAtual = document.getElementById(`step-${tutorialStep}`);
    if (stepAtual) stepAtual.style.display = 'block';
    
    // Atualizar botões
    document.getElementById('btn-anterior').style.display = tutorialStep > 1 ? 'block' : 'none';
    document.getElementById('btn-proximo').textContent = tutorialStep === 5 ? 'COMEÇAR! 🎯' : 'PRÓXIMO ➡️';
    
    // Atualizar indicadores
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index < tutorialStep);
    });
}

function proximoPassoTutorial() {
    if (tutorialStep < 5) {
        tutorialStep++;
        mostrarPassoTutorial();
    } else {
        mostrarConfiguracao();
    }
}

function mudarPassoTutorial(direcao) {
    tutorialStep += direcao;
    if (tutorialStep < 1) tutorialStep = 1;
    if (tutorialStep > 5) tutorialStep = 5;
    mostrarPassoTutorial();
}

function mudarNumJogadores(delta) {
    const input = document.getElementById('num-jogadores');
    let valor = parseInt(input.value) + delta;
    if (valor < 2) valor = 2;
    if (valor > 4) valor = 4;
    input.value = valor;
    document.getElementById('display-jogadores').textContent = valor;
    atualizarCamposJogadores();
}

function mostrarConfiguracao() {
    document.getElementById('tutorial-screen').style.display = 'none';
    document.getElementById('config-screen').style.display = 'block';
    atualizarCamposJogadores();
}

function atualizarCamposJogadores() {
    const numJogadores = parseInt(document.getElementById('num-jogadores').value);
    const container = document.getElementById('nomes-jogadores');
    container.innerHTML = '';
    
    const cores = ['🔴', '🔵', '🟢', '🟡'];
    
    for (let i = 0; i < numJogadores; i++) {
        const div = document.createElement('div');
        div.className = 'jogador-input';
        div.style.animation = `fadeIn 0.5s ease-out ${i * 0.1}s both`;
        div.innerHTML = `
            <label>${cores[i]} Jogador ${i + 1}:</label>
            <input type="text" class="nome-jogador" value="Jogador ${i + 1}" placeholder="Digite o nome...">
        `;
        container.appendChild(div);
    }
}

function iniciarEscolhaProdutos() {
    const nomes = Array.from(document.querySelectorAll('.nome-jogador')).map(input => input.value);
    
    estadoJogo.jogadores = nomes.map((nome, index) => ({
        nome,
        dinheiro: CONFIG.DINHEIRO_INICIAL,
        posicao: 0,
        produtosEscolhidos: [],
        produtosComprados: [],
        cor: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12'][index],
        respostasCorretas: 0,
        perdeuVez: false
    }));
    
    document.getElementById('config-screen').style.display = 'none';
    document.getElementById('escolha-produtos-screen').style.display = 'block';
    
    mostrarSelecaoProdutos();
}

function mostrarSelecaoProdutos() {
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorSelecionandoProdutos];
    const corJogador = ['🔴', '🔵', '🟢', '🟡'][estadoJogo.jogadorSelecionandoProdutos];
    
    document.getElementById('jogador-atual-produtos').innerHTML = 
        `${corJogador} <strong>${jogador.nome}</strong>, escolha seus ${CONFIG.PRODUTOS_PARA_COMPRAR} produtos:`;
    
    const selecionados = jogador.produtosEscolhidos.length;
    document.getElementById('produtos-selecionados').innerHTML = 
        `📦 Produtos selecionados: <strong>${selecionados}/${CONFIG.PRODUTOS_PARA_COMPRAR}</strong>`;
    
    const grid = document.getElementById('produtos-grid');
    grid.innerHTML = '';
    
    PRODUTOS.forEach((produto, index) => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.style.animation = `fadeIn 0.5s ease-out ${index * 0.05}s both`;
        
        const jaSelecionado = jogador.produtosEscolhidos.includes(produto.id);
        if (jaSelecionado) {
            card.classList.add('selecionado');
        }
        
        card.innerHTML = `
            <div class="produto-icon">${produto.icon}</div>
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-preco">💰 ${produto.preco} BOTTONS</div>
        `;
        
        card.addEventListener('click', () => selecionarProduto(produto.id));
        grid.appendChild(card);
    });
    
    if (jogador.produtosEscolhidos.length === CONFIG.PRODUTOS_PARA_COMPRAR) {
        document.getElementById('btn-confirmar-produtos').style.display = 'block';
    } else {
        document.getElementById('btn-confirmar-produtos').style.display = 'none';
    }
}

function selecionarProduto(produtoId) {
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorSelecionandoProdutos];
    const index = jogador.produtosEscolhidos.indexOf(produtoId);
    
    if (index > -1) {
        jogador.produtosEscolhidos.splice(index, 1);
    } else if (jogador.produtosEscolhidos.length < CONFIG.PRODUTOS_PARA_COMPRAR) {
        jogador.produtosEscolhidos.push(produtoId);
    }
    
    mostrarSelecaoProdutos();
}

function confirmarProdutos() {
    estadoJogo.jogadorSelecionandoProdutos++;
    
    if (estadoJogo.jogadorSelecionandoProdutos < estadoJogo.jogadores.length) {
        mostrarSelecaoProdutos();
    } else {
        iniciarJogo();
    }
}

function iniciarJogo() {
    document.getElementById('escolha-produtos-screen').style.display = 'none';
    document.getElementById('jogo-screen').style.display = 'block';
    
    criarTabuleiro();
    atualizarInfoJogadores();
    desenharTabuleiro();
}

function criarTabuleiro() {
    estadoJogo.casas = [];
    
    for (let i = 0; i < CONFIG.NUM_CASAS; i++) {
        let tipo;
        const rand = Math.random();
        
        if (i === 0) {
            tipo = 'inicio';
        } else if (i === CONFIG.NUM_CASAS - 1) {
            tipo = 'fim';
        } else if (rand < 0.6) {
            tipo = 'azul';
        } else if (rand < 0.8) {
            tipo = 'amarela';
        } else {
            tipo = 'vermelha';
        }
        
        estadoJogo.casas.push({ tipo, numero: i });
    }
}

function desenharTabuleiro() {
    const canvas = document.getElementById('tabuleiro');
    const ctx = canvas.getContext('2d');
    const largura = canvas.width;
    const altura = canvas.height;
    
    ctx.clearRect(0, 0, largura, altura);
    
    // Criar caminho em espiral com casas retangulares
    const casaLargura = 70;
    const casaAltura = 60;
    const espacamento = 5;
    const margem = 50;
    
    // Definir posições das casas em espiral
    const posicoes = calcularPosicoesEspiral(largura, altura, casaLargura, casaAltura, espacamento, margem);
    
    estadoJogo.casas.forEach((casa, index) => {
        if (index < posicoes.length) {
            const pos = posicoes[index];
            casa.x = pos.x;
            casa.y = pos.y;
            casa.largura = pos.largura;
            casa.altura = pos.altura;
            casa.angulo = pos.angulo;
            
            ctx.save();
            ctx.translate(pos.x + pos.largura / 2, pos.y + pos.altura / 2);
            ctx.rotate(pos.angulo);
            
            // Desenhar casa retangular
            if (casa.tipo === 'inicio') {
                ctx.fillStyle = '#1e3a5f';
            } else if (casa.tipo === 'fim') {
                ctx.fillStyle = '#1e3a5f';
            } else if (casa.tipo === 'azul') {
                ctx.fillStyle = '#1e3a5f';
            } else if (casa.tipo === 'amarela') {
                ctx.fillStyle = '#ffd93d';
            } else if (casa.tipo === 'vermelha') {
                ctx.fillStyle = '#ff5252';
            }
            
            ctx.fillRect(-pos.largura / 2, -pos.altura / 2, pos.largura, pos.altura);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.strokeRect(-pos.largura / 2, -pos.altura / 2, pos.largura, pos.altura);
            
            // Texto na casa
            if (casa.tipo === 'inicio') {
                ctx.fillStyle = '#ff8c42';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.save();
                ctx.rotate(-Math.PI / 2);
                ctx.fillText('COMEÇO', 0, 0);
                ctx.restore();
            } else if (casa.tipo === 'fim') {
                ctx.fillStyle = '#ff8c42';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('FIM', 0, 0);
            }
            
            ctx.restore();
        }
    });
    
    // Desenhar jogadores
    estadoJogo.jogadores.forEach((jogador, index) => {
        const casa = estadoJogo.casas[jogador.posicao];
        if (casa && casa.x !== undefined) {
            const offsetX = (index % 2) * 20 - 10;
            const offsetY = Math.floor(index / 2) * 20 - 10;
            
            ctx.beginPath();
            ctx.arc(casa.x + casa.largura / 2 + offsetX, casa.y + casa.altura / 2 + offsetY, 12, 0, Math.PI * 2);
            ctx.fillStyle = jogador.cor;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    });
}

function calcularPosicoesEspiral(largura, altura, casaW, casaH, esp, margem) {
    const posicoes = [];
    
    // Parâmetros da espiral
    let x = margem;
    let y = margem;
    let direcao = 0; // 0=direita, 1=baixo, 2=esquerda, 3=cima
    
    // Dimensões da área disponível
    let direita = largura - margem;
    let baixo = altura - margem;
    let esquerda = margem;
    let cima = margem;
    
    let casasAdicionadas = 0;
    const totalCasas = 30;
    
    while (casasAdicionadas < totalCasas) {
        // Direita
        if (direcao === 0) {
            while (x + casaW <= direita && casasAdicionadas < totalCasas) {
                posicoes.push({ x, y, largura: casaW, altura: casaH, angulo: 0 });
                x += casaW + esp;
                casasAdicionadas++;
            }
            x -= casaW + esp;
            y += casaH + esp;
            cima += casaH + esp;
            direcao = 1;
        }
        // Baixo
        else if (direcao === 1) {
            while (y + casaH <= baixo && casasAdicionadas < totalCasas) {
                posicoes.push({ x, y, largura: casaH, altura: casaW, angulo: Math.PI / 2 });
                y += casaW + esp;
                casasAdicionadas++;
            }
            y -= casaW + esp;
            x -= casaH + esp;
            direita -= casaH + esp;
            direcao = 2;
        }
        // Esquerda
        else if (direcao === 2) {
            while (x >= esquerda && casasAdicionadas < totalCasas) {
                posicoes.push({ x, y, largura: casaW, altura: casaH, angulo: 0 });
                x -= casaW + esp;
                casasAdicionadas++;
            }
            x += casaW + esp;
            y -= casaH + esp;
            baixo -= casaH + esp;
            direcao = 3;
        }
        // Cima
        else if (direcao === 3) {
            while (y >= cima && casasAdicionadas < totalCasas) {
                posicoes.push({ x, y, largura: casaH, altura: casaW, angulo: Math.PI / 2 });
                y -= casaW + esp;
                casasAdicionadas++;
            }
            y += casaW + esp;
            x += casaH + esp;
            esquerda += casaH + esp;
            direcao = 0;
        }
    }
    
    return posicoes;
}

function atualizarInfoJogadores() {
    const container = document.getElementById('jogadores-info');
    container.innerHTML = '';
    
    estadoJogo.jogadores.forEach((jogador, index) => {
        const div = document.createElement('div');
        div.className = 'jogador-info';
        if (index === estadoJogo.jogadorAtual) {
            div.classList.add('ativo');
        }
        
        const cores = ['🔴', '🔵', '🟢', '🟡'];
        
        const produtos = jogador.produtosEscolhidos.map(id => {
            const produto = PRODUTOS.find(p => p.id === id);
            const comprado = jogador.produtosComprados.includes(id);
            const estilo = comprado ? 'text-decoration: line-through; opacity: 0.5;' : '';
            return `<span style="${estilo}">${produto.icon}</span>`;
        }).join(' ');
        
        div.innerHTML = `
            <h3 style="color: ${jogador.cor}">${cores[index]} ${jogador.nome}</h3>
            <p><strong>💰 Dinheiro:</strong> ${jogador.dinheiro} bottons</p>
            <p><strong>📍 Posição:</strong> Casa ${jogador.posicao}</p>
            <p><strong>🛒 Produtos:</strong> ${produtos}</p>
        `;
        
        container.appendChild(div);
    });
}

function rolarDado() {
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    
    if (jogador.perdeuVez) {
        jogador.perdeuVez = false;
        proximoJogador();
        return;
    }
    
    const dado = Math.floor(Math.random() * 6) + 1;
    document.getElementById('resultado-dado').textContent = `🎲 ${dado}`;
    
    setTimeout(() => {
        moverJogador(dado);
    }, 1000);
}

function moverJogador(casas) {
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    jogador.posicao += casas;
    
    if (jogador.posicao >= CONFIG.NUM_CASAS - 1) {
        jogador.posicao = CONFIG.NUM_CASAS - 1;
        verificarFimJogo();
        return;
    }
    
    desenharTabuleiro();
    atualizarInfoJogadores();
    
    const casa = estadoJogo.casas[jogador.posicao];
    
    if (casa.tipo === 'azul') {
        jogador.perdeuVez = true;
        alert(`${jogador.nome} caiu em uma casa azul! Perde a próxima vez.`);
        proximoJogador();
    } else if (casa.tipo === 'amarela') {
        mostrarCartaAmarela();
    } else if (casa.tipo === 'vermelha') {
        mostrarCartaVermelha();
    } else {
        proximoJogador();
    }
}

function mostrarCartaAmarela() {
    const carta = CARTAS_AMARELAS[Math.floor(Math.random() * CARTAS_AMARELAS.length)];
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    
    const modal = document.getElementById('modal-carta');
    const conteudo = document.getElementById('carta-conteudo');
    
    let valorTexto, classe;
    if (carta.tipo === 'ganho') {
        jogador.dinheiro += carta.valor;
        valorTexto = `RECEBA ${carta.valor} BOTTONS`;
        classe = 'carta-amarela';
    } else {
        jogador.dinheiro -= carta.valor;
        valorTexto = `PAGUE ${carta.valor} BOTTONS`;
        classe = 'carta-amarela';
    }
    
    conteudo.className = classe;
    conteudo.innerHTML = `
        <div class="carta-titulo">${carta.texto}</div>
        <div class="carta-valor">${valorTexto}</div>
    `;
    
    modal.style.display = 'flex';
    atualizarInfoJogadores();
}

function mostrarCartaVermelha() {
    const carta = CARTAS_VERMELHAS[Math.floor(Math.random() * CARTAS_VERMELHAS.length)];
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    
    const modal = document.getElementById('modal-decisao');
    const conteudo = document.getElementById('decisao-conteudo');
    
    const produto1 = PRODUTOS.find(p => p.nome === carta.opcao1.produto);
    const produto2 = PRODUTOS.find(p => p.nome === carta.opcao2.produto);
    
    conteudo.innerHTML = `
        <div class="carta-titulo carta-vermelha">NÃO PERCA!</div>
        <div class="decisao-opcoes">
            <div class="opcao-decisao" onclick="escolherOpcao(1, ${carta.opcao1.casas}, ${produto1.id})">
                <h3>OPÇÃO 1</h3>
                <div style="font-size: 3em">${produto1.icon}</div>
                <p>COMPRE UM<br>${produto1.nome}</p>
                <p><strong>${produto1.preco} BOTTONS</strong></p>
                <p>ANDE ${carta.opcao1.casas} ${carta.opcao1.casas === 1 ? 'CASA' : 'CASAS'}</p>
            </div>
            <div class="opcao-decisao" onclick="escolherOpcao(2, ${carta.opcao2.casas}, ${produto2.id})">
                <h3>OPÇÃO 2</h3>
                <div style="font-size: 3em">${produto2.icon}</div>
                <p>COMPRE UM<br>${produto2.nome}</p>
                <p><strong>${produto2.preco} BOTTONS</strong></p>
                <p>ANDE ${carta.opcao2.casas} ${carta.opcao2.casas === 1 ? 'CASA' : 'CASAS'}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function escolherOpcao(opcao, casasExtras, produtoId) {
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    const produto = PRODUTOS.find(p => p.id === produtoId);
    
    // Comprar produto
    if (jogador.dinheiro >= produto.preco) {
        jogador.dinheiro -= produto.preco;
        if (!jogador.produtosComprados.includes(produtoId)) {
            jogador.produtosComprados.push(produtoId);
        }
    } else {
        alert(`${jogador.nome} não tem dinheiro suficiente!`);
    }
    
    // Mover casas extras
    if (casasExtras > 0) {
        jogador.posicao += casasExtras;
        if (jogador.posicao >= CONFIG.NUM_CASAS - 1) {
            jogador.posicao = CONFIG.NUM_CASAS - 1;
        }
    }
    
    document.getElementById('modal-decisao').style.display = 'none';
    desenharTabuleiro();
    atualizarInfoJogadores();
    
    if (jogador.posicao >= CONFIG.NUM_CASAS - 1) {
        verificarFimJogo();
    } else {
        proximoJogador();
    }
}

function fecharModalCarta() {
    document.getElementById('modal-carta').style.display = 'none';
    proximoJogador();
}

function proximoJogador() {
    document.getElementById('resultado-dado').textContent = '';
    estadoJogo.jogadorAtual = (estadoJogo.jogadorAtual + 1) % estadoJogo.jogadores.length;
    atualizarInfoJogadores();
}

function verificarFimJogo() {
    const todosChegaram = estadoJogo.jogadores.every(j => j.posicao >= CONFIG.NUM_CASAS - 1);
    
    if (todosChegaram && !estadoJogo.fasePerguntas) {
        estadoJogo.fasePerguntas = true;
        estadoJogo.jogadorAtual = 0;
        estadoJogo.perguntaAtual = 0;
        mostrarPergunta();
    }
}

function mostrarPergunta() {
    const modal = document.getElementById('modal-final');
    const perguntaDiv = document.getElementById('pergunta-atual');
    const opcoesDiv = document.getElementById('opcoes-resposta');
    
    const pergunta = PERGUNTAS[estadoJogo.perguntaAtual];
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    
    perguntaDiv.innerHTML = `
        <h3>${jogador.nome}, responda:</h3>
        <p style="font-size: 1.3em; margin-top: 15px;">${pergunta.pergunta}</p>
    `;
    
    opcoesDiv.innerHTML = '';
    pergunta.opcoes.forEach((opcao, index) => {
        const div = document.createElement('div');
        div.className = 'opcao-resposta';
        div.textContent = opcao.texto;
        div.onclick = () => selecionarResposta(index);
        opcoesDiv.appendChild(div);
    });
    
    modal.style.display = 'flex';
}

function selecionarResposta(index) {
    document.querySelectorAll('.opcao-resposta').forEach((el, i) => {
        el.classList.remove('selecionada');
        if (i === index) {
            el.classList.add('selecionada');
        }
    });
}

function responderPergunta() {
    const selecionada = document.querySelector('.opcao-resposta.selecionada');
    if (!selecionada) {
        alert('Selecione uma resposta!');
        return;
    }
    
    const index = Array.from(document.querySelectorAll('.opcao-resposta')).indexOf(selecionada);
    const pergunta = PERGUNTAS[estadoJogo.perguntaAtual];
    const jogador = estadoJogo.jogadores[estadoJogo.jogadorAtual];
    
    if (pergunta.opcoes[index].correta) {
        jogador.respostasCorretas++;
        jogador.dinheiro += 1;
        selecionada.classList.add('correta');
        setTimeout(() => {
            proximaPerguntaOuFinalizar();
        }, 1500);
    } else {
        selecionada.classList.add('incorreta');
        setTimeout(() => {
            proximaPerguntaOuFinalizar();
        }, 1500);
    }
}

function proximaPerguntaOuFinalizar() {
    estadoJogo.jogadorAtual++;
    
    if (estadoJogo.jogadorAtual >= estadoJogo.jogadores.length) {
        estadoJogo.jogadorAtual = 0;
        estadoJogo.perguntaAtual++;
    }
    
    if (estadoJogo.perguntaAtual >= PERGUNTAS.length) {
        finalizarJogo();
    } else {
        mostrarPergunta();
    }
}

function finalizarJogo() {
    document.getElementById('modal-final').style.display = 'none';
    
    // Calcular pontuação final
    estadoJogo.jogadores.forEach(jogador => {
        const produtosComprados = jogador.produtosEscolhidos.filter(id => 
            jogador.produtosComprados.includes(id)
        ).length;
        
        jogador.pontuacaoFinal = jogador.dinheiro;
        jogador.produtosCompradosTotal = produtosComprados;
        jogador.completouLista = produtosComprados === CONFIG.PRODUTOS_PARA_COMPRAR;
    });
    
    // Ordenar por completou lista primeiro, depois por dinheiro
    const ranking = [...estadoJogo.jogadores].sort((a, b) => {
        if (a.completouLista && !b.completouLista) return -1;
        if (!a.completouLista && b.completouLista) return 1;
        return b.pontuacaoFinal - a.pontuacaoFinal;
    });
    
    mostrarResultadoFinal(ranking);
}

function mostrarResultadoFinal(ranking) {
    const modal = document.getElementById('modal-resultado');
    const resultado = document.getElementById('resultado-final');
    
    resultado.innerHTML = '';
    
    ranking.forEach((jogador, index) => {
        const div = document.createElement('div');
        div.className = 'ranking-item';
        if (index === 0) div.classList.add('vencedor');
        
        const produtos = jogador.produtosEscolhidos.map(id => {
            const produto = PRODUTOS.find(p => p.id === id);
            const comprado = jogador.produtosComprados.includes(id);
            return `<span class="produto-mini" style="background: ${comprado ? '#2ecc71' : '#e74c3c'}; color: white">${produto.icon} ${produto.nome}</span>`;
        }).join('');
        
        div.innerHTML = `
            <div class="ranking-posicao">${index === 0 ? '🏆' : `${index + 1}º`}</div>
            <div class="ranking-info">
                <h3 style="color: ${jogador.cor}">${jogador.nome}</h3>
                <div class="ranking-detalhes">
                    <p>💰 Dinheiro final: <strong>${jogador.dinheiro} bottons</strong></p>
                    <p>🛒 Produtos comprados: ${jogador.produtosCompradosTotal}/${CONFIG.PRODUTOS_PARA_COMPRAR}</p>
                    <p>✅ Respostas corretas: ${jogador.respostasCorretas}/${PERGUNTAS.length}</p>
                    <p>${produtos}</p>
                    ${!jogador.completouLista ? '<p style="color: #e74c3c; font-weight: bold;">❌ Não completou a lista!</p>' : ''}
                </div>
            </div>
        `;
        
        resultado.appendChild(div);
    });
    
    modal.style.display = 'flex';
}
