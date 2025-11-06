document.addEventListener("DOMContentLoaded", () => {
    console.log("Script crearMazo cargado");

    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");

    const mainDeck = document.querySelector("#main_deck");
    const extraDeck = document.querySelector("#extra_deck");
    const sideDeck = document.querySelector("#side_deck");

    let cartasFiltradas = [];
    let zonaSeleccionada = "main";
    const mazo = {
        main: [],
        extra: [],
        side: []
    };

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
        document.querySelectorAll("#zona_mazo .btn").forEach(btn => {
            btn.classList.remove("active-zone");
        });

        switch (zonaSeleccionada) {
            case "main":
                document.querySelector("#btnMain").classList.add("active-zone");
                break;
            case "extra":
                document.querySelector("#btnExtra").classList.add("active-zone");
                break;
            case "side":
                document.querySelector("#btnSide").classList.add("active-zone");
                break;
        }
    }


    filtros.addEventListener("submit", async (e) => {
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
                listaCartas.innerHTML = `<p class="text-center text-muted mt-3">No se encontraron cartas.</p>`;
                return;
            }

            cartasFiltradas = cartas;
            mostrarCartas(cartasFiltradas);
        } catch (error) {
            console.error("Error al cargar cartas:", error);
            listaCartas.innerHTML = `<p class="text-center text-danger mt-3">Error al cargar las cartas.</p>`;
        }
    });

    function mostrarCartas(cartas) {
        listaCartas.className = "row row-cols-2 row-cols-md-5 g-2";
        listaCartas.innerHTML = "";

        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");
            col.innerHTML = `
                <div class="card border-0 text-center" style="width:150px; background:transparent;">
                    <img src="${carta.card_images[0].image_url}"
                        alt="${carta.name}"
                        class="card-img-top"
                        style="height:210px; object-fit:contain;">
                    <div class="card-body p-1">
                        <button class="btn btn-sm btn-success agregar-mazo w-100"
                                data-id="${carta.id}"
                                style="font-size:0.7rem;">Añadir al mazo</button>
                    </div>
                </div>
            `;
            listaCartas.appendChild(col);
        });

        document.querySelectorAll(".agregar-mazo").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.getAttribute("data-id");
                const carta = cartasFiltradas.find(c => c.id == id);
                if (!carta) return;

                const zona = zonaSeleccionada || "main";
                if (mazo[zona].length >= 60) {
                    alert("Esta zona del mazo no puede tener más de 60 cartas.");
                    return;
                }

                mazo[zona].push(carta);
                mostrarMazo();
            });
        });
    }

    function mostrarMazo() {
        renderZona(mainDeck, mazo.main, "main");
        renderZona(extraDeck, mazo.extra, "extra");
        renderZona(sideDeck, mazo.side, "side");
    }

    function renderZona(container, cartas, zona) {
        container.querySelectorAll(".row").forEach(r => r.remove());

        if (cartas.length === 0) return;

        const row = document.createElement("div");
        row.className = "row row-cols-2 row-cols-md-5 g-1";

        cartas.forEach((carta, index) => {
            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");

            col.innerHTML = `
                <div class="card border-0 text-center" style="width:150px; background:transparent;">
                    <img src="${carta.card_images[0].image_url}"
                        alt="${carta.name}"
                        class="card-img-top"
                        style="height:210px; object-fit:contain;">
                    <div class="card-body p-1">
                        <button class="btn btn-sm btn-danger w-100 quitar-carta"
                                data-zona="${zona}"
                                data-index="${index}"
                                style="font-size:0.7rem;">Quitar</button>
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
            });
        });
    }

    actualizarBotones();
});