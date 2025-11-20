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
    listaCartas.className = "row row-cols-2 row-cols-md-6 g-1";
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
            <div class="card border-0 text-center w-100 d-flex flex-column" style="background:transparent;">
                <div style="height:240px; width:100%; flex-shrink:0;">
                    <img src="${carta.card_images[0].image_url}"
                         alt="${carta.name}"
                         style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
                </div>
                <div class="card-body p-1 flex-grow-1 d-flex flex-column justify-content-start">
                    <!-- Puedes añadir info mínima aquí si quieres -->
                </div>
            </div>
        `;

        listaCartas.appendChild(col);

        col.querySelector("img").addEventListener("click", () => {
            mostrarDetallesCarta(carta.id, idKonami, document.querySelector("#zona_info"));
        });
    });
}

async function mostrarDetallesCarta(id, idKonami, zonaDetalles) {
    try {
        const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
        if (!response.ok) throw new Error("Failed to get card info.");

        const data = await response.json();
        const carta = data.data[0];

        let html = `
            <div class="card mb-3 border-0" style="max-width: 700px;">
                <div class="d-flex flex-column align-items-center">
                    <div style="width:240px; height:240px; flex-shrink:0;">
                        <img src="${carta.card_images[0].image_url}" class="img-fluid" alt="${carta.name}" style="object-fit:contain; width:100%; height:100%;">
                    </div>
                    <div class="w-100 mt-2">
                        <div class="card-body p-2">
                            <h5 class="card-title">${carta.name}</h5>
                            <p><strong>Konami ID:</strong> ${idKonami}</p>
        `;

        if (carta.type) html += `<p><strong>Type:</strong> ${carta.type}</p>`;
        if (carta.archetype) html += `<p><strong>Archetype:</strong> ${carta.archetype}</p>`;
        if (carta.attribute) html += `<p><strong>Attribute:</strong> ${carta.attribute}</p>`;
        if (carta.level) html += `<p><strong>Level:</strong> ${carta.level}</p>`;
        if (carta.atk != null || carta.def != null) html += `<p><strong>ATK / DEF:</strong> ${carta.atk != null ? carta.atk : ''} ${carta.def != null ? '/ ' + carta.def : ''}</p>`;
        if (carta.desc) html += `<p><strong>Description:</strong> ${carta.desc}</p>`;

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        zonaDetalles.innerHTML = html;

    } catch (error) {
        console.error(error);
        zonaDetalles.innerHTML = "<p class='text-danger'>Error showing card details.</p>";
    }
}
