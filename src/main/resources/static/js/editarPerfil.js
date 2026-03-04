document.addEventListener("DOMContentLoaded", () => {
    console.log("editarPerfil.js cargado correctamente.");

    const listaCartas = document.querySelector("#lista_cartas");
    const filtro = document.querySelector("#filtro_cartas");
    const imgPerfil = document.querySelector("#fotoPerfil");
    const hiddenInput = document.querySelector("#imagenUsuarioHidden");
    const btnToggleRol = document.getElementById("btnToggleRol");
    const usuarioId = imgPerfil.getAttribute("data-usuario-id");

    if (!imgPerfil || !hiddenInput || !listaCartas || !filtro) {
        console.error("editarPerfil.js: elementos no encontrados");
        return;
    }

    filtro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = new FormData(filtro).get("q").trim();
        if (!nombre) {
            listaCartas.innerHTML = "<p class='text-muted'>Write a name.</p>";
            return;
        }

        const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(nombre)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                listaCartas.innerHTML = "<p class='text-muted'>No cards found.</p>";
                return;
            }

            const data = await response.json();
            mostrarCartas(data.data);
        } catch (e) {
            console.error(e);
            listaCartas.innerHTML = "<p class='text-danger'>Error loading cards.</p>";
        }
    });

    function mostrarCartas(cartas) {
        listaCartas.innerHTML = "";

        cartas.forEach(carta => {
            const col = document.createElement("div");
            col.classList.add("col");

            const imagen = carta.card_images[0].image_url_cropped;

            col.innerHTML = `
                <img src="${imagen}"
                     class="img-fluid img-thumbnail seleccionar-carta"
                     style="cursor:pointer;"
                     alt="Card image"
                     onerror="this.src='/img/fotoPerfil.png'">
            `;

            col.querySelector("img").addEventListener("click", () => {
                imgPerfil.src = imagen;
                hiddenInput.value = imagen;
                const modal = bootstrap.Modal.getInstance(
                    document.getElementById("modalSeleccionarCarta")
                );
                if (modal) modal.hide();
            });

            listaCartas.appendChild(col);
        });
    }

    if (btnToggleRol && usuarioId) {
        btnToggleRol.addEventListener("click", async () => {
            try {
                const currentRole = btnToggleRol.textContent.includes("ADMIN") ? "ADMIN" : "USER";
                const newRole = currentRole === "USER" ? "ADMIN" : "USER";

                const response = await fetch(`/UsuarioAPI/cambiarRol/${usuarioId}`, {
                    method: "PUT"
                });

                if (response.ok) {
                    btnToggleRol.textContent = `Role: ${newRole}`;
                    alert(`Role changed to ${newRole}`);
                } else {
                    alert("Error changing role");
                }
            } catch (error) {
                console.error("Error changing role:", error);
                alert("An error occurred while changing the role.");
            }
        });
    }
});