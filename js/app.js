const productos = [
    { id: 1, nombre: "Set Rosa Glam", descripcion: "Uñas press-on rosas con brillo", precio: 299, categoria: "Press On", imagen: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop" },
    { id: 2, nombre: "Set Nude Elegance", descripcion: "Estilo francés elegante", precio: 349, categoria: "Press On", imagen: "https://images.unsplash.com/photo-1610992479597-7bb7b3fd5899?w=400&h=400&fit=crop" },
    { id: 3, nombre: "Kit Glitter Party", descripcion: "Purpurina extra brillante", precio: 399, categoria: "Kit Especial", imagen: "https://images.unsplash.com/photo-1616683693504-0793a0ee3a38?w=400&h=400&fit=crop" },
    { id: 4, nombre: "Set Francesita", descripcion: "Diseño francés clásico", precio: 279, categoria: "Press On", imagen: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=400&fit=crop" },
    { id: 5, nombre: "Pegamento Profesional", descripcion: "Adhesivo de larga duración", precio: 89, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1585679884075-640b3acdd9f4?w=400&h=400&fit=crop" },
    { id: 6, nombre: "Lima y Pulidor", descripcion: "Set de limas doble cara", precio: 49, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=400&fit=crop" }
];

let carrito = [];

function guardarCarrito() { 
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
}

function cargarCarrito() {
    const data = localStorage.getItem("carrito");
    carrito = data ? JSON.parse(data) : [];
    actualizarBadge();
    renderizarCarrito();
}

function actualizarBadge() {
    const total = carrito.reduce((sum, i) => sum + i.cantidad, 0);
    const badge = document.getElementById("cartBadge");
    if (badge) badge.textContent = total;
}

function agregarAlCarrito(id) {
    const existente = carrito.find(i => i.id === id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }
    guardarCarrito();
    actualizarBadge();
    renderizarCarrito();
    mostrarToast("Producto agregado al carrito");
}

function eliminarDelCarrito(id, eliminarTodo) {
    const index = carrito.findIndex(i => i.id === id);
    if (index !== -1) {
        if (eliminarTodo || carrito[index].cantidad === 1) {
            carrito.splice(index, 1);
        } else {
            carrito[index].cantidad--;
        }
        guardarCarrito();
        actualizarBadge();
        renderizarCarrito();
        mostrarToast("Carrito actualizado");
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarBadge();
    renderizarCarrito();
    mostrarToast("Carrito vaciado");
}

function renderizarCarrito() {
    const container = document.getElementById("cartItemsContainer");
    const totalSpan = document.getElementById("cartTotalAmount");
    if (!container) return;
    
    if (carrito.length === 0) {
        container.innerHTML = '<div class="cart-empty-msg"><i class="fas fa-shopping-cart"></i> No hay productos en el carrito</div>';
        if (totalSpan) totalSpan.textContent = "$0 MXN";
        return;
    }
    
    let html = "";
    let total = 0;
    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        if (!prod) return;
        const subtotal = prod.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="cart-item">
                <img class="cart-item__img" src="${prod.imagen}" alt="${prod.nombre}">
                <div class="cart-item__details">
                    <div class="cart-item__title">${prod.nombre}</div>
                    <div class="cart-item__price">$${prod.precio} MXN</div>
                    <div class="cart-item__quantity">
                        <button onclick="eliminarDelCarrito(${prod.id}, false)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="agregarAlCarrito(${prod.id})">+</button>
                        <button class="cart-item__remove" onclick="eliminarDelCarrito(${prod.id}, true)"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div class="cart-item__subtotal">$${subtotal}</div>
            </div>
        `;
    });
    container.innerHTML = html;
    if (totalSpan) totalSpan.textContent = "$" + total + " MXN";
}

function renderizarProductos() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    
    const categoria = document.querySelector(".filter-btn.active")?.dataset.cat || "todos";
    const busqueda = document.getElementById("searchInput").value.toLowerCase();
    const orden = document.getElementById("sortSelect").value;

    let filtered = [...productos];
    if (categoria !== "todos") filtered = filtered.filter(p => p.categoria === categoria);
    if (busqueda) filtered = filtered.filter(p => p.nombre.toLowerCase().includes(busqueda) || p.descripcion.toLowerCase().includes(busqueda));
    if (orden === "price-asc") filtered.sort((a, b) => a.precio - b.precio);
    if (orden === "price-desc") filtered.sort((a, b) => b.precio - a.precio);

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No hay productos</p>';
        return;
    }

    grid.innerHTML = filtered.map(prod => `
        <div class="product-card">
            <img class="product-card__img" src="${prod.imagen}" alt="${prod.nombre}">
            <div class="product-card__info">
                <h3 class="product-card__title">${prod.nombre}</h3>
                <p class="product-card__desc">${prod.descripcion}</p>
                <p class="product-card__price">$${prod.precio} MXN</p>
                <button class="product-card__button" onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
            </div>
        </div>
    `).join("");
}

function mostrarToast(msg) {
    const toast = document.getElementById("toastMsg");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

document.addEventListener("DOMContentLoaded", function() {
    cargarCarrito();
    renderizarProductos();

    document.getElementById("hamburgerBtn").addEventListener("click", function() {
        document.getElementById("sideMenu").classList.add("active");
        document.getElementById("overlay").classList.add("active");
    });
    document.getElementById("closeMenuBtn").addEventListener("click", function() {
        document.getElementById("sideMenu").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
    });

    document.getElementById("cartIconBtn").addEventListener("click", function() {
        document.getElementById("cartSidebar").classList.add("active");
        document.getElementById("overlay").classList.add("active");
    });
    document.getElementById("closeCartBtn").addEventListener("click", function() {
        document.getElementById("cartSidebar").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
    });

    document.getElementById("overlay").addEventListener("click", function() {
        document.getElementById("sideMenu").classList.remove("active");
        document.getElementById("cartSidebar").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
    });

    document.getElementById("clearCartBtn").addEventListener("click", vaciarCarrito);

    document.getElementById("checkoutBtn").addEventListener("click", function() {
        if (carrito.length === 0) {
            mostrarToast("El carrito está vacío");
            return;
        }
        alert("Compra realizada con éxito. ¡Gracias!");
        vaciarCarrito();
        document.getElementById("cartSidebar").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
    });

    document.querySelectorAll(".filter-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".filter-btn").forEach(function(b) {
                b.classList.remove("active");
            });
            this.classList.add("active");
            renderizarProductos();
        });
    });

    document.getElementById("searchInput").addEventListener("input", renderizarProductos);
    document.getElementById("searchBtn").addEventListener("click", renderizarProductos);
    document.getElementById("sortSelect").addEventListener("change", renderizarProductos);
});