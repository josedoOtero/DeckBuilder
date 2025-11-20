document.addEventListener("DOMContentLoaded", async () => {
    const listaMazos = document.querySelector("#lista_mazos");

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

    function mostrarMazos(mazos) {
        listaMazos.innerHTML = "";

        if (mazos.length === 0) {
            listaMazos.innerHTML = '<p class="text-center text-muted">No tienes mazos creados.</p>';
            return;
        }

        const row = document.createElement("div");
        row.classList.add("row", "g-4", "justify-content-center");

        mazos.forEach(mazo => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "text-center");

            const imagen = mazo.imagenCartaDestacada
                ? mazo.imagenCartaDestacada
                : "/IMG/cartaDorso.jpg";

            col.innerHTML = `
                <div class="card border-0" style="background: none;">
                    <h5 class="mb-2">${mazo.nombre || "Mazo sin título"}</h5>

                    <a href="/user/constructorMazos/${mazo.id}">
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

    const mazos = await obtenerMazosUsuario();
    mostrarMazos(mazos);
});