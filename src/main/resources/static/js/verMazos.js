// @ts-nocheck
// ...existing code...
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
    const listaMazos = document.querySelector("#lista_mazos");
    const busquedaNombreMazo = document.querySelector("#busquedaNombreMazo");
    const busquedaNombreCreador = document.querySelector("#busquedaNombreCreador");
    const btnBuscar = document.querySelector("#btnBuscar");
    function obtenerMazos(nombreMazo, nombreCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = "/MazoAPI/publicos";
                if ((nombreMazo && nombreMazo.trim() !== "") || (nombreCreador && nombreCreador.trim() !== "")) {
                    url += `/buscar?nombreMazo=${encodeURIComponent(nombreMazo || "")}&nombreCreador=${encodeURIComponent(nombreCreador || "")}`;
                }
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error("Error al obtener mazos");
                return yield response.json();
            }
            catch (error) {
                console.error(error);
                listaMazos.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los mazos.</p>';
                return [];
            }
        });
    }
    function mostrarMazos(mazos) {
        listaMazos.innerHTML = "";
        if (mazos.length === 0) {
            listaMazos.innerHTML = '<p class="text-center text-muted">No se encontraron mazos.</p>';
            return;
        }
        const row = document.createElement("div");
        row.classList.add("row", "g-2"); // menos espacio entre columnas
        mazos.forEach(mazo => {
            var _a;
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-2", "text-center", "p-1");
            const imagen = mazo.imagenCartaDestacada || "/img/cartaDorso.jpg";
            col.innerHTML = `
                <div class="card border-0" style="background: none; margin-bottom: 0.5rem;">
                    <h5 class="mb-1">${mazo.nombre || "Mazo sin título"}</h5>
                    <p class="text-muted mb-2">Creador: ${((_a = mazo.creador) === null || _a === void 0 ? void 0 : _a.nombre) || "Desconocido"}</p>
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
    // Carga inicial
    let mazosPublicos = yield obtenerMazos();
    mostrarMazos(mazosPublicos);
    // Botón de búsqueda
    btnBuscar.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        const nombreMazo = busquedaNombreMazo.value;
        const nombreCreador = busquedaNombreCreador.value;
        const resultados = yield obtenerMazos(nombreMazo, nombreCreador);
        mostrarMazos(resultados);
    }));
    // Búsqueda al presionar Enter
    [busquedaNombreMazo, busquedaNombreCreador].forEach(input => {
        input.addEventListener("keyup", e => {
            if (e.key === "Enter")
                btnBuscar.click();
        });
    });
}));
