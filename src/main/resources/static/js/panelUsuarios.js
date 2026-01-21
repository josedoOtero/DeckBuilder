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
                    throw new Error("Error getting users");
                const usuarios = yield response.json();
                renderUsuarios(usuarios);
            }
            catch (error) {
                console.error("Error loading users:", error);
                tablaBody.innerHTML =
                    `<tr><td colspan="4" class="text-danger">Users could not be loaded</td></tr>`;
            }
        });
    }
    function renderUsuarios(usuarios) {
        tablaBody.innerHTML = "";
        if (!usuarios || usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="4">There are no users</td></tr>`;
            return;
        }
        usuarios.forEach(usuario => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btn-sm btn-warning btnEditar me-1 text-white" data-id="${usuario.id}" title="edit">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-danger btnEliminar me-1" data-id="${usuario.id}" title="delete">
                        <i class="bi bi-trash"></i>
                    </button>

                    <button class="btn btn-sm btn-primary btnVerMazos" data-id="${usuario.id}" title="view decks">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            tr.querySelector(".btnEliminar").addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                if (confirm(`Are you sure you want to delete the user ${usuario.nombre}?`)) {
                    try {
                        const res = yield fetch(`/UsuarioAPI/${usuario.id}`, {
                            method: "DELETE"
                        });
                        if (!res.ok)
                            throw new Error("Error deleting user");
                        cargarUsuarios(inputNombre.value, inputEmail.value);
                    }
                    catch (err) {
                        console.error(err);
                        alert("The user could not be deleted");
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
