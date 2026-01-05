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
    const tablaBody = document.getElementById("tabla-usuarios-body");
    const btnBuscar = document.getElementById("btnBuscarUsuarios");
    const btnCrear = document.getElementById("btnCrearUsuario");
    const inputNombre = document.getElementById("buscarNombre");
    const inputEmail = document.getElementById("buscarEmail");
    function cargarUsuarios() {
        return __awaiter(this, arguments, void 0, function* (nombre = "", email = "") {
            let url = `/UsuarioAPI/buscar?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error("Error al obtener usuarios");
                const usuarios = yield response.json();
                renderUsuarios(usuarios);
            }
            catch (error) {
                console.error("Error cargando usuarios:", error);
                tablaBody.innerHTML =
                    `<tr><td colspan="4" class="text-danger">No se pudo cargar los usuarios</td></tr>`;
            }
        });
    }
    function renderUsuarios(usuarios) {
        tablaBody.innerHTML = "";
        if (!usuarios || usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="4">No hay usuarios</td></tr>`;
            return;
        }
        usuarios.forEach(usuario => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btn-sm btn-warning btnEditar me-1" data-id="${usuario.id}" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-danger btnEliminar me-1" data-id="${usuario.id}" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>

                    <button class="btn btn-sm btn-primary btnVerMazos" data-id="${usuario.id}" title="Ver Mazos">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tr.querySelector(".btnEliminar").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (confirm(`¿Seguro que quieres eliminar al usuario ${usuario.nombre}?`)) {
                    try {
                        const res = yield fetch(`/UsuarioAPI/${usuario.id}`, {
                            method: "DELETE"
                        });
                        if (!res.ok)
                            throw new Error("Error al eliminar usuario");
                        cargarUsuarios(inputNombre.value, inputEmail.value);
                    }
                    catch (err) {
                        console.error(err);
                        alert("No se pudo eliminar el usuario");
                    }
                }
            }));
            tr.querySelector(".btnEditar").addEventListener("click", () => {
                window.location.href = `/user/cuenta-editar/${usuario.id}`;
            });
            tr.querySelector(".btnVerMazos").addEventListener("click", () => {
                window.location.href = `/login/verUser/${usuario.id}`;
            });
            tablaBody.appendChild(tr);
        });
    }
    btnBuscar.addEventListener("click", () => {
        cargarUsuarios(inputNombre.value, inputEmail.value);
    });
    btnCrear.addEventListener("click", () => {
        window.location.href = "/login/crearCuenta";
    });
    cargarUsuarios();
});
