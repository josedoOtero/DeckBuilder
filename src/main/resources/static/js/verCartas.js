let cartasFiltradas = [];
let paginaActual = 1;
const cartasPorPagina = 180;
let listaCartas;

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script verCartas cargado");

    const filtros = document.querySelector("#filtros_cartas");
    listaCartas = document.querySelector("#lista_cartas .row");
    const detalles = document.querySelector("#detalles_carta");

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

                default: params.append(key, val); break;
            }
        }

        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?${params.toString()}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                listaCartas.innerHTML = `<p class="text-center text-muted mt-3">No cards found.</p>`;
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
                listaCartas.innerHTML = `<p class="text-center text-muted mt-3">No cards found.</p>`;
                return;
            }

            cartasFiltradas = cartas;
            paginaActual = 1;

            mostrarPagina();

        } catch (error) {
            console.error("Error loading cards:", error);
            listaCartas.innerHTML = `<p class="text-center text-danger">Error loading cards.</p>`;
        }
    });
});

function mostrarPagina() {
    const inicio = (paginaActual - 1) * cartasPorPagina;
    const fin = inicio + cartasPorPagina;

    const cartasPagina = cartasFiltradas.slice(inicio, fin);

    mostrarCartas(cartasPagina, listaCartas);
    renderizarPaginacion();
}

function renderizarPaginacion() {
    let cont = document.getElementById("paginacion");

    if (!cont) {
        cont = document.createElement("div");
        cont.id = "paginacion";
        cont.className = "mt-3 text-center";
        listaCartas.parentElement.appendChild(cont);
    }

    cont.innerHTML = "";

    const totalPaginas = Math.ceil(cartasFiltradas.length / cartasPorPagina);
    if (totalPaginas <= 1) return;

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn btn-secondary mx-1";
    btnPrev.textContent = "« Prev";
    btnPrev.disabled = paginaActual === 1;
    btnPrev.onclick = () => {
        paginaActual--;
        mostrarPagina();
        window.scrollTo(0, 0);
    };
    cont.appendChild(btnPrev);

    let inicio = Math.max(1, paginaActual - 3);
    let fin = Math.min(totalPaginas, paginaActual + 3);

    for (let i = inicio; i <= fin; i++) {
        const btn = document.createElement("button");
        btn.className = `btn mx-1 ${i === paginaActual ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;

        btn.onclick = () => {
            paginaActual = i;
            mostrarPagina();
            window.scrollTo(0, 0);
        };

        cont.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.className = "btn btn-secondary mx-1";
    btnNext.textContent = "Next »";
    btnNext.disabled = paginaActual === totalPaginas;
    btnNext.onclick = () => {
        paginaActual++;
        mostrarPagina();
        window.scrollTo(0, 0);
    };
    cont.appendChild(btnNext);
}

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

        // ✔ FIX FINAL: idKonami siempre existe
        const idKonami =
            carta.konami_id ??
            carta.misc_info?.[0]?.konami_id ??
            carta.id;

        col.innerHTML = `
            <div class="card border-0 text-center w-100" style="background:transparent;">
                <div style="height:240px; width:100%; flex-shrink:0;">
                    <img src="${carta.card_images[0].image_url}"
                         alt="${carta.name}"
                         style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
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

        // Datos seguros
        const precios = carta.card_prices?.[0] ?? {};
        const sets = carta.card_sets ?? [];

        // Función auxiliar para mostrar solo precio válido
        const mostrarPrecio = (titulo, valor) =>
            valor && valor !== "0.00"
                ? `<p class="mb-1"><strong>${titulo}:</strong> ${valor} €</p>`
                : "";

        let html = `
        <div class="card shadow-lg mb-4 border-0" style="max-width: 900px;">
          <div class="card-header bg-dark text-white text-center py-3 rounded-top">
            <h4 class="mb-0">${carta.name}</h4>
          </div>

          <div class="card-body bg-light">

            <!-- FILA PRINCIPAL -->
            <div class="row g-4">
              <div class="col-md-4 text-center">
                <img src="${carta.card_images[0].image_url}" class="img-fluid rounded shadow" style="max-height:260px; object-fit:contain;">
              </div>

              <div class="col-md-8">

                <h5 class="border-bottom pb-2">Información</h5>

                ${carta.type ? `<p><strong>Tipo:</strong> ${carta.type}</p>` : ""}
                ${carta.race ? `<p><strong>Tipo de Carta:</strong> ${carta.race}</p>` : ""}
                ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ""}
                ${carta.level ? `<p><strong>Nivel / Rango:</strong> ${carta.level}</p>` : ""}
                ${carta.linkval ? `<p><strong>Link:</strong> ${carta.linkval}</p>` : ""}
                ${(carta.atk != null || carta.def != null)
            ? `<p><strong>ATK / DEF:</strong> ${carta.atk ?? ""} / ${carta.def ?? ""}</p>`
            : ""}
                ${carta.archetype ? `<p><strong>Arquetipo:</strong> ${carta.archetype}</p>` : ""}
              </div>
            </div>

            <hr>

            <!-- DESCRIPCIÓN -->
            ${carta.desc ? `
            <h5 class="mt-3">Descripción</h5>
            <p class="bg-white p-3 rounded shadow-sm">${carta.desc}</p>
            ` : ""}

            <!-- PRECIOS -->
            <h5 class="mt-4">Precios de mercado</h5>
            <div class="p-3 bg-white rounded shadow-sm">
              ${mostrarPrecio("Cardmarket", precios.cardmarket_price)}
              ${mostrarPrecio("TCGPlayer", precios.tcgplayer_price)}
              ${mostrarPrecio("eBay", precios.ebay_price)}
              ${mostrarPrecio("Amazon", precios.amazon_price)}
            </div>

            <!-- SETS -->
            ${sets.length > 0 ? `
            <h5 class="mt-4">Sets disponibles</h5>
            <ul class="list-group mb-3">
              ${sets.map(s => `
                <li class="list-group-item">
                  <strong>${s.set_name}</strong><br>
                  Rarity: ${s.set_rarity}<br>
                  Code: ${s.set_code}
                </li>
              `).join("")}
            </ul>
            ` : ""}

          </div>
        </div>
        `;

        zonaDetalles.innerHTML = html;

        // -------------------------------
        // FAVORITAS: NO TOCO TU LÓGICA
        // -------------------------------
        try {
            const favResponse = await fetch("/UsuarioAPI/cartasFavoritas");
            if (!favResponse.ok) throw new Error("Usuario no autenticado");

            const cartasFavoritas = await favResponse.json();
            const esFavorita = cartasFavoritas.includes(idKonami);

            const favBtn = document.createElement("button");
            favBtn.className = "btn mt-2";

            if (esFavorita) {
                favBtn.textContent = "Quitar de favoritas";
                favBtn.classList.add("btn-danger");

                favBtn.onclick = async () => {
                    await fetch(`/UsuarioAPI/cartasFavoritas/${idKonami}`, { method: "DELETE" });
                    favBtn.textContent = "Agregar a favoritas";
                    favBtn.classList.replace("btn-danger", "btn-success");
                };

            } else {
                favBtn.textContent = "Agregar a favoritas";
                favBtn.classList.add("btn-success");

                favBtn.onclick = async () => {
                    await fetch(`/UsuarioAPI/cartasFavoritas/${idKonami}`, { method: "POST" });
                    favBtn.textContent = "Quitar de favoritas";
                    favBtn.classList.replace("btn-success", "btn-danger");
                };
            }

            zonaDetalles.appendChild(favBtn);

        } catch (e) {
            console.log("Usuario no autenticado, oculto botón de favoritas");
        }

    } catch (error) {
        console.error(error);
        zonaDetalles.innerHTML = "<p class='text-danger'>Error al cargar los detalles de la carta.</p>";
    }
}