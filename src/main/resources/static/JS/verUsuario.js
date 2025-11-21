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

    fetch(`/UsuarioAPI/${idUsuario}/mazos/publicos`)
        .then(r => {
            if (!r.ok) throw new Error("Error al cargar los mazos públicos");
            return r.json();
        })
        .then(mazos => {

            const contenedor = document.getElementById("lista_mazos");
            contenedor.innerHTML = "";

            if (mazos.length === 0) {
                contenedor.innerHTML = `<p class="text-muted text-center">Este usuario no tiene mazos públicos.</p>`;
                return;
            }

            mazos.forEach(mazo => {

                const card = document.createElement("div");
                card.classList.add("mazo-card");

                card.innerHTML = `
                    <img src="${mazo.imagenCartaDestacada || '/images/default-card.png'}"
                         alt="imagen"
                         style="width:100%; border-radius:6px;">

                    <h6 class="mt-2">${mazo.nombre}</h6>

                    <p class="text-muted" style="font-size:13px;">
                        Vistas: ${mazo.vistas}
                    </p>

                    <a href="/verMazo/${mazo.id}"
                       class="btn btn-primary btn-sm w-100">
                       Ver mazo
                    </a>
                `;

                contenedor.appendChild(card);
            });

        })
        .catch(err => console.error(err));
}