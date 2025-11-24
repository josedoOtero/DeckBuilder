document.addEventListener("DOMContentLoaded", async () => {
    const listaMazos = document.querySelector("#lista_mazos");
    const busquedaNombreMazo = document.querySelector("#busquedaNombreMazo");
    const busquedaNombreCreador = document.querySelector("#busquedaNombreCreador");
    const btnBuscar = document.querySelector("#btnBuscar");

    async function obtenerMazos(nombreMazo, nombreCreador) {
        try {
            let url = "/MazoAPI/publicos";
            if ((nombreMazo && nombreMazo.trim() !== "") || (nombreCreador && nombreCreador.trim() !== "")) {
                url += `/buscar?nombreMazo=${encodeURIComponent(nombreMazo || "")}&nombreCreador=${encodeURIComponent(nombreCreador || "")}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener mazos");
            return await response.json();
        } catch (error) {
            console.error(error);
            listaMazos.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los mazos.</p>';
            return [];
        }
    }

    // Función de mostrar mazos (sin cambios, mantiene el diseño original)
    function mostrarMazos(mazos) {
        listaMazos.innerHTML = "";

        if (mazos.length === 0) {
            listaMazos.innerHTML = '<p class="text-center text-muted">No se encontraron mazos.</p>';
            return;
        }

        const row = document.createElement("div");
        row.classList.add("row", "g-4", "justify-content-center");

        mazos.forEach(mazo => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "text-center");

            const imagen = mazo.imagenCartaDestacada || "/IMG/cartaDorso.jpg";

            col.innerHTML = `
                <div class="card border-0" style="background: none;">
                    <h5 class="mb-2">${mazo.nombre || "Mazo sin título"}</h5>
                    <p class="text-muted mb-1">Creador: ${mazo.creador?.nombre || "Desconocido"}</p>
                    <a href="/user/visualizadorMazos/${mazo.id}">
                        <img src="${imagen}"
                             alt="Mazo ${mazo.id}"
                             style="height: 240px; border-radius: 15px;
                             box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                             transition: transform 0.3s ease;">
                    </a>
                </div>
            `;

            const img = col.querySelector("img");
            img.addEventListener("mouseenter", () => img.style.transform = "scale(1.05)");
            img.addEventListener("mouseleave", () => img.style.transform = "scale(1)");

            row.appendChild(col);
        });

        listaMazos.appendChild(row);
    }

    // Cargar todos inicialmente
    let mazosPublicos = await obtenerMazos();
    mostrarMazos(mazosPublicos);

    // Evento de búsqueda
    btnBuscar.addEventListener("click", async () => {
        const nombreMazo = busquedaNombreMazo.value;
        const nombreCreador = busquedaNombreCreador.value;
        const resultados = await obtenerMazos(nombreMazo, nombreCreador);
        mostrarMazos(resultados);
    });

    // Permitir Enter en ambas barras
    [busquedaNombreMazo, busquedaNombreCreador].forEach(input => {
        input.addEventListener("keyup", async (e) => {
            if (e.key === "Enter") btnBuscar.click();
        });
    });
});