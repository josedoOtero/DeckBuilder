// @ts-nocheck
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
    fetch(`${window.location.origin}/UsuarioAPI/${idUsuario}`)
        .then(r => {
        if (!r.ok)
            throw new Error("Error retrieving user data");
        return r.json();
    })
        .then(usuario => {
        var _a;
        const zona = document.querySelector("#zona_usuario .text-muted");
        const imagen = ((_a = usuario.imagenUsuario) === null || _a === void 0 ? void 0 : _a.trim())
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
                        <p style="margin: 0;"><strong>Name:</strong> ${usuario.nombre}${esAdmin}</p>
                        <p style="margin: 2px 0 0 0;"><strong>Email:</strong> ${usuario.email}</p>
                    </div>
                </div>

                <hr>

                <div style="
                    text-align: left;
                    padding: 10px;
                ">
                    <p style="margin: 0;">
                        <strong>Description:</strong><br>
                        <span style="color: #444;">
                            ${usuario.descripcion && usuario.descripcion.trim() !== ""
            ? usuario.descripcion
            : "<em>This user has not added a description.</em>"}
                        </span>
                    </p>
                </div>
            `;
    })
        .catch(err => console.error("Error loading user data:", err));
}

function cargarMazosPublicos(idUsuario) {
    fetch(`${window.location.origin}/MazoAPI/publicos/${idUsuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error loading public decks");
            }
            return response.json();
        })
        .then(mazos => {
            const contenedor = document.getElementById("lista_mazos");
            contenedor.innerHTML = "";
            if (mazos.length === 0) {
                contenedor.innerHTML = `
                    <p class="text-muted text-center">
                        This user does not have any public decks.
                    </p>`;
                return;
            }
            mazos.forEach(mazo => {
                const imagen = mazo.imagenCartaDestacada || "/img/cartaDorso.jpg";
                const div = document.createElement("div");
                div.classList.add("mazo-card");
                div.innerHTML = `
                    <h5>${mazo.nombre || "Untitled deck"}</h5>

                    <a href="/login/visualizadorMazos/${mazo.id}">
                        <img src="${imagen}" alt="Mazo ${mazo.id}" class="mazo-img">
                    </a>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Error loading public decks:", err);
            const contenedor = document.getElementById("lista_mazos");
            contenedor.innerHTML = `<p class='text-danger text-center'>Error loading public decks.</p>`;
        });
}