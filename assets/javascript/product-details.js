// Lê Hoàng Nhân B2408868
// Đổi ảnh nhỏ lên ảnh chính
// Lê Hoàng Nhân B2408868
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

// Số lượng
const qtyInput = document.getElementById("js-qty");
const MIN_QTY = 1;
const MAX_QTY = 10;

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

// Đọc và hiển thị sản phẩm được chọn từ data.js
function getProductImagePath(product) {
  return product.hinh.replace("../img/", "./assets/img/");
}

function formatPrice(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function renderProductDetails() {
  if (typeof products === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((item) => item.ma === id);

  if (!product) {
    return;
  }

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

  if (title) {
    title.textContent = product.ten;
  }
  if (description) {
    description.textContent = product.mota;
  }
  if (currentPrice) {
    currentPrice.textContent = formatPrice(product.giaban);
  }
  if (oldPrice) {
    const oldValue = Math.round((Number(product.giaban) * 1.25) / 1000) * 1000;
    oldPrice.textContent = formatPrice(oldValue);
  }
  if (breadcrumb) {
    breadcrumb.textContent = product.ten;
  }

  const specRows = document.querySelectorAll(".product-spec-table tbody tr");
  let specEntries = [];

  if (product.thongso && typeof product.thongso === "object") {
    specEntries = Object.entries(product.thongso);
  } else {
    specEntries = Object.entries(product).filter(([key]) =>
      !["category", "ma", "hinh", "ten", "hang", "giaban", "mota", "thongso"].includes(key)
    );
  }

  specRows.forEach((row, index) => {
    const entry = specEntries[index];
    const label = row.querySelector("th");
    const value = row.querySelector("td");

    if (!entry) {
      row.style.display = "none";
      return;
    }

    if (label) {
      label.textContent = entry[0];
    }
    if (value) {
      value.textContent = entry[1];
    }
  });

  document.title = `${product.ten} | ELECTROSHOP`;
}

renderProductDetails();

// Đồng bộ bảng so sánh sản phẩm với data.js
function getProductSpecEntries(product) {
  if (product.thongso && typeof product.thongso === "object") {
    return Object.entries(product.thongso);
  }

  return Object.entries(product).filter(([key]) =>
    !["category", "ma", "hinh", "ten", "hang", "giaban", "mota", "thongso"].includes(key)
  );
}

function renderProductComparison() {
  if (typeof products === "undefined") {
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id");
  const currentProduct = products.find((item) => item.ma === id);
  if (!currentProduct) {
    return;
  }

  const sameCategory = products.filter(
    (item) => item.category === currentProduct.category && item.ma !== currentProduct.ma
  );
  const compareProduct = sameCategory[0] || products.find((item) => item.ma !== currentProduct.ma);
  if (!compareProduct) {
    return;
  }

  const compareHeaders = document.querySelectorAll(".product-compare__product");
  const currentHeader = compareHeaders[0];
  const compareHeader = compareHeaders[1];

  if (currentHeader) {
    const currentImage = currentHeader.querySelector("img");
    const currentName = currentHeader.querySelector(".product-compare__name");
    const currentPrice = currentHeader.querySelector(".product-compare__price");

    if (currentImage) {
      currentImage.src = getProductImagePath(currentProduct);
      currentImage.alt = currentProduct.ten;
    }
    if (currentName) currentName.textContent = currentProduct.ten;
    if (currentPrice) currentPrice.textContent = formatPrice(currentProduct.giaban);
  }

  if (compareHeader) {
    const compareImage = compareHeader.querySelector("img");
    const compareName = compareHeader.querySelector(".product-compare__name");
    const comparePrice = compareHeader.querySelector(".product-compare__price");
    const compareLink = compareHeader.querySelector(".product-compare__link");

    if (compareImage) {
      compareImage.src = getProductImagePath(compareProduct);
      compareImage.alt = compareProduct.ten;
    }
    if (compareName) compareName.textContent = compareProduct.ten;
    if (comparePrice) comparePrice.textContent = formatPrice(compareProduct.giaban);
    if (compareLink) {
      compareLink.href = `./product-details.html?id=${encodeURIComponent(compareProduct.ma)}`;
    }
  }

  const currentSpecs = getProductSpecEntries(currentProduct);
  const compareSpecs = getProductSpecEntries(compareProduct);
  const specLabels = new Set([
    ...currentSpecs.map(([label]) => label),
    ...compareSpecs.map(([label]) => label)
  ]);

  const tbody = document.querySelector(".product-compare__table tbody");
  if (!tbody) return;

  tbody.replaceChildren();

  specLabels.forEach((label) => {
    const currentValue = currentSpecs.find(([key]) => key === label)?.[1] || "-";
    const compareValue = compareSpecs.find(([key]) => key === label)?.[1] || "-";

    const row = document.createElement("tr");
    if (String(currentValue) !== String(compareValue)) {
      row.classList.add("is-diff");
    }

    const labelCell = document.createElement("th");
    labelCell.scope = "row";
    labelCell.textContent = label;

    const currentCell = document.createElement("td");
    currentCell.textContent = String(currentValue);

    const compareCell = document.createElement("td");
    compareCell.textContent = String(compareValue);

    row.append(labelCell, currentCell, compareCell);
    tbody.appendChild(row);
  });
}

renderProductComparison();

// Đồng bộ danh sách sản phẩm tương tự từ data.js
function renderRelatedProducts() {
  if (typeof products === "undefined") {
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id");
  const currentProduct = products.find((item) => item.ma === id);
  if (!currentProduct) {
    return;
  }

  const related = products.filter(
    (item) =>
      item.category === currentProduct.category &&
      item.ma !== currentProduct.ma
  );

  if (related.length === 0) {
    return;
  }

  const relatedItems = document.querySelectorAll(".product-related__item");
  relatedItems.forEach((item, index) => {
    const product = related[index % related.length];
    if (!product) {
      return;
    }

    const image = item.querySelector("img");
    const name = item.querySelector(".product-related__name");
    const price = item.querySelector(".product-related__price");
    const oldPrice = item.querySelector(".product-price__old");
    const link = item.querySelector(".product-related__link");

    if (image) {
      image.src = getProductImagePath(product);
      image.alt = product.ten;
    }
    if (name) {
      name.textContent = product.ten;
    }
    if (price) {
      price.textContent = formatPrice(product.giaban);
    }
    if (oldPrice) {
      const oldValue = Math.round((Number(product.giaban) * 1.25) / 1000) * 1000;
      oldPrice.textContent = formatPrice(oldValue);
    }
    if (link) {
      link.href = `./product-details.html?id=${encodeURIComponent(product.ma)}`;
    }
  });
}

renderRelatedProducts();

// Đồng bộ số lượng giỏ hàng với header trên mọi trang
const addCartBtn = document.getElementById("js-add-cart");
const buyNowBtn = document.querySelector(".product-actions__buy");
const cartCount = document.querySelector(".header__cart-btn .header__notify");
const buyNotify = document.querySelector(".js-notify");

function getCartQuantity() {
  return Number(localStorage.getItem("quantityCart")) || 0;
}

function updateCartCount(quantity) {
  if (cartCount) {
    cartCount.textContent = String(quantity);
  }
  localStorage.setItem("quantityCart", String(quantity));
}

function showAddCartMessage(quantity) {
  if (buyNotify) {
    buyNotify.style.transform = "translateY(0px)";
  }

  window.setTimeout(() => {
    if (buyNotify) {
      buyNotify.style.transform = "translateY(100px)";
    }
  }, 3000);
}

updateCartCount(getCartQuantity());

if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    const quantityToAdd = Number.parseInt(qtyInput.value, 10) || MIN_QTY;
    const quantity = getCartQuantity() + quantityToAdd;
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products.find((item) => item.ma === id);

    if (product) {
      const cart = localStorage.getItem("gioHangPCStore")
        ? localStorage.getItem("gioHangPCStore").split(",")
        : [];

      for (let i = 0; i < quantityToAdd; i++) {
        cart.push(product.ma);
      }

      localStorage.setItem("gioHangPCStore", cart.join(","));
    }

    updateCartCount(quantity);
    showAddCartMessage(quantityToAdd);
  });
}

if (buyNowBtn) {
  buyNowBtn.addEventListener("click", () => {
    const quantityToBuy = Number.parseInt(qtyInput.value, 10) || MIN_QTY;
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products.find((item) => item.ma === id);

    if (product) {
      const cart = localStorage.getItem("gioHangPCStore")
        ? localStorage.getItem("gioHangPCStore").split(",")
        : [];

      for (let i = 0; i < quantityToBuy; i++) {
        cart.push(product.ma);
      }

      localStorage.setItem("gioHangPCStore", cart.join(","));
      updateCartCount(getCartQuantity() + quantityToBuy);
    }

    window.location.href = "./cart.html";
  });
}

window.addEventListener("storage", (event) => {
  if (event.key === "quantityCart") {
    updateCartCount(getCartQuantity());
  }
});
