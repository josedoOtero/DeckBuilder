// @ts-nocheck
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cartasFavoritasIDs = [];
let cartasCargadas = [];
let paginaActual = 1;
const cartasPorPagina = 180;
let listaCartas;
document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
    listaCartas = document.querySelector("#lista_cartas .row");
    try {
        const resp = yield fetch(`${window.location.origin}/UsuarioAPI/cartasFavoritas`);
        if (!resp.ok) {
            listaCartas.innerHTML = "<p class='text-center text-muted'>Log in to view your favorites.</p>";
            return;
        }
        const jsonResponse = yield resp.text();
        try {
            cartasFavoritasIDs = JSON.parse(jsonResponse);
        }
        catch (e) {
            console.error("Error parsing JSON response:", e);
            listaCartas.innerHTML = "<p class='text-danger text-center'>Invalid server response.</p>";
            return;
        }
        if (cartasFavoritasIDs.length === 0) {
            listaCartas.innerHTML = "<p class='text-center text-muted mt-3'>No favorite cards yet.</p>";
            return;
        }
        const peticiones = cartasFavoritasIDs.map(id => fetch(`${window.location.origin}/api/v7/cardinfo.php?id=${id}`)
            .then(r => {
            if (!r.ok)
                throw new Error("Failed to fetch card info.");
            return r.json();
        })
            .catch(() => null));
        const resultados = yield Promise.all(peticiones);
        cartasCargadas = resultados
            .filter(r => r && r.data && r.data[0])
            .map(r => r.data[0]);
        mostrarPagina();
    }
    catch (e) {
        console.error("Error loading favorites:", e);
        listaCartas.innerHTML = "<p class='text-danger text-center'>Error loading favorites.</p>";
    }
}));
function mostrarPagina() {
    listaCartas.innerHTML = "";
    const inicio = (paginaActual - 1) * cartasPorPagina;
    const fin = inicio + cartasPorPagina;
    const cartasPagina = cartasCargadas.slice(inicio, fin);
    cartasPagina.forEach(carta => {
        const col = document.createElement("div");
        col.className = "col-md-2 mb-4";
        col.innerHTML = `
            <div class="card shadow-sm">
                <img src="${carta.card_images[0].image_url}" 
                     alt="Imagen de la carta ${carta.name}" 
                     class="img-fluid rounded shadow" 
                     style="max-height:260px;">
                <div class="card-body">
                    <h5 class="card-title text-center">${carta.name}</h5>
                </div>
            </div>`;
        listaCartas.appendChild(col);
    });
    renderizarPaginacion();
}
function renderizarPaginacion() {
    let cont = document.getElementById("paginacion");
    cont.innerHTML = "";
    const total = Math.ceil(cartasCargadas.length / cartasPorPagina);
    if (total <= 1)
        return;
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
    let i1 = Math.max(1, paginaActual - 3);
    let i2 = Math.min(total, paginaActual + 3);
    for (let i = i1; i <= i2; i++) {
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
function mostrarDetallesCarta(id, idKonami, zonaDetalles) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const r = yield fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            const data = yield r.json();
            const carta = data.data[0];
            const precios = carta.card_prices?.[0] || {};
            const sets = carta.card_sets || [];

            zonaDetalles.innerHTML = `
                <div class="card shadow-lg mb-4 border-0" style="max-width: 900px;">
                    <div class="card-header bg-dark text-white text-center py-3 rounded-top">
                        <h4 class="mb-0">${carta.name}</h4>
                    </div>
                    <div class="card-body bg-light">
                        <div class="row g-4">
                            <div class="col-md-4 text-center">
                                <img src="${carta.card_images[0].image_url}" 
                                     alt="Imagen de la carta ${carta.name}" 
                                     class="img-fluid rounded shadow" 
                                     style="max-height:260px;">
                            </div>
                            <div class="col-md-8">
                                <h5 class="border-bottom pb-2">Información</h5>
                                ${carta.type ? `<p><strong>Tipo:</strong> ${carta.type}</p>` : ""}
                                ${carta.race ? `<p><strong>Tipo de Carta:</strong> ${carta.race}</p>` : ""}
                                ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ""}
                                ${carta.level ? `<p><strong>Nivel:</strong> ${carta.level}</p>` : ""}
                                ${(carta.atk != null || carta.def != null)
                                    ? `<p><strong>ATK / DEF:</strong> ${carta.atk || ""} / ${carta.def || ""}</p>` : ""}
                                ${carta.archetype ? `<p><strong>Arquetipo:</strong> ${carta.archetype}</p>` : ""}
                            </div>
                        </div>
                        <hr>
                        ${carta.desc ? `<h5>Descripción</h5><p class="bg-white p-3 rounded shadow-sm">${carta.desc}</p>` : ""}
                        <h5 class="mt-4">Precios</h5>
                        <div class="p-3 bg-white rounded shadow-sm">
                            ${precios.cardmarket_price ? `<p><strong>Cardmarket:</strong> ${precios.cardmarket_price} €</p>` : ""}
                            ${precios.tcgplayer_price ? `<p><strong>TCGPlayer:</strong> ${precios.tcgplayer_price} €</p>` : ""}
                            ${precios.ebay_price ? `<p><strong>eBay:</strong> ${precios.ebay_price} €</p>` : ""}
                            ${precios.amazon_price ? `<p><strong>Amazon:</strong> ${precios.amazon_price} €</p>` : ""}
                        </div>
                        ${sets.length > 0 ? `
                        <h5 class="mt-4">Sets disponibles</h5>
                        <ul class="list-group mb-3">
                            ${sets.map(s => `
                                <li class="list-group-item">
                                    <strong>${s.set_name}</strong><br>
                                    Rarity: ${s.set_rarity}<br>
                                    Code: ${s.set_code}
                                </li>`).join("")}
                        </ul>` : ""}
                    </div>
                </div>`;
        } catch (e) {
            zonaDetalles.innerHTML = "<p class='text-danger'>Error loading details.</p>";
        }
    });
}
