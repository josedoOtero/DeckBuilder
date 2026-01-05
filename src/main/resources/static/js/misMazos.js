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
    const listaMazosGuardados = document.querySelector("#lista_mazos_guardados");
    function obtenerMazosUsuario() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/MazoAPI/usuario");
                if (!response.ok)
                    throw new Error("Error al obtener mazos del usuario");
                return yield response.json();
            }
            catch (error) {
                console.error(error);
                listaMazos.innerHTML = '<p class="text-center text-danger">No se pudieron cargar tus mazos.</p>';
                return [];
            }
        });
    }
    function obtenerMazosGuardados() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/UsuarioAPI/favoritos");
                if (!response.ok)
                    throw new Error("Error al obtener mazos guardados");
                return yield response.json();
            }
            catch (error) {
                console.error(error);
                listaMazosGuardados.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los mazos guardados.</p>';
                return [];
            }
        });
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
            let url = "";
            if (contenedor.id === "lista_mazos") {
                url = `/user/constructorMazos/${mazo.id}`;
            }
            else {
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
    const mazosUsuario = yield obtenerMazosUsuario();
    mostrarMazosEnContenedor(mazosUsuario, listaMazos);
    const mazosGuardados = yield obtenerMazosGuardados();
    mostrarMazosEnContenedor(mazosGuardados, listaMazosGuardados);
}));
