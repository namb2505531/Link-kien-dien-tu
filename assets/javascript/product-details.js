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
