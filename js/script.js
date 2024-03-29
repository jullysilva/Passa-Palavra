//GlOBALS
//Salva qual tema está
let TEMA_ATUAL = null;
//Salva qual o avatar escolhido
let AVATAR = 7;
//Verifica se está jogando
let INGAME = 0;
//Conta em qual letra esta
let LETTER_COUNT = 0;
//Conta o numero de erros
let ERROR_COUNT = 0;
//Conta numero de acertos
let HIT_COUNT = 0;
//Conta os passa-palavra
let PASS_COUNT = 0;
//Salva ultimo numero random
let LAST_RANDOM_NUMBER = 0;
let marcador_fim = 0;
let perguntas_passadas = []
// Cria objeto player para salvar todas as variaveis de multijogador
sessionStorage.setItem("numplayer", 0);
var numplayer = sessionStorage.getItem('numplayer');
let regNovo = null;


function mudarJogador() {
  if (sessionStorage.getItem('jogador') == "multiplayer") {
    if (numplayer == 1) {
      if (jogador.player[0].marcador_fim) {
        if (jogador.player[0].perguntas_passadas.lenght) {
          numplayer = 0;
          sessionStorage.setItem('numplayer', 0);
        }
        else {
          return
        }
      } else {
        numplayer = 0;
        sessionStorage.setItem('numplayer', 0);
      }
    } else {
      if (jogador.player[1].marcador_fim) {
        if (jogador.player[1].perguntas_passadas.lenght) {
          numplayer = 1;
          sessionStorage.setItem('numplayer', 1);
        } else {
          return
        }
      } else {
        numplayer = 1;
        sessionStorage.setItem('numplayer', 1);
      }
    }

    resetarCores();
    colorirTudo();
  }
}

let corCirculos = {
  'player': [{
    'cores': []
  }, {
    'cores': []
  }]
};

let player_inicio = {
  'player': [{
    'HIT_COUNT': 0,
    'LETTER_COUNT': 0,
    'ERROR_COUNT': 0,
    'PASS_COUNT': 0,
    'LAST_RANDOM_NUMBER': 0,
    'cores': [],
    'marcador_fim': 0,
    'perguntas_passadas': []
  }, {
    'HIT_COUNT': 0,
    'LETTER_COUNT': 0,
    'ERROR_COUNT': 0,
    'PASS_COUNT': 0,
    'LAST_RANDOM_NUMBER': 0,
    'cores': [],
    'marcador_fim': 0,
    'perguntas_passadas': []
  }]
};
var jogador = JSON.parse(sessionStorage.getItem("player"));

function comeco() {
  var jogador = JSON.parse(sessionStorage.getItem("player"));
  if (!jogador && INGAME == 0) {
    jogador = player_inicio;
    sessionStorage.setItem("player", JSON.stringify(player_inicio));
  }
}
comeco();


function carregaVariaveis() {
  LETTER_COUNT = jogador.player[numplayer].LETTER_COUNT;
  TEMA_ATUAL = jogador.player[numplayer].TEMA_ATUAL;
  INGAME = jogador.player[numplayer].INGAME;
  ERROR_COUNT = jogador.player[numplayer].ERROR_COUNT;
  HIT_COUNT = jogador.player[numplayer].HIT_COUNT;
  PASS_COUNT = jogador.player[numplayer].PASS_COUNT;
  LAST_RANDOM_NUMBER = jogador.player[numplayer].LAST_RANDOM_NUMBER;
  marcador_fim = jogador.player[numplayer].marcador_fim;
  perguntas_passadas = jogador.player[numplayer].perguntas_passadas;
}

function salvarVariaveis() {
  jogador.player[numplayer].LETTER_COUNT = LETTER_COUNT;
  jogador.player[numplayer].TEMA_ATUAL = TEMA_ATUAL;
  jogador.player[numplayer].INGAME = INGAME;
  jogador.player[numplayer].ERROR_COUNT = ERROR_COUNT;
  jogador.player[numplayer].HIT_COUNT = HIT_COUNT;
  jogador.player[numplayer].PASS_COUNT = PASS_COUNT;
  jogador.player[numplayer].LAST_RANDOM_NUMBER = LAST_RANDOM_NUMBER;
  jogador.player[numplayer].marcador_fim = marcador_fim;
  jogador.player[numplayer].perguntas_passadas = perguntas_passadas;
  sessionStorage.setItem('player', JSON.stringify(jogador));
}

carregaVariaveis();
salvarVariaveis();

const ALFABETO = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

function SetAvatar(i, j) {
  sessionStorage.setItem('AVATAR_' + j, i);
  router("tela_final", 0);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//i é o numero da letra, 0=a
//TODO: pular letras faltantes
function LerPergunta(i) {
  if (localStorage.getItem('DADOS')) {
    DB = JSON.parse(localStorage.getItem('DADOS'))
  }
  if (LETTER_COUNT < 26 || jogador.player[numplayer].perguntas_passadas.length) {
    if (LETTER_COUNT == -1) {
      FinalizaJogo(-1)
    }
    TEMA_ATUAL = sessionStorage.getItem('TEMA_ATUAL');
    if (jogador.player[numplayer].marcador_fim == 0) {
      LAST_RANDOM_NUMBER = getRandomInt(0, DB[TEMA_ATUAL][parseInt(i)].length - 1);
    }
    while (DB[TEMA_ATUAL][parseInt(i)][LAST_RANDOM_NUMBER] == null) {
      LETTER_COUNT++;
      i++;
      salvarVariaveis();
      if (DB[TEMA_ATUAL][parseInt(i)] == null) {
        LETTER_COUNT = 26;

        FinalizaJogo(26);
      }
    }
    console.log("[LerPergunta] LETTER_COUNT= ", i)
    console.log("[LerPergunta] i= ", i)
    var pergunta = DB[TEMA_ATUAL][parseInt(i)][LAST_RANDOM_NUMBER].pergunta;
    document.getElementById('question').innerHTML = `<span>${pergunta}</span>`;
    $('#question').textfill({
      maxFontPixels: 0
    });
    LetraFoco(i, false);
    return pergunta;
  } else {

    Jogo(26);
  }

}

function PassouAPalavra() {
  let dado_passou_palavra = {}
  dado_passou_palavra.indice = LETTER_COUNT;
  dado_passou_palavra.random = LAST_RANDOM_NUMBER;
  perguntas_passadas.push(dado_passou_palavra)
  salvarVariaveis();
  LetraFoco(LETTER_COUNT, true);
  colorirCircle(3);
  PASS_COUNT++;
  LETTER_COUNT++;
  salvarVariaveis();
  if (parseInt(HIT_COUNT) + parseInt(ERROR_COUNT) + parseInt(PASS_COUNT) >= 26) {
    r
    FinalizaJogo(26);
  } else {
    mudarJogador();
    carregaVariaveis();
    LerPergunta(LETTER_COUNT);
  }
}

function contador() {
  HIT_COUNT = sessionStorage.getItem('HIT');
  var contadorFinal = sessionStorage.getItem('resultados');

  if (sessionStorage.getItem('jogador') == "multiplayer") {
    if (contadorFinal[0] > contadorFinal[2]) {
      document.getElementById("respostaFinal").innerHTML = "O jogador 1 venceu! acertando " + contadorFinal[0] + " perguntas!<br><br> O jogador 2 acertou apenas " + contadorFinal[2] + " perguntas!";
    } else {
      document.getElementById("respostaFinal").innerHTML = "O jogador 2 venceu! acertando " + contadorFinal[2] + " perguntas!<br><br> O jogador 1 acertou apenas " + contadorFinal[0] + " perguntas!";
    }
  } else {

    document.getElementById("respostaFinal").innerHTML = "Voce acertou " + HIT_COUNT + " perguntas!";
  }
  sessionStorage.setItem('HIT', 0);

}



//Reseta as variaveis globais e redireciona para a tela correspondente ao parametro
function router(where_from, tema) {
  if (where_from == "index") {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "./views/tela_temas.html";
    //INGAME = false;
    sessionStorage.setItem('INGAME', 0);

  } else if (where_from == "menu") {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "./tela_jogo.html";
    //INGAME = true;
    sessionStorage.setItem('INGAME', 1);

  } else if (where_from == "criarTemas") {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "./tela_criar_tema.html";

  } else if (where_from == "personalizar") {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "./views/tela_criar_tema.html";

  } else if (where_from == "escolheAvatar") {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "./views/tela_avatar.html";

  } else if (where_from == "themeSelection") {
    sessionStorage.setItem('TEMA_ATUAL', tema);
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "../views/tela_jogo.html";
    //INGAME = true;
    sessionStorage.setItem('INGAME', 1);

  } else if (where_from == "tela_final") {
    location = "../index.html";
    //INGAME = false;
    sessionStorage.setItem('INGAME', 0);

  } else if (where_from == "tela_jogo") {
    location = "./tela_final.html";
    //INGAME = false;
    sessionStorage.setItem('INGAME', 0);

  } else if (where_from == "tela_criar_tema") {
    location = "../index.html";
    //INGAME = false;
    sessionStorage.setItem('INGAME', 0);

  } else {
    sessionStorage.setItem('HIT_COUNT', 0);
    location = "../views/tela_jogo.html";
    //INGAME = true;
    sessionStorage.setItem('INGAME', 1);

  }
  var resultados = [jogador.player[0].HIT_COUNT, jogador.player[1].HIT_COUNT];
  sessionStorage.setItem('resultados', resultados);
  jogador = player_inicio;
  sessionStorage.setItem('player', JSON.stringify(jogador));

}

//Confere o valor no Form=form-resposta com o .resposta no JSON
function ConfereResposta(i, random) {
  if (parseInt(HIT_COUNT) + parseInt(ERROR_COUNT) + parseInt(PASS_COUNT) >= 26 && !jogador.player[numplayer].perguntas_passadas.length) {

    FinalizaJogo(27);
  } else {
    console.log("[ConfereResposta]I= ", i)
    LetraFoco(i, true);
    var Fres = document.getElementById('form-resposta').Fresposta.value;
    var JSres = DB[TEMA_ATUAL][i][random || LAST_RANDOM_NUMBER].resposta;

    document.getElementById('form-resposta').Fresposta.value = '';

    Fres = TratamentoString(Fres);
    JSres = TratamentoString(JSres);
    //Resposta correta
    if (Fres == '') {
      PassouAPalavra();
    } else if (Fres == JSres) {
      carregaVariaveis();
      colorirCircle(1);
      HIT_COUNT++;
      sessionStorage.setItem("HIT", HIT_COUNT);
      LETTER_COUNT++;
      salvarVariaveis();
      if (parseInt(HIT_COUNT) + parseInt(ERROR_COUNT) + parseInt(PASS_COUNT) >= 26) {
        salvarVariaveis();

        FinalizaJogo(26);
      } else {
        LerPergunta(LETTER_COUNT);
      }
    }
    //Resposta incorreta
    else {
      colorirCircle(2);
      ERROR_COUNT++;
      LETTER_COUNT++;
      salvarVariaveis();
      if (parseInt(HIT_COUNT) + parseInt(ERROR_COUNT) + parseInt(PASS_COUNT) >= 26) {

        FinalizaJogo(26);
      } else {
        mudarJogador();
        carregaVariaveis();
        LerPergunta(LETTER_COUNT);
      }
    }
  }
}

//Tratamento da string
function TratamentoString(str) {
  str = str.replace(/ /g, "");
  str = str.replace(/[AÁÀÂÃÄáàâãä]/g, "a");
  str = str.replace(/[B]/g, "b");
  str = str.replace(/[CÇç]/g, "c");
  str = str.replace(/[D]/g, "d");
  str = str.replace(/[EÉÈÊËéèêë]/g, "e");
  str = str.replace(/[F]/g, "f");
  str = str.replace(/[G]/g, "g");
  str = str.replace(/[H]/g, "h");
  str = str.replace(/[IÍÌÎÏíìîï]/g, "i");
  str = str.replace(/[J]/g, "j");
  str = str.replace(/[K]/g, "k");
  str = str.replace(/[L]/g, "l");
  str = str.replace(/[M]/g, "m");
  str = str.replace(/[N]/g, "n");
  str = str.replace(/[OÓÒÔÕÖóòôõö]/g, "o");
  str = str.replace(/[P]/g, "p");
  str = str.replace(/[Q]/g, "q");
  str = str.replace(/[R]/g, "r");
  str = str.replace(/[S]/g, "s");
  str = str.replace(/[T]/g, "t");
  str = str.replace(/[UÚÙÛÜúùûü]/g, "u");
  str = str.replace(/[V]/g, "v");
  str = str.replace(/[W]/g, "w");
  str = str.replace(/[X]/g, "x");
  str = str.replace(/[Y]/g, "y");
  str = str.replace(/[Z]/g, "z");
  return str;
}

//Finaliza o jogo
function FinalizaJogo(i) {
  carregaVariaveis();
  if (i = 26 && !perguntas_passadas.length || i == -1) {

    if (numplayer == 1 && jogador.player[1].perguntas_passadas) {
      console.log("here4")
      jogador.player[0].perguntas_passadas.lenght
      mudarJogador()
    }
    if (numplayer == 0 && jogador.player[0].perguntas_passadas) {
      mudarJogador()
    }
    console.log("here2")
    document.getElementById('button-res').innerHTML = 'Finalizar Jogo';
    document.getElementById('button-res').onclick = function () {
      router('tela_jogo', 0)
    };
  } else {
    if (jogador.player[numplayer].marcador_fim == 0) {
      perguntas_passadas.push({ indice: -1, random: -1 });
      perguntas_passadas.reverse()
      marcador_fim = 1;
      salvarVariaveis();
    }
    let pergunta_atual = perguntas_passadas.pop()
    LETTER_COUNT = pergunta_atual.indice;
    LAST_RANDOM_NUMBER = pergunta_atual.random;
    salvarVariaveis();
    mudarJogador();
    carregaVariaveis();
    LerPergunta(jogador.player[numplayer].LETTER_COUNT);

  }
}

function LetraFoco(letra, respondida) {
  //A letra da vez ganha o foco da pergunta
  if (respondida == false) {
    document.getElementById("circle-" + String.fromCharCode(letra + 65)).classList.add("btn-info");
    document.getElementById("circle-" + String.fromCharCode(letra + 65)).style.fontSize = "large";
  }
  //A letra da vez perde o foco da pergunta
  else {
    document.getElementById("circle-" + String.fromCharCode(letra + 65)).style.fontSize = "medium";
  }
}

//TODO: Adicionar perguntas
function adicionarQuestao() {
  if (regNovo == null) {
    alert('Insira o tema e confirme-o, antes de adicionar perguntas e repostas!')
  }
  if (localStorage.getItem('DADOS')) {
    DB = JSON.parse(localStorage.getItem('DADOS'))
  }
  var formQuestoes = document.getElementById('form-questoes').checkValidity();
  if (formQuestoes == true) {
    var campoLetra = document.getElementById('campo-letra').value;
    var campoPergunta = document.getElementById('campo-pergunta').value;
    var campoResposta = document.getElementById('campo-resposta').value;
    var novaChave = {
      pergunta: campoPergunta,
      resposta: campoResposta
    };
    if (regNovo[campoTema][campoLetra] == null) {
      regNovo[campoTema][campoLetra] = new Array();
    }
    regNovo[campoTema][campoLetra].push(novaChave);

    document.getElementById('campo-pergunta').value = "";
    document.getElementById('campo-resposta').value = "";
    preencheQuestoes();
  }
}

function verificaLetrasQuestoes() {
  const selectElement = document.querySelector('#campo-letra');
  const options = selectElement.querySelectorAll('option');
  
  let allDisabled = true;
  
  for (let i = 0; i < options.length; i++) {
    if (!options[i].disabled) {
      allDisabled = false;
      break;
    }
  }
  
  if (allDisabled) {
    console.log('Todas as opções estão desabilitadas!');
    return true;
  } else {
    console.log('Algumas opções estão habilitadas.');
    return false;
  }  
}


//
function salvarTema() {
  var QuestoesList = document.getElementById('campo-questoes');
  var regNovoVar = regNovo;

  if (regNovoVar !== null && QuestoesList && QuestoesList.childElementCount > 0 && verificaLetrasQuestoes()) {
    for (var i = 0; i < 26; i++) {
      if (regNovoVar[i] == null) {
        regNovoVar[i] = "";
      }
    }
    DB[campoTema] = regNovoVar;
    localStorage.setItem("DADOS", JSON.stringify(DB));
    router("tela_criar_tema", 0);
  } else {
    alert('Preencha e confirme os campos obrigatórios, certifique-se que todas as letras foram selecionadas');
  }
}


//
function confirmaTema() {
  if (document.getElementById('campo-tema').value != "") {
    campoTema = document.getElementById('campo-tema').value;
    document.getElementById('campo-tema-input').innerHTML = `
        <h4 class="border-top border-bottom col text-center">
        ${campoTema}
        </h4>`;
    regNovo = new Array();
    regNovo[campoTema] = new Array();
  }
}

function deleteArray(tema, x, y) {
  //tema tem q ser string
  regNovo[tema][x].splice(y, 1);
  preencheQuestoes();
}

function verificaAlfabetoQuestoes(cont) {
  let letra = String.fromCharCode(cont + 65);
  let option_letra = document.querySelector(`#letra-${letra}`.toLowerCase());
  if (cont < 25) {
    let next_letra = String.fromCharCode(cont + 66);
    let next_option_letra = document.querySelector(`#letra-${next_letra}`.toLowerCase());
    next_option_letra.setAttribute('selected', '');
  }
  option_letra.setAttribute('disabled', '');
}

function preencheQuestoes() {
  document.getElementById('campo-questoes').innerHTML = "Questões:<br>";
  for (let cont = 0; cont <= 25; cont++) {
    if (regNovo[campoTema][cont] != null) {
      for (let cont2 = 0; cont2 < regNovo[campoTema][cont].length; cont2++) {
        verificaAlfabetoQuestoes(cont);
        document.getElementById('campo-questoes').innerHTML += `
                <button class="btn btn-light" onclick="deleteArray('${campoTema}',${cont},${cont2})"><img width="20px" src="../img/trash.svg"></button>
                <button class="btn btn-light" onclick="editArray('${campoTema}',${cont},${cont2})"><img width="20px" src="../img/pencil.svg"></button>
                Tema: ${campoTema}
                - Letra: ${String.fromCharCode(cont + 65)}
                - Pergunta: ${regNovo[campoTema][cont][cont2].pergunta}
                - Resposta: ${regNovo[campoTema][cont][cont2].resposta} <br>`;
      }
    }
  }
}

function editArray(tema, x, y) {
  document.getElementById('campo-letra').value = y;
  document.getElementById('campo-pergunta').value = regNovo[tema][x][y].pergunta;
  document.getElementById('campo-resposta').value = regNovo[tema][x][y].resposta;
  deleteArray(tema, x, y);

}

function saveGameMode() {
  for (var i = 0; i < 2; i++) {
    if (document.getElementsByName('jogador')[i].checked) {
      sessionStorage.setItem("jogador", document.getElementsByName('jogador')[i].value);
    }
    if (document.getElementsByName('tempo')[i].checked) {
      sessionStorage.setItem("tempo", document.getElementsByName('tempo')[i].value);
    }
  }
}
