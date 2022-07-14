const obterFrases = async (language) => {
  const response = await fetch(`./frases/${language}.json`).then(response => response.json())
  const random = Math.floor(Math.random() * response.frases.length)
  data.frase = response.frases[random]
}
const data = {
  numeroLinha: 0,
  frase: '',
  linhaAtual: 0,
  colunaAtual: 0,
  final: false,
  myAudio: new Audio('./urss.mp3')
}

window.onload = () => {
  const linha = 5;
  const coluna = 5;
  montarGrid(linha, coluna);
  obterFrases(getCookie('language'));
  detectMobile();

  data.numeroLinha = 0;
  selecionarLinha(data.numeroLinha);

  document.addEventListener ('keydown', (event) => {
    if(data.final == false){
      const keyName = event.key;
      var cardSelecionado = document.getElementsByClassName("cardSelecionado");
      if(cardSelecionado.length != 0){
        data.colunaAtual = cardSelecionado.item(0).id.substr(-1)
        data.linhaAtual = cardSelecionado.item(0).id.substr(-2, 1)   
      }else{
        cardSelecionado = document.getElementById("card-" + data.linhaAtual + data.colunaAtual)
        cardSelecionado.classList.add("cardSelecionado");
        cardSelecionado = document.getElementsByClassName("cardSelecionado");
      }
      if(event.code == "ArrowUp" || event.code == "ArrowLeft"){
        if(data.colunaAtual > 0){
          selecionarCard(data.linhaAtual, parseInt(data.colunaAtual)-1);
        }
      }
      if(event.code == "Enter" && data.colunaAtual == 4){
        if(parseInt(data.linhaAtual)+1 == linha){
          if(!verificarFrase(data.linhaAtual)){
            alert("Você não acertou a Frase! '" + data.frase + "'");
  
          }
        }
        verificarFrase(data.linhaAtual);
        data.numeroLinha++;
        selecionarLinha(parseInt(data.linhaAtual) + 1)
        data.linhaAtual = parseInt(data.linhaAtual) + 1;
        data.colunaAtual = 0;
      }
      if(event.code == "ArrowDown" || event.code == "ArrowRight"){
        if(data.colunaAtual < coluna -1){
          selecionarCard(data.linhaAtual, parseInt(data.colunaAtual)+1);
        }
      }
  
      if(event.code == 'Delete' || event.code == 'Backspace'){
        cardSelecionado.item(0).innerHTML = '';
        if(data.colunaAtual > 0){
          selecionarCard(data.linhaAtual, parseInt(data.colunaAtual)-1);
        }
      }else{
        if(event.keyCode > 64 && event.keyCode < 91){
          cardSelecionado.item(0).innerHTML = keyName;
          if(data.colunaAtual < coluna -1){
            selecionarCard(data.linhaAtual, parseInt(data.colunaAtual)+1);
          }
        }
      }
    }
  });
}

const changeLanguage = (idioma) => {
  setCookie('language', idioma);
  restartPage();
}

const setCookie = (name, value) => {
  document.cookie = `${name}=${value}`
}
const getCookie = (name) => {
  let value = `; ${document.cookie}`;
  let partes = value.split(`; ${name}=`);
  if(partes.length == 2) return partes.pop().split(';').shift();
} 

const patriaMae = (frase, linha) => {
  var fraseChave = 'ursal'.split("");
  var count = 0;
  for (let index = 0; index < fraseChave.length; index++) {
    if(frase[index] == fraseChave[index]){
      count++
    }
  }
  if(count == fraseChave.length){
    ativaProtocoloSovietico();
  }
}

const ativaProtocoloSovietico = () => {
  document.getElementsByTagName("body").item(0).style.backgroundImage = "url(./bandeira.jpg)";
  document.getElementsByTagName("body").item(0).style.backgroundRepeat = "no-repeat";
  document.getElementsByTagName("body").item(0).style.backgroundSize = "cover";
  document.getElementsByTagName("body").item(0).style.zIndex = "5";
  data.myAudio.play();
}

const verificarFrase = (linha) => {
  var frase = Array.from(document.getElementById('linha-' + linha).childNodes).map((el) => { return el.outerText});
  patriaMae(frase, linha);
  var fraseData = data.frase.split("")
  var count = 0;
  for (let index = 0; index < frase.length; index++) {
    if(frase[index] == fraseData[index]){
      count++;
      document.getElementById("card-" + linha + index).classList.add("cardCerto");
    } else if(fraseData.includes(frase[index])){
      document.getElementById("card-" + linha + index).classList.add("cardMeioCerto");
    }else{
      document.getElementById("card-" + linha + index).classList.add("cardErrado");
    }
  }
  if(frase.length == count){
    alert("Parabens você acertou a palavra!!");
    data.final = true;
    deselecionarCard();
    return true;
  }
  return false;
}

const deselecionarCard = () => {
  Array.from(document.querySelectorAll('.cardSelecionado'))
    .forEach((el) => el.classList.remove('cardSelecionado'));
}

const selecionarCard = (linha, coluna) => {
  if(data.final == false){
    deselecionarCard();
    if(linha == data.numeroLinha){
      var card = document.getElementById(`card-${linha}${coluna}`)
      card.classList.add("cardSelecionado");
    }
  }
}

const selecionarLinha = (linha) => {
  deselecionarLinha();
  selecionarCard(linha, 0);
  var row = document.getElementById(`linha-${linha}`);
  const columns = row.childNodes;
  columns.forEach(column => {
    column.classList.add("linhaSelecionada");
  });
}

const deselecionarLinha = () => {
  Array.from(document.querySelectorAll('.linhaSelecionada'))
    .forEach((el) => el.classList.remove('linhaSelecionada'));
}



const montarGrid = (linha, coluna) => {
  var container = document.getElementById('container-items');
  var toInner = ''
  for (let index = 0; index < linha; index++) {
    toInner += '<div class="row" id="linha-' + index + '">'
    for (let aux = 0; aux < coluna; aux++) {
      toInner += '<div class="col card" id="card-' + index + aux +'" onclick="selecionarCard('+ index + ','+ aux +')">'+'</div>';  
    }
    toInner += '</div>'
  }
  container.innerHTML = toInner + container.innerHTML
}

const restartPage = () => {
  window.location.reload()
}

const detectMobile = () => {
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)){
    document.getElementsByClassName("main").item(0).classList.add("mobile");
    return true;
  }else{
    return false;
  }
}
