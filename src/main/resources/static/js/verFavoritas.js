// @ts-nocheck
// ...existing code...
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
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
        const resp = yield fetch("/UsuarioAPI/cartasFavoritas");
        if (!resp.ok) {
            listaCartas.innerHTML = "<p class='text-center text-muted'>Log in to view your favorites.</p>";
            return;
        }
        cartasFavoritasIDs = yield resp.json();
        if (cartasFavoritasIDs.length === 0) {
            listaCartas.innerHTML = "<p class='text-center text-muted mt-3'>No favorite cards yet.</p>";
            return;
        }
        const peticiones = cartasFavoritasIDs.map(id => fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`)
            .then(r => r.json())
            .catch(() => null));
        const resultados = yield Promise.all(peticiones);
        cartasCargadas = resultados
            .filter(r => r && r.data && r.data[0])
            .map(r => r.data[0]);
        mostrarPagina();
    }
    catch (e) {
        console.error(e);
        listaCartas.innerHTML = "<p class='text-danger text-center'>Error loading favorites.</p>";
    }
}));
function mostrarPagina() {
    const inicio = (paginaActual - 1) * cartasPorPagina;
    const fin = inicio + cartasPorPagina;
    const pagina = cartasCargadas.slice(inicio, fin);
    mostrarCartas(pagina, listaCartas);
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
function mostrarCartas(cartas, lista) {
    lista.className = "row row-cols-2 row-cols-md-6 g-1";
    lista.innerHTML = "";
    if (!cartas || cartas.length === 0) {
        lista.innerHTML = "<p class='text-center text-muted'>No cards found</p>";
        return;
    }
    cartas.forEach(carta => {
        var _a, _b, _c, _d;
        const col = document.createElement("div");
        col.classList.add("col", "d-flex", "justify-content-center");
        const idKonami = (_d = (_a = carta.konami_id) !== null && _a !== void 0 ? _a : (_c = (_b = carta.misc_info) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.konami_id) !== null && _d !== void 0 ? _d : carta.id;
        col.innerHTML = `
            <div class="card border-0 text-center w-100" style="background:transparent;">
                <div style="height:240px; width:100%; flex-shrink:0;">
                    <img src="${carta.card_images[0].image_url}"
                         alt="${carta.name}"
                         style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
                </div>
            </div>
        `;
        lista.appendChild(col);
        col.querySelector("img").addEventListener("click", () => {
            mostrarDetallesCarta(carta.id, idKonami, document.querySelector("#zona_info"));
        });
    });
}
function mostrarDetallesCarta(id, idKonami, zonaDetalles) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const r = yield fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${id}`);
            const data = yield r.json();
            const carta = data.data[0];
            const precios = (_b = (_a = carta.card_prices) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : {};
            const sets = (_c = carta.card_sets) !== null && _c !== void 0 ? _c : [];
            let html = `
        <div class="card shadow-lg mb-4 border-0" style="max-width: 900px;">
          <div class="card-header bg-dark text-white text-center py-3 rounded-top">
            <h4 class="mb-0">${carta.name}</h4>
          </div>

          <div class="card-body bg-light">

            <div class="row g-4">
              <div class="col-md-4 text-center">
                <img src="${carta.card_images[0].image_url}" class="img-fluid rounded shadow" style="max-height:260px;">
              </div>

              <div class="col-md-8">
                <h5 class="border-bottom pb-2">Información</h5>
                ${carta.type ? `<p><strong>Tipo:</strong> ${carta.type}</p>` : ""}
                ${carta.race ? `<p><strong>Tipo de Carta:</strong> ${carta.race}</p>` : ""}
                ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ""}
                ${carta.level ? `<p><strong>Nivel:</strong> ${carta.level}</p>` : ""}
                ${(carta.atk != null || carta.def != null)
                ? `<p><strong>ATK / DEF:</strong> ${(_d = carta.atk) !== null && _d !== void 0 ? _d : ""} / ${(_e = carta.def) !== null && _e !== void 0 ? _e : ""}</p>` : ""}
                ${carta.archetype ? `<p><strong>Arquetipo:</strong> ${carta.archetype}</p>` : ""}
              </div>
            </div>

            <hr>

            ${carta.desc ? `<h5>Descripción</h5><p class="bg-white p-3 rounded shadow-sm">${carta.desc}</p>` : ""}

            <h5 class="mt-4">Precios</h5>
            <div class="p-3 bg-white rounded shadow-sm">
              ${precios.cardmarket_price && precios.cardmarket_price !== "0.00" ? `<p><strong>Cardmarket:</strong> ${precios.cardmarket_price} €</p>` : ""}
              ${precios.tcgplayer_price && precios.tcgplayer_price !== "0.00" ? `<p><strong>TCGPlayer:</strong> ${precios.tcgplayer_price} €</p>` : ""}
              ${precios.ebay_price && precios.ebay_price !== "0.00" ? `<p><strong>eBay:</strong> ${precios.ebay_price} €</p>` : ""}
              ${precios.amazon_price && precios.amazon_price !== "0.00" ? `<p><strong>Amazon:</strong> ${precios.amazon_price} €</p>` : ""}
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
        </div>
        `;
            zonaDetalles.innerHTML = html;
            const favBtn = document.createElement("button");
            favBtn.className = "btn mt-2 btn-danger";
            favBtn.textContent = "Remove from favorites";
            favBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                const confirmar = confirm("¿Seguro que quieres eliminar esta carta de tus favoritas?");
                if (!confirmar)
                    return;
                yield fetch(`/UsuarioAPI/cartasFavoritas/${idKonami}`, { method: "DELETE" });
                // actualizar arrays locales
                cartasFavoritasIDs = cartasFavoritasIDs.filter(cid => cid !== idKonami);
                cartasCargadas = cartasCargadas.filter(c => {
                    var _a, _b, _c, _d;
                    const kid = (_d = (_a = c.konami_id) !== null && _a !== void 0 ? _a : (_c = (_b = c.misc_info) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.konami_id) !== null && _d !== void 0 ? _d : c.id;
                    return kid !== idKonami;
                });
                if ((paginaActual - 1) * cartasPorPagina >= cartasCargadas.length && paginaActual > 1) {
                    paginaActual--;
                }
                mostrarPagina();
                zonaDetalles.innerHTML = `
                <div class="alert alert-success mt-3">
                    Carta eliminada de favoritos.
                </div>
            `;
            });
            zonaDetalles.appendChild(favBtn);
        }
        catch (e) {
            zonaDetalles.innerHTML = "<p class='text-danger'>Error loading details.</p>";
        }
    });
}
