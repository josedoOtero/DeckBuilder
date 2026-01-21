document.addEventListener("DOMContentLoaded", () => {
    const listaMazos = document.querySelector("#lista_mazos");
    const listaMazosGuardados = document.querySelector("#lista_mazos_guardados");

    async function obtenerMazosUsuario() {
        try {
            const response = await fetch("/MazoAPI/usuario");
            if (!response.ok) {
                listaMazos.innerHTML = '<p class="text-center text-danger">Your decks could not be loaded.</p>';
                return [];
            }
            return await response.json();
        } catch (error) {
            listaMazos.innerHTML = '<p class="text-center text-danger">Your decks could not be loaded.</p>';
            return [];
        }
    }

    async function obtenerMazosGuardados() {
        try {
            const response = await fetch("/UsuarioAPI/favoritos");
            if (!response.ok) {
                listaMazosGuardados.innerHTML = '<p class="text-center text-danger">The saved decks could not be loaded.</p>';
                return [];
            }
            return await response.json();
        } catch (error) {
            listaMazosGuardados.innerHTML = '<p class="text-center text-danger">The saved decks could not be loaded.</p>';
            return [];
        }
    }

    function obtenerClaseEstado(estado) {
        switch (estado) {
            case "publico": return "estado-publico";
            case "privado": return "estado-privado";
            case "incompleto": return "estado-incompleto";
            default: return "estado-privado";
        }
    }

    function mostrarMazosEnContenedor(mazos, contenedor) {
        contenedor.innerHTML = "";
        if (mazos.length === 0) {
            contenedor.innerHTML = '<p class="text-center text-muted">There are no decks.</p>';
            return;
        }

        const row = document.createElement("div");
        row.classList.add("row", "g-4");

        mazos.forEach(mazo => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "text-center");

            const imagen = mazo.imagenCartaDestacada || "/IMG/cartaDorso.jpg";
            const url = contenedor.id === "lista_mazos"
                ? `/user/constructorMazos/${mazo.id}`
                : `/login/visualizadorMazos/${mazo.id}`;
            const estado = mazo.estado || "privado";
            const claseEstado = obtenerClaseEstado(estado);

            col.innerHTML = `
                <div class="mazo-card">
                    <h5 class="mb-1">${mazo.nombre || "Untitled deck"}</h5>
                    <div class="estado-mazo">
                        <span class="estado-pelotita ${claseEstado}"></span>
                        <span>${estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
                    </div>
                    <a href="${url}">
                        <img src="${imagen}" class="mazo-img" alt="Deck ${mazo.id}">
                    </a>
                </div>
            `;
            row.appendChild(col);
        });

        contenedor.appendChild(row);
    }

    (async () => {
        const mazosUsuario = await obtenerMazosUsuario();
        mostrarMazosEnContenedor(mazosUsuario, listaMazos);

        const mazosGuardados = await obtenerMazosGuardados();
        mostrarMazosEnContenedor(mazosGuardados, listaMazosGuardados);
    })();
});