// Lê Hoàng Nhân B2408868
// Trang chi tiết sản phẩm: đổi ảnh, số lượng, hiển thị dữ liệu từ data.js, giỏ hàng

// ================= 1. HẰNG SỐ & HÀM DÙNG CHUNG =================
const CART_KEY = "gioHangPCStore"; // phải trùng với key trong product.js
const MIN_QTY = 1;
const MAX_QTY = 10;

// Các trường chung.
const COMMON_KEYS = [
  "category",
  "ma",
  "hinh",
  "ten",
  "hang",
  "giaban",
  "mota",
  "thongso",
];

// Nhãn tiếng Việt cho tên thuộc tính trong data.js.
const SPEC_LABELS = {
  // CPU
  socket: "Socket",
  kientruc: "Kiến trúc",
  nhanluong: "Nhân / luồng",
  xungnhip: "Xung nhịp",
  cache: "Bộ nhớ đệm",
  dohoa: "Đồ họa tích hợp",
  ram: "RAM hỗ trợ",
  tdp: "TDP",
  // Mainboard
  chipset: "Chipset",
  cpuhotro: "CPU hỗ trợ",
  kichthuoc: "Kích thước",
  kheram: "Khe RAM",
  luutru: "Lưu trữ",
  khemorong: "Khe mở rộng",
  congxuathinh: "Cổng xuất hình",
  ketnoi: "Kết nối",
  // RAM
  dongsp: "Dòng sản phẩm",
  dungluong: "Dung lượng",
  chuanbus: "Chuẩn / Bus",
  dotre: "Độ trễ",
  dienap: "Điện áp",
  tannhiet: "Tản nhiệt",
  congnghe: "Công nghệ",
  // SSD
  masp: "Mã SP",
  giaotiep: "Giao tiếp",
  tocdo: "Tốc độ",
  bonho: "Bộ nhớ",
  phukien: "Phụ kiện",
  tuongthich: "Tương thích",
  // VGA
  gpu: "GPU",
  cuda: "Nhân CUDA",
  vram: "VRAM",
  nguon: "Nguồn đề xuất",
};

// Chuyển đường dẫn ảnh trong data.js sang đường dẫn dùng trong thư mục assets.
function getProductImagePath(product) {
  return product.hinh.replace("../img/", "./assets/img/");
}

// Hiển thị giá theo định dạng Việt Nam, kèm đơn vị đồng.
function formatPrice(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

// Giá cũ ước tính: cao hơn giá bán 25%, làm tròn đến hàng nghìn.
function getOldPrice(product) {
  return Math.round((Number(product.giaban) * 1.25) / 1000) * 1000;
}

// Chuyển tên thuộc tính thành nhãn dễ đọc.
function formatSpecLabel(key) {
  return SPEC_LABELS[key] || key;
}

// Lấy mã sản phẩm từ ?id= trên URL rồi tìm trong data.js.
function getCurrentProduct() {
  if (typeof products === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("id");
  return products.find((item) => item.ma === id) || null;
}

// Trả về các cặp [tên thông số, giá trị] của một sản phẩm.
function getProductSpecEntries(product) {
  if (product.thongso && typeof product.thongso === "object") {
    return Object.entries(product.thongso);
  }
  return Object.entries(product).filter(([key]) => !COMMON_KEYS.includes(key));
}

// ================= 2. ĐỔI ẢNH NHỎ LÊN ẢNH CHÍNH =================
const mainImg = document.querySelector(".product-gallery__img");
const thumbBtns = document.querySelectorAll(".product-thumbs__btn");

thumbBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    mainImg.src = img.src;
    mainImg.alt = img.alt;
    thumbBtns.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ================= 3. SỐ LƯỢNG =================
const qtyInput = document.getElementById("js-qty");

// Đưa số lượng về số nguyên trong khoảng MIN_QTY – MAX_QTY.
function setQty(value) {
  const n = Number.parseInt(value, 10);
  qtyInput.value = Number.isNaN(n)
    ? MIN_QTY
    : Math.min(MAX_QTY, Math.max(MIN_QTY, n));
}

document
  .getElementById("js-qty-minus")
  .addEventListener("click", () => setQty(+qtyInput.value - 1));
document
  .getElementById("js-qty-plus")
  .addEventListener("click", () => setQty(+qtyInput.value + 1));
qtyInput.addEventListener("change", () => setQty(qtyInput.value));

// ================= 4. HIỂN THỊ SẢN PHẨM ĐƯỢC CHỌN =================
function renderProductDetails() {
  const product = getCurrentProduct();
  // Không tìm thấy mã thì giữ lại nội dung tĩnh có sẵn trong HTML.
  if (!product) return;

  localStorage.setItem("selectedProductId", product.ma);

  const imagePath = getProductImagePath(product);
  const mainImage = document.querySelector(".product-gallery__img");
  const thumbnails = document.querySelectorAll(".product-thumbs__btn img");
  const title = document.querySelector(".product-info__title");
  const description = document.querySelector(".product-info__desc");
  const currentPrice = document.querySelector(".product-price__current");
  const oldPrice = document.querySelector(".product-price__old");
  const breadcrumb = document.querySelector(".breadcrumb span:last-child");

  if (mainImage) {
    mainImage.src = imagePath;
    mainImage.alt = product.ten;
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.src = imagePath;
    thumbnail.alt = product.ten;
  });

  if (title) title.textContent = product.ten;
  if (description) description.textContent = product.mota;
  if (currentPrice) currentPrice.textContent = formatPrice(product.giaban);
  if (oldPrice) oldPrice.textContent = formatPrice(getOldPrice(product));
  if (breadcrumb) breadcrumb.textContent = product.ten;

  // Dựng lại toàn bộ bảng thông số để không bị thiếu/thừa dòng.
  const specBody = document.querySelector(".product-spec-table tbody");
  if (specBody) {
    specBody.replaceChildren();
    getProductSpecEntries(product).forEach(([key, value]) => {
      const row = document.createElement("tr");
      const label = document.createElement("th");
      const cell = document.createElement("td");
      label.textContent = formatSpecLabel(key);
      cell.textContent = String(value);
      row.append(label, cell);
      specBody.appendChild(row);
    });
  }

  document.title = `${product.ten} | ELECTROSHOP`;
}

renderProductDetails();

// ================= 5. BẢNG SO SÁNH SẢN PHẨM =================
function renderProductComparison() {
  const currentProduct = getCurrentProduct();
  if (!currentProduct) return;

  // Ưu tiên sản phẩm khác cùng danh mục; nếu không có thì chọn sản phẩm khác đầu tiên.
  const sameCategory = products.filter(
    (item) =>
      item.category === currentProduct.category &&
      item.ma !== currentProduct.ma,
  );
  const compareProduct =
    sameCategory[0] || products.find((item) => item.ma !== currentProduct.ma);
  if (!compareProduct) return;

  const compareHeaders = document.querySelectorAll(".product-compare__product");

  // Điền ảnh, tên, giá vào một cột của bảng so sánh.
  function fillHeader(header, product) {
    if (!header) return;
    const image = header.querySelector("img");
    const name = header.querySelector(".product-compare__name");
    const price = header.querySelector(".product-compare__price");
    const link = header.querySelector(".product-compare__link");

    if (image) {
      image.src = getProductImagePath(product);
      image.alt = product.ten;
    }
    if (name) name.textContent = product.ten;
    if (price) price.textContent = formatPrice(product.giaban);
    if (link) {
      link.href = `./product-details.html?id=${encodeURIComponent(product.ma)}`;
    }
  }

  fillHeader(compareHeaders[0], currentProduct);
  fillHeader(compareHeaders[1], compareProduct);

  // Gộp tên thông số của cả hai sản phẩm để không bỏ sót thông số chỉ có ở một bên.
  const currentSpecs = getProductSpecEntries(currentProduct);
  const compareSpecs = getProductSpecEntries(compareProduct);
  const specKeys = new Set([
    ...currentSpecs.map(([key]) => key),
    ...compareSpecs.map(([key]) => key),
  ]);

  const tbody = document.querySelector(".product-compare__table tbody");
  if (!tbody) return;
  tbody.replaceChildren();

  specKeys.forEach((key) => {
    const currentValue = currentSpecs.find(([k]) => k === key)?.[1] || "-";
    const compareValue = compareSpecs.find(([k]) => k === key)?.[1] || "-";

    const row = document.createElement("tr");
    if (String(currentValue) !== String(compareValue)) {
      row.classList.add("is-diff");
    }

    const labelCell = document.createElement("th");
    labelCell.scope = "row";
    labelCell.textContent = formatSpecLabel(key);

    const currentCell = document.createElement("td");
    currentCell.textContent = String(currentValue);

    const compareCell = document.createElement("td");
    compareCell.textContent = String(compareValue);

    row.append(labelCell, currentCell, compareCell);
    tbody.appendChild(row);
  });
}

renderProductComparison();

// ================= 6. SẢN PHẨM TƯƠNG TỰ =================
function renderRelatedProducts() {
  const currentProduct = getCurrentProduct();
  if (!currentProduct) return;

  const related = products.filter(
    (item) =>
      item.category === currentProduct.category &&
      item.ma !== currentProduct.ma,
  );
  if (related.length === 0) return;

  document.querySelectorAll(".product-related__item").forEach((item, index) => {
    // Thẻ gợi ý nhiều hơn sản phẩm cùng danh mục thì danh sách được lặp lại.
    const product = related[index % related.length];

    const image = item.querySelector("img");
    const name = item.querySelector(".product-related__name");
    const price = item.querySelector(".product-related__price");
    const oldPrice = item.querySelector(".product-price__old");
    const link = item.querySelector(".product-related__link");

    if (image) {
      image.src = getProductImagePath(product);
      image.alt = product.ten;
    }
    if (name) name.textContent = product.ten;
    if (price) price.textContent = formatPrice(product.giaban);
    if (oldPrice) oldPrice.textContent = formatPrice(getOldPrice(product));
    if (link) {
      link.href = `./product-details.html?id=${encodeURIComponent(product.ma)}`;
    }
  });
}

renderRelatedProducts();

// ================= 7. GIỎ HÀNG =================
// Định dạng lưu giống product.js:
// gioHangPCStore = [{ ma, ten, gia, hinhAnh, soLuong }, ...] (đã stringify)
const addCartBtn = document.getElementById("js-add-cart");
const buyNowBtn = document.querySelector(".product-actions__buy");
const cartCount = document.querySelector(".header__cart-btn .header__notify");
const buyNotify = document.querySelector(".js-notify");

// Đọc giỏ hàng, nếu dữ liệu hỏng hoặc chưa có thì trả về mảng rỗng.
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

// Tính tổng số lượng và cập nhật lên biểu tượng giỏ hàng ở header.
function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + item.soLuong, 0);
  if (cartCount) cartCount.textContent = String(total);
}

// Thêm sản phẩm vào giỏ: đã có thì cộng dồn số lượng.
function addProductToCart(product, qty) {
  const cart = getCart();
  const item = cart.find((sp) => sp.ma === product.ma);

  if (item) {
    item.soLuong += qty;
  } else {
    cart.push({
      ma: product.ma,
      ten: product.ten,
      gia: Number(product.giaban),
      hinhAnh: getProductImagePath(product),
      soLuong: qty,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// Hiện thông báo thêm vào giỏ hàng trong 3 giây.
function showAddCartMessage() {
  if (!buyNotify) return;
  buyNotify.style.transform = "translateY(0px)";
  window.setTimeout(() => {
    buyNotify.style.transform = "translateY(100px)";
  }, 3000);
}

// Tab khác thay đổi giỏ hàng thì cập nhật lại số trên header của tab này.
window.addEventListener("storage", (event) => {
  if (event.key === CART_KEY) updateCartCount();
});

updateCartCount();

if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    const product = getCurrentProduct();
    if (!product) return;
    addProductToCart(product, Number.parseInt(qtyInput.value, 10) || MIN_QTY);
    showAddCartMessage();
  });
}

if (buyNowBtn) {
  buyNowBtn.addEventListener("click", () => {
    const product = getCurrentProduct();
    if (product) {
      addProductToCart(product, Number.parseInt(qtyInput.value, 10) || MIN_QTY);
    }
    window.location.href = "./cart.html";
  });
}
