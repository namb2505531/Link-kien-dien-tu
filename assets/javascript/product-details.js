// Lê Hoàng Nhân B2408868
// Đổi ảnh nhỏ lên ảnh chính
// Lê Hoàng Nhân B2408868
const mainImg = document.querySelector(".product-gallery__img");
const thumbBtns = document.querySelectorAll(".product-thumbs__btn");

// Khi chọn ảnh thu nhỏ, thay ảnh chính và đánh dấu ảnh đang được chọn.
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

// Đưa số lượng về số nguyên trong giới hạn MIN_QTY–MAX_QTY.
// Nếu giá trị nhập không chuyển được thành số, dùng số lượng tối thiểu.
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
// Chuyển đường dẫn ảnh trong data.js sang đường dẫn dùng trong thư mục assets.
function getProductImagePath(product) {
  return product.hinh.replace("../img/", "./assets/img/");
}

// Hiển thị giá theo định dạng phân cách hàng nghìn của Việt Nam, kèm đơn vị đồng.
function formatPrice(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

// Đọc mã sản phẩm từ tham số ?id= trên URL, tìm trong mảng products
// (được khai báo ở data.js), rồi điền thông tin vào trang chi tiết.
function renderProductDetails() {
  // data.js phải được nạp trước file này; nếu không có dữ liệu thì dừng render.
  if (typeof products === "undefined") {
    return;
  }

  // Mã trên URL xác định sản phẩm cần hiển thị.
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((item) => item.ma === id);

  // Không tìm thấy mã thì giữ lại nội dung tĩnh có sẵn trong HTML.
  if (!product) {
    return;
  }

  // Lưu mã sản phẩm hiện tại để những phần khác có thể dùng lại.
  localStorage.setItem("selectedProductId", product.ma);

  // Lấy các phần tử HTML sẽ được cập nhật theo dữ liệu sản phẩm.
  const imagePath = getProductImagePath(product);
  const mainImage = document.querySelector(".product-gallery__img");
  const thumbnails = document.querySelectorAll(".product-thumbs__btn img");
  const title = document.querySelector(".product-info__title");
  const description = document.querySelector(".product-info__desc");
  const currentPrice = document.querySelector(".product-price__current");
  const oldPrice = document.querySelector(".product-price__old");
  const breadcrumb = document.querySelector(".breadcrumb span:last-child");

  // Cập nhật ảnh chính và mô tả thay thế của ảnh.
  if (mainImage) {
    mainImage.src = imagePath;
    mainImage.alt = product.ten;
  }

  // Đồng bộ các ảnh thu nhỏ với ảnh của sản phẩm đang xem.
  thumbnails.forEach((thumbnail) => {
    thumbnail.src = imagePath;
    thumbnail.alt = product.ten;
  });

  // Điền tên, mô tả, giá bán, giá cũ ước tính và tên sản phẩm trong breadcrumb.
  // Giá cũ được tính cao hơn giá bán 25%, sau đó làm tròn đến hàng nghìn.
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

  // Ưu tiên lấy thông số từ product.thongso. Nếu chưa có, lấy các thuộc tính
  // khác của sản phẩm và bỏ qua những trường thông tin chung.
  const specRows = document.querySelectorAll(".product-spec-table tbody tr");
  let specEntries = [];

  if (product.thongso && typeof product.thongso === "object") {
    specEntries = Object.entries(product.thongso);
  } else {
    specEntries = Object.entries(product).filter(([key]) =>
      !["category", "ma", "hinh", "ten", "hang", "giaban", "mota", "thongso"].includes(key)
    );
  }

  // Mỗi dòng hiển thị một tên thông số và giá trị tương ứng.
  // Ẩn những dòng HTML dư nếu sản phẩm có ít thông số hơn số dòng mẫu.
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

  // Đặt tiêu đề tab trình duyệt theo tên sản phẩm.
  document.title = `${product.ten} | ELECTROSHOP`;
}

renderProductDetails();

// Đồng bộ bảng so sánh sản phẩm với data.js
// Trả về các cặp [tên thông số, giá trị] để dùng khi tạo bảng so sánh.
function getProductSpecEntries(product) {
  if (product.thongso && typeof product.thongso === "object") {
    return Object.entries(product.thongso);
  }

  return Object.entries(product).filter(([key]) =>
    !["category", "ma", "hinh", "ten", "hang", "giaban", "mota", "thongso"].includes(key)
  );
}

// Hiển thị sản phẩm hiện tại và một sản phẩm khác trong bảng so sánh.
function renderProductComparison() {
  if (typeof products === "undefined") {
    return;
  }

  // Tìm sản phẩm hiện tại theo mã trên URL.
  const id = new URLSearchParams(window.location.search).get("id");
  const currentProduct = products.find((item) => item.ma === id);
  if (!currentProduct) {
    return;
  }

  // Ưu tiên sản phẩm khác cùng danh mục; nếu không có thì chọn sản phẩm khác đầu tiên.
  const sameCategory = products.filter(
    (item) => item.category === currentProduct.category && item.ma !== currentProduct.ma
  );
  const compareProduct = sameCategory[0] || products.find((item) => item.ma !== currentProduct.ma);
  if (!compareProduct) {
    return;
  }

  // Cập nhật ảnh, tên và giá của sản phẩm hiện tại và sản phẩm được đem so sánh.
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

  // Gộp tên thông số của cả hai sản phẩm để không bỏ sót thông số chỉ có ở một bên.
  const currentSpecs = getProductSpecEntries(currentProduct);
  const compareSpecs = getProductSpecEntries(compareProduct);
  const specLabels = new Set([
    ...currentSpecs.map(([label]) => label),
    ...compareSpecs.map(([label]) => label)
  ]);

  const tbody = document.querySelector(".product-compare__table tbody");
  // Nếu bảng không có phần tbody thì không có nơi để dựng các dòng so sánh.
  if (!tbody) return;

  // Xóa các dòng cũ hoặc dòng mẫu trước khi dựng bảng mới.
  tbody.replaceChildren();

  specLabels.forEach((label) => {
    // Dùng dấu gạch ngang nếu một trong hai sản phẩm không có thông số này.
    const currentValue = currentSpecs.find(([key]) => key === label)?.[1] || "-";
    const compareValue = compareSpecs.find(([key]) => key === label)?.[1] || "-";

    const row = document.createElement("tr");
    // Gắn class để CSS làm nổi bật dòng có giá trị khác nhau.
    if (String(currentValue) !== String(compareValue)) {
      row.classList.add("is-diff");
    }

    // Tạo một dòng gồm tên thông số, giá trị sản phẩm hiện tại và giá trị đối chiếu.
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
// Điền các sản phẩm cùng danh mục vào những thẻ gợi ý có sẵn trong HTML.
function renderRelatedProducts() {
  if (typeof products === "undefined") {
    return;
  }

  // Tìm sản phẩm hiện tại để loại nó khỏi danh sách sản phẩm tương tự.
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
    // Nếu thẻ gợi ý nhiều hơn sản phẩm cùng danh mục, danh sách sẽ được lặp lại.
    const product = related[index % related.length];
    if (!product) {
      return;
    }

    const image = item.querySelector("img");
    const name = item.querySelector(".product-related__name");
    const price = item.querySelector(".product-related__price");
    const oldPrice = item.querySelector(".product-price__old");
    const link = item.querySelector(".product-related__link");

    // Cập nhật các phần tử tồn tại trong thẻ gợi ý.
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
// Lấy tổng số lượng đang lưu; nếu giá trị chưa có hoặc không hợp lệ thì trả về 0.
const addCartBtn = document.getElementById("js-add-cart");
const buyNowBtn = document.querySelector(".product-actions__buy");
const cartCount = document.querySelector(".header__cart-btn .header__notify");
const buyNotify = document.querySelector(".js-notify");

function getCartQuantity() {
  return Number(localStorage.getItem("quantityCart")) || 0;
}

// Cập nhật số lượng trên biểu tượng giỏ hàng (nếu có) và ghi lại vào localStorage.
function updateCartCount(quantity) {
  if (cartCount) {
    cartCount.textContent = String(quantity);
  }
  localStorage.setItem("quantityCart", String(quantity));
}

// Hiện thông báo thêm vào giỏ bằng hiệu ứng CSS, rồi tự ẩn sau 3 giây.
// Tham số quantity hiện chưa được dùng để thay đổi nội dung thông báo.
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

// Đồng bộ biểu tượng giỏ hàng với số lượng đã lưu khi trang vừa tải.
updateCartCount(getCartQuantity());

if (addCartBtn) {
  addCartBtn.addEventListener("click", () => {
    // Đọc số lượng cần thêm từ ô nhập; nếu không hợp lệ thì dùng số lượng tối thiểu.
    const quantityToAdd = Number.parseInt(qtyInput.value, 10) || MIN_QTY;
    const quantity = getCartQuantity() + quantityToAdd;
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products.find((item) => item.ma === id);

    if (product) {
      // gioHangPCStore lưu mã sản phẩm dạng chuỗi, phân tách bằng dấu phẩy.
      // Thêm mã một lần cho mỗi đơn vị số lượng.
      const cart = localStorage.getItem("gioHangPCStore")
        ? localStorage.getItem("gioHangPCStore").split(",")
        : [];

      for (let i = 0; i < quantityToAdd; i++) {
        cart.push(product.ma);
      }

      localStorage.setItem("gioHangPCStore", cart.join(","));
    }

    // Cập nhật số lượng tổng trên header và hiện thông báo.
    updateCartCount(quantity);
    showAddCartMessage(quantityToAdd);
  });
}

if (buyNowBtn) {
  buyNowBtn.addEventListener("click", () => {
    // Thêm số lượng đang chọn vào giỏ hàng trước khi mở trang giỏ hàng.
    const quantityToBuy = Number.parseInt(qtyInput.value, 10) || MIN_QTY;
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products.find((item) => item.ma === id);

    if (product) {
      // Lưu mã sản phẩm theo số lượng đã chọn và cập nhật số trên header.
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

// Sự kiện storage được phát ở tab khác cùng origin khi localStorage thay đổi.
// Đọc lại số đã lưu để cập nhật biểu tượng giỏ hàng của tab này.
window.addEventListener("storage", (event) => {
  if (event.key === "quantityCart") {
    updateCartCount(getCartQuantity());
  }
});
