document.addEventListener("DOMContentLoaded", async () => {
    const listaMazos = document.querySelector("#lista_mazos");
    const busquedaNombreMazo = document.querySelector("#busquedaNombreMazo");
    const busquedaNombreCreador = document.querySelector("#busquedaNombreCreador");
    const btnBuscar = document.querySelector("#btnBuscar");

    async function obtenerMazos(nombreMazo, nombreCreador) {
        try {
            let url = "/MazoAPI/publicos/buscar";
            url += `?nombreMazo=${encodeURIComponent(nombreMazo || "")}&nombreCreador=${encodeURIComponent(nombreCreador || "")}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Error obtaining decks");
            return await response.json();
        } catch (error) {
            console.error(error);
            listaMazos.innerHTML = '<p class="text-center text-danger">The decks could not be loaded.</p>';
            return [];
        }
    }

    function mostrarMazos(mazos) {
        listaMazos.innerHTML = "";

        if (!mazos || mazos.length === 0) {
            listaMazos.innerHTML = '<p class="text-center text-muted">No mallets were found.</p>';
            return;
        }

        const row = document.createElement("div");
        row.classList.add("row", "g-2");

        mazos.forEach(mazo => {
            if (mazo.estado?.toLowerCase() !== "publico") return;

            const col = document.createElement("div");
            col.classList.add(
                "col-12",
                "col-sm-6",
                "col-md-4",
                "col-lg-2",
                "text-center",
                "p-1"
            );

            const imagen = mazo.imagenCartaDestacada || "/img/cartaDorso.jpg";

            col.innerHTML = `
                <div class="card border-0" style="background: none; margin-bottom: 0.5rem;">
                    <h5 class="mb-1">${mazo.nombre || "Mazo sin título"}</h5>
                    <p class="text-muted mb-2">Creador: ${mazo.creador?.nombre || "unknown"}</p>
                    <a href="/login/visualizadorMazos/${mazo.id}">
                        <img src="${imagen}" alt="Mazo ${mazo.id}"
                             style="height: 280px; border-radius: 15px;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                                    transition: transform 0.3s ease;
                                    width: auto;">
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

    let mazosPublicos = await obtenerMazos();
    mostrarMazos(mazosPublicos);

    btnBuscar.addEventListener("click", async () => {
        const nombreMazo = busquedaNombreMazo.value;
        const nombreCreador = busquedaNombreCreador.value;
        const resultados = await obtenerMazos(nombreMazo, nombreCreador);
        mostrarMazos(resultados);
    });

    [busquedaNombreMazo, busquedaNombreCreador].forEach(input => {
        input.addEventListener("keyup", e => {
            if (e.key === "Enter") btnBuscar.click();
        });
    });
});