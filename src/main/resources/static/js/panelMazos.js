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
document.addEventListener("DOMContentLoaded", function () {
    const tablaBody = document.querySelector("#tabla-mazos-body");
    const btnBuscar = document.getElementById("btnBuscarMazos");
    const btnCrear = document.getElementById("btnCrearMazo");
    const inputNombreMazo = document.getElementById("buscarNombreMazo");
    const inputCreador = document.getElementById("buscarCreador");
    function cargarMazos() {
        return __awaiter(this, arguments, void 0, function* (nombreMazo = "", nombreCreador = "") {
            const url = `/MazoAPI/buscar?nombreMazo=${encodeURIComponent(nombreMazo)}&nombreCreador=${encodeURIComponent(nombreCreador)}`;
            try {
                const response = yield fetch(url, { credentials: "same-origin" });
                if (!response.ok)
                    throw new Error("Error al obtener mazos");
                const mazos = yield response.json();
                renderMazos(mazos);
            }
            catch (error) {
                console.error(error);
                tablaBody.innerHTML = `<tr><td colspan="5" class="text-danger">No se pudo cargar los mazos</td></tr>`;
            }
        });
    }
    function renderMazos(mazos) {
        tablaBody.innerHTML = "";
        if (!mazos || mazos.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5">No hay mazos</td></tr>`;
            return;
        }
        mazos.forEach(mazo => {
            var _a;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${mazo.id}</td>
                <td>${mazo.nombre || "Sin nombre"}</td>
                <td>${((_a = mazo.creador) === null || _a === void 0 ? void 0 : _a.nombre) || "Desconocido"}</td>
                <td>${mazo.estado || "Desconocido"}</td>
                <td class="">
                    <button class="btn btn-sm btn-warning btnEditar me-1" data-id="${mazo.id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btnEliminar me-1" data-id="${mazo.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-sm btn-primary btnVer" data-id="${mazo.id}" title="Ver Mazos">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tr.querySelector(".btnEliminar").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (confirm(`¿Seguro que quieres eliminar el mazo "${mazo.nombre}"?`)) {
                    try {
                        const res = yield fetch(`/MazoAPI/${mazo.id}`, { method: "DELETE", credentials: "same-origin" });
                        if (!res.ok)
                            throw new Error("Error al eliminar mazo");
                        cargarMazos(inputNombreMazo.value, inputCreador.value);
                    }
                    catch (err) {
                        console.error(err);
                        alert("No se pudo eliminar el mazo");
                    }
                }
            }));
            tr.querySelector(".btnEditar").addEventListener("click", () => {
                window.location.href = `/user/constructorMazos/${mazo.id}`;
            });
            tr.querySelector(".btnVer").addEventListener("click", () => {
                window.location.href = `/user/visualizadorMazos/${mazo.id}`;
            });
            tablaBody.appendChild(tr);
        });
    }
    btnBuscar.addEventListener("click", () => {
        cargarMazos(inputNombreMazo.value, inputCreador.value);
    });
    btnCrear.addEventListener("click", () => {
        window.location.href = "/user/constructorMazos";
    });
    cargarMazos();
});
