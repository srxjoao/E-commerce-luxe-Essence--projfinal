//Lê um arquivo qualquer
//caminhoArquivo é o parâmetro que você deve usar para informar o nome do arquivo.
const loadFile = function(caminhoArquivo, done) {
  var xhr = new XMLHttpRequest()
  xhr.onload = function() { return done(this.responseText) }
  xhr.open("GET", caminhoArquivo, true)
  xhr.send()
}

//Objeto contendo os dados do usuário que serão carregados do JSON
let dadosUsuario = {}
//Objeto contendo os dados dos items que serão carregados do JSON
let dadosProdutos = {}

//Coleção de items que foram comprados
let carrinho = []

//Carrega os dados contidos nos arquivos JSON dos items e do usuário
//JSONFile: Nome do arquivo contendo os dados dos items. Ex: dados.json
//userFile: Nome do arquivo contendo os dados do usuário. Ex: usuário.json
//func: Função a ser chamada depois que os dados dos arquivos JSON forem carregados
//Retorna o valor 1 para indicar que o carregamento foi bem sucedido
const carregaJSON = function(JSONFile, userFile, func) {
  console.log("Carregando JSON com os items do site ...");
  loadFile(JSONFile, function(responseText) {
    dadosProdutos = JSON.parse(responseText)
    console.log("OK dados produtos")
    console.log("Carregando dados do usuário ...");
    loadFile(userFile, function(responseText) {
      dadosUsuario = JSON.parse(responseText)
      console.log("OK dados usuario")
      func()
      return 1
    })
  })
}

//A função setup é chamada após os dados do JSON dos items e do usuário terem sido carregadas em seus respectivos objetos. Todas as outras funcionalidades a serem feitas após o carregamento dos arquivos devem estar dentro da função setup.
//Sem parâmetros
//Retorna 1  para mostrar que o carregamento foi bem sucedido
const setup = function() {
  //Chama a função para criar os elementos HTML a partir de um array de items
  criaProdutosNoHTML("containerProdutos", dadosProdutos.produtos, "Todos os produtos")
  return 1
}

//A função init é chamada automaticamente ao término do carregamento dos elementos do body no HTML
//Sem parâmetros
//Sem retorno
const init = function() {
  carregaJSON("/data/data.json", "/data/usuario.json", setup);
}

//A função comprarItemClick é atribuida a todos os botões "comprar" de todos os items. Para diferenciar qual item está sendo selecionado utilizaremos o ID do próprio botão, que é igual ao ID do produto no JSON ...
//Sem parâmetros
//Sem retorno
const comprarItemClick = function() {
  console.log("Comprando item ", this.id)
  let produto = dadosProdutos.produtos.filter(p => p.id === this.id)
  carrinho.push(produto[0])
  console.log(carrinho)
}

const favoritar = function() {
  console.log("Favoritando item ", this.id)
  let produto = dadosProdutos.produtos.find(p => p.id === this.id)
  produto.favorito = !produto.favorito
  if (produto.favorito == true){
    this.src = "/images/fav2.png"
  }
  else{
    this.src = "/images/fav1.png"
  }
    
}

//A função criaProdutosNoHTML vai gerar, a partir de um array de items, os elementos HTML que apresentam um determinado item (titulo, imagem, descricao, botão de compra)
//container: String que contém o ID da div no HTML onde os elementos ficarão ancorados
//dadosProdutos: Array contendo os items a serem apresentados
//categoria: String contendo o título a ser apresentado na div (na prática é um H1)
//Sem retorno
function criaProdutosNoHTML(container, dadosProdutos, categoria) {
  let containerCategoria = document.getElementById(container)

  child = containerCategoria.lastElementChild
  while (child) {
    containerCategoria.removeChild(child)
    child = containerCategoria.lastElementChild
  }

  //Cria o título da categoria dentro do container
  let titulo = document.createElement('h1')
  //Substituir pela classe que você criou para o seu título de produto
  titulo['className'] = "SEU CLASSE CSS"
  titulo.textContent = categoria
  containerCategoria.appendChild(titulo)

  //Carrega todos os produtos no container (div)
  let containerProdutos = document.getElementById(container)

  child = containerProdutos.lastElementChild
  while (child) {
    containerProdutos.removeChild(child)
    child = containerProdutos.lastElementChild
  }

  let contador = 0
  //Percorre todos os produtos para criar cada card dos items
  for (let produto of dadosProdutos) {
    if (contador % 4 == 0) {
      var row = document.createElement('div')
      row['className'] = "row"
      containerProdutos.appendChild(row);
    }
    //Cria a div card para o produto
    let novaDiv = document.createElement('div')
    //Substituir pela classe que você criou para o seu título de produto
    novaDiv['className'] = "col"
    row.appendChild(novaDiv);

    //cria a imagem dentro da div do card
    let img = document.createElement('img')
    img['src'] = produto.img
    img['style'] = "max-width:350px; max-height:350px"
    img['className'] = "card-img-top"
    novaDiv.appendChild(img)

    //Cria o titulo do produto na div   
    let nH1 = document.createElement('h1');
    nH1['className'] = "card-title"
    nH1['style'] = "font-size:25px;"
    nH1.textContent = produto.titulo
    novaDiv.appendChild(nH1)

    //Cria o preco   
    let pPreco = document.createElement('p')
    pPreco['className'] = "card-text"
    pPreco.textContent = produto.valor
    novaDiv.appendChild(pPreco)

    //cria a imagem dentro da div do card
    let fav = document.createElement('img')
    if (produto.favorito == true) {
      fav['src'] = "/images/fav2.png"
    }
    else{
      fav['src'] = "/images/fav1.png"
    }    
    fav['className'] = "favorito"
    fav.onclick = favoritar
    fav['id'] = produto.id
    novaDiv.appendChild(fav)

    //Cria o botão    
    let Adicionaraocarrinho = document.createElement('p')
    novaDiv.appendChild(Adicionaraocarrinho)
    let bBotao = document.createElement('button')
    bBotao['id'] = produto.id
    bBotao['className'] = "btn btn-outline-secondary"
    bBotao.onclick = comprarItemClick
    bBotao.textContent = "Adicionar ao carrinho"
    Adicionaraocarrinho.appendChild(bBotao)

    contador++
  }
}

let filtrasinkcare = function(produto) {
  if (produto.categoria == "skincare") {
    return True
  }
  else {
    return False
  }
}

//filtros para produtos

const filtroSkincare = function() {
  console.log("filtro skincare")
  let skincareSkkn = dadosProdutos.produtos.filter(
    produto => produto.categoria == "skincare"
  )
  document.getElementById("estoque").innerHTML = skincareSkkn.length + "produtos"
  criaProdutosNoHTML("containerProdutos", skincareSkkn, "Categoria: Skincare")
}


function carregacarrinhos() {
  criaProdutosNoHTML(containerProdutos, carrinho, "Carrinho")
}

const filtroROUPAS = function() {
  console.log("filtro roupas")
  let roupas = dadosProdutos.produtos.filter(
    produto => produto.categoria == "roupas M/H"
  )
  document.getElementById("estoque").innerHTML = roupas.length + "produtos"
  criaProdutosNoHTML("containerProdutos", roupas, "Categoria: roupas M/H")
}


function carregacarrinhos() {
  criaProdutosNoHTML(containerProdutos, carrinho, "Carrinho")
}

const filtroAcessorios = function() {
  console.log("filtro acessorios")
  let acessorios = dadosProdutos.produtos.filter(
    produto => produto.categoria == "acessorios"
  )
  document.getElementById("estoque").innerHTML =  acessorios.length+"produtos"
  criaProdutosNoHTML("containerProdutos", acessorios, "Categoria: acessorios")
}

const filtroFavs= function() { 
  let acessorios = dadosProdutos.produtos.filter(
    produto => produto.favorito == true
  )
  document.getElementById("estoque").innerHTML =  acessorios.length+"produtos"
  criaProdutosNoHTML("containerProdutos", acessorios, "Favoritos")
}

//soma os valores 
function carregacarrinho() {
  criaProdutosNoHTML("containerProdutos", carrinho, "Carrinho")
  let total = carrinho.reduce((soma, p) => soma + p.valor,0)
  document.getElementById("estoque").innerHTML = total
}

//Add ao carrinho
function procurar(){
  let pesquisa =  document.getElementById("pesquisando").value
   let buscando = dadosProdutos.produtos.filter(
    produto => produto.titulo == pesquisa
  )
  criaProdutosNoHTML("containerProdutos", buscando, "#: "+pesquisa)
}

//remove carrinho

function remove (){
  carrinho.pop()
  carregacarrinho()
}

function limpa (){
  carrinho = []
  carregacarrinho()
}

