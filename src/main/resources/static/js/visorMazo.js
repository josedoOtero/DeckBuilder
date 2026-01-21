// @ts-nocheck
var __awaiter = function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
    const pageData = document.getElementById('pageData');
    const ID = pageData ? pageData.dataset.id : null;
    const btnSave = document.querySelector("#btnSave");
    if (!ID) {
        console.error("The deck ID is missing.");
        return;
    }
    function actualizarBotonFavorito() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`/UsuarioAPI/favoritos/${ID}`);
                if (!res.ok) {
                    manejarError("Failed to check favorite", new Error("no OK"));
                    return;
                }
                const esFavorito = yield res.json();
                if (esFavorito) {
                    btnSave.textContent = "Remove from favorites";
                    btnSave.classList.remove("btn-success");
                    btnSave.classList.add("btn-danger");
                }
                else {
                    btnSave.textContent = "Save to favorites";
                    btnSave.classList.remove("btn-danger");
                    btnSave.classList.add("btn-success");
                }
                return esFavorito;
            }
            catch (e) {
                manejarError("Failed to check favorite", e);
            }
        });
    }
    btnSave.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const esFavorito = yield actualizarBotonFavorito();
            const metodo = esFavorito ? "DELETE" : "POST";
            const res = yield fetch(`/UsuarioAPI/favoritos/${ID}`, { method: metodo });
            if (!res.ok)
                alert("Favorites could not be updated");
            yield actualizarBotonFavorito();
        }
        catch (e) {
            console.error(e);
            alert("Favorites could not be updated");
        }
    }));
    const mainCont = document.querySelector("#main_deck .row");
    const extraCont = document.querySelector("#extra_deck .row");
    const sideCont = document.querySelector("#side_deck .row");
    function cargarMazo() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const res = yield fetch(`/MazoAPI/${ID}`);
                if (!res.ok) {
                    console.error("The deck could not be loaded");
                    return;
                }
                const mazo = yield res.json();
                const idsMain = ((_b = (_a = mazo.mainDeck) === null || _a === void 0 ? void 0 : _a.cartas) === null || _b === void 0 ? void 0 : _b.map(c => c.idKonami)) || [];
                const idsExtra = ((_d = (_c = mazo.extraDeck) === null || _c === void 0 ? void 0 : _c.cartas) === null || _d === void 0 ? void 0 : _d.map(c => c.idKonami)) || [];
                const idsSide = ((_f = (_e = mazo.sideDeck) === null || _e === void 0 ? void 0 : _e.cartas) === null || _f === void 0 ? void 0 : _f.map(c => c.idKonami)) || [];
                const idsTotales = [...idsMain, ...idsExtra, ...idsSide];
                if (idsTotales.length === 0) {
                    mainCont.innerHTML = extraCont.innerHTML = sideCont.innerHTML = `<p class='text-muted text-center'>Empty</p>`;
                    return;
                }
                const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${idsTotales.join(",")}`;
                const resCartas = yield fetch(url);
                const dataCartas = yield resCartas.json();
                const cartasInfo = dataCartas.data;
                const dic = {};
                for (let carta of cartasInfo)
                    dic[carta.id] = carta;
                cargarSeccion(idsMain, mainCont, dic);
                cargarSeccion(idsExtra, extraCont, dic);
                cargarSeccion(idsSide, sideCont, dic);
                document.querySelector("#inputNombreMazo").value = mazo.nombre || "Unnamed";
                document.querySelector("#inputCreador").value = ((_g = mazo.creador) === null || _g === void 0 ? void 0 : _g.nombre) || "unknown";
                document.querySelector("#btnVerUser").href = `/login/verUser/${((_h = mazo.creador) === null || _h === void 0 ? void 0 : _h.id) || ""}`;
            }
            catch (e) {
                console.error("Error loading deck:", e);
                alert("The deck could not be loaded");
            }
        });
    }
    function cargarSeccion(ids, contenedor, dic) {
        contenedor.innerHTML = "";
        if (!ids || ids.length === 0) {
            contenedor.innerHTML = `<p class='text-muted text-center'>Empty</p>`;
            return;
        }
        for (let id of ids) {
            const info = dic[id];
            if (!info)
                continue;
            const col = document.createElement("div");
            col.className = "col d-flex justify-content-center";
            col.innerHTML = `
                <div class="card border-0 text-center w-100" style="background:transparent;">
                    <div style="height:240px; width:100%; flex-shrink:0;">
                        <img src="${info.card_images[0].image_url}"
                             alt="Imagen de la carta ${info.name}"
                             style="width:100%; height:100%; object-fit:contain; cursor:pointer;">
                    </div>
                </div>
            `;
            col.querySelector("img").addEventListener("click", () => mostrarDetalles(info));
            contenedor.appendChild(col);
        }
    }
    function mostrarDetalles(carta) {
        var _a;
        const zonaDetalles = document.querySelector("#zona_info");
        let preciosHTML = "";
        const p = (_a = carta.card_prices) === null || _a === void 0 ? void 0 : _a[0];
        if (p) {
            preciosHTML = `<hr><h5 class="mt-2">Precios estimados</h5><div class="d-flex flex-wrap gap-2">`;
            if (parseFloat(p.cardmarket_price) > 0)
                preciosHTML += `<span class="badge bg-success">Cardmarket: €${p.cardmarket_price}</span>`;
            if (parseFloat(p.tcgplayer_price) > 0)
                preciosHTML += `<span class="badge bg-primary">TCGPlayer: $${p.tcgplayer_price}</span>`;
            if (parseFloat(p.ebay_price) > 0)
                preciosHTML += `<span class="badge bg-warning text-dark">eBay: $${p.ebay_price}</span>`;
            if (parseFloat(p.amazon_price) > 0)
                preciosHTML += `<span class="badge bg-info text-dark">Amazon: $${p.amazon_price}</span>`;
            if (parseFloat(p.coolstuffinc_price) > 0)
                preciosHTML += `<span class="badge bg-secondary">CoolStuffInc: $${p.coolstuffinc_price}</span>`;
            preciosHTML += `</div>`;
        }
        zonaDetalles.innerHTML = `
            <div class="card mb-3 border-0" style="max-width: 700px;">
                <div class="card-header bg-transparent border-0">
                    <h4 class="card-title mb-0 text-center">${carta.name}</h4>
                </div>

                <div class="card-body">
                    <div class="row g-3">

                        <div class="col-md-4 d-flex justify-content-center align-self-start">
                            <img src="${carta.card_images[0].image_url}" class="img-fluid rounded"
                                 style="object-fit:contain; max-height:240px;" alt="Imagen de la carta ${carta.name}">
                        </div>

                        <div class="col-md-8" style="text-align: left;">
                            ${carta.type ? `<p><strong>Tipo:</strong> ${carta.type}</p>` : ''}
                            ${carta.archetype ? `<p><strong>Arquetipo:</strong> ${carta.archetype}</p>` : ''}
                            ${carta.attribute ? `<p><strong>Atributo:</strong> ${carta.attribute}</p>` : ''}
                            ${carta.race ? `<p><strong>Raza / Tipo:</strong> ${carta.race}</p>` : ''}
                            ${carta.level != null ? `<p><strong>Nivel:</strong> ${carta.level}</p>` : ''}
                            ${(carta.atk != null || carta.def != null) ? `<p><strong>ATK / DEF:</strong> ${carta.atk} / ${carta.def}</p>` : ''}
                        </div>

                    </div>

                    ${carta.desc ? `<hr><p class="mt-3" style="text-align: left;"><strong>Descripción:</strong> ${carta.desc}</p>` : ''}

                    ${preciosHTML}
                </div>
            </div>
        `;
    }
    yield cargarMazo();
    yield actualizarBotonFavorito();
    const btnComentario = document.getElementById('btnComentario');
    const modalContainer = document.getElementById('comentariosModalContainer');
    const usuarioMeta = document.getElementById('usuarioMeta');
    function crearEstrellasDisplay(valor) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="stars">${i <= valor ? '★' : '☆'}</span>`;
        }
        return html;
    }
    function crearEstrellasInteractivo(name, inicial = 0) {
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex align-items-center';
        wrapper.style.gap = '4px';
        for (let i = 1; i <= 5; i++) {
            const s = document.createElement('span');
            s.className = 'star-btn' + (i <= inicial ? ' filled' : '');
            s.dataset.value = i;
            s.innerText = '★';
            s.addEventListener('click', () => {
                const siblings = wrapper.querySelectorAll('.star-btn');
                siblings.forEach(sp => sp.classList.remove('filled'));
                for (let j = 0; j < i; j++)
                    siblings[j].classList.add('filled');
                wrapper.dataset.value = i;
            });
            wrapper.appendChild(s);
        }
        wrapper.dataset.value = inicial;
        return wrapper;
    }
    function abrirModalComentarios() {
        return __awaiter(this, void 0, void 0, function* () {
            modalContainer.innerHTML = `
            <div class="modal fade" id="modalComentarios" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Comments</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" style="padding:0;">
                    <div id="listaComentarios"></div>
                  </div>
                  <div class="modal-footer" id="modalFooter"></div>
                </div>
              </div>
            </div>
        `;
            const modalEl = modalContainer.querySelector('#modalComentarios');
            const bsModal = new bootstrap.Modal(modalEl);
            function cargarYRenderizar() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const lista = modalContainer.querySelector('#listaComentarios');
                    lista.innerHTML = `<div class="p-3 text-center text-muted">Charging...</div>`;
                    try {
                        const res = yield fetch(`/ComentarioAPI/mazo/${ID}`);
                        if (!res.ok) {
                            manejarError("Error al obtener comentarios", new Error("Respuesta no OK"));
                            return;
                        }
                        const comentarios = yield res.json();
                        if (!Array.isArray(comentarios) || comentarios.length === 0) {
                            lista.innerHTML = `<div class="p-3 text-center text-muted">There are no comments yet.</div>`;
                        }
                        else {
                            lista.innerHTML = '';
                            comentarios.forEach(c => {
                                var _a, _b, _c, _d, _e, _f;
                                const img = ((_b = (_a = c.usuario) === null || _a === void 0 ? void 0 : _a.imagenUsuario) === null || _b === void 0 ? void 0 : _b.trim()) ? c.usuario.imagenUsuario : '/img/fotoPerfil.png';
                                const nombre = ((_c = c.usuario) === null || _c === void 0 ? void 0 : _c.nombre) || 'Usuario';
                                const fecha = c.creadoEn ? new Date(c.creadoEn).toLocaleString() : '';
                                const item = document.createElement('div');
                                item.className = 'comentario-item d-flex gap-3';
                                item.innerHTML = `
                            <div style="flex:0 0 56px;">
                                <img src="${img}" class="comentario-avatar" alt="${nombre}">
                            </div>
                            <div style="flex:1;">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div class="comentario-nombre">${nombre}</div>
                                        <div class="comentario-fecha">${fecha}</div>
                                    </div>
                                    <div class="ms-2 text-end">${crearEstrellasDisplay(c.valoracion)}</div>
                                </div>
                                <div class="comentario-mensaje">${c.mensaje || ''}</div>
                            </div>
                        `;
                                const metaId = ((_d = usuarioMeta === null || usuarioMeta === void 0 ? void 0 : usuarioMeta.dataset) === null || _d === void 0 ? void 0 : _d.id) || '';
                                const isAdmin = ((_e = usuarioMeta === null || usuarioMeta === void 0 ? void 0 : usuarioMeta.dataset) === null || _e === void 0 ? void 0 : _e.isadmin) === 'true';
                                const botonesDiv = document.createElement('div');
                                botonesDiv.style.marginLeft = '8px';
                                botonesDiv.style.alignSelf = 'start';
                                if (isAdmin) {
                                    const btnDel = document.createElement('button');
                                    btnDel.className = 'btn-eliminar-comentario';
                                    btnDel.title = 'Eliminar comentario';
                                    btnDel.innerText = '✖';
                                    btnDel.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                                        if (!confirm('¿Eliminar comentario?'))
                                            return;
                                        try {
                                            const r = yield fetch(`/ComentarioAPI/${c.id}`, { method: 'DELETE' });
                                            if (!r.ok)
                                                console.error('Delete error');
                                            cargarYRenderizar();
                                        }
                                        catch (e) {
                                            console.error(e);
                                            alert('Could not delete');
                                        }
                                    }));
                                    botonesDiv.appendChild(btnDel);
                                }
                                if (metaId && parseInt(metaId) === ((_f = c.usuario) === null || _f === void 0 ? void 0 : _f.id)) {
                                    const btnEdit = document.createElement('button');
                                    btnEdit.className = 'btn btn-sm btn-outline-secondary ms-2';
                                    btnEdit.innerText = 'edit';
                                    btnEdit.addEventListener('click', () => iniciarEdicion(c, item, cargarYRenderizar));
                                    botonesDiv.appendChild(btnEdit);
                                }
                                if (botonesDiv.childElementCount > 0)
                                    item.appendChild(botonesDiv);
                                lista.appendChild(item);
                            });
                        }
                        const footer = modalContainer.querySelector('#modalFooter');
                        footer.innerHTML = '';
                        const usuarioId = (_a = usuarioMeta === null || usuarioMeta === void 0 ? void 0 : usuarioMeta.dataset) === null || _a === void 0 ? void 0 : _a.id;
                        if (usuarioId) {
                            const form = document.createElement('div');
                            form.className = 'w-100 p-3';
                            form.innerHTML = `
                        <div class="mb-2"><strong>Write a comment</strong></div>
                        <div id="nuevoRating" class="mb-2"></div>
                        <div class="mb-2"><textarea id="nuevoMensaje" class="form-control" rows="3" placeholder="Your comment..."></textarea></div>
                        <div class="d-flex justify-content-end">
                            <button id="btnEnviarComentario" class="btn btn-success btn-sm">Send</button>
                        </div>
                    `;
                            footer.appendChild(form);
                            const ratingWrapper = crearEstrellasInteractivo('nuevoRating', 0);
                            form.querySelector('#nuevoRating').appendChild(ratingWrapper);
                            form.querySelector('#btnEnviarComentario').addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                                const valoracion = parseInt(ratingWrapper.dataset.value) || 0;
                                const mensaje = form.querySelector('#nuevoMensaje').value.trim();
                                if (valoracion < 1 || valoracion > 5) {
                                    alert('Select a rating between 1 and 5');
                                    return;
                                }
                                if (!mensaje) {
                                    alert('Write a message');
                                    return;
                                }
                                try {
                                    const payload = { mensaje, valoracion };
                                    const res = yield fetch(`/ComentarioAPI?idMazo=${ID}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload)
                                    });
                                    if (!res.ok) {
                                        const txt = yield res.text();
                                        console.error(txt || 'Error creating comment');
                                        return;
                                    }
                                    form.querySelector('#nuevoMensaje').value = '';
                                    ratingWrapper.dataset.value = 0;
                                    const stars = ratingWrapper.querySelectorAll('.star-btn');
                                    stars.forEach(s => s.classList.remove('filled'));
                                    cargarYRenderizar();
                                }
                                catch (e) {
                                    console.error(e);
                                    alert('The comment could not be created');
                                }
                            }));
                        }
                        else {
                            const footerMsg = document.createElement('div');
                            footerMsg.className = 'w-100 p-3 text-muted text-center';
                            footerMsg.innerHTML = 'Log in to comment.';
                            modalContainer.querySelector('#modalFooter').appendChild(footerMsg);
                        }
                    }
                    catch (e) {
                        console.error(e);
                        lista.innerHTML = `<div class="p-3 text-center text-danger">Error loading comments</div>`;
                    }
                });
            }
            function iniciarEdicion(comentario, itemElement, recargar) {
                const contenidoDiv = itemElement.querySelector('div[style*="flex:1;"]');
                if (!contenidoDiv)
                    return;
                contenidoDiv.innerHTML = '';
                const ratingWrapper = crearEstrellasInteractivo('editRating', comentario.valoracion || 0);
                const txt = document.createElement('textarea');
                txt.className = 'form-control mt-2';
                txt.rows = 3;
                txt.value = comentario.mensaje || '';
                const acciones = document.createElement('div');
                acciones.className = 'd-flex justify-content-end mt-2';
                const btnGuardar = document.createElement('button');
                btnGuardar.className = 'btn btn-sm btn-primary me-2';
                btnGuardar.innerText = 'Guardar';
                btnGuardar.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                    const nuevaVal = parseInt(ratingWrapper.dataset.value) || 0;
                    const nuevoMsg = txt.value.trim();
                    if (nuevaVal < 1 || nuevaVal > 5) {
                        alert('Select a rating between 1 and 5');
                        return;
                    }
                    if (!nuevoMsg) {
                        alert('\n' + 'Write a message');
                        return;
                    }
                    try {
                        const payload = { mensaje: nuevoMsg, valoracion: nuevaVal };
                        const res = yield fetch(`/ComentarioAPI/${comentario.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!res.ok)
                            console.error('Error saving');
                        recargar();
                    }
                    catch (e) {
                        console.error(e);
                        alert('Could not save');
                    }
                }));
                const btnCancelar = document.createElement('button');
                btnCancelar.className = 'btn btn-sm btn-secondary';
                btnCancelar.innerText = 'Cancel';
                btnCancelar.addEventListener('click', () => recargar());
                acciones.appendChild(btnGuardar);
                acciones.appendChild(btnCancelar);
                contenidoDiv.appendChild(ratingWrapper);
                contenidoDiv.appendChild(txt);
                contenidoDiv.appendChild(acciones);
            }
            bsModal.show();
            cargarYRenderizar();
            modalEl.addEventListener('hidden.bs.modal', () => { modalContainer.innerHTML = ''; });
        });
    }
    btnComentario.addEventListener('click', abrirModalComentarios);
}));

function manejarError(mensaje, error) {
    console.error(mensaje, error);
    alert(mensaje);
}
