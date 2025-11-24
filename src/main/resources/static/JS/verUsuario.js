document.addEventListener("DOMContentLoaded", () => {
    console.log("JS verUsuario.js cargado!");

    if (!window.ID_USUARIO) {
        console.error("ERROR: No se recibió el ID de usuario.");
        return;
    }

    cargarDatosUsuario(window.ID_USUARIO);
    cargarMazosPublicos(window.ID_USUARIO);
});

function cargarDatosUsuario(idUsuario) {

    fetch(`/UsuarioAPI/${idUsuario}`)
        .then(r => {
            if (!r.ok) throw new Error("Error al obtener datos del usuario");
            return r.json();
        })
        .then(usuario => {

            // Mostrar nombre, email, etc.
            const zona = document.querySelector("#zona_usuario .text-muted");

            zona.innerHTML = `
                <p><strong>Nombre:</strong> ${usuario.nombre}</p>
                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Mazos creados:</strong> ${usuario.mazos.length}</p>
                <p><strong>Mazos favoritos:</strong> ${usuario.mazosFavoritos.length}</p>
            `;

        })
        .catch(err => console.error(err));
}

function cargarMazosPublicos(idUsuario) {

    fetch(`/MazoAPI/publicos/${idUsuario}`)
        .then(r => {
            if (!r.ok) {
                console.error("Respuesta no OK:", r.status);
                throw new Error("Error al cargar los mazos públicos");
            }
            return r.json();
        })
        .then(mazos => {

            if (!Array.isArray(mazos)) {
                console.error("Formato inesperado recibido:", mazos);
                return;
            }

            const contenedor = document.getElementById("lista_mazos");
            contenedor.innerHTML = "";

            if (mazos.length === 0) {
                contenedor.innerHTML = `
                    <p class="text-muted text-center">
                        Este usuario no tiene mazos públicos.
                    </p>`;
                return;
            }

            mazos.forEach(mazo => {

                const col = document.createElement("div");
                col.classList.add("col-md-4", "mb-4");

                const imagen = mazo.imagenCartaDestacada || "/images/default-card.png";

                col.innerHTML = `
                    <div class="card border-0" style="background: none;">
                        <h5 class="mb-2">${mazo.nombre || "Mazo sin título"}</h5>

                        <a href="/user/visualizadorMazos/${mazo.id}">
                            <img src="${imagen}"
                                 alt="Mazo ${mazo.id}"
                                 style="height: 240px; width: 100%; object-fit: cover;
                                 border-radius: 15px;
                                 box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                                 transition: transform 0.3s ease;">
                        </a>
                    </div>
                `;

                contenedor.appendChild(col);
            });

        })
        .catch(err => console.error("Error cargando mazos públicos:", err));
}