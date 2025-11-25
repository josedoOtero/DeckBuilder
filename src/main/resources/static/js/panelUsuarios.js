document.addEventListener("DOMContentLoaded", function () {
    const tablaBody = document.getElementById("tabla-usuarios-body"); // <-- Cambiado
    const btnBuscar = document.getElementById("btnBuscarUsuarios");
    const btnCrear = document.getElementById("btnCrearUsuario");
    const inputNombre = document.getElementById("buscarNombre");
    const inputEmail = document.getElementById("buscarEmail");

    async function cargarUsuarios(nombre = "", email = "") {
        let url = `/UsuarioAPI/buscar?nombre=${encodeURIComponent(nombre)}&email=${encodeURIComponent(email)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener usuarios");
            const usuarios = await response.json();
            renderUsuarios(usuarios);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            tablaBody.innerHTML = `<tr><td colspan="4" class="text-danger">No se pudo cargar los usuarios</td></tr>`;
        }
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
                    <button class="btn btn-sm btn-warning btnEditar" data-id="${usuario.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btnEliminar" data-id="${usuario.id}">Eliminar</button>
                    <button class="btn btn-sm btn-info btnVerMazos" data-id="${usuario.id}">Ver Mazos</button>
                </td>
            `;

            tr.querySelector(".btnEliminar").addEventListener("click", async () => {
                if (confirm(`¿Seguro que quieres eliminar al usuario ${usuario.nombre}?`)) {
                    try {
                        const res = await fetch(`/UsuarioAPI/${usuario.id}`, { method: "DELETE" });
                        if (!res.ok) throw new Error("Error al eliminar usuario");
                        cargarUsuarios(inputNombre.value, inputEmail.value);
                    } catch (err) {
                        console.error(err);
                        alert("No se pudo eliminar el usuario");
                    }
                }
            });

            tr.querySelector(".btnEditar").addEventListener("click", () => {
                alert("Editar usuario: " + usuario.nombre);
            });

            tr.querySelector(".btnVerMazos").addEventListener("click", () => {
                alert("Ver mazos del usuario: " + usuario.nombre);
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