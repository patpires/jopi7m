//console.log('[DevSoutinho] Flappy Bird');
//console.log('Inscreva-se no canal :D https://www.youtube.com/channel/UCzR2u5RWXWjUh7CwLSvbitA');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
// Criando as medalhas de pontuação
const medalhas = {
  aco: { spriteX: 0, spriteY: 75, largura: 46, altura: 48 },
  prata: { spriteX: 47, spriteY: 75, largura: 46, altura: 48 },
  bronze: { spriteX: 0, spriteY: 123, largura: 46, altura: 48 },
  ouro: { spriteX: 47, spriteY: 123, largura: 46, altura: 48 },
};


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;
      
      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}

function fazColisao(Joaninha, chao) {
  const JoaninhaY = Joaninha.y + Joaninha.altura;
  const chaoY = chao.y;

  if(JoaninhaY >= chaoY) {
    return true;
  }

  return false;
}

function criaJoaninha() {
  const Joaninha = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 3, // Aumentar a altura do pulo
    pula() {
      Joaninha.velocidade =  - Joaninha.pulo;
    },
    gravidade: 0.1, // Reduzir a gravidade
    velocidade: 0,
    atualiza() {
      if(fazColisao(Joaninha, globais.chao)) {
        som_HIT.play();
        mudaParaTela(Telas.GAME_OVER);
        return;
      }
  
      Joaninha.velocidade = Joaninha.velocidade + Joaninha.gravidade;
      Joaninha.y = Joaninha.y + Joaninha.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa pra baixo
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + Joaninha.frameAtual;
        const baseRepeticao = Joaninha.movimentos.length;
        Joaninha.frameAtual = incremento % baseRepeticao
      }
    },
    desenha() {
      Joaninha.atualizaOFrameAtual();
      const { spriteX, spriteY } = Joaninha.movimentos[Joaninha.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        Joaninha.largura, Joaninha.altura, // Tamanho do recorte na sprite
        Joaninha.x, Joaninha.y,
        Joaninha.largura, Joaninha.altura,
      );
    }
  }
  return Joaninha;  
}

/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// [mensagemGameOver]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  }
}

// [Canos]
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 120, // Aumentar o espaço entre os canos
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 120; // Aumentar o espaço entre os canos
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    temColisaoComOJoaninha(par) {
      const cabecaDaJoaninha = globais.Joaninha.y;
      const peDaJoaninha = globais.Joaninha.y + globais.Joaninha.altura;
      
      if((globais.Joaninha.x + globais.Joaninha.largura) >= par.x) {
        if(cabecaDaJoaninha <= par.canoCeu.y) {
          return true;
        }

        if(peDaJoaninha >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou200Frames = frames % 200 === 0;
      if(passou200Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par) {
        par.x = par.x - 1.5;

        if(canos.temColisaoComOJoaninha(par)) {
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

function criaPlacar() {
  const placar = {
    pontuacao: 0,
    recorde: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
    },
    atualiza() {
      const intervaloDeFrames = 20;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        placar.pontuacao = placar.pontuacao + 1;
        placar.recorde = Math.max(placar.pontuacao, placar.recorde);
      }
    },
  };
  return placar;
}

// [Telas]
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.Joaninha = criaJoaninha();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.Joaninha.desenha();
      
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.Joaninha.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.Joaninha.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.Joaninha.atualiza();
    globais.placar.atualiza();
  }
};

Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();

    let medalha = null;
    if (globais.placar.pontuacao >= 100) {
      medalha = medalhas.ouro;
    } else if (globais.placar.pontuacao >= 90) {
      medalha = medalhas.bronze;
    } else if (globais.placar.pontuacao >= 90) {
      medalha = medalhas.prata;
    } else if (globais.placar.pontuacao >= 30) {
      medalha = medalhas.aco;
    }

    if (medalha) {
      contexto.drawImage(
        sprites,
        medalha.spriteX, medalha.spriteY,
        medalha.largura, medalha.altura,
        canvas.width / 4 - medalha.largura/4 + 5, canvas.height / 2 - 100,
        medalha.largura, medalha.altura,
      );
    }
      contexto.font = '25px "VT323"';
      contexto.textAlign = 'center';
      contexto.fillStyle = 'white';
      contexto.fillText(`${globais.placar.pontuacao} `, canvas.width / 2 +30, canvas.height / 2 - 60);
      contexto.fillText(`${globais.placar.recorde} `, canvas.width / 2 +30,  canvas.height / 2 - 30);
      console.log(`${globais.placar.pontuacao} pontos`, canvas.width / 2+30, canvas.height / 2 - 60);
      console.log(`${globais.placar.recorde} record`, canvas.width / 2+30, canvas.height / 2 - 30);
  },
  atualiza() {},
  click() {
    mudaParaTela(Telas.INICIO);
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();