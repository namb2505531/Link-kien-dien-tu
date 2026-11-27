// MSSV: B2305989 
// HỌ VÀ TÊN: LÊ XUÂN ANH


var CART_KEY = "gioHangPCStore";
var totals = document.querySelectorAll(".price-total2");
var price_totals = document.querySelector('input[name="total_price"]');
var finalPrice = 0;
var discount = 0;
var applied = false;

// LAY DU LIEU GIO HANG
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// LUU DU LIEU GIO HANG
function saveCart() {
    var cart = [];
    products.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        cart.push({
            ma: item.dataset.id,
            ten: item.querySelector(".product-name").textContent,
            gia: Number(item.dataset.price),
            hinhAnh: item.querySelector("img").getAttribute("src"),
            soLuong: Number(item.querySelector(".quantity-value").textContent),
            checked: checkbox.checked
        });
    });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// TAO SAN PHAM TREN GIAO DIEN GIO HANG
var cartList = document.querySelector(".main__cart-form");
function renderCart() {
    var cart = getCart();
    cartList.textContent = "";
    cart.forEach(function(sp) {
        // Khung chứa mỗi sản phẩm
        var item = document.createElement("div");
        item.className = "main__cart-element cart-item";
        item.dataset.id = sp.ma;
        item.dataset.price = sp.gia;
        // Checkbox
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = sp.ma;
        checkbox.checked = false;
        // Hình ảnh sản phẩm
        var image = document.createElement("img");
        image.src = sp.hinhAnh;
        image.alt = sp.ten;
        // Khung thông tin sản phẩm
        var infor = document.createElement("div");
        infor.className = "main__cart-infor";
        // Tên sản phẩm
        var name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = sp.ten;
        // Khung số lượng
        var quantityBox = document.createElement("div");
        quantityBox.className = "main__cart-element quantity";
        // Nút giảm
        var minus = document.createElement("button");
        minus.type = "button";
        minus.className = "minus";
        minus.textContent = "-";
        // Số lượng
        var quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = sp.soLuong;
        // Nút tăng
        var plus = document.createElement("button");
        plus.type = "button";
        plus.className = "plus";
        plus.textContent = "+";
        // Input ẩn lưu số lượng 
        var quantityInput = document.createElement("input");
        quantityInput.type = "hidden";
        quantityInput.name = "quantity[]";
        quantityInput.value = sp.soLuong;
        quantityInput.disabled = !checkbox.checked;
        //Cây Dom của khung số lượng
        quantityBox.appendChild(minus);
        quantityBox.appendChild(quantity);
        quantityBox.appendChild(plus);
        quantityBox.appendChild(quantityInput);
        //Cây Dom của khung thông tin sản phẩm
        infor.appendChild(name);
        infor.appendChild(quantityBox);
        // Khung chứa giá và nút, trạng thái
        var priceBox = document.createElement("div");
        priceBox.className = "main__cart-header main__cart-element-price";
        // Giá tiền
        var price = document.createElement("h3");
        price.className = "price-item";
        price.textContent =(Number(sp.gia) * Number(sp.soLuong)).toLocaleString("vi-VN") + "đ";
        // Khung chứa nút xóa và trạng thái
        var priceButton = document.createElement("div");
        priceButton.className = "cart-price-button";
        // Nút xóa
        var del = document.createElement("button");
        del.type = "button";
        del.className = "delproduct";
        del.textContent = "Xóa";
        // Trạng thái sản phẩm
        var status = document.createElement("h4");
        status.textContent = "Còn hàng";
        //Cây Dom của khung chứa nút xóa và trạng thái
        priceButton.appendChild(del);
        priceButton.appendChild(status);
        //Cây Dom của khung giá và nút
        priceBox.appendChild(price);
        priceBox.appendChild(priceButton);
        // Đưa các thành phần vào khung sản phẩm
        item.appendChild(checkbox);
        item.appendChild(image);
        item.appendChild(infor);
        item.appendChild(priceBox);
        cartList.appendChild(item);
    });
    // Lấy lại danh sách sản phẩm sau được thêm vào giỏ hàng
    products = document.querySelectorAll(".main__cart-form .cart-item");
}


// KHOI TAO GIO HANG
var products = [];
renderCart();

// LAY DANH SACH SAN PHAM THANH TOAN
var payingList = document.getElementById("main__paying-product");
// CAP NHAT DANH SACH SAN PHAM THANH TOAN
function updatePayingProducts() {
    payingList.textContent = "";
    products.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        //Nếu sản phẩm không được chọn thì không cần đưa vào để thanh toán
        if (!checkbox.checked) {
            return;
        }
        //Khung chứa mỗi sản phẩm đã được tích chọn ở mỗi giỏ hàng
        var payingItem = document.createElement("div");
        payingItem.className = "main__paying-product-element";
        // Hình ảnh sản phẩm
        var image = document.createElement("img");
        image.src = item.querySelector("img").src;
        image.alt = item.querySelector(".product-name").textContent;
        //Khung chứa thông tin của sản phẩm
        var infor=document.createElement("div");
        infor.className = "main__paying-infor";
        //Khung chứa tên của sản phẩm
        var infor1=document.createElement("div");
        infor1.className="main__paying-infor1";
        //Tên sản phẩm
        var tensp=document.createElement("h3");
        tensp.textContent=item.querySelector(".product-name").textContent;
        //Số lượng sản phẩm được chọn
        var quantity=document.createElement("span");
        quantity.className="paying-quantity";
        quantity.textContent=item.querySelector(".quantity-value").textContent;
        //Khung chứa giá sản phẩm
        var payprice=document.createElement("div");
        payprice.className="main__paying-infor main__paying-price"
        //Giá của sản phẩm
        var price=document.createElement("p")
        price.className="paying-price"
        price.textContent=item.querySelector(".price-item").textContent;
        //Cây Dom của khung chứa tên của sản phẩm
        infor1.appendChild(tensp);
        //Cây Dom của khung chứa thông tin sản phẩm
        infor.appendChild(infor1);
        infor.appendChild(quantity);
        //Cây Dom của khung chứa giá sản phẩm
        payprice.appendChild(price)
        //Cây Dom khung chứa mỗi sản phẩm
        payingItem.appendChild(image)
        payingItem.appendChild(infor)
        payingItem.appendChild(payprice)
        //Cây Dom của danh sách sản phẩm thanh toán
        payingList.appendChild(payingItem)
    });
}
//Tổng tiền chưa hiện ra
// TINH TONG TIEN
function updateTotal() {
    var sum = 0;
    products.forEach(function(item) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        var priceItem = item.querySelector(".price-item");
        if (/*checkbox && priceItem && */checkbox.checked) {
            sum += Number(
                priceItem.textContent.replace(/[^\d]/g, "")
            );
        }
    });

    // Tong tien truoc giam gia
    totals[0].textContent =
        sum.toLocaleString("vi-VN") + "đ";

    // Tong tien sau giam gia
    finalPrice = sum - sum * discount;

    totals[1].textContent =
        finalPrice.toLocaleString("vi-VN") + "đ";

    // Luu tong tien vao input an
    if (price_totals) {
        price_totals.value =
            finalPrice.toLocaleString("vi-VN") + "đ";
    }

    updateshopping();
}

// AP DUNG VOUCHER
var order = document.getElementsByClassName(
    "main__order-setion-apply"
)[0];

var input = order.querySelector(".input");
var vouchers = document.querySelectorAll(".buttonvoucher");
var saleoff = document.querySelector(".sale-off");
var buttonapply = document.querySelector(".buttonapply");

vouchers.forEach(function(button) {
    button.addEventListener("click", function() {
        input.value = button.textContent.trim();

        discount = 0;
        applied = false;
        saleoff.textContent = "0%";

        vouchers.forEach(function(item) {
            item.style.display = "inline-flex";
        });

        button.style.display = "none";

        updateTotal();
    });
});

buttonapply.addEventListener("click", function() {
    if (input.value.trim() === vouchers[0].textContent.trim()) {
        discount = 0.05;
    }
    else if (input.value.trim() === vouchers[1].textContent.trim()) {
        discount = 0.1;
    }
    else if (input.value.trim() === vouchers[2].textContent.trim()) {
        discount = 0.1;
    }
    else {
        alert("Voucher không hợp lệ!");
        return;
    }

    saleoff.textContent = discount * 100 + "%";
    applied = true;

    updateTotal();

    alert("Áp dụng voucher thành công!");
});

// TANG, GIAM SO LUONG VA XOA SAN PHAM
// DUNG EVENT DELEGATION DE XU LY CAC SAN PHAM TAO DONG
cartList.addEventListener("click", function(event) {
    var item = event.target.closest(".cart-item");

    if (!item) {
        return;
    }

    var quantity = item.querySelector(".quantity-value");
    var value = Number(quantity.textContent);

    // GIAM SO LUONG
    if (event.target.closest(".minus")) {
        if (value > 1) {
            quantity.textContent = value - 1;
            updateCartItem(item);
        }
    }

    // TANG SO LUONG
    else if (event.target.closest(".plus")) {
        quantity.textContent = value + 1;
        updateCartItem(item);
    }

    // XOA SAN PHAM
    else if (event.target.closest(".delproduct")) {
        item.remove();

        products = document.querySelectorAll(".cart-item");

        saveCart();
        updatePayingProducts();
        updateTotal();
    }
});

// CAP NHAT THONG TIN CUA MOT SAN PHAM
function updateCartItem(item) {
    var quantity = item.querySelector(".quantity-value");
    var quantityInput = item.querySelector('input[name="quantity[]"]');
    var price = item.querySelector(".price-item");
    var checkbox = item.querySelector('input[type="checkbox"]');

    var unitPrice = Number(item.dataset.price);
    var value = Number(quantity.textContent);

    quantityInput.value = value;

    price.textContent =
        (unitPrice * value).toLocaleString("vi-VN") + "đ";

    quantityInput.disabled = !checkbox.checked;

    saveCart();
    updatePayingProducts();
    updateTotal();
}

// CHON HOAC BO CHON SAN PHAM
cartList.addEventListener("change", function(event) {
    if (event.target.matches('input[type="checkbox"]')) {
        var item = event.target.closest(".cart-item");

        var quantityInput = item.querySelector(
            'input[name="quantity[]"]'
        );

        quantityInput.disabled = !event.target.checked;

        saveCart();
        updatePayingProducts();
        updateTotal();
    }
});

// CAP NHAT SO LUONG VA TRANG THAI BAN DAU
products.forEach(function(item) {
    var checkbox = item.querySelector('input[type="checkbox"]');
    var quantityInput = item.querySelector('input[name="quantity[]"]');

    quantityInput.disabled = !checkbox.checked;
});





//  CHUYỂN ĐỔI GIAO DIỆN
var cart = document.getElementById("main__cart");
var shopping = document.getElementById("main__shopping");
var paying = document.getElementById("main__paying");
var buttons = document.querySelectorAll(".button-next");
var steps = document.querySelectorAll(".step");
var line12 = document.querySelector(".line1-2");
var line23 = document.querySelector(".line2-3");
function chuyenGiaoDien(step) {
    cart.style.display = "none";
    shopping.style.display = "none";
    paying.style.display = "none";
    buttons.forEach(function(button) {
        button.style.display = "none";
    });
    if (step === 0) {
        cart.style.display = "flex";
        buttons[0].style.display = "block";
    }
    else if (step === 1) {
        shopping.style.display = "flex";
        buttons[1].style.display = "block";
    }
    else if (step === 2) {
        paying.style.display = "flex";
        buttons[2].style.display = "block";
    }
}

//  TẠO MÃ ĐƠN HÀNG
function createOrderID() {
    var now = new Date();
    var hour = now.getHours();
    var buoi = "";
    if (hour < 12) {
        buoi = "S";//Buổi sáng
    }
    else {
        buoi = "C";//Buổi chiều
    }
    var year = String(now.getFullYear()).slice(-2);
    var random = Math.floor(1000 + Math.random() * 9000);
    return "E" + buoi + year + random;
}

var orderID = "";
var send__orderID = document.getElementById("send__order-ID");

//Hàm kiểm tra số điện thoại và email(nếu nhập)
function validateForm() {
    // Lấy giá trị số điện thoại và email
    const sdt = document.getElementById("sdt").value.trim();
    const email = document.getElementById("email").value.trim();
    //Số điện thoại có 1o số và bắt đầu bằng số 0
    const sdtRegex = /^0[1-9][0-9]{8}$/;
    //tên@miền.đuôi
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    // Kiểm tra số điện thoại
    if (!sdtRegex.test(sdt)) {
        alert("Số điện thoại không đúng định dạng!");
        document.getElementById("sdt").focus();
        return false;
    }
    // Kiểm tra email (không bắt buộc nhập)
    if (email !== "" && !emailRegex.test(email)) {
        alert("Email không đúng định dạng!");
        document.getElementById("email").focus();
        return false;
    }
    return true;
}
// Mở giao diện giỏ hàng ban đầu.
chuyenGiaoDien(0);
//Nút chuyển từ giỏ hàng sang vận chuyển
buttons[0].addEventListener("click", function() {
    // Kiểm tra còn sản phẩm trong giỏ hàng không.
    var hasProduct = false;
    products.forEach(function(item) {
        if (item.isConnected) {
            hasProduct = true;
        }
    });
    if (!hasProduct) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    // Kiểm tra đã chọn ít nhất một sản phẩm chưa.
    var hasChecked = false;
    products.forEach(function(item) {
        if (!item.isConnected) {
            return;
        }
        var checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            hasChecked = true;
        }
    });
    if (!hasChecked) {
        alert("Vui lòng chọn ít nhất một sản phẩm!");
        return;
    }
    line12.style.background = "var(--primary-gradient)";
    chuyenGiaoDien(1);
});
// Nút chuyển từ vận chuyển sang thanh toán
buttons[1].addEventListener("click", function() {
    // Kiểm tra các trường bắt buộc.
    var requiredInputs = shopping.querySelectorAll("[required]");
    for (var i = 0; i < requiredInputs.length; i++) {
        if (!requiredInputs[i].checkValidity()) {
            requiredInputs[i].reportValidity();
            return;
        }
    }
    // Kiểm tra phương thức vận chuyển.
    var shippingSelected = document.querySelector('input[name="shipping"]:checked');
    if (!shippingSelected) {
        alert("Vui lòng chọn phương thức vận chuyển!");
        return;
    }
    //Kiểm tra số điện thoại và email.
    if (!validateForm()) {
        return;
    }
    information();
    // Tạo mã đơn hàng.
    if (orderID === "") {
        orderID = createOrderID();
    }
    var showOrderID = document.querySelector(".show-order-id");
    showOrderID.textContent = orderID;
    send__orderID.value = orderID;
    line23.style.background = "var(--primary-gradient)";
    chuyenGiaoDien(2);
});
// Nút đặt hàng
buttons[2].addEventListener("click", function() {
    var payingMethod = document.querySelector('input[name="payment"]:checked');
    if (!payingMethod) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
    }
    alert("Đặt hàng thành công!");
});
// Cho phép nhấn vào các bước để chuyển giao diện.
steps.forEach(function(step, index) {

    step.addEventListener("click", function() {
        chuyenGiaoDien(index);
    });
});

// THÔNG TIN VẬN CHUYỂN
var fee = 0;
var shippingCost = 0;
var shippingPrice = document.querySelectorAll(".main__shopping-infor.main__shopping-price");
var shippingForm = document.querySelector(".main__shopping-formal");
var shippingFee = document.querySelector(".shopping-fee");
var shippingMethods = shippingForm.querySelectorAll('input[name="shipping"]');
// Cập nhật phí giao hàng tiêu chuẩn.
function updateshopping() {
    if (finalPrice >= 30000000) {
        fee = 0;
    }
    else {
        fee = 200000;
    }

    if (fee === 0) {
        shippingPrice[0].querySelector("h4").textContent = "Miễn phí";
    }
    else {
        shippingPrice[0].querySelector("h4").textContent = fee.toLocaleString("vi-VN") + "đ";
    }
    var selected = shippingForm.querySelector('input[name="shipping"]:checked');
    if (selected) {
        updateShippingFee(selected.value);
    }
}
// Cập nhật phí theo phương thức vận chuyển.
function updateShippingFee(method) {
    if (method === "Tiêu chuẩn") {
        shippingCost = fee;
    }
    else if (method === "Hỏa tốc") {
        shippingCost = 1000000;
    }
    else if (method === "Nhận tại cửa hàng") {
        shippingCost = 0;
    }
    if (shippingCost === 0) {
        shippingFee.textContent = "Miễn phí";
    }
    else {
        shippingFee.textContent = shippingCost.toLocaleString("vi-VN") + "đ";
    }
    // Cập nhật tổng tiền cuối cùng
    updateFinalTotal();
}

// Cập nhật tổng tiền cuối cùng.
function updateFinalTotal() {
    var total = finalPrice + shippingCost;
    totals[1].textContent =
        total.toLocaleString("vi-VN") + "đ";
}
var showshopping = document.getElementById("show-shopping");
var showtime = document.getElementById("show-time");
// Khi thay đổi phương thức vận chuyển.
shippingMethods.forEach(function(method) {
    method.addEventListener("change", function() {
        //Cập nhật phí vận chuyển
        updateShippingFee(method.value);
        showshopping.textContent = method.value;
        var parent = method.closest(".main__shopping-element");
        var infor = parent.querySelector(".main__shopping-infor");
        var note = infor.querySelector("p");
        showtime.textContent = note.textContent;
    });
});

// CẬP NHẬT THÔNG TIN KHÁCH HÀNG
var ho_ten = document.getElementById("ho_ten");
var sdt = document.getElementById("sdt");
var tinh_tp = document.getElementById("tinh_tp");
var address = document.getElementById("address");
var showName = document.getElementById("show-name");
var showPhone = document.getElementById("show-phone");
var showAddress = document.getElementById("show-address");
function information() {
    showName.textContent = ho_ten.value;
    showPhone.textContent = sdt.value;
    showAddress.textContent = address.value + ", " + tinh_tp.value;
}

//PHƯƠNG THỨC THANH TOÁN VÀ MÃ QR
var payments = document.querySelectorAll('input[name="payment"]');
var QR = document.querySelector(".main__paying-method-element");
// Hàm ẩn hoặc hiện mã QR
function showQR() {
    var payment = document.querySelector(
        'input[name="payment"]:checked'
    );
    // Chưa chọn phương thức thanh toán.
    if (!payment) {
        QR.style.display = "none";
        return;
    }
    // Hiện khi chọn phương thức thanh toán là mã QR
    if (payment.value === "QR") {
        QR.style.display = "flex";
    }
    else {
        QR.style.display = "none";
    }
}

// Khi thay đổi phương thức thanh toán.
payments.forEach(function(method) {
    method.addEventListener("change", function() {
        showQR();
    });
});
// Cập nhật danh sách sản phẩm và tổng tiền ban đầu.
// updatePayingProducts();
// updateTotal();
// Cập nhật trạng thái mã QR.
showQR();

