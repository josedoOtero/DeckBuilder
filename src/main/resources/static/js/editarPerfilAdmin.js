document.addEventListener("DOMContentLoaded", () => {

    const listaCartas = document.querySelector("#lista_cartas");
    const filtro = document.querySelector("#filtro_cartas");
    const imgPerfil = document.querySelector("#fotoPerfil");

    const usuarioId = imgPerfil.getAttribute("data-usuario-id");

    if (!usuarioId) {
        console.error("No se encontró el ID del usuario.");
        return;
    }

    filtro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = new FormData(filtro).get("q").trim();

        if (!nombre) {
            listaCartas.innerHTML = "<p class='text-muted'>Escribe un nombre.</p>";
            return;
        }

        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(nombre)}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                listaCartas.innerHTML = "<p class='text-muted'>No se encontraron cartas.</p>";
                return;
            }

            const data = await response.json();
            mostrarCartas(data.data);

        } catch (e) {
            console.error(e);
            listaCartas.innerHTML = "<p class='text-danger'>Error cargando cartas.</p>";
        }
    });

    function mostrarCartas(cartas) {
        listaCartas.innerHTML = "";

        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col");

            const imagenCropped = carta.card_images[0].image_url_cropped;

            col.innerHTML = `
                <img src="${imagenCropped}"
                     class="img-fluid img-thumbnail seleccionar-carta"
                     style="cursor:pointer;"
                     data-url="${imagenCropped}"
                     onerror="this.src='/img/fotoPerfil.png'">
            `;

            listaCartas.appendChild(col);

            col.querySelector("img").addEventListener("click", () => {
                seleccionarCarta(imagenCropped);
            });
        });
    }

    async function seleccionarCarta(urlImagen) {

        try {
            const response = await fetch(`/UsuarioAPI/cambiarImg/${usuarioId}?url=${encodeURIComponent(urlImagen)}`, {
                method: "PUT"
            });

            if (response.ok) {
                imgPerfil.src = urlImagen;
                alert("Imagen actualizada correctamente.");

                bootstrap.Modal.getInstance(
                    document.querySelector("#modalSeleccionarCarta")
                ).hide();

            } else {
                const errorText = await response.text();
                console.error("ERROR del servidor: ", errorText);
                alert("Error: " + errorText);
            }

        } catch (e) {
            console.error(e);
            alert("Error al actualizar la imagen.");
        }
    }

});