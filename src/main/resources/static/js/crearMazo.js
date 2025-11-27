document.addEventListener("DOMContentLoaded", () => {
    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");

    const mainDeck = document.querySelector("#main_deck");
    const extraDeck = document.querySelector("#extra_deck");
    const sideDeck = document.querySelector("#side_deck");

    const btnSave = document.querySelector("#btnSave");
    const btnDelete = document.querySelector("#btnDelete");
    const nombreMazo = document.querySelector("#nombreMazo");
    const cartaDestacada = document.querySelector("#cartaDestacada");
    const estadoSelect = document.querySelector("#estadoMazo");

    const currentUrl = window.location.pathname;
    const match = currentUrl.match(/\/constructorMazos\/(\d+)/i);
    const ID_MAZO = match ? match[1] : null;

    let cartasFiltradas = [];
    let zonaSeleccionada = "mainExtra";
    const mazo = { main: [], extra: [], side: [] };

    let paginaActual = 1;
    const cartasPorPagina = 180;

    async function cargarMazoSiExiste() {
        if (!ID_MAZO) return;

        try {
            const response = await fetch(`/MazoAPI/${ID_MAZO}`);
            if (!response.ok) throw new Error("No se pudo cargar el mazo");

            const data = await response.json();

            nombreMazo.value = data.nombre || "";
            estadoSelect.value = data.estado || "publico";

            mazo.main = data.mainDeck?.cartas || [];
            mazo.extra = data.extraDeck?.cartas || [];
            mazo.side = data.sideDeck?.cartas || [];

            const ids = [...mazo.main, ...mazo.extra, ...mazo.side].map(c => c.idKonami);

            if (ids.length > 0) {
                const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${ids.join(",")}`;
                const res = await fetch(url);
                const cartaData = await res.json();
                cartasFiltradas = cartaData.data;
            }

            mostrarMazo();

            setTimeout(() => {
                const url = data.imagenCartaDestacada || "/img/cartaDorso.jpg";
                cartaDestacada.value = url;
                document.getElementById("cartaDestacadaPreview").src = url;
            }, 200);

        } catch (error) {
            console.error("Error al cargar mazo existente:", error);
        }
    }

    document.querySelector("#btnShort").addEventListener("click", ordenarMazo);

    function ordenarMazo() {
        if (cartasFiltradas.length === 0) return;

        const prioridadTipo = {
            "Normal Monster": 1,
            "Effect Monster": 1,
            "Flip Effect Monster": 1,
            "Tuner Monster": 1,
            "Ritual Monster": 1,
            "Fusion Monster": 2,
            "Synchro Monster": 2,
            "XYZ Monster": 2,
            "Link Monster": 2,
            "Spell Card": 3,
            "Trap Card": 4
        };

        function obtenerCartaInfo(idKonami) {
            return cartasFiltradas.find(c => c.id === idKonami);
        }

        function ordenarZona(arr) {
            arr.sort((a, b) => {
                const cartaA = obtenerCartaInfo(a.idKonami);
                const cartaB = obtenerCartaInfo(b.idKonami);
                if (!cartaA || !cartaB) return 0;

                const tipoA = prioridadTipo[cartaA.type] || 99;
                const tipoB = prioridadTipo[cartaB.type] || 99;

                if (tipoA !== tipoB) return tipoA - tipoB;

                return cartaA.name.localeCompare(cartaB.name);
            });
        }

        ordenarZona(mazo.main);
        ordenarZona(mazo.extra);
        ordenarZona(mazo.side);

        mostrarMazo();

        alert("Cartas ordenadas correctamente.");
    }

    document.querySelector("#btnMainExtra").addEventListener("click", () => {
        zonaSeleccionada = "mainExtra";
        actualizarBotones();
    });

    document.querySelector("#btnSide").addEventListener("click", () => {
        zonaSeleccionada = "side";
        actualizarBotones();
    });

    function actualizarBotones() {
        document.querySelectorAll("#zona_mazo .btn").forEach(btn => btn.classList.remove("active-zone"));
        if (zonaSeleccionada === "mainExtra") document.querySelector("#btnMainExtra").classList.add("active-zone");
        if (zonaSeleccionada === "side") document.querySelector("#btnSide").classList.add("active-zone");
    }

    function mostrarSelectorDestacada() {
        const cont = document.getElementById("destacadaSelector");
        cont.innerHTML = "";

        const imgDefault = document.createElement("img");
        imgDefault.src = "/img/cartaDorso.jpg";
        imgDefault.dataset.url = "/img/cartaDorso.jpg";
        estiloMiniatura(imgDefault);
        imgDefault.addEventListener("click", () => seleccionarDestacada(imgDefault));
        cont.appendChild(imgDefault);

        const todas = [...mazo.main, ...mazo.extra, ...mazo.side];
        const idsUnicos = [...new Set(todas.map(c => c.idKonami))];

        idsUnicos.forEach(id => {
            const cartaInfo = cartasFiltradas.find(c => c.id === id);
            if (!cartaInfo) return;

            const url = cartaInfo.card_images[0].image_url;

            const img = document.createElement("img");
            img.src = url;
            img.dataset.url = url;
            estiloMiniatura(img);

            img.addEventListener("click", () => seleccionarDestacada(img));
            cont.appendChild(img);
        });
    }

    function estiloMiniatura(img) {
        img.style.width = "80px";
        img.style.height = "110px";
        img.style.cursor = "pointer";
        img.style.border = "2px solid transparent";
        img.style.borderRadius = "4px";
    }

    document.getElementById("cartaDestacadaPreview").addEventListener("click", () => {
        mostrarSelectorDestacada();
        const modal = new bootstrap.Modal(document.getElementById("modalDestacada"));
        modal.show();
    });

    function seleccionarDestacada(img) {
        const url = img.dataset.url;

        cartaDestacada.value = url;
        document.getElementById("cartaDestacadaPreview").src = url;

        const modal = bootstrap.Modal.getInstance(document.getElementById("modalDestacada"));
        modal.hide();
    }

    filtros.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(filtros);
        const params = new URLSearchParams();

        let atkMin = null, atkMax = null, defMin = null, defMax = null;

        for (const [key, value] of formData.entries()) {
            if (!value.trim()) continue;
            const val = value.trim();
            switch (key) {
                case "q": params.append("fname", val); break;
                case "tipo": params.append("type", val); break;
                case "tipoCarta": params.append("race", val); break;
                case "arquetipo": params.append("archetype", val); break;
                case "atributo": params.append("attribute", val); break;
                case "nivel": params.append("level", val); break;
                case "familia": params.append("race", val); break;
                case "atkMin": atkMin = parseInt(val); break;
                case "atkMax": atkMax = parseInt(val); break;
                case "defMin": defMin = parseInt(val); break;
                case "defMax": defMax = parseInt(val); break;
                default: params.append(key, val);
            }
        }

        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${params.toString()}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener cartas");
            const data = await response.json();
            let cartas = data.data;

            cartas = cartas.filter(c => {
                if (atkMin !== null && c.atk < atkMin) return false;
                if (atkMax !== null && c.atk > atkMax) return false;
                if (defMin !== null && c.def < defMin) return false;
                if (defMax !== null && c.def > defMax) return false;
                return true;
            });

            if (cartas.length === 0) {
                listaCartas.innerHTML = '<p class="text-center text-muted mt-3">No se encontraron cartas.</p>';
                document.getElementById("paginacion").innerHTML = "";
                return;
            }

            cartasFiltradas = cartas;
            paginaActual = 1; // reset página
            mostrarCartasPaginadas();
        } catch (error) {
            console.error("Error al cargar cartas:", error);
            listaCartas.innerHTML = '<p class="text-center text-danger mt-3">Error al cargar las cartas.</p>';
            document.getElementById("paginacion").innerHTML = "";
        }
    });

    function mostrarCartasPaginadas() {
        const inicio = (paginaActual - 1) * cartasPorPagina;
        const fin = inicio + cartasPorPagina;
        const cartasAMostrar = cartasFiltradas.slice(inicio, fin);
        mostrarCartas(cartasAMostrar);
        renderizarPaginacion();
    }

    function mostrarCartas(cartas) {
        listaCartas.className = "row row-cols-6 g-2";
        listaCartas.innerHTML = "";

        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");
            col.innerHTML = `
                <div class="card border-0 text-center w-100" style="background:transparent;">
                    <div style="height:240px; width:100%;">
                        <img src="${carta.card_images[0].image_url}"
                             alt="${carta.name}"
                             style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
                    </div>
                </div>
            `;

            col.querySelector("img").addEventListener("click", () => agregarCartaAlMazo(carta, zonaSeleccionada));
            listaCartas.appendChild(col);
        });
    }

    function renderizarPaginacion() {
        const cont = document.getElementById("paginacion");
        cont.innerHTML = "";

        const totalPaginas = Math.ceil(cartasFiltradas.length / cartasPorPagina);
        if (totalPaginas <= 1) return;

        const btnPrev = document.createElement("button");
        btnPrev.className = "btn btn-secondary mx-1";
        btnPrev.textContent = "« Prev";
        btnPrev.disabled = paginaActual === 1;
        btnPrev.onclick = () => {
            paginaActual--;
            mostrarCartasPaginadas();
        };
        cont.appendChild(btnPrev);

        // Mostrar máximo 4 páginas alrededor de la actual
        const maxPaginasMostradas = 4;
        let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasMostradas / 2));
        let fin = inicio + maxPaginasMostradas - 1;

        if (fin > totalPaginas) {
            fin = totalPaginas;
            inicio = Math.max(1, fin - maxPaginasMostradas + 1);
        }

        for (let i = inicio; i <= fin; i++) {
            const btn = document.createElement("button");
            btn.className = `btn mx-1 ${i === paginaActual ? "btn-primary" : "btn-outline-primary"}`;
            btn.textContent = i;
            btn.onclick = () => {
                paginaActual = i;
                mostrarCartasPaginadas();
            };
            cont.appendChild(btn);
        }

        const btnNext = document.createElement("button");
        btnNext.className = "btn btn-secondary mx-1";
        btnNext.textContent = "Next »";
        btnNext.disabled = paginaActual === totalPaginas;
        btnNext.onclick = () => {
            paginaActual++;
            mostrarCartasPaginadas();
        };
        cont.appendChild(btnNext);
    }

    function agregarCartaAlMazo(carta, zona) {
        const idKonami = carta.id;
        const totalCopias = [...mazo.main, ...mazo.extra, ...mazo.side]
            .filter(c => c.idKonami === idKonami).length;

        if (totalCopias >= 3) {
            alert("No puedes tener más de 3 copias de la misma carta en tu mazo.");
            return;
        }

        if (zona === "side") {
            if (mazo.side.length >= 15) {
                alert("Side Deck no puede tener más de 15 cartas.");
                return;
            }
            mazo.side.push({ idKonami });
        } else if (zona === "mainExtra") {
            const tiposExtra = ["Fusion Monster", "Synchro Monster", "XYZ Monster", "Link Monster", "Pendulum Monster"];
            if (tiposExtra.includes(carta.type)) {
                if (mazo.extra.length >= 15) {
                    alert("Extra Deck no puede tener más de 15 cartas.");
                    return;
                }
                mazo.extra.push({ idKonami });
            } else {
                if (mazo.main.length >= 60) {
                    alert("Main Deck no puede tener más de 60 cartas.");
                    return;
                }
                mazo.main.push({ idKonami });
            }
        }

        mostrarMazo();
    }

    function renderZona(container, cartas, zona) {
        const row = container.querySelector(".row");
        row.innerHTML = "";

        cartas.forEach((carta, index) => {
            const cartaInfo = cartasFiltradas.find(c => c.id === carta.idKonami);
            const imgSrc = cartaInfo ? cartaInfo.card_images[0].image_url : "";
            const name = cartaInfo ? cartaInfo.name : `Carta ${carta.idKonami}`;

            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");
            col.innerHTML = `
            <div class="card border-0 text-center w-100" style="background:transparent;">
                <div style="height:120px; width:100%;">
                    <img src="${imgSrc}" alt="${name}" style="width:100%; height:100%; object-fit:contain;">
                </div>
                <div class="card-body p-0 d-flex justify-content-start">
                    <button class="btn btn-sm btn-primary ver-carta" data-index="${index}" style="font-size:0.9rem; border-radius:0;">
                        <i class="bi bi-eye"></i>
                    </button>

                    <button class="btn btn-sm btn-danger quitar-carta" data-zona="${zona}" data-index="${index}" style="font-size:0.9rem; border-radius:0; margin-left:0;">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            `;
            row.appendChild(col);
        });

        container.querySelectorAll(".quitar-carta").forEach(boton => {
            boton.addEventListener("click", e => {
                const zona = e.target.closest("button").dataset.zona;
                const index = e.target.closest("button").dataset.index;
                mazo[zona].splice(index, 1);
                mostrarMazo();
            });
        });

        container.querySelectorAll(".ver-carta").forEach(boton => {
            boton.addEventListener("click", e => {
                const index = e.target.closest("button").dataset.index;
                const carta = cartas[index];
                const cartaInfo = cartasFiltradas.find(c => c.id === carta.idKonami);
                if (cartaInfo) {
                    const tituloModal = document.getElementById("modalCartaLabel");
                    tituloModal.textContent = cartaInfo.name;
                    tituloModal.classList.add("text-white");
                    document.getElementById("imgCartaModal").src = cartaInfo.card_images[0].image_url;

                    const infoDiv = document.getElementById("infoCartaModal");
                    let htmlInfo = `
                        <p><strong>Tipo de carta:</strong> ${cartaInfo.type || "N/A"}</p>
                        <p><strong>Arquetipo:</strong> ${cartaInfo.archetype || "N/A"}</p>
                    `;

                    if (cartaInfo.type.includes("Monster")) {
                        htmlInfo += `
                            <p><strong>Ataque:</strong> ${cartaInfo.atk !== undefined ? cartaInfo.atk : "N/A"}</p>
                            <p><strong>Defensa:</strong> ${cartaInfo.def !== undefined ? cartaInfo.def : "N/A"}</p>
                            <p><strong>Nivel:</strong> ${cartaInfo.level !== undefined ? cartaInfo.level : "N/A"}</p>
                            <p><strong>Atributo:</strong> ${cartaInfo.attribute || "N/A"}</p>
                            <p><strong>Raza:</strong> ${cartaInfo.race || "N/A"}</p>
                            <p><strong>Descripción:</strong> ${cartaInfo.desc || "N/A"}</p>
                        `;
                    } else {
                        htmlInfo += `
                            <p><strong>Descripción:</strong> ${cartaInfo.desc || "N/A"}</p>
                        `;
                    }

                    infoDiv.innerHTML = htmlInfo;

                    const modal = new bootstrap.Modal(document.getElementById("modalCarta"));
                    modal.show();
                }
            });
        });
    }

    function mostrarMazo() {
        renderZona(mainDeck, mazo.main, "main");
        renderZona(extraDeck, mazo.extra, "extra");
        renderZona(sideDeck, mazo.side, "side");
    }

    btnSave.addEventListener("click", async () => {
        const payload = {
            nombre: nombreMazo.value,
            estado: estadoSelect.value || "publico",
            mainDeck: { cartas: mazo.main },
            extraDeck: { cartas: mazo.extra },
            sideDeck: { cartas: mazo.side },
            imagenCartaDestacada: cartaDestacada.value
        };

        try {
            let response;

            if (!ID_MAZO) {
                response = await fetch("/MazoAPI", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error al crear el mazo: ${errorText}`);
                }

            } else {
                response = await fetch(`/MazoAPI/${ID_MAZO}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error al actualizar el mazo: ${errorText}`);
                }
            }

            window.location.href = "/user/misMazos";

        } catch (error) {
            console.error("Error al guardar mazo:", error);
            alert(error.message);
        }
    });

    btnDelete.addEventListener("click", async () => {
        if (!ID_MAZO) {
            window.location.href = "/user/misMazos";
            return;
        }

        if (confirm("¿Seguro que quieres eliminar este mazo?")) {
            try {
                const response = await fetch(`/MazoAPI/${ID_MAZO}`, { method: "DELETE" });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error al eliminar el mazo: ${errorText}`);
                }

                Object.keys(mazo).forEach(k => mazo[k] = []);
                mostrarMazo();
                nombreMazo.value = "";

                window.location.href = "/user/misMazos";

            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }
    });

    actualizarBotones();
    cargarMazoSiExiste();
});