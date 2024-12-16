function carregarCSV() {
    fetch('produtos.csv')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar o arquivo CSV.');
            return response.text();
        })
        .then(data => {
            const produtos = processarCSV(data);
            gerarProdutos(produtos);
        })
        .catch(error => console.error('Erro:', error));
}

// Função para processar os dados CSV e retornar um array de objetos
function processarCSV(data) {
    const linhas = data.split('\n');
    const produtos = [];
    for (let i = 1; i < linhas.length; i++) { // Ignora o cabeçalho
        const dados = linhas[i].split(',');
        if (dados.length === 4) {
            produtos.push({
                nome: dados[0].trim(),
                categoria: dados[1].trim(),
                preco: parseFloat(dados[2].trim()),
                imagem: dados[3].trim()
            });
        }
    }
    return produtos;
}

// Função para gerar os produtos no HTML
function gerarProdutos(produtos) {
    produtos.forEach(produto => {
        const container = document.getElementById(`produtos-container-${produto.categoria}`);
        if (container) {
            const produtoHTML = `
                <div class="produto" data-id="${produto.nome}" data-preco="${produto.preco}">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    <button class="botao" onclick="adicionarAoCarrinho(event)">Comprar: R$ ${produto.preco.toFixed(2)}</button>
                    <button class="quantidade_diminiu" onclick="alterarQuantidade(event, -1)">-</button>
                    <span class="quantidade-produto" data-id="${produto.nome}">0</span>
                    <button class="quantidade_aumenta" onclick="alterarQuantidade(event, 1)">+</button>
                </div>
            `;
            container.innerHTML += produtoHTML;
        }
    });
}


// Chama a função para carregar os produtos assim que a página carregar
window.onload = carregarCSV;




















// Função para exibir ou ocultar o painel
function togglePanel() {
    var panel = document.getElementById("cart-panel");
    // Alterna entre mostrar e esconder o painel
    panel.style.display = panel.style.display === "block" ? "none" : "block";
}

// Função para fechar o painel
function closePanel() {
    document.getElementById("cart-panel").style.display = "none";
}



let cart = [];  // Array para armazenar os produtos no carrinho

// Função para alternar o painel de carrinho
function togglePanel() {
    const panel = document.getElementById("cart-panel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
}

// Função para fechar o painel de carrinho
function closePanel() {
    document.getElementById("cart-panel").style.display = "none";
}

// Função para adicionar produtos ao carrinho
function adicionarAoCarrinho(event) {
    const produtoElement = event.target.closest('.produto'); // Encontra o produto mais próximo
    const id = produtoElement.dataset.id; // ID do produto
    const nome = produtoElement.querySelector('h3').textContent; // Nome do produto (conteúdo do h3)
    const preco = produtoElement.dataset.preco; // Preço do produto
    const quantidade = produtoElement.querySelector('.quantidade-produto').textContent; // Quantidade selecionada

    // Verifica se a quantidade é maior que 0
    if (quantidade > 0) {
        const produto = {
            id: id,
            nome: nome,
            preco: preco,
            quantidade: quantidade
        };

        // Verifica se o produto já está no carrinho
        const produtoExistente = cart.find(item => item.id === id);
        if (produtoExistente) {
            produtoExistente.quantidade = parseInt(produtoExistente.quantidade) + parseInt(quantidade);
        } else {
            cart.push(produto);
        }

        // Atualiza o painel do carrinho
        atualizarCarrinho();
    }
}


// Função para atualizar o painel de carrinho
function atualizarCarrinho() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = ""; // Limpa o painel

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <button onclick="removerDoCarrinho('${item.id}')">retirar produto</button>
            <div>
                <h4>${item.nome}</h4>
                <p>Preço: R$ ${item.preco * item.quantidade}</p>
                <p>Quantidade: ${item.quantidade}</p>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
}

// Função para remover um produto do carrinho
function removerDoCarrinho(id) {
    cart = cart.filter(item => item.id !== id); // Remove o item do carrinho
    atualizarCarrinho(); // Atualiza o painel
}

// Função para alterar a quantidade de um produto
function alterarQuantidade(event, delta) {
    const quantidadeElement = event.target.closest('.produto').querySelector('.quantidade-produto');
    let quantidade = parseInt(quantidadeElement.textContent);
    quantidade += delta;

    if (quantidade >= 0) {
        quantidadeElement.textContent = quantidade;
    }
}


// Função para gerar o resumo do pedido e enviar para o WhatsApp
function finalizarPedido() {
    // Cria o resumo do pedido
    let resumoPedido = 'Resumo do Pedido:\n';

    cart.forEach(item => {
        resumoPedido += `${item.nome} - Quantidade: ${item.quantidade} - Preço Total: R$ ${item.preco * item.quantidade}\n`;
    });

    // Adiciona o total do pedido
    let totalPedido = cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    resumoPedido += `\nTotal: R$ ${totalPedido.toFixed(2)}`;

    // Codifica o resumo do pedido e cria o link para o WhatsApp
    const whatsappLink = `https://wa.me/555181703581?text=${encodeURIComponent(resumoPedido)}`;

    // Abre o link do WhatsApp
    window.open(whatsappLink, '_blank');
}



document.getElementById('link-doces-sobremesas').onclick = function () {
    const targetElement = document.getElementById('doces_sobremesas');
    targetElement.scrollIntoView({ behavior: 'smooth' });
};

document.getElementById('link-salgados').onclick = function () {
    const targetElement = document.getElementById('salgados');
    targetElement.scrollIntoView({ behavior: 'smooth' });
};




let timeout;
function pesquisarProdutos() {
    clearTimeout(timeout); // Limpa qualquer execução anterior da função
    timeout = setTimeout(() => {
        const pesquisaInput = document.querySelector('.barra_pesquisa input'); // Obtém o input de pesquisa
        const produtos = document.querySelectorAll('.produto'); // Obtém todos os produtos
        const pesquisaTermo = pesquisaInput.value.toLowerCase(); // Obtém o texto digitado e transforma para minúsculas

        produtos.forEach((produto) => {
            const nomeProduto = produto.querySelector('h3').textContent.toLowerCase(); // Obtém o nome do produto

            if (nomeProduto.includes(pesquisaTermo)) {
                produto.style.display = 'block'; // Exibe o produto
            } else {
                produto.style.display = 'none'; // Oculta o produto
            }
        });
    }, 300); // Delay de 300ms
}

document.querySelector('.barra_pesquisa input').addEventListener('input', pesquisarProdutos);

