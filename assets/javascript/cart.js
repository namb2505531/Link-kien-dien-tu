
var products = document.querySelectorAll(".cart-item");
var totals = document.querySelectorAll(".price-total2");
<<<<<<< Updated upstream
var price_totals=document.querySelector('input[name="total_price"]')
var finalPrice;
=======
var price_totals = document.querySelector('input[name="total_price"]');
var payingProducts = document.querySelectorAll(".main__paying-product-element");
var finalPrice = 0;
var discount = 0;
var applied = false;
// Khởi tạo lại giỏ hàng với 3 sản phẩm ban đầu.
// localStorage.removeItem("cart");
// Lưu vào giỏ hàng localStorage
function saveCart() {
    var cartData = [];
    products.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        var quantity = item.querySelector(".quantity-value");
        cartData.push({
            id: checkbox.value,
            quantity: Number(quantity.textContent),
            checked: checkbox.checked,
            // Ghi nhận sản phẩm đã bị xóa hay chưa.
            deleted: !item.isConnected
        });
    });
    localStorage.setItem("cart", JSON.stringify(cartData));
}
//ĐỌC VÀ KHÔI PHỤC GIỎ HÀNG

function loadCart() {
    // Lấy dữ liệu từ localStorage
    var savedCart = localStorage.getItem("cart");
    // Nếu chưa có dữ liệu, lưu 3 sản phẩm ban đầu trong HTML.
    if (savedCart === null) {
        saveCart();
        return;
    }
    // Đọc dữ liệu JSON.
    try {
        savedCart = JSON.parse(savedCart);
    }
    // Bắt lỗi và cho savedCart được gán thành null
    catch (error) {
        savedCart = null;
    }
    // Nếu dữ liệu không hợp lệ thì khởi tạo lại.
    if (!Array.isArray(savedCart)) {
        localStorage.removeItem("cart");
        saveCart();
        return;
    }
    // Duyệt qua từng sản phẩm trong giỏ hàng
    products.forEach(function(item, index) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        var quantity = item.querySelector(".quantity-value");
        // Tìm sản phẩm tương ứng trong localStorage.
        var savedItem = savedCart.find(function(data) {
            return data.id === checkbox.value;
        });
        // Không tìm thấy sản phẩm trong dữ liệu đã lưu xóa khỏi giỏ hàng
        if (!savedItem) {
            item.remove();
            if (payingProducts[index]) {
                payingProducts[index].style.display = "none";//Ẩn sản phẩm đó trong phần thanh toán
            }
            return;
        }
        // Sản phẩm đã bị xóa trước đó thì xóa trong dữ liệu và ẩn nó trong phần thanh toán.
        if (savedItem.deleted === true) {
            item.remove();
            if (payingProducts[index]) {
                payingProducts[index].style.display = "none";
            }
            return;
        }
        // Khôi phục số lượng.
        var value = Number(savedItem.quantity);
        if ( value < 1) {
            value = 1;
        }
        quantity.textContent = value;
        // Khôi phục checkbox.
        checkbox.checked = savedItem.checked === true;
    });
}
// Khôi phục giỏ hàng ngay khi tải trang.
loadCart();
// TÍNH TỔNG TIỀN
>>>>>>> Stashed changes
function updateTotal() {
    let sum = 0;
    products.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        var price_item = item.querySelector(".price-item");
        if (checkbox.checked) {
            sum += Number(price_item.innerText.replace(/[^\d]/g, ""));
        }
    });
    totals[0].innerText = sum.toLocaleString("vi-VN") + "đ";
    finalPrice = sum - sum * discount;
    totals[1].innerText = finalPrice.toLocaleString("vi-VN") + "đ";
    price_totals.value=finalPrice.toLocaleString("vi-VN") + "đ";
    updateshopping();
}
var order = document.getElementsByClassName("main__order-setion-apply")[0];
var input = order.querySelector(".input");
var vouchers = document.querySelectorAll(".buttonvoucher");
var saleoff = document.querySelector(".sale-off");
vouchers.forEach(function(button) {
    button.addEventListener("click", function() {
        input.value = button.innerText.trim();
        discount = 0;
        applied = false;
        saleoff.innerText = 0 +"%";
        updateTotal();
        vouchers.forEach(function(item) {
            item.style.display = "inline-flex";
        });
        button.style.display = "none";
    });
});
var discount = 0;
var applied = false;
var buttonapply = document.querySelector(".buttonapply");
buttonapply.addEventListener("click", function() {
    if (applied == true) {
        alert("Bạn chỉ được áp dụng voucher một lần!");
        return;
    }
    if (input.value.trim() == vouchers[0].innerText.trim()) {
        discount = 0.05;
    }
    else if (input.value.trim() == vouchers[1].innerText.trim()) {
        discount = 0.1;
    }
    else if (input.value.trim() == vouchers[2].innerText.trim()) {
        discount = 0.1;
    }
    else {
        alert("Voucher không hợp lệ!");
        return;
    }
    saleoff.innerText=discount*100 + "%";
    applied = true;
    updateTotal();
    alert("Áp dụng voucher thành công!");
});
var payingProducts = document.querySelectorAll(".main__paying-product-element");
payingProducts.forEach(function(item) {
    item.style.display = "none";
});
function updatePayingProducts() {
    products.forEach(function(item, index) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        if (payingProducts[index]) {
            if (checkbox.checked) {
                payingProducts[index].style.display = "flex";
            }
            else {
                payingProducts[index].style.display = "none";
            }
        }
    });
}
updatePayingProducts();
var payingProducts = document.querySelectorAll(".main__paying-product-element");
products.forEach(function(item,index) {
    var minus = item.querySelector(".minus");
    var plus = item.querySelector(".plus");
    var quantity = item.querySelector(".quantity-value");
    var quantityInput = item.querySelector('input[name="quantity[]"]');
    var del = item.querySelector(".delproduct");
    var price_item = item.querySelector(".price-item");
    var price_init = Number(price_item.innerText.replace(/[^\d]/g, ""));
    var price_item1 = item.querySelector(".price-item1");
    var checkbox = item.querySelector('input[type="checkbox"]');
    var payingProduct = payingProducts[index];
    quantityInput.disabled = !checkbox.checked;
    var payingQuantity = payingProduct.querySelector(".paying-quantity");
    var payingPrice = payingProduct.querySelector(".paying-price");
    if (price_item1){
        var price_init1 = Number(price_item1.innerText.replace(/[^\d]/g, ""));
    }
    function updatePrice(){
        let value=Number(quantity.innerText);
        quantityInput.value = value;
        price_item.innerText = (price_init * value).toLocaleString("vi-VN") +"đ";
        if (price_item1){
            price_item1.innerText = (price_init1 * value).toLocaleString("vi-VN") +"đ";
        }
        payingQuantity.innerText = value;
        payingPrice.innerText = (price_init * value).toLocaleString("vi-VN") + "đ";
        if (value <= 0) {
            payingProduct.style.display = "none";
        }
        else {
            if (checkbox.checked) {
                payingProduct.style.display = "flex";
            }
            else {
                payingProduct.style.display = "none";
            }
        }
        updateTotal();
    }
    minus.addEventListener("click", function() {
        let value = Number(quantity.innerText);
        if ((value - 1)>=1){
            quantity.innerText = value - 1;
        }
        else{
            quantity.innerText = 0;
        }
        updatePrice();
    });
    plus.addEventListener("click", function() {
        let value = Number(quantity.innerText);
        quantity.innerText = value + 1;
        updatePrice();
    });
    del.addEventListener("click", function(){
        item.remove();
        payingProduct.style.display = "none";
        updateTotal();
    })
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            quantityInput.disabled = false;
        }
        else {
            quantityInput.disabled = true;
        }
        updateTotal();
        updatePayingProducts();
    });
});
//Chuyển đổi giao diện
var cart = document.getElementById("main__cart");
var shopping = document.getElementById("main__shopping");
var paying = document.getElementById("main__paying");
var buttons = document.querySelectorAll(".button-next");
var steps = document.querySelectorAll(".step");
var line12=document.querySelector(".line1-2");
var line23=document.querySelector(".line2-3");
function chuyenGiaoDien(step) {
    cart.style.display = "none";
    shopping.style.display = "none";
    paying.style.display = "none";
    buttons.forEach(function(button) {
        button.style.display = "none";
    });
    if (step == 0) {
        cart.style.display = "flex";
        buttons[0].style.display = "block";
    }
    else if (step == 1) {
        shopping.style.display = "flex";
        buttons[1].style.display = "block";
    }
    else if (step == 2) {
        paying.style.display = "flex";
        buttons[2].style.display = "block";
    }
}
function createOrderID() {
    var now = new Date();
    var hour = now.getHours();
    var buoi = "";
    if (hour < 12) {
        buoi = "S"; // Buổi sáng
    }
    else {
        buoi = "C"; // Buổi chiều
    }
    var year = String(now.getFullYear()).slice(-2);
    var random = Math.floor(1000 + Math.random() * 9000);
    return "E" + buoi + year + random;
}
var orderID="";
var send__orderID=document.getElementById("send__order-ID");
chuyenGiaoDien(0);
buttons[0].addEventListener("click", function() {
    line12.style.background="var(--primary-gradient)";
    chuyenGiaoDien(1);
});
buttons[1].addEventListener("click", function() {
    // Kiểm tra các trường bắt buộc
    var requiredInputs = shopping.querySelectorAll("[required]");
    for (var i = 0; i < requiredInputs.length; i++) {
        if (!requiredInputs[i].checkValidity()) {
            requiredInputs[i].reportValidity();
            return;
        }
    }

    // Kiểm tra phương thức vận chuyển
    var shipping = document.querySelector('input[name="shipping"]:checked');
    if (!shipping) {
        alert("Vui lòng chọn phương thức vận chuyển!");
        return;
    }
    information();
    if (orderID == "") {
        orderID = createOrderID();
    }
    var showOrderID = document.querySelector(".show-order-id");
<<<<<<< Updated upstream
    showOrderID.innerText = orderID;
    send__orderID.value=orderID;
    line23.style.background="var(--primary-gradient)";
=======
    showOrderID.textContent = orderID;
    send__orderID.value = orderID;
    line23.style.background = "var(--primary-gradient)";
    if (!validateForm()){
        return;
    }
>>>>>>> Stashed changes
    chuyenGiaoDien(2);
});
buttons[2].addEventListener("click", function() {
    var paying = document.querySelector('input[name="payment"]:checked');
    if(!paying){
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }
    alert("Đặt hàng thành công!");
});
steps.forEach(function(step, index) {
    step.addEventListener("click", function() {
        chuyenGiaoDien(index);
    });
});

<<<<<<< Updated upstream
// Lấy thông tin vận chuyển
=======
// THÔNG TIN VẬN CHUYỂN
//Các regex kiểm tra thông tin nhập vào
function validateForm() {
    const sdt = document.getElementById("sdt").value.trim();
    const email = document.getElementById("email").value.trim();
    // Số điện thoại bắt đầu bằng 0 và có 10 chữ số
    const sdtRegex = /^(0)[1-9][0-9]{8}$/;
    //tên@miền.đuôi
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;//Chưa xong
    // Kiểm tra số điện thoại
    if (!sdtRegex.test(sdt)) {
        alert("Số điện thoại không đúng định dạng!");
        return false;
    }
    // Kiểm tra email nếu có nhập
    if (email !== "" && !emailRegex.test(email)) {
        alert("Email không đúng định dạng!");
        return false;
    }
    return true;
}
//
>>>>>>> Stashed changes
var fee = 0;
var shippingCost = 0;
var shippingPrice = document.querySelectorAll(".main__shopping-infor.main__shopping-price"
);
var shippingForm = document.querySelector(".main__shopping-formal");
var shippingFee = document.querySelector(".shopping-fee");
var shippingMethods = shippingForm.querySelectorAll('input[name="shipping"]');
// Hàm cập nhật phí giao hàng tiêu chuẩn
function updateshopping() {
    if (finalPrice >= 30000000) {
        fee = 0;
    }
    else {
        fee = 200000;
    }
    if (fee == 0) {
        shippingPrice[0].querySelector("h4").innerText = "Miễn phí";
    }
    else {
        shippingPrice[0].querySelector("h4").innerText = fee.toLocaleString("vi-VN") + "đ";
    }
    var selected = shippingForm.querySelector('input[name="shipping"]:checked');
    if (selected) {
        updateShippingFee(selected.value);
    }
}
// Hàm cập nhật phí theo phương thức vận chuyển
function updateShippingFee(method) {
    if (method == "Tiêu chuẩn") {
        shippingCost = fee;
    }
    else if (method == "Hỏa tốc") {
        shippingCost = 1000000;
    }
    else if (method == "Nhận tại cửa hàng") {
        shippingCost = 0;
    }
    if (shippingCost == 0) {
        shippingFee.innerText = "Miễn phí";

    }
    else {
        shippingFee.innerText = shippingCost.toLocaleString("vi-VN") + "đ";
    }
    updateFinalTotal();
}
function updateFinalTotal() {
    var total = finalPrice + shippingCost;
    totals[1].innerText = total.toLocaleString("vi-VN") + "đ";
}
var showshopping=document.getElementById("show-shopping");
var showtime=document.getElementById("show-time");
var note = document.querySelectorAll(".main__shopping-infor p");
shippingMethods.forEach(function(method) {
    method.addEventListener("change", function() {
        updateShippingFee(method.value);
        showshopping.innerText=method.value;
        var parent = method.closest(".main__shopping-element");
        var infor = parent.querySelector(".main__shopping-infor");
        var note = infor.querySelector("p");
        showtime.innerText = note.innerText;
    });
});
//Cập nhật thông tin khách hàng sau khi nhập
var ho_ten=document.getElementById("ho_ten");
var sdt=document.getElementById("sdt");
var tinh_tp=document.getElementById("tinh_tp");
var address=document.getElementById("address");
var showName = document.getElementById("show-name");
var showPhone = document.getElementById("show-phone");
var showAddress = document.getElementById("show-address");
function information(){
    showName.innerHTML=ho_ten.value;
    showPhone.innerText=sdt.value;
    showAddress.innerText=address.value + ", "+tinh_tp.value;
}
var payments = document.querySelectorAll('input[name="payment"]');
var QR = document.querySelector(".main__paying-method-element");
function showQR() {
    var payment = document.querySelector('input[name="payment"]:checked');
    if (payment.value == "QR") {
        QR.style.display = "flex";
    }
    else {
        QR.style.display = "none";
    }
}
payments.forEach(function(method){
    method.addEventListener("change",function(){
        showQR();
    });
});
