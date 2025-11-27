document.addEventListener("DOMContentLoaded", async () => {
    const listaMazos = document.querySelector("#lista_mazos");
    const listaMazosGuardados = document.querySelector("#lista_mazos_guardados");

    async function obtenerMazosUsuario() {
        try {
            const response = await fetch("/MazoAPI/usuario");
            if (!response.ok) throw new Error("Error al obtener mazos del usuario");
            return await response.json();
        } catch (error) {
            console.error(error);
            listaMazos.innerHTML = '<p class="text-center text-danger">No se pudieron cargar tus mazos.</p>';
            return [];
        }
    }

    async function obtenerMazosGuardados() {
        try {
            const response = await fetch("/UsuarioAPI/favoritos");
            if (!response.ok) throw new Error("Error al obtener mazos guardados");
            return await response.json();
        } catch (error) {
            console.error(error);
            listaMazosGuardados.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los mazos guardados.</p>';
            return [];
        }
    }

    function mostrarMazosEnContenedor(mazos, contenedor) {
        contenedor.innerHTML = "";

        if (mazos.length === 0) {
            contenedor.innerHTML = '<p class="text-center text-muted">No hay mazos.</p>';
            return;
        }

        const row = document.createElement("div");
        row.classList.add("row", "g-4");

        mazos.forEach(mazo => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "text-center");

            const imagen = mazo.imagenCartaDestacada
                ? mazo.imagenCartaDestacada
                : "/IMG/cartaDorso.jpg";

            // Selección de URL según el contenedor
            let url = "";
            if (contenedor.id === "lista_mazos") {
                url = `/user/constructorMazos/${mazo.id}`;
            } else {
                url = `/user/visualizadorMazos/${mazo.id}`;
            }

            col.innerHTML = `
                <div class="card border-0" style="background: none;">
                    <h5 class="mb-2">${mazo.nombre || "Mazo sin título"}</h5>
                    <a href="${url}">
                        <img src="${imagen}" class="mazo-img" alt="Mazo ${mazo.id}">
                    </a>
                </div>
            `;

            row.appendChild(col);
        });

        contenedor.appendChild(row);
    }

    const mazosUsuario = await obtenerMazosUsuario();
    mostrarMazosEnContenedor(mazosUsuario, listaMazos);

    const mazosGuardados = await obtenerMazosGuardados();
    mostrarMazosEnContenedor(mazosGuardados, listaMazosGuardados);
});