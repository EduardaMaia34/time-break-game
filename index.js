const fundos = new Image();
const s = new Image();
const detalhes = new Image();
detalhes.src = "./sprites.png/detalhes.png";
fundos.src = "./sprites.png/pngfundo.png";
s.src = "./sprites.png/s.png";

//Pegando do html
var cnv = document.querySelector("#canvas");
var ctx = cnv.getContext("2d");

//--------------------------
const laser = new Audio();
laser.src = "./audios.mp3/laser.mp3";
laser.volume = 0.1;

const explosao1 = new Audio();
explosao1.src = "./audios.mp3/explosao.mp3";
explosao1.volume = 0.2;

const radio8 = new Audio();
radio8.src = "./audios.mp3/musica8.mp3";
radio8.volume = 0.3;


//--------------------------

let frames = 0;
let portalframe = 0;
function reiniciarf() {
  portalframe = 0;
  nave.y = 170;
}

let randomcor = Math.floor(Math.random() * 4);
let num = {
  x: 0,
  mudarx() {
    num.x = Math.floor(Math.random() * 4);
  }
};

//Características da variável nave
// [Plano de Fundo]
const fundotodo = {
  spriteX: 2,
  spriteY: 0,
  largura: 300,
  altura: 400,
  x: 0,
  y: 0,
  w: 400,
  h: 500,
  atualiza() {
    if (FazColisao() || FazColisaoPortais()) {
      return;
    }

    const vel_Do_Chao = 10;
    fundotodo.x = fundotodo.x - vel_Do_Chao;
    fundotodo.x = fundotodo.x % fundotodo.largura;
  },
  desenha() {
    ctx.drawImage(
      fundos,
      fundotodo.spriteX,
      fundotodo.spriteY,
      fundotodo.largura,
      fundotodo.altura,
      fundotodo.x,
      fundotodo.y,
      fundotodo.w,
      fundotodo.h
    );
    ctx.drawImage(
      fundos,
      fundotodo.spriteX,
      fundotodo.spriteY,
      fundotodo.largura,
      fundotodo.altura,
      fundotodo.x + fundotodo.largura - 4,
      fundotodo.y,
      fundotodo.w,
      fundotodo.h
    );
  }
};

const tap = {
  spriteX: 622,
  spriteY: 2462,
  largura: 252,
  altura: 141,
  x: 150,
  y: 260,
  w: 80,
  h: 50,
  desenha() {
    ctx.drawImage(
      s,
      tap.spriteX,
      tap.spriteY,
      tap.largura,
      tap.altura,
      tap.x,
      tap.y,
      tap.w,
      tap.h
    );
  }
};

let TelaAtiva = {};

function Mudaparatela(NovaTela) {
  TelaAtiva = NovaTela;
  reiniciarf();
}

const Telas = {
  INICIO: {
    desenha() {
      fundotodo.desenha();
      nave.desenha();
      time_break.desenha();
      tap.desenha();
    },
    atualiza() {},
    click() {
      Mudaparatela(Telas.JOGO);
      radio8.play();
      
    }
  }
};

Telas.JOGO = {
  desenha() {
    fundotodo.desenha();
    nave.desenha();
    portais.desenha();
    placar.desenha();
  },
  atualiza() {
    num.mudarx();
    nave.atualiza();
    fundotodo.atualiza();
    portais.atualiza();
    placar.atualiza();

    if (FazColisao() || FazColisaoPortais()) {
      explosao1.play();
      radio8.pause();
      Mudaparatela(Telas.FINAL);
    }
  },

  click() {
    pular();
  }

};

Telas.FINAL = {
  desenha() {
    fundotodo.desenha();
    nave.desenha();
    score.desenha();
    game_over.desenha();
    placar.desenhafim();
  },

  atualiza() {
  },

  click() {
    Mudaparatela(Telas.INICIO);
    reiniciarf();
    voltaportal();
    placar.pontuacao = 0;
    portais.vel_portais = 5;
  }
};

const time_break = {
  spriteX: 1642,
  spriteY: 2324,
  largura: 986,
  altura: 353,
  x: 75,
  y: 100,
  w: 250,
  h: 100,
  desenha() {
    ctx.drawImage(
      s,
      time_break.spriteX,
      time_break.spriteY,
      time_break.largura,
      time_break.altura,
      time_break.x,
      time_break.y,
      time_break.w,
      time_break.h
    );
  }
};

const score = {
  detalhes,
  spriteX: 369,
  spriteY: 401,
  largura: 117,
  altura: 43,
  x: 115,
  y: 230,
  w: 160,
  h: 65,
  atualiza() {},
  desenha() {
    ctx.drawImage(
      detalhes,
      score.spriteX,
      score.spriteY,
      score.largura,
      score.altura,
      score.x,
      score.y,
      score.w,
      score.h
    );
  }
};

const game_over = {
  s,
  spriteX: 1654,
  spriteY: 1930,
  largura: 805,
  altura: 130,
  x: 85,
  y: 130,
  w: 220,
  h: 90,
  desenha() {
    ctx.drawImage(
      s,
      game_over.spriteX,
      game_over.spriteY,
      game_over.largura,
      game_over.altura,
      game_over.x,
      game_over.y,
      game_over.w,
      game_over.h
    );
  }
};

const nave = {
  spriteX: 4,
  spriteY: 159,
  largura: 70,
  altura: 70,
  x: 10,
  y: 170,
  w: 60,
  h: 60,
  velocidade: 0,
  gravidade: 0.25,
  /*--------------------------------------- */

  atualiza() {
    if (FazColisao()) {
      return;
    }

    nave.velocidade = nave.velocidade + nave.gravidade;
    nave.y = nave.y + nave.velocidade;
  },
  naves: [
    { spriteX: 0, spriteY: 160 },
    { spriteX: 5, spriteY: 240 },
    { spriteX: 5, spriteY: 315 },
    { spriteX: 5, spriteY: 240 }
  ],
  frameatual: 0,
  atualizaFrameAtual() {
    const intervalodeframes = 10;
    const passouintervalo = frames % intervalodeframes === 0;

    if (passouintervalo) {
      const incremento = 1 + nave.frameatual;
      const baseRepeticao = nave.naves.length;
      nave.frameAtual = incremento % baseRepeticao;
    }
  },

  desenha() {
    nave.atualizaFrameAtual();
    const { spriteX, spriteY } = nave.naves[nave.frameAtual];
    ctx.drawImage(
      detalhes,
      spriteX,
      spriteY,
      nave.largura,
      nave.altura,
      nave.x,
      nave.y,
      nave.w,
      nave.h
    );
  }
};

const portais = {
  x: 1000,
  y: Math.floor(Math.random() * (465 - 200 + 1)),
  w: 45,
  h: 80,

  cores: [
    { spriteX: 515, spriteY: 1834 }, //portal vermelho = 2
    { spriteX: 653, spriteY: 1834 }, //portal verde = 0
    { spriteX: 773, spriteY: 1834 }, //portal azul = 1
    { spriteX: 881, spriteY: 1834 } //portal roxo = 3
  ],

  atualiza() {
    const loop_portais = portalframe % 110 === 0;

    if (loop_portais) {
      num.mudarx();
      portais.y = Math.floor(Math.random() * (465 - 200 + 1) + 45);
      portais.x = 420;
      portais.desenha();
    }

    if (FazColisao() || FazColisaoPortais()) {
      return;
    }

    const vel_portais = 4;
    portais.x = portais.x - vel_portais;
  },

  desenha() {
    const { spriteX, spriteY } = portais.cores[randomcor];
    ctx.drawImage(
      s,
      spriteX,
      spriteY,
      portal_verde.largura,
      portal_verde.altura,
      portais.x,
      portais.y,
      portal_verde.w,
      portal_verde.h
    );
  }
};

const portal_verde = {
  detalhes,
  spriteX: 290,
  spriteY: 200,
  largura: 120,
  altura: 367,
  x: 350,
  y: 150,
  w: 45,
  h: 100,
  atualiza() {
    const vel_portais = 7;
    portal_verde.x = portal_verde.x - vel_portais;
  }
};

const portal_azul = {
  detalhes,
  spriteX: 153,
  spriteY: 220,
  largura: 50,
  altura: 148,
  x: 300,
  y: 100,
  w: 45,
  h: 150,
  atualiza() {
    const vel_portais = 7;
    portal_azul.x = portal_azul.x - vel_portais;
  }
};

const portal_vermelho = {
  detalhes,
  spriteX: 210,
  spriteY: 200,
  largura: 33,
  altura: 148,
  x: 280,
  y: 200,
  w: 45,
  h: 150,
  atualiza() {
    const vel_portais = 7;
    portal_vermelho.x = portal_vermelho.x - vel_portais;
  }
};

const portal_roxo = {
  detalhes,
  spriteX: 251,
  spriteY: 200,
  largura: 50,
  altura: 148,
  x: 350,
  y: 300,
  w: 45,
  h: 150,
  atualiza() {
    const vel_portais = 7;
    portal_roxo.x = portal_roxo.x - vel_portais;
  }
};

const explosao = {
  detalhes,
  spriteX: 0,
  spriteY: 435,
  largura: 70,
  altura: 70,
  x: 10,
  y: 145,
  w: 60,
  h: 60,
  desenha() {
    ctx.drawImage(
      detalhes,
      explosao.spriteX,
      explosao.spriteY,
      explosao.largura,
      explosao.altura,
      explosao.x,
      explosao.y,
      explosao.w,
      explosao.h
    );
  }
};
//--------------------------

cnv.addEventListener("click", pular);
cnv.addEventListener("click", function () {
  if (TelaAtiva.click) {
    TelaAtiva.click();
  }
});

//Chamando as funçoes
Mudaparatela(Telas.INICIO);
loop();
pular();

function loop() {
  nave.frameatual = nave.frameatual + 1;
  portalframe = portalframe + 1;
  fundotodo.atualiza();
  fundotodo.desenha();

  TelaAtiva.desenha();
  TelaAtiva.atualiza();
  num.mudarx();

  requestAnimationFrame(loop);
}
function voltaportal() {
  portais.x = 1000;
}
function FazColisao() {
  const yinferiror = nave.y + nave.h;
  const chao = 420;
  const teto = 70;

  if (yinferiror >= chao || nave.y <= teto) {
    return true;
  }
  return false;
}

function FazColisaoPortais() {
  const pyf = portais.y + portais.h;
  const nyf = nave.y + nave.h;

  if (nave.x === portais.x && nyf > portais.y && nave.y < pyf) {
    return true;
  }
  return false;
}

function pular() {
  nave.velocidade = -4.6;
  laser.play();
}

const placar = {
  pontuacao: 0,
  desenha() {
    ctx.font = '40px "VT323"';
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.fillText(`SCORE ${placar.pontuacao}`, 400, 35);
  },
  desenhafim() {
    ctx.font = '70px "VT323"';
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(` ${placar.pontuacao}`, 185, 340);
  },
  atualiza() {
    const loop_portais = portalframe % 90 === 0;

    if (loop_portais) {
      placar.pontuacao = placar.pontuacao + 1;
    }
    if (placar.pontuacao % 10 === 0 && placar.pontuacao >= 5) {
      portais.atualiza();
    }
    if (placar.pontuacao >= 5) {
      portais.desenha();
    }
  }
};
