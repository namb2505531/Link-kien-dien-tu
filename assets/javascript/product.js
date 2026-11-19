
// ==============================
// BIẾN DÙNG CHUNG
// ==============================
const CART_KEY = "gioHangPCStore";               
const CART_PAGE_URL = "/page/show-cart.html";   

let originalOrder = [];                          


// ==============================
// CART  
// ==============================
function updateCartCount(){

    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    let total = 0;
    cart.forEach(item => total += item.soLuong);

    let count = document.getElementById("cart-count");
    if(count) count.textContent = total;
}

function addToCart(name, price, image){

    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    let product = cart.find(sp => sp.ten === name);

    if(product){
        product.soLuong += 1;
    }else{
        cart.push({
            ten: name,
            gia: Number(price),
            hinhAnh: image,
            soLuong: 1
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();

    alert("Đã thêm vào giỏ hàng!");
}

function handleAddCart(){
    let card = this.closest(".product-card");

    let name = card.querySelector("h4").innerText;
    let priceText = card.querySelector(".new-price").innerText;
    let price = Number(priceText.replace(/\D/g, ''));
    let image = card.querySelector("img").src;

    addToCart(name, price, image);
}

function bindAddToCart(){
    document.querySelectorAll(".add-cart").forEach(btn => {
        btn.onclick = handleAddCart;
    });
}

function redirect2ShowCartPage(){
    const cartBtn = document.getElementById("js-cart-notify");
    if(cartBtn){
        cartBtn.addEventListener("click", function(){
            location.href = CART_PAGE_URL;
        });
    }
}


// ==============================
// DANH MỤC  [sanpham.js: showCategory]
// ==============================

function getCategory(card){
    if(card.dataset.category) return card.dataset.category;

    const img = card.querySelector("img");
    const src = img ? decodeURIComponent(img.getAttribute("src")).toLowerCase() : "";

    if(src.includes("/cpu/"))       return "cpu";
    if(src.includes("/vga/"))       return "vga";
    if(src.includes("/mainbroad/")) return "mainboard";   
    if(src.includes("/ram/"))       return "ram";
    if(src.includes("/ssd/"))       return "ssd";
    return "";
}

function showCategory(category, element){

    document.querySelectorAll(".product-card").forEach(card => {
        const show = (category === "all" || getCategory(card) === category);
        card.style.display = show ? "" : "none";
    });

    
    document.querySelectorAll(".filter-category li").forEach(item => {
        item.classList.remove("active");
    });
    if(element) element.classList.add("active");

    
    const sortSelect = document.getElementById("sortSelect");
    if(sortSelect){
        sortSelect.value = "default";
    }

    
    sortPrice("default");
}


// ==============================
// SORT  
// ==============================
function getPrice(card) {
    let text = card.querySelector(".new-price").innerText;
    return Number(text.replace(/\D/g, ''));
}

function sortPrice(type) {

    const list = document.querySelector(".product-list");
    if (!list) return;

    let items;

    if (type === "default") {
        items = [...originalOrder];
    }
    else {
        items = Array.from(list.querySelectorAll(".product-card"));

        if (type === "asc") {
            items.sort((a, b) => getPrice(a) - getPrice(b));
        }
        else if (type === "desc") {
            items.sort((a, b) => getPrice(b) - getPrice(a));
        }
    }

    list.innerHTML = "";

    items.forEach(item => list.appendChild(item));

    // bind lại event
    bindAddToCart();
}


// ==============================
// LOAD
// ==============================
document.addEventListener("DOMContentLoaded", function(){

    updateCartCount();

    bindAddToCart();


    originalOrder = Array.from(document.querySelectorAll(".product-list .product-card"));

    
    document.querySelectorAll(".filter-category li").forEach(li => {
        li.addEventListener("click", function(){
            showCategory(li.dataset.category, li);
        });
    });


    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('cat');

    if (categoryId) {
        const targetElement = document.querySelector(`.filter-category li[data-category="${categoryId}"]`);

        if (targetElement) {
            showCategory(categoryId, targetElement);
        }
    }

    redirect2ShowCartPage();
});

