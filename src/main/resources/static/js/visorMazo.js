document.addEventListener("DOMContentLoaded", async () => {

    const ID = window.ID_MAZO;
    const btnSave = document.querySelector("#btnSave");

    if (!ID) {
        console.error("Falta el ID del mazo");
        return;
    }

    async function actualizarBotonFavorito() {
        try {
            const res = await fetch(`/UsuarioAPI/favoritos/${ID}`);
            const esFavorito = await res.json();

            if (esFavorito) {
                btnSave.textContent = "Quitar de favoritos";
                btnSave.classList.remove("btn-success");
                btnSave.classList.add("btn-danger");
            } else {
                btnSave.textContent = "Guardar en favoritos";
                btnSave.classList.remove("btn-danger");
                btnSave.classList.add("btn-success");
            }

            return esFavorito;
        } catch (e) {
            console.error("Error al comprobar favorito", e);
        }
    }

    btnSave.addEventListener("click", async () => {
        try {
            const esFavorito = await actualizarBotonFavorito();

            const metodo = esFavorito ? "DELETE" : "POST";

            const res = await fetch(`/UsuarioAPI/favoritos/${ID}`, { method: metodo });
            if (!res.ok) throw new Error("Error al actualizar favorito");

            await actualizarBotonFavorito();

        } catch (e) {
            console.error(e);
            alert("No se pudo actualizar favoritos");
        }
    });

    const mainCont = document.querySelector("#main_deck .row");
    const extraCont = document.querySelector("#extra_deck .row");
    const sideCont = document.querySelector("#side_deck .row");

    async function cargarMazo() {
        try {
            const res = await fetch(`/MazoAPI/${ID}`);
            if (!res.ok) throw new Error("No se pudo cargar el mazo");

            const mazo = await res.json();

            const idsMain = mazo.mainDeck?.cartas?.map(c => c.idKonami) || [];
            const idsExtra = mazo.extraDeck?.cartas?.map(c => c.idKonami) || [];
            const idsSide = mazo.sideDeck?.cartas?.map(c => c.idKonami) || [];

            const idsTotales = [...idsMain, ...idsExtra, ...idsSide];

            if (idsTotales.length === 0) {
                mainCont.innerHTML = extraCont.innerHTML = sideCont.innerHTML = `<p class='text-muted text-center'>Empty</p>`;
                return;
            }

            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsTotales.join(",")}`;
            const resCartas = await fetch(url);
            const dataCartas = await resCartas.json();
            const cartasInfo = dataCartas.data;

            const dic = {};
            for (let carta of cartasInfo) dic[carta.id] = carta;

            cargarSeccion(idsMain, mainCont, dic);
            cargarSeccion(idsExtra, extraCont, dic);
            cargarSeccion(idsSide, sideCont, dic);

            document.querySelector("#inputNombreMazo").value = mazo.nombre || "Sin nombre";
            document.querySelector("#inputCreador").value = mazo.creador?.nombre || "Desconocido";
            document.querySelector("#btnVerUser").href = `/login/verUser/${mazo.creador?.id || ""}`;
        } catch (e) {
            console.error(e);
        }
    }

    function cargarSeccion(ids, contenedor, dic) {
        contenedor.innerHTML = "";
        if (!ids || ids.length === 0) {
            contenedor.innerHTML = `<p class='text-muted text-center'>Empty</p>`;
            return;
        }

        for (let id of ids) {
            const info = dic[id];
            if (!info) continue;

            const col = document.createElement("div");
            col.className = "col d-flex justify-content-center";

            col.innerHTML = `
                <div class="card border-0 text-center w-100" style="background:transparent;">
                    <div style="height:240px; width:100%; flex-shrink:0;">
                        <img src="${info.card_images[0].image_url}"
                             alt="${info.name}"
                             style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
                    </div>
                </div>
            `;

            col.querySelector("img").addEventListener("click", () => mostrarDetalles(info));
            contenedor.appendChild(col);
        }
    }


    function mostrarDetalles(carta) {
        const zonaDetalles = document.querySelector("#zona_info");

        let preciosHTML = "";

        const p = carta.card_prices?.[0];
        if (p) {
            preciosHTML = `<hr><h5 class="mt-2">Precios estimados</h5><div class="d-flex flex-wrap gap-2">`;

            if (parseFloat(p.cardmarket_price) > 0)
                preciosHTML += `<span class="badge bg-success">Cardmarket: €${p.cardmarket_price}</span>`;

            if (parseFloat(p.tcgplayer_price) > 0)
                preciosHTML += `<span class="badge bg-primary">TCGPlayer: $${p.tcgplayer_price}</span>`;

            if (parseFloat(p.ebay_price) > 0)
                preciosHTML += `<span class="badge bg-warning text-dark">eBay: $${p.ebay_price}</span>`;

            if (parseFloat(p.amazon_price) > 0)
                preciosHTML += `<span class="badge bg-info text-dark">Amazon: $${p.amazon_price}</span>`;

            if (parseFloat(p.coolstuffinc_price) > 0)
                preciosHTML += `<span class="badge bg-secondary">CoolStuffInc: $${p.coolstuffinc_price}</span>`;

            preciosHTML += `</div>`;
        }

        zonaDetalles.innerHTML = `
            <div class="card mb-3 border-0" style="max-width: 700px;">
                <div class="card-header bg-transparent border-0">
                    <h4 class="card-title mb-0 text-center">${carta.name}</h4>
                </div>

                <div class="card-body">
                    <div class="row g-3">

                        <div class="col-md-4 d-flex justify-content-center align-self-start">
                            <img src="${carta.card_images[0].image_url}" class="img-fluid rounded"
                                 style="object-fit:contain; max-height:240px;">
                        </div>

                        <div class="col-md-8" style="text-align: left;">
                            ${carta.type ? `<p><strong>Tipo:</strong> ${carta.type}</p>` : ''}
                            ${carta.archetype ? `<p><strong>Arquetipo:</strong> ${carta.archetype}</p>` : ''}
                            ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ''}
                            ${carta.race ? `<p><strong>Raza / Tipo:</strong> ${carta.race}</p>` : ''}
                            ${carta.level != null ? `<p><strong>Nivel:</strong> ${carta.level}</p>` : ''}
                            ${(carta.atk != null || carta.def != null) ? `<p><strong>ATK / DEF:</strong> ${carta.atk} / ${carta.def}</p>` : ''}
                        </div>

                    </div>

                    ${carta.desc ? `<hr><p class="mt-3" style="text-align: left;"><strong>Descripción:</strong> ${carta.desc}</p>` : ''}

                    ${preciosHTML}
                </div>
            </div>
        `;
    }

    await cargarMazo();
    await actualizarBotonFavorito();
});