document.addEventListener("DOMContentLoaded", async () => {
    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");

    const mainDeck = document.querySelector("#main_deck");
    const extraDeck = document.querySelector("#extra_deck");
    const sideDeck = document.querySelector("#side_deck");

    const btnFavoritos = document.querySelector("#btnFavoritos");
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

    let cartasMazoInfo = {};
    let _actualizandoInfoMazo = false;

    async function cargarMazoExistente() {
        if (!ID_MAZO) return;
        try {
            const resp = await fetch(`/MazoAPI/${ID_MAZO}`);
            if (!resp.ok) throw new Error();
            const data = await resp.json();

            mazo.main = data.mainDeck?.cartas || [];
            mazo.extra = data.extraDeck?.cartas || [];
            mazo.side = data.sideDeck?.cartas || [];

            nombreMazo.value = data.nombre || "";
            estadoSelect.value = data.estado || "publico";
            cartaDestacada.value = data.imagenCartaDestacada || "/img/cartaDorso.jpg";
            document.getElementById("cartaDestacadaPreview").src = cartaDestacada.value;

            await actualizarInfoMazo();
            mostrarMazo();
        } catch (err) {
            console.error(err);
        }
    }

    btnFavoritos.addEventListener("click", async e => {
        e.preventDefault();
        try {
            const response = await fetch("/UsuarioAPI/cartasFavoritas", { method: "GET", credentials: "include" });
            if (!response.ok) throw new Error();
            const idsFavoritas = await response.json();
            if (idsFavoritas.length === 0) {
                alert("No tienes cartas favoritas.");
                return;
            }

            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsFavoritas.join(",")}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            const data = await res.json();
            cartasFiltradas = data.data;
            paginaActual = 1;
            mostrarCartasPaginadas();
        } catch (error) {
            alert("Error al cargar cartas favoritas");
        }
    });

    function exportDeck() {
        const nombreMazoVal = nombreMazo.value || 'mi_mazo';
        const estadoMazoVal = estadoSelect.value;
        const cartaDestacadaVal = cartaDestacada.value;

        const mapDeck = deck => deck.map(c => {
            const info = cartasMazoInfo[c.idKonami];
            return info ? {
                id: info.id,
                nombre: info.name,
                atk: info.atk,
                def: info.def,
                nivel: info.level,
                tipo: info.type,
                arquetipo: info.archetype,
                atributo: info.attribute,
                descripcion: info.desc,
                imagen: info.card_images[0].image_url
            } : { id: c.idKonami };
        });

        const deckData = {
            nombre: nombreMazoVal,
            estado: estadoMazoVal,
            cartaDestacada: cartaDestacadaVal,
            mainDeck: mapDeck(mazo.main),
            extraDeck: mapDeck(mazo.extra),
            sideDeck: mapDeck(mazo.side)
        };

        const blob = new Blob([JSON.stringify(deckData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nombreMazoVal}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    document.getElementById('btnExport').addEventListener('click', exportDeck);

    function ordenarMazo() {
        const prioridadTipo = {
            "Normal Monster": 1, "Effect Monster": 1, "Flip Effect Monster": 1, "Tuner Monster": 1, "Ritual Monster": 1,
            "Fusion Monster": 2, "Synchro Monster": 2, "XYZ Monster": 2, "Link Monster": 2, "Pendulum Monster": 2,
            "Spell Card": 3, "Trap Card": 4
        };

        const ordenarZona = arr => arr.sort((a, b) => {
            const cartaA = cartasMazoInfo[a.idKonami];
            const cartaB = cartasMazoInfo[b.idKonami];
            if (!cartaA || !cartaB) return 0;
            const tipoA = prioridadTipo[cartaA.type] || 99;
            const tipoB = prioridadTipo[cartaB.type] || 99;
            if (tipoA !== tipoB) return tipoA - tipoB;
            return cartaA.name.localeCompare(cartaB.name);
        });

        ordenarZona(mazo.main);
        ordenarZona(mazo.extra);
        ordenarZona(mazo.side);
        mostrarMazo();
        alert("Cartas ordenadas correctamente.");
    }

    document.querySelector("#btnShort").addEventListener("click", ordenarMazo);
    document.querySelector("#btnMainExtra").addEventListener("click", () => { zonaSeleccionada = "mainExtra"; actualizarBotones(); });
    document.querySelector("#btnSide").addEventListener("click", () => { zonaSeleccionada = "side"; actualizarBotones(); });

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

        if (idsUnicos.length === 0) return;

        fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsUnicos.join(",")}`)
            .then(res => res.json())
            .then(data => {
                (data.data || []).forEach(cartaInfo => {
                    const img = document.createElement("img");
                    img.src = cartaInfo.card_images[0].image_url;
                    img.dataset.url = img.src;
                    estiloMiniatura(img);
                    img.addEventListener("click", () => seleccionarDestacada(img));
                    cont.appendChild(img);
                });
            })
            .catch(() => {});
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
        new bootstrap.Modal(document.getElementById("modalDestacada")).show();
    });

    function seleccionarDestacada(img) {
        cartaDestacada.value = img.dataset.url;
        document.getElementById("cartaDestacadaPreview").src = img.dataset.url;
        bootstrap.Modal.getInstance(document.getElementById("modalDestacada")).hide();
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

        try {
            const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?${params.toString()}`);
            if (!response.ok) throw new Error();
            let cartas = (await response.json()).data || [];
            cartas = cartas.filter(c => (atkMin === null || c.atk >= atkMin) && (atkMax === null || c.atk <= atkMax) &&
                (defMin === null || c.def >= defMin) && (defMax === null || c.def <= defMax));
            if (!cartas.length) {
                listaCartas.innerHTML = '<p class="text-center text-muted mt-3">No se encontraron cartas.</p>';
                document.getElementById("paginacion").innerHTML = "";
                return;
            }
            cartasFiltradas = cartas;
            paginaActual = 1;
            mostrarCartasPaginadas();
        } catch (error) {
            listaCartas.innerHTML = '<p class="text-center text-danger mt-3">Error al cargar las cartas.</p>';
            document.getElementById("paginacion").innerHTML = "";
        }
    });

    function mostrarCartasPaginadas() {
        const inicio = (paginaActual - 1) * cartasPorPagina;
        const visibles = cartasFiltradas.slice(inicio, inicio + cartasPorPagina);
        mostrarCartas(visibles);
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
                        <img src="${carta.card_images[0].image_url}" alt="${carta.name}" style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
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
        btnPrev.onclick = () => { paginaActual--; mostrarCartasPaginadas(); };
        cont.appendChild(btnPrev);

        const maxPaginasMostradas = 4;
        let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasMostradas / 2));
        let fin = inicio + maxPaginasMostradas - 1;
        if (fin > totalPaginas) { fin = totalPaginas; inicio = Math.max(1, fin - maxPaginasMostradas + 1); }

        for (let i = inicio; i <= fin; i++) {
            const btn = document.createElement("button");
            btn.className = `btn mx-1 ${i === paginaActual ? "btn-primary" : "btn-outline-primary"}`;
            btn.textContent = i;
            btn.onclick = () => { paginaActual = i; mostrarCartasPaginadas(); };
            cont.appendChild(btn);
        }

        const btnNext = document.createElement("button");
        btnNext.className = "btn btn-secondary mx-1";
        btnNext.textContent = "Next »";
        btnNext.disabled = paginaActual === totalPaginas;
        btnNext.onclick = () => { paginaActual++; mostrarCartasPaginadas(); };
        cont.appendChild(btnNext);
    }

    async function agregarCartaAlMazo(carta, zona) {
        const idKonami = carta.id;
        const totalCopias = [...mazo.main, ...mazo.extra, ...mazo.side].filter(c => c.idKonami === idKonami).length;
        if (totalCopias >= 3) { alert("No puedes tener más de 3 copias de la misma carta en tu mazo."); return; }

        if (zona === "side") {
            if (mazo.side.length >= 15) { alert("Side Deck no puede tener más de 15 cartas."); return; }
            mazo.side.push({ idKonami });
        } else {
            const tiposExtra = ["Fusion Monster", "Synchro Monster", "XYZ Monster", "Link Monster", "Pendulum Monster"];
            if (tiposExtra.includes(carta.type)) {
                if (mazo.extra.length >= 15) { alert("Extra Deck no puede tener más de 15 cartas."); return; }
                mazo.extra.push({ idKonami });
            } else {
                if (mazo.main.length >= 60) { alert("Main Deck no puede tener más de 60 cartas."); return; }
                mazo.main.push({ idKonami });
            }
        }

        await actualizarInfoMazo();
        mostrarMazo();
    }

    async function actualizarInfoMazo() {
        if (_actualizandoInfoMazo) return;
        _actualizandoInfoMazo = true;
        try {
            const idsKonami = [...new Set([...mazo.main, ...mazo.extra, ...mazo.side].map(c => c.idKonami))];
            if (!idsKonami.length) { cartasMazoInfo = {}; return; }

            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsKonami.join(",")}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error();
            const data = await resp.json();

            cartasMazoInfo = {};
            (data.data || []).forEach(c => { cartasMazoInfo[c.id] = c; });
        } catch (err) {
            console.error(err);
        } finally {
            _actualizandoInfoMazo = false;
        }
    }

    function renderZona(container, cartas, zona) {
        const row = container.querySelector(".row");
        row.innerHTML = "";
        cartas.forEach((carta, index) => {
            const cartaInfo = cartasMazoInfo[carta.idKonami];
            const imgSrc = cartaInfo ? cartaInfo.card_images[0].image_url : "img/noimage.jpg";
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
                        <button class="btn btn-sm btn-danger quitar-carta" data-zona="${zona}" data-index="${index}" style="font-size:0.9rem; border-radius:0;">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            row.appendChild(col);

            col.querySelector(".ver-carta").addEventListener("click", () => mostrarCartaModal(cartaInfo));
            col.querySelector(".quitar-carta").addEventListener("click", () => {
                mazo[zona] = mazo[zona].filter((_, i) => i !== index);
                mostrarMazo();
            });
        });
    }

    function mostrarMazo() {
        renderZona(mainDeck, mazo.main, "main");
        renderZona(extraDeck, mazo.extra, "extra");
        renderZona(sideDeck, mazo.side, "side");
    }

    function mostrarCartaModal(cartaInfo) {
        if (!cartaInfo) return;
        const modalImg = document.getElementById("imgCartaModal");
        const modalInfo = document.getElementById("infoCartaModal");
        modalImg.src = cartaInfo.card_images[0].image_url;
        modalInfo.innerHTML = `
            <p><strong>${cartaInfo.name}</strong></p>
            <p>Type: ${cartaInfo.type}</p>
            <p>ATK/${cartaInfo.atk} DEF/${cartaInfo.def}</p>
            <p>${cartaInfo.desc}</p>
        `;
        new bootstrap.Modal(document.getElementById("modalCarta")).show();
    }

    async function guardarMazo() {
        const payload = {
            nombre: nombreMazo.value,
            estado: estadoSelect.value,
            imagenCartaDestacada: cartaDestacada.value,
            mainDeck: { cartas: mazo.main },
            extraDeck: { cartas: mazo.extra },
            sideDeck: { cartas: mazo.side }
        };

        const options = {
            method: ID_MAZO ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        };

        const url = ID_MAZO ? `/MazoAPI/${ID_MAZO}` : `/MazoAPI`;

        const resp = await fetch(url, options);
        if (!resp.ok) {
            alert("Error guardando el mazo");
            return;
        }

        const data = await resp.json();
        alert("Mazo guardado correctamente");

        if (!ID_MAZO) {
            window.location.href = `/user/constructorMazos/${data.id}`;
        }
    }

    btnSave.addEventListener("click", guardarMazo);

    btnDelete.addEventListener("click", () => {
        if (!confirm("¿Estás seguro que deseas eliminar el mazo?")) return;
        if (!ID_MAZO) { alert("No hay mazo para eliminar"); return; }
        fetch(`/MazoAPI/${ID_MAZO}`, { method: "DELETE" })
            .then(r => { if (r.ok) { alert("Mazo eliminado"); window.location.href = "/constructorMazos"; } });
    });

    cargarMazoExistente();
});
