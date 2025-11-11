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

    let cartasFiltradas = [];
    let zonaSeleccionada = "main";
    const mazo = { main: [], extra: [], side: [] };

    document.querySelector("#btnMain").addEventListener("click", () => {
        zonaSeleccionada = "main";
        actualizarBotones();
    });
    document.querySelector("#btnExtra").addEventListener("click", () => {
        zonaSeleccionada = "extra";
        actualizarBotones();
    });
    document.querySelector("#btnSide").addEventListener("click", () => {
        zonaSeleccionada = "side";
        actualizarBotones();
    });

    function actualizarBotones() {
        document.querySelectorAll("#zona_mazo .btn").forEach(btn => btn.classList.remove("active-zone"));
        if (zonaSeleccionada === "main") document.querySelector("#btnMain").classList.add("active-zone");
        if (zonaSeleccionada === "extra") document.querySelector("#btnExtra").classList.add("active-zone");
        if (zonaSeleccionada === "side") document.querySelector("#btnSide").classList.add("active-zone");
    }

    // Buscar cartas
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

    // Mostrar cartas filtradas
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

    // Agregar carta a mazo
    function agregarCartaAlMazo(carta, zona) {
        const idKonami = carta.id; // identificador único
        const totalCopias = [...mazo.main, ...mazo.extra, ...mazo.side]
            .filter(c => c.idKonami === idKonami).length;

        if (totalCopias >= 3) {
            alert("No puedes tener más de 3 copias de la misma carta en tu mazo.");
            return;
        }

        if (mazo[zona].length >= 60) {
            alert("Esta zona del mazo no puede tener más de 60 cartas.");
            return;
        }

        const tipo = carta.type || "";
        if (zona === "extra") {
            const tiposExtra = ["Fusion Monster", "Synchro Monster", "XYZ Monster", "Link Monster", "Pendulum Monster"];
            if (!tiposExtra.includes(tipo)) {
                alert("Solo puedes agregar cartas del Extra Deck (Fusión, Synchro, XYZ, Link, Pendulum) a esta zona.");
                return;
            }
        } else if (zona === "main") {
            const tiposExtra = ["Fusion Monster", "Synchro Monster", "XYZ Monster", "Link Monster"];
            if (tiposExtra.includes(tipo)) {
                alert("No puedes agregar cartas del Extra Deck al Main Deck.");
                return;
            }
        }

        mazo[zona].push({ idKonami });
        mostrarMazo();
        actualizarCartaDestacada();
    }

    // Render de cada zona del mazo
    function renderZona(container, cartas, zona) {
        container.querySelectorAll(".row").forEach(r => r.remove());
        if (cartas.length === 0) return;

        const row = document.createElement("div");
        row.className = "row row-cols-5 g-1";

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

        container.appendChild(row);

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

    // Mostrar el mazo completo
    function mostrarMazo() {
        renderZona(mainDeck, mazo.main, "main");
        renderZona(extraDeck, mazo.extra, "extra");
        renderZona(sideDeck, mazo.side, "side");
    }

    // Actualizar el selector de carta destacada
    function actualizarCartaDestacada() {
        cartaDestacada.innerHTML = '<option value="">Featured card</option>';
        const todasLasCartas = [...mazo.main, ...mazo.extra, ...mazo.side];

        todasLasCartas.forEach(carta => {
            const cartaInfo = cartasFiltradas.find(c => c.id === carta.idKonami);
            if (cartaInfo) {
                const option = document.createElement("option");
                option.value = cartaInfo.id;
                option.textContent = cartaInfo.name;
                cartaDestacada.appendChild(option);
            }
        });
    }

    // Guardar mazo
    btnSave.addEventListener("click", async () => {
        if (mazo.main.length === 0 && mazo.extra.length === 0 && mazo.side.length === 0) {
            alert("No puedes guardar un mazo vacío.");
            return;
        }

        const nuevoMazo = {
            estado: estadoSelect.value,
            imagenCartaDestacada: cartaDestacada.value || null,
            mainDeck: { cartas: mazo.main.map(c => ({ idKonami: c.idKonami })) },
            extraDeck: { cartas: mazo.extra.map(c => ({ idKonami: c.idKonami })) },
            sideDeck: { cartas: mazo.side.map(c => ({ idKonami: c.idKonami })) }
        };

        try {
            const response = await fetch("/MazoAPI", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoMazo)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Respuesta del servidor:", errorText);
                throw new Error("Error al guardar el mazo");
            }

            const data = await response.json();
            alert(`Mazo guardado con éxito (ID: ${data.id})`);
        } catch (error) {
            console.error("Error al guardar el mazo:", error);
            alert("Error al guardar el mazo");
        }
    });


    // Eliminar mazo
    btnDelete.addEventListener("click", () => {
        if (confirm("¿Seguro que quieres eliminar este mazo?")) {
            Object.keys(mazo).forEach(k => mazo[k] = []);
            mostrarMazo();
            actualizarCartaDestacada();
            nombreMazo.value = "";
        }
    });

    actualizarBotones();
});