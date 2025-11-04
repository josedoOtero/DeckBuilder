document.addEventListener("DOMContentLoaded", () => {
    console.log("Script verCartas cargado");

    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");
    const zonaMazo = document.querySelector("#zona_mazo");
    let cartasFiltradas = [];
    let mazo = [];

    filtros.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(filtros);
        const params = new URLSearchParams();

        let atkMin = null, atkMax = null, defMin = null, defMax = null;

        for (const [key, value] of formData.entries()) {
            if (!value.trim()) continue;
            const val = value.trim();

            switch (key) {
                case "q":
                    params.append("fname", val);
                    break;
                case "tipo":
                    params.append("type", val);
                    break;
                case "tipoCarta":
                    params.append("race", val);
                    break;
                case "arquetipo":
                    params.append("archetype", val);
                    break;
                case "atributo":
                    params.append("attribute", val);
                    break;
                case "nivel":
                    params.append("level", val);
                    break;
                case "familia":
                    params.append("race", val);
                    break;
                case "atkMin":
                    atkMin = parseInt(val);
                    break;
                case "atkMax":
                    atkMax = parseInt(val);
                    break;
                case "defMin":
                    defMin = parseInt(val);
                    break;
                case "defMax":
                    defMax = parseInt(val);
                    break;
                default:
                    params.append(key, val);
            }
        }

        const queryString = params.toString();
        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${encodeURI(queryString)}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                listaCartas.innerHTML = `
                    <p class="text-center text-muted mt-3">No se encontraron cartas con esos filtros.</p>
                `;
                return;
            }

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
                listaCartas.innerHTML = `
                    <p class="text-center text-muted mt-3">No se encontraron cartas.</p>
                `;
                return;
            }

            cartasFiltradas = cartas;
            mostrarCartas(cartasFiltradas);

        } catch (error) {
            console.error("Error al cargar las cartas:", error);
            listaCartas.innerHTML = `
                <p class="text-center text-danger mt-3">Error al cargar las cartas. Intenta de nuevo.</p>
            `;
        }
    });

    function mostrarCartas(cartas) {
        listaCartas.className = "row row-cols-2 row-cols-md-5 g-1";
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
                                style="font-size:0.7rem; padding:3px 6px;">Añadir al mazo</button>
                    </div>
                </div>
            `;

            listaCartas.appendChild(col);
        });

        document.querySelectorAll(".agregar-mazo").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                const carta = cartasFiltradas.find(c => c.id == id);
                if (!carta) return;

                if (mazo.length >= 60) {
                    alert("El mazo no puede tener más de 60 cartas.");
                    return;
                }

                mazo.push(carta);
                mostrarMazo();
            });
        });
    }

    function mostrarMazo() {
        if (!zonaMazo) return;

        zonaMazo.innerHTML = "";

        if (mazo.length === 0) {
            zonaMazo.innerHTML = `
                <p class="text-center text-muted">No hay cartas en el mazo.</p>
            `;
            return;
        }

        const row = document.createElement("div");
        row.className = "row row-cols-2 row-cols-md-5 g-1";

        mazo.forEach((carta, index) => {
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
                                data-index="${index}"
                                style="font-size:0.7rem; padding:3px 6px;">Quitar</button>
                    </div>
                </div>
            `;

            row.appendChild(col);
        });

        zonaMazo.appendChild(row);

        document.querySelectorAll(".quitar-carta").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                mazo.splice(index, 1);
                mostrarMazo();
            });
        });
    }
});

