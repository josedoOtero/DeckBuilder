let cartasFavoritasIDs = [];
let cartasCargadas = [];
let paginaActual = 1;
const cartasPorPagina = 24;

let listaCartas;
let zonaDetalles;

document.addEventListener("DOMContentLoaded", async () => {
    listaCartas = document.querySelector("#lista_cartas .row");
    zonaDetalles = document.getElementById("detalles_carta");

    try {
        const resp = await fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas`);

        if (!resp.ok) {
            listaCartas.innerHTML = "<p class='text-center text-muted'>Log in to view your favorites.</p>";
            return;
        }

        cartasFavoritasIDs = await resp.json();

        if (!Array.isArray(cartasFavoritasIDs) || cartasFavoritasIDs.length === 0) {
            listaCartas.innerHTML = "<p class='text-center text-muted mt-3'>No favorite cards yet.</p>";
            return;
        }

        const peticiones = cartasFavoritasIDs.map(id =>
            fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
        );

        const resultados = await Promise.all(peticiones);

        cartasCargadas = resultados
            .filter(r => r && r.data && r.data[0])
            .map(r => r.data[0]);

        mostrarPagina();

    } catch (e) {
        console.error(e);
        listaCartas.innerHTML = "<p class='text-danger text-center'>Error loading favorites.</p>";
    }
});

function mostrarPagina() {
    listaCartas.innerHTML = "";

    const inicio = (paginaActual - 1) * cartasPorPagina;
    const fin = inicio + cartasPorPagina;
    const cartasPagina = cartasCargadas.slice(inicio, fin);

    cartasPagina.forEach(carta => {
        const col = document.createElement("div");
        col.className = "col-md-2 mb-4";

        col.innerHTML = `
            <div class="card shadow-sm h-100" style="cursor:pointer">
                <img src="${carta.card_images[0].image_url}"
                     class="img-fluid rounded shadow"
                     style="max-height:260px;">
                <div class="card-body p-2">
                    <h6 class="card-title text-center">${carta.name}</h6>
                </div>
            </div>
        `;

        col.onclick = () => mostrarDetallesCarta(carta.id);

        listaCartas.appendChild(col);
    });

    renderizarPaginacion();
}

function renderizarPaginacion() {
    const cont = document.getElementById("paginacion");
    cont.innerHTML = "";

    const total = Math.ceil(cartasCargadas.length / cartasPorPagina);
    if (total <= 1) return;

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

    const inicio = Math.max(1, paginaActual - 3);
    const fin = Math.min(total, paginaActual + 3);

    for (let i = inicio; i <= fin; i++) {
        const b = document.createElement("button");
        b.className = `btn mx-1 ${i === paginaActual ? "btn-primary" : "btn-outline-primary"}`;
        b.textContent = i;
        b.onclick = () => {
            paginaActual = i;
            mostrarPagina();
            window.scrollTo(0, 0);
        };
        cont.appendChild(b);
    }

    const btnNext = document.createElement("button");
    btnNext.className = "btn btn-secondary mx-1";
    btnNext.textContent = "Next »";
    btnNext.disabled = paginaActual === total;
    btnNext.onclick = () => {
        paginaActual++;
        mostrarPagina();
        window.scrollTo(0, 0);
    };
    cont.appendChild(btnNext);
}

async function mostrarDetallesCarta(id) {
    try {
        zonaDetalles.innerHTML = "<p class='text-center text-muted'>Loading...</p>";

        const r = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
        const data = await r.json();

        const carta = data.data[0];
        const precios = carta.card_prices?.[0] || {};
        const sets = carta.card_sets || [];
        const idKonami = carta.konami_id ?? carta.id;

        zonaDetalles.innerHTML = `
            <div class="card shadow-lg border-0">
                <div class="card-header bg-dark text-white text-center">
                    <h4 class="mb-0">${carta.name}</h4>
                </div>

                <div class="card-body bg-light">
                    <div class="row g-3">
                        <div class="col-md-4 text-center">
                            <img src="${carta.card_images[0].image_url}"
                                 class="img-fluid rounded shadow"
                                 style="max-height:260px;">
                        </div>

                        <div class="col-md-8">
                            <h5>Information</h5>
                            ${carta.type ? `<p><strong>Type:</strong> ${carta.type}</p>` : ""}
                            ${carta.race ? `<p><strong>Race:</strong> ${carta.race}</p>` : ""}
                            ${carta.attribute ? `<p><strong>Attribute:</strong> ${carta.attribute}</p>` : ""}
                            ${carta.level ? `<p><strong>Level:</strong> ${carta.level}</p>` : ""}
                            ${(carta.atk != null || carta.def != null)
            ? `<p><strong>ATK / DEF:</strong> ${carta.atk ?? ""} / ${carta.def ?? ""}</p>` : ""}
                            ${carta.archetype ? `<p><strong>Archetype:</strong> ${carta.archetype}</p>` : ""}
                        </div>
                    </div>

                    <hr>

                    <h5>Description</h5>
                    <p class="bg-white p-3 rounded shadow-sm">${carta.desc}</p>

                    <h5 class="mt-3">Prices</h5>
                    <div class="bg-white p-3 rounded shadow-sm">
                        ${precios.cardmarket_price ? `<p>Cardmarket: ${precios.cardmarket_price} €</p>` : ""}
                        ${precios.tcgplayer_price ? `<p>TCGPlayer: ${precios.tcgplayer_price} €</p>` : ""}
                        ${precios.ebay_price ? `<p>eBay: ${precios.ebay_price} €</p>` : ""}
                        ${precios.amazon_price ? `<p>Amazon: ${precios.amazon_price} €</p>` : ""}
                    </div>

                    ${sets.length > 0 ? `
                        <h5 class="mt-3">Available Sets</h5>
                        <ul class="list-group">
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

        try {
            const favResp = await fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas`);
            if (!favResp.ok) throw new Error("Usuario no autenticado");

            let favoritas = await favResp.json();
            let esFavorita = favoritas.includes(idKonami);

            const favBtn = document.createElement("button");
            favBtn.className = "btn mt-2";

            const actualizarBoton = (favorita) => {
                if (favorita) {
                    favBtn.textContent = "Quitar de favoritas";
                    favBtn.classList.replace("btn-success", "btn-danger");
                    if (!favBtn.classList.contains("btn-danger")) favBtn.classList.add("btn-danger");
                } else {
                    favBtn.textContent = "Agregar a favoritas";
                    favBtn.classList.replace("btn-danger", "btn-success");
                    if (!favBtn.classList.contains("btn-success")) favBtn.classList.add("btn-success");
                }
            };

            actualizarBoton(esFavorita);

            favBtn.onclick = async () => {
                if (esFavorita) {
                    await fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas/${idKonami}`, { method: "DELETE" });
                    esFavorita = false;
                } else {
                    await fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas/${idKonami}`, { method: "POST" });
                    esFavorita = true;
                }
                actualizarBoton(esFavorita);
                await recargarFavoritas();
            };

            zonaDetalles.appendChild(favBtn);

        } catch (err) {
            console.log("Unauthenticated user, favorites button hidden");
        }

    } catch (e) {
        console.error(e);
        zonaDetalles.innerHTML = "<p class='text-danger'>Error loading card details.</p>";
    }
}

async function recargarFavoritas() {
    try {
        const resp = await fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas`);
        if (!resp.ok) return;
        cartasFavoritasIDs = await resp.json();

        if (cartasFavoritasIDs.length === 0) {
            cartasCargadas = [];
            listaCartas.innerHTML = "<p class='text-center text-muted mt-3'>No favorite cards yet.</p>";
            return;
        }

        const peticiones = cartasFavoritasIDs.map(id =>
            fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
        );

        const resultados = await Promise.all(peticiones);

        cartasCargadas = resultados
            .filter(r => r && r.data && r.data[0])
            .map(r => r.data[0]);

        paginaActual = 1;
        mostrarPagina();

    } catch (err) {
        console.error("Error reloading favorites:", err);
    }
}