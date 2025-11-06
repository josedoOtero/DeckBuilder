document.addEventListener("DOMContentLoaded", () => {
    console.log("Script verCartas cargado");

    const filtros = document.querySelector("#filtros_cartas");
    const listaCartas = document.querySelector("#lista_cartas .row");
    const detalles = document.querySelector("#detalles_carta");
    let cartasFiltradas = [];

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
                if (response.status === 400) {
                    listaCartas.innerHTML = `
                        <p class="text-center text-muted mt-3">No cards found with those filters.</p>
                    `;
                    return;
                } else {
                    throw new Error("Error fetching cards");
                }
            }

            const data = await response.json();
            let cartas = data.data;

            // Aplicar filtros de ataque/defensa localmente
            cartas = cartas.filter(c => {
                if (atkMin !== null && c.atk < atkMin) return false;
                if (atkMax !== null && c.atk > atkMax) return false;
                if (defMin !== null && c.def < defMin) return false;
                if (defMax !== null && c.def > defMax) return false;
                return true;
            });

            if (cartas.length === 0) {
                listaCartas.innerHTML = `
                    <p class="text-center text-muted mt-3">No cards found.</p>
                `;
                return;
            }

            cartasFiltradas = cartas;
            mostrarCartas(cartas, listaCartas);

        } catch (error) {
            console.error("Error loading cards:", error);
            listaCartas.innerHTML = `
                <p class="text-center text-muted mt-3">Error loading cards. Please try again.</p>
            `;
        }
    });
});

function mostrarCartas(cartas, listaCartas) {
    listaCartas.className = "row row-cols-2 row-cols-md-5 g-0";
    listaCartas.innerHTML = "";

    if (!cartas || cartas.length === 0) {
        listaCartas.innerHTML = "<p class='text-center text-muted'>No cards found</p>";
        return;
    }

    cartas.forEach(carta => {
        const col = document.createElement("div");
        col.classList.add("col", "d-flex", "justify-content-center");

        const idKonami = carta.misc_info?.[0]?.konami_id ?? "Unknown";

        col.innerHTML = `
            <div class="card border-0 text-center" style="width:180px; background:transparent;">
                <img src="${carta.card_images[0].image_url}"
                     alt="${carta.name}"
                     class="card-img-top"
                     style="height:255px; object-fit:contain;">
                <div class="card-body p-1">
                    <button class="btn btn-sm btn-primary ver-mas"
                            data-id="${carta.id}"
                            data-idkonami="${idKonami}"
                            style="font-size:0.7rem; padding:2px 6px;">View more</button>
                </div>
            </div>
        `;

        listaCartas.appendChild(col);
    });

    listaCartas.querySelectorAll(".ver-mas").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const idKonami = e.target.getAttribute("data-idkonami");
            mostrarDetallesCarta(id, idKonami, document.querySelector("#zona_info"));
        });
    });
}

async function mostrarDetallesCarta(id, idKonami, zonaDetalles) {
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
        if (!response.ok) throw new Error("Failed to get card info.");

        const data = await response.json();
        const carta = data.data[0];

        zonaDetalles.innerHTML = `
            <div class="card mb-3 border-0" style="max-width: 700px;">
                <div class="row g-0">
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <img src="${carta.card_images[0].image_url}" class="img-fluid rounded-start" alt="${carta.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${carta.name}</h5>
                            <p><strong>Konami ID:</strong> ${idKonami}</p>
                            <p><strong>Type:</strong> ${carta.type || "N/A"}</p>
                            <p><strong>Archetype:</strong> ${carta.archetype || "N/A"}</p>
                            <p><strong>Attribute:</strong> ${carta.attribute || "N/A"}</p>
                            <p><strong>Level:</strong> ${carta.level || "N/A"}</p>
                            <p><strong>ATK / DEF:</strong> ${carta.atk || "N/A"} / ${carta.def || "N/A"}</p>
                            <p><strong>Description:</strong> ${carta.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        zonaDetalles.innerHTML = "<p class='text-danger'>Error showing card details.</p>";
    }
}