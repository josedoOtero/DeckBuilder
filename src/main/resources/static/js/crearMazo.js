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

    async function cargarMazoSiExiste() {
        if (!ID_MAZO) return;

        try {
            const response = await fetch(`/MazoAPI/${ID_MAZO}`);
            if (!response.ok) throw new Error("No se pudo cargar el mazo");

            const data = await response.json();

            nombreMazo.value = data.nombre || "";
            estadoSelect.value = data.estado || "publico";

            mazo.main = data.mainDeck?.cartas?.map(c => ({ idKonami: c.idKonami })) || [];
            mazo.extra = data.extraDeck?.cartas?.map(c => ({ idKonami: c.idKonami })) || [];
            mazo.side = data.sideDeck?.cartas?.map(c => ({ idKonami: c.idKonami })) || [];

            const ids = [...mazo.main, ...mazo.extra, ...mazo.side].map(c => c.idKonami);

            if (ids.length > 0) {
                const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${ids.join(",")}`;
                const res = await fetch(url);
                const cartaData = await res.json();
                cartasFiltradas = cartaData.data;
            }

            mostrarMazo();
            actualizarCartaDestacada();

            setTimeout(() => {
                cartaDestacada.value = data.imagenCartaDestacada || "";
            }, 200);
        } catch (error) {
            console.error("Error al cargar mazo existente:", error);
        }
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
                return;
            }

            cartasFiltradas = cartas;
            mostrarCartas(cartasFiltradas);
        } catch (error) {
            console.error("Error al cargar cartas:", error);
            listaCartas.innerHTML = '<p class="text-center text-danger mt-3">Error al cargar las cartas.</p>';
        }
    });

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
        actualizarCartaDestacada();
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
                <div style="height:210px; width:100%;">
                    <img src="${imgSrc}" alt="${name}" style="width:100%; height:100%; object-fit:contain;">
                </div>
                <div class="card-body p-0">
                    <button class="btn btn-sm btn-danger w-100 quitar-carta" data-zona="${zona}" data-index="${index}" style="font-size:0.7rem;">Quitar</button>
                </div>
            </div>
            `;
            row.appendChild(col);
        });

        container.querySelectorAll(".quitar-carta").forEach(boton => {
            boton.addEventListener("click", e => {
                const zona = e.target.dataset.zona;
                const index = e.target.dataset.index;
                mazo[zona].splice(index, 1);
                mostrarMazo();
                actualizarCartaDestacada();
            });
        });
    }

    function mostrarMazo() {
        renderZona(mainDeck, mazo.main, "main");
        renderZona(extraDeck, mazo.extra, "extra");
        renderZona(sideDeck, mazo.side, "side");
    }

    function actualizarCartaDestacada() {
        const todas = [...mazo.main, ...mazo.extra, ...mazo.side];
        const idsUnicos = [...new Set(todas.map(c => c.idKonami))];

        cartaDestacada.innerHTML = '<option value="">Featured card</option>';

        idsUnicos.forEach(id => {
            const cartaInfo = cartasFiltradas.find(c => c.id === id);
            if (cartaInfo) {
                const opt = document.createElement("option");
                opt.value = cartaInfo.card_images[0].image_url;
                opt.textContent = cartaInfo.name;
                cartaDestacada.appendChild(opt);
            }
        });
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
            // No hay mazo creado, simplemente redirigir
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

                // Limpiar localmente
                Object.keys(mazo).forEach(k => mazo[k] = []);
                mostrarMazo();
                actualizarCartaDestacada();
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