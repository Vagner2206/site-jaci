
// =========================================================
// INICIAR SEMPRE O SITE NO TOPO
// =========================================================

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);


// =========================================================
// ABRIR A SURPRESA
// =========================================================

const botaoSurpresa =
    document.querySelector(".btn-surpresa");

const inicio =
    document.querySelector("#inicio");

const historia =
    document.querySelector("#historia");

document.body.style.overflow = "hidden";

if (botaoSurpresa) {

    botaoSurpresa.addEventListener(
        "click",
        function () {

            // Começar o desaparecimento da abertura
            if (inicio) {

                inicio.classList.add(
                    "esconder"
                );

            }

            // Esperar o fade terminar
            setTimeout(
                function () {

                    if (inicio) {
                        inicio.style.display = "none";
                    }

                    if (historia) {
                        historia.classList.add(
                            "historia-visivel"
                        );
                    }

                    document.body.style.overflow = "";

                },
                1000
            );

        }
    );

}


// =========================================================
// SISTEMA DOS CARTÕES DA HISTÓRIA
// =========================================================

const cartoesHistoria =
    document.querySelector(".cartoes-historia");

const momentos =
    document.querySelectorAll(".momento");

const botoesProximo =
    document.querySelectorAll(".btn-proximo");

let momentoAtual = 0;
let mudancaHistoriaEmAndamento = false;
let temporizadorHistoria = null;


// =========================================================
// STORAGE — SISTEMA CENTRAL DO PROGRESSO
// =========================================================

const CHAVE_STORAGE =
    "progressoSurpresaJacileth";

const CHAVE_DESBLOQUEIO =
    "surpresaDesbloqueada";


// =========================================================
// GUARDAR PROGRESSO
// =========================================================

function guardarProgresso() {

    const surpresaDesbloqueada =
        localStorage.getItem(
            CHAVE_DESBLOQUEIO
        ) === "true";


    const progresso = {

        momentoAtual:
            momentoAtual,

        surpresaDesbloqueada:
            surpresaDesbloqueada

    };


    try {

        localStorage.setItem(
            CHAVE_STORAGE,
            JSON.stringify(progresso)
        );


        console.log(
            "💾 Progresso guardado:",
            progresso
        );


    } catch (erro) {

        console.error(
            "⚠️ Não foi possível guardar o progresso:",
            erro
        );

    }

}


// =========================================================
// CARREGAR PROGRESSO
// =========================================================

function carregarProgresso() {

    try {

        const progressoGuardado =
            localStorage.getItem(
                CHAVE_STORAGE
            );


        if (!progressoGuardado) {

            console.log(
                "🆕 Nenhum progresso encontrado."
            );


            return {

                momentoAtual: 0,

                surpresaDesbloqueada:
                    false

            };

        }


        const progresso =
            JSON.parse(
                progressoGuardado
            );


        // -------------------------------------------------
        // VALIDAR O MOMENTO
        // -------------------------------------------------

        let momentoGuardado =
            0;


        if (
            typeof progresso.momentoAtual ===
                "number" &&
            Number.isFinite(
                progresso.momentoAtual
            ) &&
            progresso.momentoAtual >= 0 &&
            progresso.momentoAtual <
                momentos.length
        ) {

            momentoGuardado =
                Math.floor(
                    progresso.momentoAtual
                );

        }


        // -------------------------------------------------
        // VERIFICAR DESBLOQUEIO
        // -------------------------------------------------

        const desbloqueada =
            localStorage.getItem(
                CHAVE_DESBLOQUEIO
            ) === "true";


        const progressoFinal = {

            momentoAtual:
                momentoGuardado,

            surpresaDesbloqueada:
                desbloqueada

        };


        console.log(
            "📂 Progresso recuperado:",
            progressoFinal
        );


        return progressoFinal;


    } catch (erro) {

        console.error(
            "⚠️ Erro ao recuperar o progresso:",
            erro
        );


        return {

            momentoAtual: 0,

            surpresaDesbloqueada:
                false

        };

    }

}


// ---------------------------------------------------------
// AJUSTAR ALTURA DO CONTAINER
// ---------------------------------------------------------

function ajustarAlturaHistoria() {

    if (
        !cartoesHistoria ||
        momentos.length === 0
    ) {
        return;
    }


    const cartaoAtual =
        momentos[momentoAtual];


    if (!cartaoAtual) {
        return;
    }


    const altura =
        cartaoAtual.offsetHeight;


    if (altura > 0) {

        cartoesHistoria.style.height =
            altura + "px";

    }

}


// ---------------------------------------------------------
// MOSTRAR CARTÃO
// ---------------------------------------------------------

function mostrarMomento(
    indice,
    fazerScroll = false
) {

    if (
        indice < 0 ||
        indice >= momentos.length ||
        !momentos[indice]
    ) {
        return;
    }


    if (mudancaHistoriaEmAndamento) {
        return;
    }


    mudancaHistoriaEmAndamento = true;


    if (temporizadorHistoria) {

        clearTimeout(
            temporizadorHistoria
        );

    }


    const cartaoAnterior =
        momentos[momentoAtual];

    const novoCartao =
        momentos[indice];


    // -----------------------------------------------------
    // RETIRAR CARTÃO ANTERIOR
    // -----------------------------------------------------

    if (
        cartaoAnterior &&
        cartaoAnterior !== novoCartao
    ) {

        cartaoAnterior.classList.remove(
            "visivel"
        );

    }


    momentoAtual =
        indice;


    // =====================================================
    // GUARDAR O MOMENTO ATUAL
    // =====================================================

    guardarProgresso();


    // -----------------------------------------------------
    // PEQUENA PAUSA PARA A TRANSIÇÃO
    // -----------------------------------------------------

    temporizadorHistoria =
        setTimeout(function () {

            novoCartao.classList.add(
                "visivel"
            );


            requestAnimationFrame(
                function () {

                    ajustarAlturaHistoria();


                    requestAnimationFrame(
                        function () {

                            ajustarAlturaHistoria();


                            if (
                                fazerScroll &&
                                historia
                            ) {

                                const margemTopo =
                                    80;


                                const posicao =
                                    novoCartao.getBoundingClientRect().top +
                                    window.scrollY -
                                    margemTopo;


                                window.scrollTo({

                                    top:
                                        posicao,

                                    behavior:
                                        "smooth"

                                });

                            }


                            mudancaHistoriaEmAndamento =
                                false;

                        }
                    );

                }
            );

        }, 250);

}


// ---------------------------------------------------------
// PREPARAR OS CARTÕES
// ---------------------------------------------------------

if (momentos.length > 0) {

    momentos.forEach(
        function (
            momento,
            indice
        ) {

            momento.classList.remove(
                "visivel"
            );


            momento.style.position =
                "absolute";

            momento.style.top =
                "0";

            momento.style.left =
                "0";

            momento.style.width =
                "100%";


            momento.style.zIndex =
                indice === 0
                    ? "2"
                    : "1";

        }
    );


    // =====================================================
    // RECUPERAR O PROGRESSO
    // =====================================================

    const progresso =
    carregarProgresso();


let momentoInicial =
    0;


if (
    progresso &&
    typeof progresso.momentoAtual ===
        "number"
) {

    momentoInicial =
        Math.max(
            0,
            Math.min(
                progresso.momentoAtual,
                momentos.length - 1
            )
        );

}

    momentoAtual =
        momentoInicial;


    const primeiroCartao =
        momentos[momentoInicial];


    if (primeiroCartao) {

        primeiroCartao.classList.add(
            "visivel"
        );

        primeiroCartao.style.zIndex =
            "2";

    }


    requestAnimationFrame(
        function () {

            requestAnimationFrame(
                function () {

                    ajustarAlturaHistoria();

                }
            );

        }
    );


    console.log(
        "🎮 A surpresa começa no Momento:",
        momentoAtual + 1
    );

}


// ---------------------------------------------------------
// BOTÕES PRÓXIMO
// ---------------------------------------------------------

botoesProximo.forEach(
    function (botao) {

        botao.addEventListener(
            "click",
            function () {

                if (
                    mudancaHistoriaEmAndamento
                ) {
                    return;
                }


                if (
                    momentoAtual <
                    momentos.length - 1
                ) {

                    const proximo =
                        momentos[
                            momentoAtual + 1
                        ];


                    if (proximo) {

                        proximo.style.zIndex =
                            "2";


                        // Se o próximo cartão
                        // for o Momento 12
                        if (
                            momentoAtual + 1 ===
                            momentos.length - 1
                        ) {

                            const revelarSurpresa =
                                document.querySelector(
                                    "#revelarSurpresa"
                                );


                            if (revelarSurpresa) {

                                revelarSurpresa.style.display =
                                    "block";

                            }

                        }

                    }


                    const atual =
                        momentos[momentoAtual];


                    if (atual) {

                        atual.style.zIndex =
                            "1";

                    }


                    mostrarMomento(
                        momentoAtual + 1,
                        true
                    );

                }

            }
        );

    }
);


// ---------------------------------------------------------
// REDIMENSIONAMENTO
// ---------------------------------------------------------

window.addEventListener(
    "resize",
    function () {

        setTimeout(
            function () {

                ajustarAlturaHistoria();

            },
            100
        );

    }
);


// =========================================================
// ANIMAÇÃO DE ENTRADA DA GALERIA
// =========================================================

const fotosMemoria =
    document.querySelectorAll(
        ".foto-memoria"
    );

const galeria =
    document.querySelector(
        "#galeria"
    );


if (
    fotosMemoria.length > 0 &&
    galeria &&
    "IntersectionObserver" in window
) {

    const observadorGaleria =
        new IntersectionObserver(

            function (entradas) {

                entradas.forEach(
                    function (entrada) {

                        if (
                            entrada.isIntersecting
                        ) {

                            fotosMemoria.forEach(
                                function (
                                    foto,
                                    indice
                                ) {

                                    setTimeout(
                                        function () {

                                            foto.classList.add(
                                                "visivel"
                                            );

                                        },
                                        indice * 120
                                    );

                                }
                            );


                            observadorGaleria.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    observadorGaleria.observe(
        galeria
    );

} else {

    fotosMemoria.forEach(
        function (foto) {

            foto.classList.add(
                "visivel"
            );

        }
    );

}


// =========================================================
// VISUALIZADOR DA GALERIA
// FOTOS + VÍDEOS
// =========================================================

const visualizador =
    document.querySelector(
        "#visualizador"
    );

const imagemAmpliada =
    document.querySelector(
        "#imagemAmpliada"
    );

const videoWrapper =
    document.querySelector(
        "#videoWrapper, .video-wrapper"
    );

const videoAmpliado =
    document.querySelector(
        "#videoAmpliado"
    );

const botaoPlayVideo =
    document.querySelector(
        "#botaoPlayVideo"
    );

const fecharGaleria =
    document.querySelector(
        "#fecharGaleria"
    );

const fotoAnterior =
    document.querySelector(
        "#fotoAnterior"
    );

const fotoSeguinte =
    document.querySelector(
        "#fotoSeguinte"
    );

const itensGaleria =
    document.querySelectorAll(
        ".foto-memoria"
    );

const imagemContainer =
    document.querySelector(
        ".imagem-ampliada-container"
    );

let fotoAtual = 0;


// =========================================================
// ABRIR FOTO OU VÍDEO
// =========================================================

function abrirItem(indice) {

    if (
        !itensGaleria[indice] ||
        !visualizador ||
        !imagemContainer
    ) {
        return;
    }


    fotoAtual =
        indice;


    const item =
        itensGaleria[
            fotoAtual
        ];


    const imagem =
        item.querySelector(
            "img"
        );


    const video =
        item.querySelector(
            "video"
        );


    // -----------------------------------------------------
    // RESET
    // -----------------------------------------------------

    if (videoAmpliado) {

        videoAmpliado.pause();

        try {

            videoAmpliado.currentTime =
                0;

        } catch (erro) {
            // Ignorar
        }


        videoAmpliado.style.display =
            "none";

    }


    if (videoWrapper) {

        videoWrapper.style.display =
            "none";

    }


    if (botaoPlayVideo) {

        botaoPlayVideo.classList.remove(
            "escondido"
        );

    }


    // -----------------------------------------------------
    // FOTO
    // -----------------------------------------------------

    if (imagem) {

        if (imagemAmpliada) {

            imagemAmpliada.src =
                imagem.currentSrc ||
                imagem.src;


            imagemAmpliada.alt =
                imagem.alt ||
                "Memória ampliada";


            imagemAmpliada.style.display =
                "block";

        }

    }


    // -----------------------------------------------------
    // VÍDEO
    // -----------------------------------------------------

    else if (video) {

        if (imagemAmpliada) {

            imagemAmpliada.style.display =
                "none";

        }


        if (videoWrapper) {

            videoWrapper.style.display =
                "flex";

        }


        if (videoAmpliado) {

            const source =
                video.querySelector(
                    "source"
                );


            let caminhoVideo =
                "";


            if (
                source &&
                source.src
            ) {

                caminhoVideo =
                    source.src;

            } else {

                caminhoVideo =
                    video.currentSrc ||
                    video.src ||
                    "";

            }


            videoAmpliado.src =
                caminhoVideo;


            videoAmpliado.controls =
                false;


            videoAmpliado.style.display =
                "block";


            videoAmpliado.load();

        }


        if (botaoPlayVideo) {

            botaoPlayVideo.classList.remove(
                "escondido"
            );

        }

    }


    // -----------------------------------------------------
    // ANIMAÇÃO
    // -----------------------------------------------------

    imagemContainer.style.transition =
        "none";


    imagemContainer.style.transform =
        "scale(0.85)";


    visualizador.style.opacity =
        "";


    visualizador.style.background =
        "rgba(0, 0, 0, 0.92)";


    visualizador.classList.add(
        "aberto"
    );


    document.body.style.overflow =
        "hidden";


    requestAnimationFrame(
        function () {

            imagemContainer.style.transition =
                "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";


            imagemContainer.style.transform =
                "scale(1)";

        }
    );

}


// =========================================================
// CLIQUE NAS FOTOS E VÍDEOS
// =========================================================

itensGaleria.forEach(
    function (
        item,
        indice
    ) {

        const imagem =
            item.querySelector(
                "img"
            );


        const video =
            item.querySelector(
                "video"
            );


        if (imagem) {

            imagem.addEventListener(
                "click",
                function () {

                    abrirItem(
                        indice
                    );

                }
            );

        }


        if (video) {

            video.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();
                    evento.stopPropagation();


                    abrirItem(
                        indice
                    );

                }
            );

        }

    }
);


// =========================================================
// BOTÃO PLAY DO VÍDEO
// =========================================================

if (botaoPlayVideo) {

    botaoPlayVideo.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();
            evento.stopPropagation();


            if (!videoAmpliado) {
                return;
            }


            const promessa =
                videoAmpliado.play();


            if (
                promessa !== undefined
            ) {

                promessa
                    .then(
                        function () {

                            botaoPlayVideo.classList.add(
                                "escondido"
                            );

                        }
                    )
                    .catch(
                        function (erro) {

                            console.error(
                                "Não foi possível reproduzir o vídeo:",
                                erro
                            );

                        }
                    );

            }

        }
    );

}


// =========================================================
// EVENTOS DO VÍDEO
// =========================================================

if (videoAmpliado) {

    videoAmpliado.addEventListener(
        "play",
        function () {

            if (botaoPlayVideo) {

                botaoPlayVideo.classList.add(
                    "escondido"
                );

            }

        }
    );


    videoAmpliado.addEventListener(
        "ended",
        function () {

            if (botaoPlayVideo) {

                botaoPlayVideo.classList.remove(
                    "escondido"
                );

            }

        }
    );

}


// =========================================================
// FECHAR VISUALIZADOR
// =========================================================

function fecharVisualizador() {

    if (!visualizador) {
        return;
    }


    if (videoAmpliado) {

        videoAmpliado.pause();

        try {

            videoAmpliado.currentTime =
                0;

        } catch (erro) {
            // Ignorar
        }

    }


    visualizador.classList.remove(
        "aberto"
    );


    document.body.style.overflow =
        "";

}


// =========================================================
// PRÓXIMA MEMÓRIA
// =========================================================

function proximaFoto() {

    if (
        itensGaleria.length === 0
    ) {
        return;
    }


    fotoAtual++;


    if (
        fotoAtual >=
        itensGaleria.length
    ) {

        fotoAtual = 0;

    }


    abrirItem(
        fotoAtual
    );

}


// =========================================================
// MEMÓRIA ANTERIOR
// =========================================================

function anteriorFoto() {

    if (
        itensGaleria.length === 0
    ) {
        return;
    }


    fotoAtual--;


    if (
        fotoAtual < 0
    ) {

        fotoAtual =
            itensGaleria.length - 1;

    }


    abrirItem(
        fotoAtual
    );

}


// =========================================================
// BOTÕES DO VISUALIZADOR
// =========================================================

if (fecharGaleria) {

    fecharGaleria.addEventListener(
        "click",
        fecharVisualizador
    );

}


if (fotoSeguinte) {

    fotoSeguinte.addEventListener(
        "click",
        proximaFoto
    );

}


if (fotoAnterior) {

    fotoAnterior.addEventListener(
        "click",
        anteriorFoto
    );

}


// =========================================================
// CLICAR NO FUNDO
// =========================================================

if (visualizador) {

    visualizador.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                visualizador
            ) {

                fecharVisualizador();

            }

        }
    );

}


// =========================================================
// TECLADO
// =========================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !visualizador ||
            !visualizador.classList.contains(
                "aberto"
            )
        ) {
            return;
        }


        if (
            evento.key ===
            "Escape"
        ) {

            fecharVisualizador();

        }


        if (
            evento.key ===
            "ArrowRight"
        ) {

            proximaFoto();

        }


        if (
            evento.key ===
            "ArrowLeft"
        ) {

            anteriorFoto();

        }

    }
);


// =========================================================
// SWIPE NO TELEMÓVEL
// =========================================================

let toqueInicialX = 0;
let toqueInicialY = 0;
let movimentoX = 0;
let movimentoY = 0;
let arrastandoFoto = false;


if (
    visualizador &&
    imagemContainer
) {

    visualizador.addEventListener(
        "touchstart",
        function (evento) {

            if (
                !visualizador.classList.contains(
                    "aberto"
                )
            ) {
                return;
            }


            if (!evento.touches[0]) {
                return;
            }


            toqueInicialX =
                evento.touches[0].clientX;


            toqueInicialY =
                evento.touches[0].clientY;


            movimentoX = 0;
            movimentoY = 0;


            arrastandoFoto =
                true;


            imagemContainer.style.transition =
                "none";

        },
        {
            passive: true
        }
    );


    visualizador.addEventListener(
        "touchmove",
        function (evento) {

            if (
                !arrastandoFoto ||
                !evento.touches[0]
            ) {
                return;
            }


            const toqueAtualX =
                evento.touches[0].clientX;


            const toqueAtualY =
                evento.touches[0].clientY;


            movimentoX =
                toqueAtualX -
                toqueInicialX;


            movimentoY =
                toqueAtualY -
                toqueInicialY;


            const distanciaX =
                Math.abs(
                    movimentoX
                );


            const distanciaY =
                Math.abs(
                    movimentoY
                );


            // -------------------------------------------------
            // VERTICAL
            // -------------------------------------------------

            if (
                distanciaY >
                distanciaX
            ) {

                const movimentoSuave =
                    movimentoY * 0.75;


                imagemContainer.style.transform =
                    `translateY(${movimentoSuave}px) scale(0.96)`;


                const opacidade =
                    Math.max(
                        0.35,
                        1 -
                        distanciaY / 500
                    );


                visualizador.style.background =
                    `rgba(0, 0, 0, ${opacidade})`;

            }


            // -------------------------------------------------
            // HORIZONTAL
            // -------------------------------------------------

            else if (
                distanciaX >
                distanciaY
            ) {

                const movimentoSuave =
                    movimentoX * 0.85;


                imagemContainer.style.transform =
                    `translateX(${movimentoSuave}px) scale(0.96)`;


                const opacidade =
                    Math.max(
                        0.65,
                        0.92 -
                        distanciaX / 1000
                    );


                visualizador.style.background =
                    `rgba(0, 0, 0, ${opacidade})`;

            }

        },
        {
            passive: true
        }
    );


    visualizador.addEventListener(
        "touchend",
        function () {

            if (!arrastandoFoto) {
                return;
            }


            arrastandoFoto =
                false;


            const distanciaX =
                Math.abs(
                    movimentoX
                );


            const distanciaY =
                Math.abs(
                    movimentoY
                );


            // -------------------------------------------------
            // SWIPE VERTICAL
            // -------------------------------------------------

            if (
                distanciaY >
                distanciaX
            ) {

                if (
                    distanciaY > 100
                ) {

                    const direcao =
                        movimentoY > 0
                            ? 1
                            : -1;


                    imagemContainer.style.transition =
                        "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";


                    imagemContainer.style.transform =
                        `translateY(${direcao * 100}vh) scale(0.9)`;


                    visualizador.style.transition =
                        "opacity 0.35s ease";


                    visualizador.style.opacity =
                        "0";


                    setTimeout(
                        function () {

                            fecharVisualizador();


                            imagemContainer.style.transform =
                                "scale(0.85)";


                            visualizador.style.opacity =
                                "";


                            visualizador.style.background =
                                "";

                        },
                        350
                    );


                    return;

                }


                imagemContainer.style.transition =
                    "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";


                imagemContainer.style.transform =
                    "translateY(0) scale(1)";


                visualizador.style.transition =
                    "background 0.4s ease";


                visualizador.style.background =
                    "rgba(0, 0, 0, 0.92)";


                return;

            }


            // -------------------------------------------------
            // SWIPE HORIZONTAL
            // -------------------------------------------------

            if (
                distanciaX >
                distanciaY
            ) {

                if (
                    movimentoX < -100
                ) {

                    imagemContainer.style.transition =
                        "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)";


                    imagemContainer.style.transform =
                        "translateX(-100vw) scale(0.96)";


                    setTimeout(
                        proximaFoto,
                        180
                    );


                    return;

                }


                if (
                    movimentoX > 100
                ) {

                    imagemContainer.style.transition =
                        "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)";


                    imagemContainer.style.transform =
                        "translateX(100vw) scale(0.96)";


                    setTimeout(
                        anteriorFoto,
                        180
                    );


                    return;

                }


                imagemContainer.style.transition =
                    "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";


                imagemContainer.style.transform =
                    "translateX(0) scale(1)";


                visualizador.style.transition =
                    "background 0.4s ease";


                visualizador.style.background =
                    "rgba(0, 0, 0, 0.92)";

            }

        },
        {
            passive: true
        }
    );


    visualizador.addEventListener(
        "touchcancel",
        function () {

            arrastandoFoto =
                false;


            imagemContainer.style.transition =
                "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";


            imagemContainer.style.transform =
                "translate(0, 0) scale(1)";


            visualizador.style.background =
                "rgba(0, 0, 0, 0.92)";

        },
        {
            passive: true
        }
    );

}


// =========================================================
// PLAYER — THOSE EYES
// =========================================================

const musicaThoseEyes =
    document.querySelector(
        "#musicaThoseEyes"
    );

const botaoMusica =
    document.querySelector(
        "#botaoMusica"
    );

const barraProgresso =
    document.querySelector(
        "#barraProgresso"
    );

const progressoMusica =
    document.querySelector(
        ".progresso-musica"
    );

const tempoMusica =
    document.querySelector(
        "#tempoMusica"
    );

const cartaoMusica =
    document.querySelector(
        ".cartao-musica"
    );


if (
    musicaThoseEyes &&
    botaoMusica &&
    barraProgresso &&
    progressoMusica &&
    tempoMusica &&
    cartaoMusica
) {

    console.log("🎵 DIAGNÓSTICO DA MÚSICA INICIADO");

musicaThoseEyes.addEventListener("play", () => {
    console.log("▶️ PLAY", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("playing", () => {
    console.log("🟢 PLAYING", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("pause", () => {
    console.log("⏸️ PAUSE", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("waiting", () => {
    console.log("⏳ WAITING / BUFFERING", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("stalled", () => {
    console.log("🐌 STALLED", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("canplay", () => {
    console.log("✅ CANPLAY", musicaThoseEyes.currentTime);
});

musicaThoseEyes.addEventListener("error", () => {
    console.log(
        "❌ ERRO",
        musicaThoseEyes.error
    );
});

musicaThoseEyes.addEventListener("ended", () => {
    console.log("🏁 ENDED");
});

    function formatarTempo(
        segundos
    ) {

        if (
            !Number.isFinite(
                segundos
            )
        ) {
            return "0:00";
        }


        segundos =
            Math.floor(
                segundos
            );


        const minutos =
            Math.floor(
                segundos / 60
            );


        const segundosRestantes =
            segundos % 60;


        return (
            minutos +
            ":" +
            String(
                segundosRestantes
            ).padStart(
                2,
                "0"
            )
        );

    }


    function atualizarTempo() {

        tempoMusica.textContent =
            formatarTempo(
                musicaThoseEyes.currentTime
            );

    }


    botaoMusica.addEventListener(
    "click",
    async function () {

        console.log(
            "🎵 CLIQUE NO BOTÃO",
            "paused:",
            musicaThoseEyes.paused,
            "currentTime:",
            musicaThoseEyes.currentTime
        );

        if (musicaThoseEyes.paused) {

            try {

                await musicaThoseEyes.play();

                console.log(
                    "✅ PLAY INICIADO"
                );

            } catch (erro) {

                console.error(
                    "❌ PLAY FOI INTERROMPIDO:",
                    erro
                );

            }

        } else {

            musicaThoseEyes.pause();

            console.log(
                "⏸️ PAUSE PEDIDO PELO BOTÃO"
            );

        }

    }
);


    musicaThoseEyes.addEventListener(
        "play",
        function () {

            botaoMusica.textContent =
                "❚❚";


            botaoMusica.setAttribute(
                "aria-label",
                "Pausar música"
            );


            cartaoMusica.classList.add(
                "tocando"
            );

        }
    );


    musicaThoseEyes.addEventListener(
        "pause",
        function () {

            botaoMusica.textContent =
                "▶";


            botaoMusica.setAttribute(
                "aria-label",
                "Ouvir música"
            );


            cartaoMusica.classList.remove(
                "tocando"
            );

        }
    );


    musicaThoseEyes.addEventListener(
        "loadedmetadata",
        function () {

            atualizarTempo();

        }
    );


    musicaThoseEyes.addEventListener(
        "timeupdate",
        function () {

            if (
                !Number.isFinite(
                    musicaThoseEyes.duration
                ) ||
                musicaThoseEyes.duration <= 0
            ) {
                return;
            }


            const percentagem =
                (
                    musicaThoseEyes.currentTime /
                    musicaThoseEyes.duration
                ) * 100;


            barraProgresso.style.width =
                percentagem + "%";


            atualizarTempo();

        }
    );


    progressoMusica.addEventListener(
        "click",
        function (evento) {

            if (
                !Number.isFinite(
                    musicaThoseEyes.duration
                ) ||
                musicaThoseEyes.duration <= 0
            ) {
                return;
            }


            const rect =
                progressoMusica.getBoundingClientRect();


            const posicao =
                evento.clientX -
                rect.left;


            const percentagem =
                Math.max(
                    0,
                    Math.min(
                        1,
                        posicao /
                        rect.width
                    )
                );


            musicaThoseEyes.currentTime =
                percentagem *
                musicaThoseEyes.duration;

        }
    );


    musicaThoseEyes.addEventListener(
        "ended",
        function () {

            barraProgresso.style.width =
                "0%";


            tempoMusica.textContent =
                "0:00";


            botaoMusica.textContent =
                "▶";


            botaoMusica.setAttribute(
                "aria-label",
                "Ouvir música"
            );


            cartaoMusica.classList.remove(
                "tocando"
            );

        }
    );


    musicaThoseEyes.addEventListener(
        "error",
        function () {

            console.error(
                "Não foi possível carregar Those Eyes."
            );

        }
    );

}


// =========================================================
// CARTA PARA JACILETH
// =========================================================

const envelopeCarta =
    document.querySelector(
        ".envelope-carta"
    );

const botaoAbrirCarta =
    document.querySelector(
        "#abrirCarta"
    );

const cartaAberta =
    document.querySelector(
        "#cartaAberta"
    );

const fecharCarta =
    document.querySelector(
        "#fecharCarta"
    );


if (
    envelopeCarta &&
    botaoAbrirCarta &&
    cartaAberta
) {

    botaoAbrirCarta.addEventListener(
        "click",
        function () {

            cartaAberta.classList.add(
                "aberta"
            );


            cartaAberta.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";

        }
    );

}


function fecharCartaEspecial() {

    if (!cartaAberta) {
        return;
    }


    cartaAberta.classList.remove(
        "aberta"
    );


    cartaAberta.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


if (fecharCarta) {

    fecharCarta.addEventListener(
        "click",
        fecharCartaEspecial
    );

}


if (cartaAberta) {

    cartaAberta.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                cartaAberta
            ) {

                fecharCartaEspecial();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !cartaAberta ||
            !cartaAberta.classList.contains(
                "aberta"
            )
        ) {
            return;
        }


        if (
            evento.key ===
            "Escape"
        ) {

            fecharCartaEspecial();

        }

    }
);


// =========================================
// SISTEMA DE REVELAÇÃO DO RESTO DA SURPRESA
// =========================================

const btnRevelarSurpresa =
    document.querySelector(
        "#btnRevelarSurpresa"
    );

const revelarSurpresa =
    document.querySelector(
        "#revelarSurpresa"
    );


// Elementos que serão desbloqueados
// depois do Momento 12
const restoDoSite =
    document.querySelectorAll(
        "#galeria, #sobre-ela, #carta, #aniversario, #capsula-final, footer"
    );


// =========================================================
// VERIFICAR SE A SURPRESA JÁ FOI DESBLOQUEADA
// =========================================================

const surpresaJaDesbloqueada =
    localStorage.getItem(
        CHAVE_DESBLOQUEIO
    ) === "true";


if (surpresaJaDesbloqueada) {

    console.log(
        "🔓 Surpresa já desbloqueada anteriormente."
    );


    // Mostrar o resto do site
    restoDoSite.forEach(
        function (secao) {

            secao.style.display =
                "";

        }
    );


    // Botão não precisa aparecer
    if (revelarSurpresa) {

        revelarSurpresa.style.display =
            "none";

    }

} else {

    // Ainda não desbloqueou
    // Então esconder o resto
    restoDoSite.forEach(
        function (secao) {

            secao.style.display =
                "none";

        }
    );


    if (revelarSurpresa) {

        revelarSurpresa.style.display =
            "none";

    }

}


// =========================================================
// CLICAR EM "REVELAR SURPRESA"
// =========================================================

if (btnRevelarSurpresa) {

    btnRevelarSurpresa.addEventListener(
        "click",
        function () {

            console.log(
                "✨ A surpresa continua..."
            );


            // =================================================
            // GUARDAR QUE O RESTO DA SURPRESA FOI DESBLOQUEADO
            // =================================================

           localStorage.setItem(
    CHAVE_DESBLOQUEIO,
    "true"
);


            // Guardar também o progresso completo
            guardarProgresso();


            // Revelar o resto do site
            restoDoSite.forEach(
                function (secao) {

                    secao.style.display =
                        "";

                }
            );


            // Esconder o botão depois de utilizado
            if (revelarSurpresa) {

                revelarSurpresa.style.display =
                    "none";

            }


            // Levar suavemente até à galeria
            const galeria =
                document.querySelector(
                    "#galeria"
                );


            if (galeria) {

                setTimeout(
                    function () {

                        galeria.scrollIntoView({
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });

                    },
                    100
                );

            }

        }
    );

}


// =========================================================
// BOTÃO — RECOMEÇAR A SURPRESA
// =========================================================

const btnResetarSurpresa =
    document.querySelector("#btnResetarSurpresa");

if (btnResetarSurpresa) {

    btnResetarSurpresa.addEventListener(
        "click",
        function () {

            const confirmar =
                confirm(
                    "💙 Tens a certeza que queres recomeçar a surpresa?\n\n" +
                    "O teu progresso atual será apagado e vais voltar ao Momento 1."
                );

            if (!confirmar) {
                return;
            }

            // Apagar o progresso
           localStorage.removeItem(
    CHAVE_STORAGE
);

localStorage.removeItem(
    CHAVE_DESBLOQUEIO
);

            console.log(
                "🔄 Surpresa reiniciada."
            );

            // Recarregar o site
            window.location.reload();

        }
    );

}

// =========================================================
// EASTER EGG — CORAÇÃO SECRETO
// =========================================================


const easterEggCoracao =
    document.querySelector(
        "#easterEggCoracao"
    );


const easterEggContador =
    document.querySelector(
        "#easterEggContador"
    );


const easterEggModal =
    document.querySelector(
        "#easterEggModal"
    );


const fecharEasterEgg =
    document.querySelector(
        "#fecharEasterEgg"
    );


const botaoFecharEasterEgg =
    document.querySelector(
        "#botaoFecharEasterEgg"
    );


// =========================================================
// CONFIGURAÇÃO
// =========================================================

const CLIQUES_NECESSARIOS_EASTER_EGG =
    5;


let cliquesEasterEgg =
    0;


// =========================================================
// FUNÇÃO — ABRIR EASTER EGG
// =========================================================

function abrirEasterEgg() {

    if (
        !easterEggModal
    ) {
        return;
    }


    easterEggModal.classList.add(
        "aberto"
    );


    easterEggModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    console.log(
        "💙 Easter Egg encontrado!"
    );

}


// =========================================================
// FUNÇÃO — FECHAR EASTER EGG
// =========================================================

function fecharEasterEggModal() {

    if (
        !easterEggModal
    ) {
        return;
    }


    easterEggModal.classList.remove(
        "aberto"
    );


    easterEggModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    console.log(
        "💙 Easter Egg fechado."
    );

}


// =========================================================
// FUNÇÃO — ANIMAR CORAÇÃO
// =========================================================

function animarCoracao() {

    if (
        !easterEggCoracao
    ) {
        return;
    }


    easterEggCoracao.classList.remove(
        "pulsar"
    );


    // Forçar o navegador a reiniciar
    // a animação
    void easterEggCoracao.offsetWidth;


    easterEggCoracao.classList.add(
        "pulsar"
    );

}


// =========================================================
// FUNÇÃO — ATUALIZAR CONTADOR
// =========================================================

function atualizarContadorEasterEgg() {

    if (
        !easterEggContador
    ) {
        return;
    }


    // -----------------------------------------------------
    // Antes de 3 cliques
    // -----------------------------------------------------

    if (
        cliquesEasterEgg < 3
    ) {

        easterEggContador.textContent =
            "";


        easterEggContador.classList.remove(
            "mostrar"
        );


        return;

    }


    // -----------------------------------------------------
    // A partir do terceiro clique
    // -----------------------------------------------------

    const restantes =
        CLIQUES_NECESSARIOS_EASTER_EGG -
        cliquesEasterEgg;


    if (
        restantes > 0
    ) {

        easterEggContador.textContent =
            "👀 Falta pouco...";


        easterEggContador.classList.add(
            "mostrar"
        );

    }

}


// =========================================================
// CLIQUE NO CORAÇÃO
// =========================================================

if (
    easterEggCoracao
) {

    easterEggCoracao.addEventListener(
        "click",
        function () {

            // -------------------------------------------------
            // Aumentar contador
            // -------------------------------------------------

            cliquesEasterEgg++;


            console.log(
                "💙 Clique secreto:",
                cliquesEasterEgg,
                "/",
                CLIQUES_NECESSARIOS_EASTER_EGG
            );


            // -------------------------------------------------
            // Animar
            // -------------------------------------------------

            animarCoracao();


            // -------------------------------------------------
            // Atualizar mensagem
            // -------------------------------------------------

            atualizarContadorEasterEgg();


            // -------------------------------------------------
            // Verificar se chegou aos 5 cliques
            // -------------------------------------------------

            if (
                cliquesEasterEgg >=
                CLIQUES_NECESSARIOS_EASTER_EGG
            ) {

                setTimeout(
                    function () {

                        abrirEasterEgg();


                        // Preparar novamente
                        // para uma nova descoberta

                        cliquesEasterEgg =
                            0;


                        if (
                            easterEggContador
                        ) {

                            easterEggContador.textContent =
                                "";


                            easterEggContador.classList.remove(
                                "mostrar"
                            );

                        }

                    },
                    300
                );

            }

        }
    );

}


// =========================================================
// BOTÃO X
// =========================================================

if (
    fecharEasterEgg
) {

    fecharEasterEgg.addEventListener(
        "click",
        fecharEasterEggModal
    );

}


// =========================================================
// BOTÃO FECHAR
// =========================================================

if (
    botaoFecharEasterEgg
) {

    botaoFecharEasterEgg.addEventListener(
        "click",
        fecharEasterEggModal
    );

}


// =========================================================
// CLICAR NO FUNDO
// =========================================================

if (
    easterEggModal
) {

    easterEggModal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                easterEggModal
            ) {

                fecharEasterEggModal();

            }

        }
    );

}


// =========================================================
// ESC — FECHAR
// =========================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !easterEggModal ||
            !easterEggModal.classList.contains(
                "aberto"
            )
        ) {
            return;
        }


        if (
            evento.key ===
            "Escape"
        ) {

            fecharEasterEggModal();

        }

    }
);

// =========================================================
// FASE 3 — CÁPSULA DO TEMPO
// =========================================================


// =========================================================
// ELEMENTOS
// =========================================================

const abrirCapsulaTempo =
    document.querySelector(
        "#abrirCapsulaTempo"
    );


const capsulaTempoModal =
    document.querySelector(
        "#capsulaTempoModal"
    );


const fecharCapsulaTempo =
    document.querySelector(
        "#fecharCapsulaTempo"
    );


const botaoFecharCapsula =
    document.querySelector(
        "#botaoFecharCapsula"
    );


// =========================================================
// ABRIR CÁPSULA
// =========================================================

function abrirCapsula() {

    if (
        !capsulaTempoModal
    ) {
        return;
    }


    capsulaTempoModal.classList.add(
        "aberto"
    );


    capsulaTempoModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    console.log(
        "🔮 Cápsula do tempo aberta."
    );

}


// =========================================================
// FECHAR CÁPSULA
// =========================================================

function fecharCapsula() {

    if (
        !capsulaTempoModal
    ) {
        return;
    }


    capsulaTempoModal.classList.remove(
        "aberto"
    );


    capsulaTempoModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    console.log(
        "🔮 Cápsula do tempo fechada."
    );

}


// =========================================================
// BOTÃO — ABRIR
// =========================================================

if (
    abrirCapsulaTempo
) {

    abrirCapsulaTempo.addEventListener(
        "click",
        abrirCapsula
    );

}


// =========================================================
// BOTÃO X
// =========================================================

if (
    fecharCapsulaTempo
) {

    fecharCapsulaTempo.addEventListener(
        "click",
        fecharCapsula
    );

}


// =========================================================
// BOTÃO — GUARDAR MENSAGEM
// =========================================================

if (
    botaoFecharCapsula
) {

    botaoFecharCapsula.addEventListener(
        "click",
        fecharCapsula
    );

}


// =========================================================
// CLICAR NO FUNDO
// =========================================================

if (
    capsulaTempoModal
) {

    capsulaTempoModal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                capsulaTempoModal
            ) {

                fecharCapsula();

            }

        }
    );

}


// =========================================================
// ESC — FECHAR
// =========================================================

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !capsulaTempoModal ||
            !capsulaTempoModal.classList.contains(
                "aberto"
            )
        ) {
            return;
        }


        if (
            evento.key ===
            "Escape"
        ) {

            fecharCapsula();

        }

    }
);


// =========================================================
// 🎬 FINAL CINEMATOGRÁFICO
// =========================================================

const finalCinematografico =
    document.querySelector("#finalCinematografico");

const cinemaTexto =
    document.querySelector("#cinemaTexto");

const cinemaRever =
    document.querySelector("#cinemaRever");


// ---------------------------------------------------------
// CONFIGURAÇÃO DA HISTÓRIA
// ---------------------------------------------------------

const cenasCinema = [

    {
        texto:
            "Havia uma história que começou sem sabermos onde ia dar...",
        classe: ""
    },

    {
        texto:
            "Uma amizade.",
        classe: "azul"
    },

    {
        texto:
            "Alguns sentimentos escondidos.",
        classe: ""
    },

    {
        texto:
            "Um casaco.",
        classe: "destaque"
    },

    {
        texto:
            "Um coração dividido em dois. 💙",
        classe: "destaque"
    },

    {
        texto:
            "Um primeiro beijo.",
        classe: ""
    },

    {
        texto:
            "E finalmente...",
        classe: ""
    },

    {
        texto:
            "Nós.",
        classe: "grande-final"
    },

    {
        texto:
            "10 de Maio de 2026.",
        classe: "azul"
    },

    {
        texto:
            "O dia em que a nossa história ganhou um novo nome.",
        classe: ""
    },

    {
        texto:
            "Jacileth.",
        classe: "grande-final"
    },

    {
        texto:
            "Feliz aniversário. ❤️",
        classe: "destaque"
    },

    {
        texto:
            "E se achaste que esta era a parte final...",
        classe: ""
    },

    {
        texto:
            "Estás enganada.",
        classe: "destaque"
    },

    {
        texto:
            "É apenas o começo da nossa história. ❤️",
        classe: "grande-final"
    }

];


// ---------------------------------------------------------
// TEMPOS
// ---------------------------------------------------------

const TEMPO_ENTRE_CENAS = 4200;

const TEMPO_INICIAL = 1200;

const TEMPO_FINAL = 5500;


// ---------------------------------------------------------
// ABRIR CINEMA
// ---------------------------------------------------------

function iniciarFinalCinematografico() {

    if (!finalCinematografico || !cinemaTexto) {
        console.warn(
            "🎬 Elementos do final cinematográfico não encontrados."
        );

        return;
    }


    // Impede o site de continuar a fazer scroll
    document.body.style.overflow = "hidden";


    // Ativa o ecrã
    finalCinematografico.classList.add("ativo");

    finalCinematografico.classList.remove("finalizado");

    finalCinematografico.setAttribute(
        "aria-hidden",
        "false"
    );


    // Começamos no primeiro texto
    cinemaTexto.textContent = "";

    cinemaTexto.className = "cinema-texto";


    // Pequeno intervalo para permitir
    // a entrada cinematográfica do ecrã
    setTimeout(function () {

        mostrarCenaCinema(0);

    }, TEMPO_INICIAL);
}


// ---------------------------------------------------------
// MOSTRAR UMA CENA
// ---------------------------------------------------------

function mostrarCenaCinema(indice) {

    if (
        !cinemaTexto ||
        indice >= cenasCinema.length
    ) {
        finalizarCinema();
        return;
    }


    const cena = cenasCinema[indice];


    // Primeiro desaparece
    cinemaTexto.classList.remove("mostrar");


    setTimeout(function () {

        // Atualiza o texto
        cinemaTexto.textContent =
            cena.texto;


        // Limpa classes antigas
        cinemaTexto.className =
            "cinema-texto";


        // Adiciona classe especial
        if (cena.classe) {

            cinemaTexto.classList.add(
                cena.classe
            );

        }


        // Pequeno intervalo antes do fade
        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                cinemaTexto.classList.add(
                    "mostrar"
                );

            });

        });


        // Tempo até à próxima frase
        setTimeout(function () {

            mostrarCenaCinema(indice + 1);

        }, TEMPO_ENTRE_CENAS);

    }, 900);
}


// ---------------------------------------------------------
// FINAL DA EXPERIÊNCIA
// ---------------------------------------------------------

function finalizarCinema() {

    if (!finalCinematografico) return;


    // Mantém a última frase durante alguns segundos
    setTimeout(function () {

        finalCinematografico.classList.add(
            "finalizado"
        );

    }, TEMPO_FINAL);
}


// ---------------------------------------------------------
// REVER A SURPRESA
// ---------------------------------------------------------

if (cinemaRever) {

    cinemaRever.addEventListener(
        "click",
        function () {

            finalCinematografico.classList.remove(
                "ativo"
            );

            finalCinematografico.classList.remove(
                "finalizado"
            );

            finalCinematografico.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.style.overflow = "";


            // Voltamos para o topo
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// ---------------------------------------------------------
// INTEGRAR COM A CÁPSULA DO TEMPO
// ---------------------------------------------------------

if (botaoFecharCapsula) {

    botaoFecharCapsula.addEventListener(
        "click",
        function () {

            // Primeiro fecha a cápsula
            fecharCapsula();


            // Depois de um pequeno intervalo,
            // começa o final cinematográfico
            setTimeout(function () {

                iniciarFinalCinematografico();

            }, 1200);

        }
    );

}


// ---------------------------------------------------------
// ESC — SAIR DO CINEMA
// ---------------------------------------------------------

document.addEventListener(
    "keydown",
    function (evento) {

        if (
            !finalCinematografico ||
            !finalCinematografico.classList.contains(
                "ativo"
            )
        ) {
            return;
        }


        if (evento.key === "Escape") {

            finalCinematografico.classList.remove(
                "ativo"
            );

            finalCinematografico.classList.remove(
                "finalizado"
            );

            finalCinematografico.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow = "";

        }

    }
);

