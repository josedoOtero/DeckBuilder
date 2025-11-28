document.addEventListener("DOMContentLoaded", () => {
    console.log("JS verUsuario.js cargado!");

    if (!window.ID_USUARIO) {
        console.error("ERROR: No se recibió el ID de usuario.");
        return;
    }

    cargarDatosUsuario(window.ID_USUARIO);
    cargarMazosPublicos(window.ID_USUARIO);
});


// ====================
//      DATOS USUARIO
// ====================
function cargarDatosUsuario(idUsuario) {
    fetch(`/UsuarioAPI/${idUsuario}`)
        .then(r => {
            if (!r.ok) throw new Error("Error al obtener datos del usuario");
            return r.json();
        })
        .then(usuario => {
            const zona = document.querySelector("#zona_usuario .text-muted");

            const imagen = usuario.imagenUsuario?.trim()
                ? usuario.imagenUsuario
                : "/img/fotoPerfil.png";

            const esAdmin = usuario.rol === "ROLE_ADMIN" ? " (Admin)" : "";

            zona.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 10px;
                ">
                    <img src="${imagen}"
                         alt="Foto de ${usuario.nombre}"
                         style="
                            width: 110px;
                            height: 110px;
                            object-fit: cover;
                            border-radius: 10px;
                            border: 2px solid #ddd;
                         ">

                    <div style="text-align: left; width: 100%;">
                        <p style="margin: 0;"><strong>Nombre:</strong> ${usuario.nombre}${esAdmin}</p>
                        <p style="margin: 2px 0 0 0;"><strong>Email:</strong> ${usuario.email}</p>
                    </div>
                </div>

                <hr>

                <div style="
                    text-align: left;
                    padding: 10px;
                ">
                    <p style="margin: 0;">
                        <strong>Descripción:</strong><br>
                        <span style="color: #444;">
                            ${usuario.descripcion && usuario.descripcion.trim() !== ""
                                ? usuario.descripcion
                                : "<em>Este usuario no ha añadido una descripción.</em>"}
                        </span>
                    </p>
                </div>
            `;
        })
        .catch(err => console.error("Error cargando datos del usuario:", err));
}




// ==============================
//      MAZOS PÚBLICOS
// ==============================
function cargarMazosPublicos(idUsuario) {
    fetch(`/MazoAPI/publicos/${idUsuario}`)
        .then(r => {
            if (!r.ok) throw new Error("Error al cargar los mazos públicos");
            return r.json();
        })
        .then(mazos => {
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

                const imagen = mazo.imagenCartaDestacada || "/img/cartaDorso.jpg";

                const div = document.createElement("div");
                div.classList.add("mazo-card");

                div.innerHTML = `
                    <h5>${mazo.nombre || "Mazo sin título"}</h5>

                    <a href="/user/visualizadorMazos/${mazo.id}">
                        <img src="${imagen}" alt="Mazo ${mazo.id}" class="mazo-img">
                    </a>
                `;

                contenedor.appendChild(div);
            });
        })
        .catch(err => console.error("Error cargando mazos públicos:", err));
}
