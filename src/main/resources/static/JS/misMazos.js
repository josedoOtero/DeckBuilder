document.addEventListener("DOMContentLoaded", async () => {
    const listaMazos = document.querySelector("#lista_mazos");

    async function obtenerMazosUsuario() {
        try {
            const response = await fetch("/MazoAPI/usuario");
            if (!response.ok) throw new Error("Error al obtener mazos del usuario");
            const mazos = await response.json();
            return mazos;
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

        mazos.forEach(mazo => {
            const mazoDiv = document.createElement("div");
            mazoDiv.classList.add("mb-4", "text-center");

            const imagen = mazo.imagenCartaDestacada
                ? mazo.imagenCartaDestacada
                : "/IMG/cartaDorso.jpg";

            mazoDiv.innerHTML = `
                <h3>${mazo.nombre || "Mazo sin título"}</h3>
                <a href="http://localhost:8080/user/costructorMazos/${mazo.id}">
                    <img src="${imagen}" 
                         alt="Mazo ${mazo.id}" 
                         style="height: 240px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.3s ease;">
                </a>
            `;

            const img = mazoDiv.querySelector("img");
            img.addEventListener("mouseenter", () => img.style.transform = "scale(1.05)");
            img.addEventListener("mouseleave", () => img.style.transform = "scale(1)");

            listaMazos.appendChild(mazoDiv);
        });
    }

    const mazos = await obtenerMazosUsuario();
    mostrarMazos(mazos);
});