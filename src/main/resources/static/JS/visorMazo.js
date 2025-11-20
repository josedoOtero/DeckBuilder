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

            cargarSeccion(mazo.mainDeck.cartas, mainCont);
            cargarSeccion(mazo.extraDeck.cartas, extraCont);
            cargarSeccion(mazo.sideDeck.cartas, sideCont);

        } catch (e) {
            console.error(e);
        }
    }

    async function cargarSeccion(cartas, contenedor) {
        contenedor.innerHTML = "";

        if (!cartas || cartas.length === 0) {
            contenedor.innerHTML = `<p class='text-muted text-center'>Empty</p>`;
            return;
        }

        for (let carta of cartas) {
            const konami = carta.idKonami;

            try {
                const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?konami_id=${konami}`);
                const data = await response.json();
                const info = data.data[0];

                const cardDiv = document.createElement("div");
                cardDiv.className = "col";
                cardDiv.innerHTML = `
                    <img src="${info.card_images[0].image_url}"
                         style="width:100%; cursor:pointer;">
                `;

                cardDiv.querySelector("img").addEventListener("click", () => {
                    mostrarDetalles(info);
                });

                contenedor.appendChild(cardDiv);

            } catch (err) {
                console.error("Error cargando carta:", konami, err);
            }
        }
    }

    function mostrarDetalles(carta) {
        zonaDetalles.innerHTML = `
            <h3>${carta.name}</h3>
            <img src="${carta.card_images[0].image_url}" style="width:200px;">
            <p><strong>Type:</strong> ${carta.type}</p>
            <p><strong>Description:</strong> ${carta.desc}</p>
        `;
    }

    cargarMazo();
});