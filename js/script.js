// =========================================================
// INICIAR SEMPRE O SITE NO TOPO
// =========================================================

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

// =========================================================
// ABERTURA DO SITE
// =========================================================

const botaoSurpresa = document.querySelector(".btn-surpresa");
const inicio = document.querySelector("#inicio");
const historia = document.querySelector("#historia");

if (botaoSurpresa) {

    botaoSurpresa.addEventListener("click", function () {

        if (inicio) {
            inicio.classList.add("esconder");
        }

        setTimeout(function () {

            if (historia) {
                historia.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        }, 1000);

    });

}


// =========================================================
// SISTEMA DOS CARTÕES DA HISTÓRIA
// CORRIGIDO — SEM EFEITO ESCADA
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


// ---------------------------------------------------------
// AJUSTAR ALTURA DO CONTAINER
// ---------------------------------------------------------

function ajustarAlturaHistoria() {

    if (!cartoesHistoria || momentos.length === 0) {
        return;
    }

    const cartaoAtual =
        momentos[momentoAtual];

    if (!cartaoAtual) {
        return;
    }

    /*
     * Como os cartões agora são ABSOLUTOS,
     * o container precisa receber manualmente
     * a altura do cartão que está visível.
     */

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

function mostrarMomento(indice, fazerScroll = false) {

    if (
        indice < 0 ||
        indice >= momentos.length ||
        !momentos[indice]
    ) {
        return;
    }

    /*
     * Impede vários cliques enquanto a transição
     * anterior ainda está a acontecer.
     */

    if (mudancaHistoriaEmAndamento) {
        return;
    }

    mudancaHistoriaEmAndamento = true;


    if (temporizadorHistoria) {
        clearTimeout(temporizadorHistoria);
    }


    const cartaoAnterior =
        momentos[momentoAtual];

    const novoCartao =
        momentos[indice];


    // -----------------------------------------------------
    // RETIRAR CARTÃO ANTERIOR
    // -----------------------------------------------------

    if (cartaoAnterior && cartaoAnterior !== novoCartao) {

        cartaoAnterior.classList.remove(
            "visivel"
        );

    }


    momentoAtual = indice;


    // -----------------------------------------------------
    // PEQUENA PAUSA PARA A TRANSIÇÃO
    // -----------------------------------------------------

    temporizadorHistoria = setTimeout(function () {

        novoCartao.classList.add(
            "visivel"
        );


        requestAnimationFrame(function () {

            ajustarAlturaHistoria();


            /*
             * Esperamos um pouco para o navegador
             * calcular correctamente a nova altura.
             */

            requestAnimationFrame(function () {

                ajustarAlturaHistoria();


                if (fazerScroll && historia) {

                    const margemTopo = 80;

                    const posicao =
                        novoCartao.getBoundingClientRect().top +
                        window.scrollY -
                        margemTopo;

                    window.scrollTo({
                        top: posicao,
                        behavior: "smooth"
                    });

                }


                mudancaHistoriaEmAndamento =
                    false;

            });

        });

    }, 250);

}


// ---------------------------------------------------------
// PREPARAR OS CARTÕES
// ---------------------------------------------------------

if (momentos.length > 0) {

    momentos.forEach(function (momento, indice) {

        momento.classList.remove(
            "visivel"
        );

        /*
         * Todos os cartões ficam sobrepostos.
         * O CSS também define isto, mas fazemos
         * aqui como segurança.
         */

        momento.style.position = "absolute";
        momento.style.top = "0";
        momento.style.left = "0";
        momento.style.width = "100%";

        momento.style.zIndex =
            indice === 0 ? "2" : "1";

    });


    momentoAtual = 0;


    const primeiroCartao =
        momentos[0];

    primeiroCartao.classList.add(
        "visivel"
    );

    primeiroCartao.style.zIndex = "2";


    /*
     * Esperar o navegador terminar de renderizar
     * antes de medir a altura.
     */

    requestAnimationFrame(function () {

        requestAnimationFrame(function () {

            ajustarAlturaHistoria();

        });

    });

}




// ---------------------------------------------------------
// BOTÕES PRÓXIMO
// ---------------------------------------------------------

botoesProximo.forEach(function (botao) {

    botao.addEventListener(
        "click",
        function () {

            if (mudancaHistoriaEmAndamento) {
                return;
            }


            if (
                momentoAtual <
                momentos.length - 1
            ) {

                /*
                 * O cartão seguinte passa para cima
                 * do anterior.
                 */

                const proximo =
                    momentos[momentoAtual + 1];

                if (proximo) {

    proximo.style.zIndex = "2";

    // Se o próximo cartão for o Momento 12,
    // revelar o botão da surpresa.
    if (momentoAtual + 1 === momentos.length - 1) {

        const revelarSurpresa =
            document.querySelector("#revelarSurpresa");

        if (revelarSurpresa) {
            revelarSurpresa.style.display = "block";
        }

    }

}


                const atual =
                    momentos[momentoAtual];

                if (atual) {

                    atual.style.zIndex = "1";

                }


                mostrarMomento(
                    momentoAtual + 1,
                    true
                );

            }

        }
    );

});


// ---------------------------------------------------------
// REDIMENSIONAMENTO
// ---------------------------------------------------------

window.addEventListener(
    "resize",
    function () {

        /*
         * Pequeno atraso para o navegador
         * recalcular fontes e dimensões.
         */

        setTimeout(function () {

            ajustarAlturaHistoria();

        }, 100);

    }
);


// =========================================================
// ANIMAÇÃO DE ENTRADA DA GALERIA
// =========================================================

const fotosMemoria =
    document.querySelectorAll(".foto-memoria");

const galeria =
    document.querySelector("#galeria");


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

    observadorGaleria.observe(galeria);

} else {

    /*
     * Fallback para navegadores sem
     * IntersectionObserver.
     */

    fotosMemoria.forEach(function (foto) {

        foto.classList.add("visivel");

    });

}


// =========================================================
// VISUALIZADOR DA GALERIA
// FOTOS + VÍDEOS
// =========================================================

const visualizador =
    document.querySelector("#visualizador");

const imagemAmpliada =
    document.querySelector("#imagemAmpliada");


/*
 * Aceita tanto:
 *
 * id="videoWrapper"
 *
 * como:
 *
 * class="video-wrapper"
 *
 * Assim evitamos o conflito que existia entre
 * CSS e JavaScript.
 */

const videoWrapper =
    document.querySelector(
        "#videoWrapper, .video-wrapper"
    );

const videoAmpliado =
    document.querySelector("#videoAmpliado");

const botaoPlayVideo =
    document.querySelector("#botaoPlayVideo");

const fecharGaleria =
    document.querySelector("#fecharGaleria");

const fotoAnterior =
    document.querySelector("#fotoAnterior");

const fotoSeguinte =
    document.querySelector("#fotoSeguinte");

const itensGaleria =
    document.querySelectorAll(".foto-memoria");

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


    fotoAtual = indice;


    const item =
        itensGaleria[fotoAtual];

    const imagem =
        item.querySelector("img");

    const video =
        item.querySelector("video");


    // -----------------------------------------------------
    // RESET
    // -----------------------------------------------------

    if (videoAmpliado) {

        videoAmpliado.pause();

        try {
            videoAmpliado.currentTime = 0;
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


            let caminhoVideo = "";


            if (source && source.src) {

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


            /*
             * O vídeo ampliado usa o nosso
             * botão azul de Play.
             */

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


    visualizador.style.opacity = "";

    visualizador.style.background =
        "rgba(0, 0, 0, 0.92)";


    visualizador.classList.add(
        "aberto"
    );


    document.body.style.overflow =
        "hidden";


    requestAnimationFrame(function () {

        imagemContainer.style.transition =
            "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

        imagemContainer.style.transform =
            "scale(1)";

    });

}


// =========================================================
// CLIQUE NAS FOTOS E VÍDEOS
// =========================================================

itensGaleria.forEach(
    function (item, indice) {

        const imagem =
            item.querySelector("img");

        const video =
            item.querySelector("video");


        if (imagem) {

            imagem.addEventListener(
                "click",
                function () {

                    abrirItem(indice);

                }
            );

        }


        if (video) {

            video.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();
                    evento.stopPropagation();

                    abrirItem(indice);

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


            if (promessa !== undefined) {

                promessa
                    .then(function () {

                        botaoPlayVideo.classList.add(
                            "escondido"
                        );

                    })
                    .catch(function (erro) {

                        console.error(
                            "Não foi possível reproduzir o vídeo:",
                            erro
                        );

                    });

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
            videoAmpliado.currentTime = 0;
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

    if (itensGaleria.length === 0) {
        return;
    }


    fotoAtual++;


    if (
        fotoAtual >=
        itensGaleria.length
    ) {

        fotoAtual = 0;

    }


    abrirItem(fotoAtual);

}


// =========================================================
// MEMÓRIA ANTERIOR
// =========================================================

function anteriorFoto() {

    if (itensGaleria.length === 0) {
        return;
    }


    fotoAtual--;


    if (fotoAtual < 0) {

        fotoAtual =
            itensGaleria.length - 1;

    }


    abrirItem(fotoAtual);

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


        if (evento.key === "Escape") {

            fecharVisualizador();

        }


        if (evento.key === "ArrowRight") {

            proximaFoto();

        }


        if (evento.key === "ArrowLeft") {

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

            arrastandoFoto = true;


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
                Math.abs(movimentoX);

            const distanciaY =
                Math.abs(movimentoY);


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


            arrastandoFoto = false;


            const distanciaX =
                Math.abs(movimentoX);

            const distanciaY =
                Math.abs(movimentoY);


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

            arrastandoFoto = false;


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
    document.querySelector("#musicaThoseEyes");

const botaoMusica =
    document.querySelector("#botaoMusica");

const barraProgresso =
    document.querySelector("#barraProgresso");

const progressoMusica =
    document.querySelector(".progresso-musica");

const tempoMusica =
    document.querySelector("#tempoMusica");

const cartaoMusica =
    document.querySelector(".cartao-musica");


if (
    musicaThoseEyes &&
    botaoMusica &&
    barraProgresso &&
    progressoMusica &&
    tempoMusica &&
    cartaoMusica
) {

    function formatarTempo(segundos) {

        if (!Number.isFinite(segundos)) {
            return "0:00";
        }


        segundos =
            Math.floor(segundos);


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
            ).padStart(2, "0")
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
        function () {

            if (
                musicaThoseEyes.paused
            ) {

                const promessa =
                    musicaThoseEyes.play();


                if (
                    promessa !== undefined
                ) {

                    promessa.catch(
                        function (erro) {

                            console.error(
                                "Não foi possível reproduzir a música:",
                                erro
                            );

                        }
                    );

                }

            } else {

                musicaThoseEyes.pause();

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
    document.querySelector(".envelope-carta");

const botaoAbrirCarta =
    document.querySelector("#abrirCarta");

const cartaAberta =
    document.querySelector("#cartaAberta");

const fecharCarta =
    document.querySelector("#fecharCarta");


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
            evento.key === "Escape"
        ) {

            fecharCartaEspecial();

        }

    }
);


// =========================================================
// CONTADOR DE ANIVERSÁRIO
// =========================================================

// true  = teste de 5 segundos
// false = data real

const MODO_TESTE = true;

const DURACAO_TESTE = 5;

const DATA_ANIVERSARIO =
    new Date(
        "2026-10-02T00:00:00"
    );


const contadorAniversario =
    document.querySelector(
        "#contadorAniversario"
    );

const diasElemento =
    document.querySelector("#dias");

const horasElemento =
    document.querySelector("#horas");

const minutosElemento =
    document.querySelector("#minutos");

const segundosElemento =
    document.querySelector("#segundos");


if (
    contadorAniversario &&
    diasElemento &&
    horasElemento &&
    minutosElemento &&
    segundosElemento
) {

    let momentoFinal;

    let contadorIntervalo = null;


    if (MODO_TESTE) {

        momentoFinal =
            Date.now() +
            DURACAO_TESTE * 1000;

    } else {

        momentoFinal =
            DATA_ANIVERSARIO.getTime();

    }


    function formatarNumero(numero) {

        return String(numero).padStart(
            2,
            "0"
        );

    }

function desbloquearSite() {
    contadorAniversario.classList.add("liberado");

    document.body.style.overflow = "";

    console.log("🎉 Contador terminou! Site desbloqueado.");
}


    function actualizarContador() {

        const agora =
            Date.now();


        const diferenca =
            momentoFinal -
            agora;


        if (
            diferenca <= 0
        ) {

            diasElemento.textContent =
                "00";

            horasElemento.textContent =
                "00";

            minutosElemento.textContent =
                "00";

            segundosElemento.textContent =
                "00";


            if (
                contadorIntervalo
            ) {

                clearInterval(
                    contadorIntervalo
                );

                contadorIntervalo =
                    null;

            }


            desbloquearSite();

            return;

        }


        const totalSegundos =
            Math.floor(
                diferenca / 1000
            );


        const dias =
            Math.floor(
                totalSegundos /
                (60 * 60 * 24)
            );


        const horas =
            Math.floor(
                (
                    totalSegundos %
                    (60 * 60 * 24)
                ) /
                (60 * 60)
            );


        const minutos =
            Math.floor(
                (
                    totalSegundos %
                    (60 * 60)
                ) /
                60
            );


        const segundos =
            totalSegundos %
            60;


        diasElemento.textContent =
            formatarNumero(dias);

        horasElemento.textContent =
            formatarNumero(horas);

        minutosElemento.textContent =
            formatarNumero(minutos);

        segundosElemento.textContent =
            formatarNumero(segundos);

    }


    // -----------------------------------------------------
    // BLOQUEAR SITE
    // -----------------------------------------------------

    document.body.style.overflow =
        "hidden";


    // -----------------------------------------------------
    // PRIMEIRA ACTUALIZAÇÃO
    // -----------------------------------------------------

    actualizarContador();


    // -----------------------------------------------------
    // INTERVALO
    // -----------------------------------------------------

    contadorIntervalo =
        setInterval(
            actualizarContador,
            1000
        );

}

// =========================================
// SISTEMA DE REVELAÇÃO DO RESTO DA SURPRESA
// =========================================

const btnRevelarSurpresa = document.querySelector("#btnRevelarSurpresa");
const revelarSurpresa = document.querySelector("#revelarSurpresa");

if(revelarSurpresa){
    revelarSurpresa.style.display="none";
}

// Elementos que serão desbloqueados depois do Momento 12
const restoDoSite = document.querySelectorAll(
    "#galeria, #sobre-ela, #carta, #aniversario, footer"
);


// Esconde o resto do site inicialmente
restoDoSite.forEach(function(secao) {
    secao.style.display = "none";
});


// Quando ela clicar no botão...
if (btnRevelarSurpresa) {

    btnRevelarSurpresa.addEventListener("click", function() {

        console.log("✨ A surpresa continua...");

        // Revelar o resto do site
        restoDoSite.forEach(function(secao) {
            secao.style.display = "";
        });

        // Esconder o botão depois de utilizado
        if (revelarSurpresa) {
            revelarSurpresa.style.display = "none";
        }

        // Levar suavemente até à galeria
        const galeria = document.querySelector("#galeria");

        if (galeria) {
            setTimeout(function() {
                galeria.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        }

    });

}