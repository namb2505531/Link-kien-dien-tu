//Đặng Hoàng Nam B2505531
//bật tắt menu-mobile-btn
const menuBtn = document.getElementById("mobile-menu-btn");
const menuList = document.getElementById("mobile-menu-list");
menuBtn.addEventListener("click", function () {
  if (menuList.style.display === "block") {
    menuList.style.display = "none";
  } else {
    menuList.style.display = "block";
    viTriLucMo = window.scrollY; // lưu lại vị trí trang ngay lúc bấm mở
  }
});
window.addEventListener("scroll", function () {
  //abs là trị tuyệt đối, không tắt khi lưới quá ngắn
  if (
    menuList.style.display === "block" &&
    Math.abs(window.scrollY - viTriLucMo) > 15
  ) {
    menuList.style.display = "none";
  }
});
//Thông báo thêm vào giỏ hàng và đồng bộ giỏ hàng chung
const buyBtns = document.querySelectorAll(".product__item-btn");
const buyNotify = document.querySelector(".js-notify");
const cartKey = "gioHangPCStore";

function getUnifiedCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    if (Array.isArray(cart) && cart.length > 0) {
      return cart.reduce(function (total, item) {
        return total + (Number(item.soLuong) || 1);
      }, 0);
    }
  } catch (error) {
    // Nếu dữ liệu cũ không phải JSON, dùng quantityCart để tương thích ngược.
  }
  return Number(localStorage.getItem("quantityCart")) || 0;
}

function addHomeProductToCart(item) {
  if (typeof products === "undefined") {
    return;
  }
  const product = products.find(function (entry) {
    return entry.ma === item.dataset.productId;
  });
  if (!product) {
    return;
  }

  let cart = [];
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    if (Array.isArray(savedCart)) {
      cart = savedCart;
    }
  } catch (error) {
    cart = [];
  }

  const existing = cart.find(function (entry) {
    return entry.ma === product.ma;
  });
  if (existing) {
    existing.soLuong = (Number(existing.soLuong) || 0) + 1;
  } else {
    cart.push({
      ma: product.ma,
      ten: product.ten,
      gia: Number(product.giaban),
      hinhAnh: product.hinh.replace("../img/", "./assets/img/"),
      soLuong: 1,
    });
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

let quantityCart = getUnifiedCartCount();
const headerNotify = document.querySelector(".header__notify");
if (headerNotify) {
  headerNotify.textContent = String(quantityCart);
}
for (let i = 0; i < buyBtns.length; i++) {
  buyBtns[i].addEventListener("click", function (event) {
    event.stopPropagation();
    const productItem = buyBtns[i].closest(".product__item");
    if (productItem) {
      addHomeProductToCart(productItem);
    }

    quantityCart = getUnifiedCartCount();
    localStorage.setItem("quantityCart", String(quantityCart));
    if (headerNotify) {
      headerNotify.textContent = String(quantityCart);
    }
    if (buyNotify) {
      buyNotify.style.transform = "translateY(0px)";
    }
    window.setTimeout(function () {
      if (buyNotify) {
        buyNotify.style.transform = "translateY(100px)";
      }
    }, 3000);
  });
}
//Đặng Hoàng Nam B2505531

//Nguyễn Hoàng Gia Thịnh B2405055
//Đổi chữ nút tài khoản trên header: đã đăng nhập thì hiện tên tài khoản
function updateHeaderAccount() {
  const accountBtn = document.querySelector(".header__account-btn");
  if (!accountBtn) {
    return;
  }
  const username = localStorage.getItem("electroshopCurrentUser");
  let text = "Đăng nhập";
  if (username) {
    // Tên dài thì cắt bớt
    text = username.length > 6 ? username.slice(0, 6) + "..." : username;
  }
  accountBtn.lastChild.textContent = " " + text;
}
updateHeaderAccount();
//Nguyễn Hoàng Gia Thịnh B2405055
