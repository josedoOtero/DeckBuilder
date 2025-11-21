document.addEventListener("DOMContentLoaded", async () => {

    const ID = window.ID_MAZO;

    if (!ID) {
        console.error("No se recibió ID del mazo");
        return;
    }

    const mainCont = document.querySelector("#main_deck .row");
    const extraCont = document.querySelector("#extra_deck .row");
    const sideCont = document.querySelector("#side_deck .row");
    const zonaDetalles = document.querySelector("#zona_detalles");

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
                mainCont.innerHTML = extraCont.innerHTML = sideCont.innerHTML =
                    `<p class='text-muted text-center'>Empty</p>`;
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
            document.querySelector("#inputCreador").value = "Desconocido";


            if (mazo.creador) {
                document.querySelector("#inputCreador").value = mazo.creador.nombre;
                document.querySelector("#btnVerUser").href = `/user/verUser/${mazo.creador.id}`;
            }


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

            const cardDiv = document.createElement("div");
            cardDiv.className = "col";
            cardDiv.innerHTML = `
                <img src="${info.card_images[0].image_url}" style="width:100%; cursor:pointer;">
            `;

            cardDiv.querySelector("img").addEventListener("click", () => {
                mostrarDetalles(info);
            });

            contenedor.appendChild(cardDiv);
        }
    }

    function mostrarDetalles(carta) {
        const zonaInfo = document.querySelector("#zona_info");

        zonaInfo.innerHTML = `
            <h3>${carta.name}</h3>
            <img src="${carta.card_images[0].image_url}" style="width:200px;">
            <p><strong>Type:</strong> ${carta.type}</p>
            <p><strong>Description:</strong> ${carta.desc}</p>
        `;
    }

    cargarMazo();
});