// Trần Nguyễn Kha - B24107672

// 1. BIẾN DÙNG CHUNG & HÀM LẤY DỮ LIỆU TỪ DATA.JS
const CART_KEY = "gioHangPCStore";
let originalOrder = [];  //tạo mảng rổng để lưu sản phẩm cho sắp xếp và lọc sản phẩm

let notifyTimer = null; // dùng để hẹn giờ tắt thông báo đã thêm vào giỏ hàng

// Tìm sản phẩm trong file data.js theo mã
function findProductInData(id) {
  return products.find((sp) => sp.ma === id);
}

// CHUYỂN TRANG CHI TIẾT KHI BẤM VÀO TÊN SẢN PHẨM

function bindProductDetailLinks() {
  document.querySelectorAll(".product-card").forEach((card) => {  //vòng lặp quét qua từng sản phẩm
    const sp = findProductInData(card.dataset.id); //hàm tìm kiếm tra cứu theo id
    if (!sp) return;  //không thấy sản phẩm 
    card.style.cursor = "pointer";  //biến con trỏ thành bàn tay
    card.onclick = function (e) {   //xử lí cứ click chuột ấn vào đâu
      if (e.target.closest(".add-cart")) return;    //xử lý xung đột khi người dùng ấn vào thêm giỏ hàng sẽ không chuyển trang
      window.location.href = `./product-details.html?id=${encodeURIComponent(sp.ma)}`;  //chuyển trang chi tiết khi click chuột
    };
  });
}

// 3. GIỎ HÀNG
function getCart() {  //hàm getCart
  try {
    let cart = JSON.parse(localStorage.getItem(CART_KEY));  //truy cập vào ngăn chứa của trình duyệt tìm ngăn cart_key lấy dữ liệu
    // Chỉ chấp nhận dạng mảng, còn lại (null, chuỗi, số...) coi như giỏ trống
    if (Array.isArray(cart)) {   //kiểm tra dữ liệu cart có phải mãng không
      return cart;  //trả về mảng cart
    }
  } catch (error) { //dữ liệu không đúng thì json.parse báo lỗi -> skip
    // Dữ liệu hỏng thì bỏ qua, trả về giỏ trống ở dưới
  }
  return [];  //trường hợp cuối trả về mảng rỗng
}

function updateCartCount() {   //hàm tính tổng sản phẩm và note lên icon giỏ hàng
  let cart = getCart();  //danh sách mảng sản phẩm

  let total = 0; //biến cộng dồn

  cart.forEach((item) => (total += Number(item.soLuong) || 1));  //vòng lặp đi qua các item trong mảng

  // Cập nhật số lượng lên icon giỏ hàng trên Header
  let count = document.querySelector(".header__cart-btn .header__notify");
  if (count) count.textContent = total;

  localStorage.setItem("quantityCart", String(total));  //lưu số lượng sản phẩm, đổi kiểu số sang text
}


function showNotify() {

  let notify = document.querySelector(".js-notify");
  if (!notify) return; //không có return null

  notify.style.transform = "translateY(0px)"; // hiệu ứng thông báo thêm giỏ hàng
  clearTimeout(notifyTimer); // bấm liên tục thì hủy hẹn giờ cũ, tránh bị tắt sớm
  notifyTimer = setTimeout(function () {
    notify.style.transform = "translateY(100px)"; // hiệu ứng trượt xuống để ẩn
  }, 3000);  //3 giây
}

function addToCart(id, name, price, image) {   //hàm 4 tham số
  let cart = getCart();  //ds sản phẩm

  let product = cart.find((sp) => sp.ma === id);   //phương thúc tìm kím trong mảng cart sp.ma trùng với id sp vừa click 

  if (product) {
    product.soLuong = (Number(product.soLuong) || 0) + 1;    //kiểm tra product, ép kiểu, cộng dồn san phẩm
  } else {   //chưa có trong giỏ, thêm đối tượng vào mảng với số lượng 1
    cart.push({
      ma: id,
      ten: name,
      gia: Number(price),
      hinhAnh: image,
      soLuong: 1,
    });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));  //chuyển đổi mảng cart thành dữ liệu lưu vào localStorage
  updateCartCount();   //cập nhật số lượng
  showNotify();   //thông báo thêm giỏ hàng
}

function handleAddCart() {
  let card = this.closest(".product-card");    //xác định khung click chuột vào sản phẩm
  let id = card.dataset.id;    //trích id lưu vào data-id
  let sp = findProductInData(id); // gọi hàm tra cứu đối tượng trong data.js 
  let image = card.querySelector("img").getAttribute("src"); //lấy img

  if (sp) {   //kiểm tra sản phẩm có tồn tại trong data.js
    addToCart(sp.ma, sp.ten, sp.giaban, image);  //thêm sản phẩm
  }
}

function bindAddToCart() {    
  document.querySelectorAll(".add-cart").forEach((btn) => {    //quét các nút có class
    btn.onclick = handleAddCart;   //gán hàm handleAddCart vào sự kiện onclick khi click vào nút thêm giỏ hàng 
  });
}

// lọc danh mục

function showCategory(category, element) {   
  document.querySelectorAll(".product-card").forEach((card) => {   //quét toàn bộ thẻ
    let id = card.dataset.id;   //lấy data-id trong html
    let sp = findProductInData(id);    //tra data-id trong data.js

    if (category === "all" || (sp && sp.category === category)) {
      card.style.display = "";   //hiện sản phẩm
    } else {
      card.style.display = "none";   //không có danh mục sản phẩm gán none
    }
  });

  // Đổi màu mục đang chọn ở menu bên trái
  document.querySelectorAll(".filter-category li").forEach((item) => {  //quét thẻ li
    item.classList.remove("active");   //xóa class = active ,xóa màu khi dời chuột qua danh mục khác
  });
  if (element) element.classList.add("active");   //gán class để đổi màu lại

  // Đặt lại ô sắp xếp về mặc định
  let sortSelect = document.getElementById("sortSelect");  //kiểm tra thẻ và đặt giá trị
  if (sortSelect) sortSelect.value = "default";   //
  sortPrice("default");  //khôi phục thứ tự thẻ mặc định
}

//SẮP XẾP GIÁ

function getPrice(card) {
  let id = card.dataset.id;   // đọc id -> data-id
  let sp = findProductInData(id);   //tra cứu id bên data.js
  return sp ? Number(sp.giaban) : 0;   // nếu tìm thấy giá và so sánh, không có return 0
}

function sortPrice(type) {
  let list = document.querySelector(".product-list");   //tìm product-list->không có thì thoát
  if (!list) return;

  let items;  //khai báo biến items, lưu mảng các thẻ

  if (type === "default") { 
    items = [...originalOrder];  //tạo bản sao lưu thứ tự ban đầu
  } else {
    items = Array.from(list.querySelectorAll(".product-card"));  //lưu sản phẩm -> items

    if (type === "asc") {    //dùng phương thức sort-> xếp giá tăng 
      items.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (type === "desc") {   //giá giảm
      items.sort((a, b) => getPrice(b) - getPrice(a));
    }
  }

  list.innerHTML = "";   //làm rỗng thẻ cũ
  items.forEach((item) => list.appendChild(item));  //duyệt qua items đã xếp

  // Gắn lại sự kiện click sau khi sắp xếp lại thẻ
  bindAddToCart();   //gọi lại sự kiện thêm 
  bindProductDetailLinks();   //xem chi tiết
}

// 6. CHẠY KHI TẢI TRANG XONG
document.addEventListener("DOMContentLoaded", function () {    //code chạy khi brower dựng xong html 
  bindProductDetailLinks();  //chi tiết sp
  bindAddToCart();     //thêm sp

  // Lưu thứ tự ban đầu của 15 sản phẩm
  originalOrder = Array.from(   
    document.querySelectorAll(".product-list .product-card"),   
  );

  // Gắn sự kiện bấm chọn danh mục
  document.querySelectorAll(".filter-category li").forEach((li) => {   //duyệt quá tất cả thẻ li
    li.addEventListener("click", function () {    //chuẩn bị cho sự kiện click chuột -> danh mục
      showCategory(li.dataset.category, li);    //truyền tên danh mục -> vừa click lọc và đổi màu
    });
  });

  // Nếu từ trang chủ bấm sang có kèm ?cat=cpu thì tự lọc luôn
  // Lấy chuỗi tham số sau dấu ? trên url -> window.location.search, URLSearchParams để lấy giá trị của khóa "cat" và lưu vào biến categoryId.  
  let urlParams = new URLSearchParams(window.location.search);  
  let categoryId = urlParams.get("cat");

  if (categoryId) {
    let targetElement = document.querySelector(   //chuỗi mẫu
      `.filter-category li[data-category="${categoryId}"]`,    // dùng chuỗi mẫu tìm data-category khớp trên url
    );
    if (targetElement) {    //kiểm tra mune tồn tại -> tiếp tục
      showCategory(categoryId, targetElement);     //categoryID sai -> null
    }
  }
});