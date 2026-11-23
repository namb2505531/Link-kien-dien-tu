// Trần Nguyễn Kha - B24107672

// 1. BIẾN DÙNG CHUNG & HÀM LẤY DỮ LIỆU TỪ DATA.JS
const CART_KEY = "gioHangPCStore";
let originalOrder = [];

// Tìm sản phẩm trong file data.js theo mã
function findProductInData(id) {
  return products.find((sp) => sp.ma === id);
}

// 2. CHUYỂN TRANG CHI TIẾT KHI BẤM VÀO TÊN SẢN PHẨM

function bindProductDetailLinks() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const sp = findProductInData(card.dataset.id);
    if (!sp) return;
    card.style.cursor = "pointer";
    card.onclick = function (e) {
      if (e.target.closest(".add-cart")) return;
      window.location.href = `./product-details.html?id=${encodeURIComponent(sp.ma)}`;
    };
  });
}

// 3. GIỎ HÀNG

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  let total = 0;
  cart.forEach((item) => (total += item.soLuong));

  // Cập nhật số lượng lên icon giỏ hàng trên Header
  let count = document.querySelector(".header__cart-btn .header__notify");
  if (count) count.textContent = total;
}

function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  let product = cart.find((sp) => sp.ma === id);

  if (product) {
    product.soLuong += 1;
  } else {
    cart.push({
      ma: id,
      ten: name,
      gia: Number(price),
      hinhAnh: image,
      soLuong: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  alert("Đã thêm vào giỏ hàng!");
}

function handleAddCart() {
  let card = this.closest(".product-card");
  let id = card.dataset.id;
  let sp = findProductInData(id); // Lấy tên và giá chuẩn từ data.js
  let image = card.querySelector("img").getAttribute("src");

  if (sp) {
    addToCart(sp.ma, sp.ten, sp.giaban, image);
  }
}

function bindAddToCart() {
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.onclick = handleAddCart;
  });
}

// 4. LỌC DANH MỤC (LẤY CATEGORY TỪ DATA.JS)

function showCategory(category, element) {
  document.querySelectorAll(".product-card").forEach((card) => {
    let id = card.dataset.id;
    let sp = findProductInData(id);

    if (category === "all" || (sp && sp.category === category)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Đổi màu mục đang chọn ở menu bên trái
  document.querySelectorAll(".filter-category li").forEach((item) => {
    item.classList.remove("active");
  });
  if (element) element.classList.add("active");

  // Đặt lại ô sắp xếp về mặc định
  let sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "default";
  sortPrice("default");
}

// 5. SẮP XẾP GIÁ (LẤY GIÁ TỪ DATA.JS)

function getPrice(card) {
  let id = card.dataset.id;
  let sp = findProductInData(id);
  return sp ? Number(sp.giaban) : 0;
}

function sortPrice(type) {
  let list = document.querySelector(".product-list");
  if (!list) return;

  let items;

  if (type === "default") {
    items = [...originalOrder];
  } else {
    items = Array.from(list.querySelectorAll(".product-card"));

    if (type === "asc") {
      items.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (type === "desc") {
      items.sort((a, b) => getPrice(b) - getPrice(a));
    }
  }

  list.innerHTML = "";
  items.forEach((item) => list.appendChild(item));

  // Gắn lại sự kiện click sau khi sắp xếp lại thẻ
  bindAddToCart();
  bindProductDetailLinks();
}

// 6. CHẠY KHI TẢI TRANG XONG

document.addEventListener("DOMContentLoaded", function () {
  bindProductDetailLinks();
  bindAddToCart();

  // Lưu thứ tự ban đầu của 15 sản phẩm
  originalOrder = Array.from(
    document.querySelectorAll(".product-list .product-card"),
  );

  // Gắn sự kiện bấm chọn danh mục
  document.querySelectorAll(".filter-category li").forEach((li) => {
    li.addEventListener("click", function () {
      showCategory(li.dataset.category, li);
    });
  });

  // Nếu từ trang chủ bấm sang có kèm ?cat=cpu thì tự lọc luôn
  let urlParams = new URLSearchParams(window.location.search);
  let categoryId = urlParams.get("cat");

  if (categoryId) {
    let targetElement = document.querySelector(
      `.filter-category li[data-category="${categoryId}"]`,
    );
    if (targetElement) {
      showCategory(categoryId, targetElement);
    }
  }
});
