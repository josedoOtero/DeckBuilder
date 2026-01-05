// Script para la página Home: paginación de arquetipos, búsqueda y carga de imágenes por página
(function(){
    const grid = document.getElementById('archetypeGrid');
    const pagination = document.getElementById('archetypePagination');
    const searchInput = document.getElementById('archetypeSearch');
    let allArchetypes = [];
    let filteredArchetypes = []; // lista filtrada usada para paginar y renderizar

    // Paginación: 5 filas por página, asumimos 4 columnas por fila (col-lg-3)
    const rowsPerPage = 3;
    const columnsPerRow = 4; // si quieres que cambie con responsive, lo podemos recalcular
    const itemsPerPage = rowsPerPage * columnsPerRow; // 20
    let currentPage = 1;

    // simple debounce
    function debounce(fn, wait){
        let t;
        return function(...args){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,args), wait); };
    }

    function normalizeArchetypes(data){
        if(!Array.isArray(data)) return [];
        const normalized = data.map(item => {
            if(typeof item === 'string') return item;
            if(!item) return '';
            if(item.archetype) return item.archetype;
            if(item.name) return item.name;
            if(item.Archetype) return item.Archetype;
            if(item.archetype_name) return item.archetype_name;
            try{ const keys = Object.keys(item); if(keys.length===1 && typeof item[keys[0]]==='string') return item[keys[0]]; }catch(e){}
            return JSON.stringify(item);
        }).filter(Boolean);
        return Array.from(new Set(normalized));
    }

    async function fetchArchetypes(){
        try{
            const res = await fetch('https://db.ygoprodeck.com/api/v7/archetypes.php');
            if(!res.ok) throw new Error('No se pudo obtener arquetipos');
            const data = await res.json();
            allArchetypes = normalizeArchetypes(data);
            // inicialmente sin filtro
            filteredArchetypes = allArchetypes.slice();
            currentPage = 1;
            renderPage(currentPage);
            loadImagesForPage(currentPage);
            prefetchAdjacentPages(currentPage);
            renderPaginationControls();
        }catch(err){
            console.error('Error cargando arquetipos:', err);
            allArchetypes = ['Blue-Eyes','Dark Magician','Elemental HERO','Sky Striker','Salamangreat','Dragunity','Cyber Dragon','Toon'];
            filteredArchetypes = allArchetypes.slice();
            currentPage = 1;
            renderPage(currentPage);
            loadImagesForPage(currentPage);
            renderPaginationControls();
        }
    }

    async function fetchImageForArchetype(name){
        if(!name) return '/img/fondo/fondo1.jpg';
        try{
            const res = await fetch(
                'https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype='
                + encodeURIComponent(name)
            );
            if(!res.ok) throw new Error('cardinfo failed');
            const json = await res.json();
            if (json && Array.isArray(json.data) && json.data.length > 0) {
                // Tomar el primer candidato válido
                for (const c of json.data) {
                    if (c.card_images && c.card_images[0]) {
                        const imgObj = c.card_images[0];
                        // Intentar primero cropped (solo arte) → luego full → luego small
                        return imgObj.image_url_cropped
                            || imgObj.image_url
                            || imgObj.image_url_small
                            || '/img/fondo/fondo1.jpg';
                    }
                }
            }
        } catch(e) {
            console.warn('No image for', name, e);
        }
        return '/img/fondo/fondo1.jpg';
    }


    // pool de concurrencia simple para cargar imágenes
    async function fillImagesConcurrently(archetypes, concurrency){
        if(!Array.isArray(archetypes) || archetypes.length===0) return;
        const queue = archetypes.slice();
        const workers = [];
        for(let i=0;i<concurrency;i++){
            workers.push((async function worker(){
                while(queue.length){
                    const name = queue.shift();
                    try{
                        const url = await fetchImageForArchetype(name);
                        const selector = `[data-archetype="${cssEscape(name)}"]`;
                        const el = grid ? grid.querySelector(selector) : null;
                        if(el && url) el.style.backgroundImage = `url('${url}')`;
                    }catch(e){
                        // ignora errores individuales
                    }
                }
            })());
        }
        await Promise.all(workers);
    }

    // cargar imágenes para una página concreta (usa filteredArchetypes)
    function loadImagesForPage(page){
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(filteredArchetypes.length, start + itemsPerPage);
        const slice = filteredArchetypes.slice(start, end);
        fillImagesConcurrently(slice, 6).catch(()=>{});
    }

    // prefetch de páginas adyacentes (prev/next)
    function prefetchAdjacentPages(page){
        const total = Math.ceil(filteredArchetypes.length / itemsPerPage);
        const pagesToPrefetch = [];
        if(page > 1) pagesToPrefetch.push(page - 1);
        if(page < total) pagesToPrefetch.push(page + 1);
        pagesToPrefetch.forEach(p => {
            const s = (p - 1) * itemsPerPage;
            const e = Math.min(filteredArchetypes.length, s + itemsPerPage);
            const slice = filteredArchetypes.slice(s, e);
            fillImagesConcurrently(slice, 3).catch(()=>{});
        });
    }

    // escape para usar en selector de atributo
    function cssEscape(str){
        return String(str).replace(/"/g,'\\"').replace(/'/g, "\\'").replace(/\[/g,'\\[').replace(/\]/g,'\\]');
    }

    function renderGridSlice(start, end){
        if(!grid) return;
        grid.innerHTML='';
        const items = filteredArchetypes.slice(start, end);
        if(items.length === 0){
            const col = document.createElement('div');
            col.className = 'col-12';
            col.innerHTML = '<div class="p-4 text-center text-muted">No se encontraron arquetipos que coincidan con la búsqueda.</div>';
            grid.appendChild(col);
            return;
        }
        for(let i=0;i<items.length;i++){
            const raw = items[i];
            const name = (typeof raw === 'string') ? raw : String(raw);
            const idx = start + i;
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
            const card = document.createElement('div');
            card.className = 'archetype-card';
            card.setAttribute('data-archetype', name);
            card.style.backgroundImage = "url('/img/fondo/fondo1.jpg')";
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';

            const color = (idx % 2 === 0) ? 'linear-gradient(0deg, rgba(13,110,253,0.6), rgba(13,110,253,0.6))' : 'linear-gradient(0deg, rgba(220,53,69,0.6), rgba(220,53,69,0.6))';
            const overlay = document.createElement('div'); overlay.className='overlay-color'; overlay.style.background = color;
            const content = document.createElement('div'); content.className='content';
            const title = document.createElement('div'); title.className='archetype-title'; title.textContent = name;
            const btn = document.createElement('a'); btn.className='btn btn-sm btn-light'; btn.textContent='Ver más';
            // construir la URL de fandom para el arquetipo y abrir en nueva pestaña
            try{
                const fandomPath = String(name).trim().replace(/\s+/g, '_');
                const fandomUrl = 'https://yugioh.fandom.com/wiki/' + encodeURIComponent(fandomPath);
                btn.href = fandomUrl;
                btn.target = '_blank';
                btn.rel = 'noopener';
            }catch(e){
                btn.href = '';
            }
            content.appendChild(title);
            content.appendChild(btn);

            card.appendChild(overlay);
            card.appendChild(content);
            col.appendChild(card);
            grid.appendChild(col);
        }
    }

    function renderPaginationControls(){
        if(!pagination) return;
        pagination.innerHTML = '';
        const total = Math.ceil(filteredArchetypes.length / itemsPerPage) || 1;

        // Prev
        const prevLi = document.createElement('li'); prevLi.className = 'page-item' + (currentPage===1 ? ' disabled' : '');
        const prevA = document.createElement('a'); prevA.className='page-link'; prevA.href='#'; prevA.textContent='Anterior';
        prevA.addEventListener('click', (e)=>{ e.preventDefault(); if(currentPage>1) goToPage(currentPage-1); });
        prevLi.appendChild(prevA); pagination.appendChild(prevLi);

        // páginas (si hay muchas, limitar visualización a ventana razonable)
        const maxButtons = 7; // mostrar máximo 7 botones de página
        const half = Math.floor(maxButtons/2);
        let startPage = Math.max(1, currentPage - half);
        let endPage = Math.min(total, startPage + maxButtons - 1);
        if(endPage - startPage < maxButtons - 1){ startPage = Math.max(1, endPage - maxButtons + 1); }

        for(let p=startPage;p<=endPage;p++){
            const li = document.createElement('li'); li.className = 'page-item' + (p===currentPage ? ' active' : '');
            const a = document.createElement('a'); a.className='page-link'; a.href='#'; a.textContent = String(p);
            a.addEventListener('click', (e)=>{ e.preventDefault(); goToPage(p); });
            li.appendChild(a); pagination.appendChild(li);
        }

        // Next
        const nextLi = document.createElement('li'); nextLi.className = 'page-item' + (currentPage===total ? ' disabled' : '');
        const nextA = document.createElement('a'); nextA.className='page-link'; nextA.href='#'; nextA.textContent='Siguiente';
        nextA.addEventListener('click', (e)=>{ e.preventDefault(); if(currentPage<total) goToPage(currentPage+1); });
        nextLi.appendChild(nextA); pagination.appendChild(nextLi);
    }

    function goToPage(p){
        const total = Math.ceil(filteredArchetypes.length / itemsPerPage) || 1;
        if(p<1) p=1; if(p>total) p=total;
        currentPage = p;
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(filteredArchetypes.length, start + itemsPerPage);
        renderGridSlice(start, end);
        loadImagesForPage(currentPage);
        prefetchAdjacentPages(currentPage);
        renderPaginationControls();
        // scroll to grid
        if(grid) grid.scrollIntoView({behavior:'smooth', block:'start'});
    }

    // buscar por nombre (filtrado)
    function applySearchFilter(query){
        const q = String(query||'').trim().toLowerCase();
        if(!q){
            filteredArchetypes = allArchetypes.slice();
        } else {
            filteredArchetypes = allArchetypes.filter(a => String(a||'').toLowerCase().includes(q));
        }
        currentPage = 1;
        renderPage(currentPage);
        loadImagesForPage(currentPage);
        prefetchAdjacentPages(currentPage);
        renderPaginationControls();
    }

    // render de página (usa filteredArchetypes)
    function renderPage(page){
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(filteredArchetypes.length, start + itemsPerPage);
        renderGridSlice(start, end);
    }

    // inicialización del input de búsqueda con debounce
    const debouncedSearch = debounce(function(e){ applySearchFilter(e.target.value); }, 300);
    if(searchInput){ searchInput.addEventListener('input', debouncedSearch); }

    // inicialización
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', fetchArchetypes);
    } else {
        fetchArchetypes();
    }
})();