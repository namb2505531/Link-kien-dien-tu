// MSSV: B2305989 
// HỌ VÀ TÊN: LÊ XUÂN ANH


// Lấy danh sách 3 sản phẩm ban đầu trong HTML.
var products = document.querySelectorAll(".cart-item");
var totals = document.querySelectorAll(".price-total2");
var price_totals = document.querySelector('input[name="total_price"]');
var payingProducts = document.querySelectorAll(".main__paying-product-element");
var finalPrice = 0;
var discount = 0;
var applied = false;
// Khởi tạo lại giỏ hàng với 3 sản phẩm ban đầu.
localStorage.removeItem("cart");
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

// ======================================================
// 3. ĐỌC VÀ KHÔI PHỤC GIỎ HÀNG
// ======================================================

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
function updateTotal() {
    var sum = 0;
    products.forEach(function(item) {
        // Không tính sản phẩm đã bị xóa.
        if (!item.isConnected) {
            return;
        }
        var checkbox = item.querySelector('input[type="checkbox"]');
        var price_item = item.querySelector(".price-item");
        if (checkbox.checked) {
            sum += Number(
                price_item.textContent.replace(/[^\d]/g, "")
            );
        }
    });
    // Tổng tiền ban đầu.
    totals[0].textContent = sum.toLocaleString("vi-VN") + "đ";
    // Tổng tiền sau giảm giá.
    finalPrice = sum - sum * discount;
    totals[1].textContent =finalPrice.toLocaleString("vi-VN") + "đ";
    // Lưu tổng tiền vào input ẩn.
    price_totals.value = finalPrice.toLocaleString("vi-VN") + "đ";
    // Cập nhật phí vận chuyển.
    updateshopping();
}
// ÁP DỤNG VOUCHER
var order = document.getElementsByClassName("main__order-setion-apply")[0];
var input = order.querySelector(".input");
var vouchers = document.querySelectorAll(".buttonvoucher");
var saleoff = document.querySelector(".sale-off");
var buttonapply = document.querySelector(".buttonapply");
// Khi chọn voucher.
vouchers.forEach(function(button) {
    button.addEventListener("click", function() {
        input.value = button.textContent.trim();
        discount = 0;
        applied = false;
        saleoff.textContent = "0%";
        // Hiển thị lại các voucher.
        vouchers.forEach(function(item) {
            item.style.display = "inline-flex";
        });
        // Ẩn voucher vừa chọn.
        button.style.display = "none";
        //Cập nhật tổng tiền sau khi áp dụng voucher
        updateTotal();
    });
});
// Khi nhấn nút áp dụng.
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
    //Cập nhật tổng tiền sau khi chọn nút áp dụng voucher
    updateTotal();
    alert("Áp dụng voucher thành công!");
});

// CẬP NHẬT SẢN PHẨM Ở BƯỚC THANH TOÁN
// Ban đầu ẩn tất cả sản phẩm ở bước thanh toán.
payingProducts.forEach(function(item) {
    item.style.display = "none";
});
function updatePayingProducts() {
    products.forEach(function(item, index) {
        var checkbox = item.querySelector('input[type="checkbox"]');
        if (!payingProducts[index]) {
            return;
        }
        // Sản phẩm đã bị xóa hoặc chưa được chọn sẽ ẩn
        if (!item.isConnected || !checkbox.checked) {
            payingProducts[index].style.display = "none";
        }
        // Ngược lại thì sản phẩm được chọn sẽ hiện ra
        else {
            payingProducts[index].style.display = "flex";
        }
    });
}

// TĂNG, GIẢM SỐ LƯỢNG VÀ XÓA SẢN PHẨM
products.forEach(function(item, index) {
    // Bỏ qua sản phẩm đã bị xóa khi khôi phục.
    if (!item.isConnected) {
        return;
    }
    var minus = item.querySelector(".minus");
    var plus = item.querySelector(".plus");
    var quantity = item.querySelector(".quantity-value");
    var quantityInput = item.querySelector('input[name="quantity[]"]');
    var del = item.querySelector(".delproduct");
    var price_item = item.querySelector(".price-item");
    var price_item1 = item.querySelector(".price-item1");
    var checkbox = item.querySelector('input[type="checkbox"]');
    var payingProduct = payingProducts[index];
    // Lấy giá gốc của sản phẩm.
    var price_init = Number(price_item.textContent.replace(/[^\d]/g, ""));
    var price_init1 = 0;
    if (price_item1) {
        price_init1 = Number(
            price_item1.textContent.replace(/[^\d]/g, "")
        );
    }
    // Lấy thông tin sản phẩm ở bước thanh toán.
    var payingQuantity = null;
    var payingPrice = null;
    if (payingProduct) {
        payingQuantity = payingProduct.querySelector(
            ".paying-quantity"
        );
        payingPrice = payingProduct.querySelector(
            ".paying-price"
        );
    }
    // Khóa hoặc mở ô số lượng theo checkbox.
    quantityInput.disabled = !checkbox.checked;

    // Hàm cập nhật giá và số lượng
    function updatePrice(updateSummary) {
        var value = Number(quantity.textContent);
        // Cập nhật input số lượng.
        quantityInput.value = value;
        // Cập nhật giá sản phẩm.
        price_item.textContent =(price_init * value).toLocaleString("vi-VN") + "đ";
        // Cập nhật giá cũ nếu có.
        if (price_item1) {
            price_item1.textContent =(price_init1 * value).toLocaleString("vi-VN") + "đ";
        }
        // Cập nhật sản phẩm ở bước thanh toán.
        if (payingQuantity && payingPrice) {
            payingQuantity.textContent = value;
            payingPrice.textContent =(price_init * value).toLocaleString("vi-VN") + "đ";
        }
        // Hiển thị hoặc ẩn sản phẩm ở bước thanh toán.
        if (payingProduct) {
            if (checkbox.checked && item.isConnected) {
                payingProduct.style.display = "flex";
            }
            else {
                payingProduct.style.display = "none";
            }
        }
        // Cập nhật tổng tiền.
        if (updateSummary !== false) {
            updateTotal();
        }
        // Lưu dữ liệu mới.
        saveCart();
    }
    // Nút giảm số lượng
    minus.addEventListener("click", function() {
        var value = Number(quantity.textContent);
        // Số lượng tối thiểu là 1.
        if (value > 1) {
            quantity.textContent = value - 1;
            updatePrice();
        }
    });
    // Nút tăng số lượng
    plus.addEventListener("click", function() {
        var value = Number(quantity.textContent);
        quantity.textContent = value + 1;
        updatePrice();
    });
    // Nút xóa sản phẩm
    del.addEventListener("click", function() {
        // Xóa sản phẩm khỏi giao diện.
        item.remove();
        // Ẩn sản phẩm tương ứng ở bước thanh toán.
        if (payingProduct) {
            payingProduct.style.display = "none";
        }
        // Lưu trạng thái xóa trước khi cập nhật tổng tiền.
        saveCart();
        updateTotal();
    });
    // Chọn hoặc bỏ chọn sản phẩm
    checkbox.addEventListener("change", function() {
        quantityInput.disabled = !checkbox.checked;
        // Cập nhật tổng tiền, cập nhật danh sách sản phẩm thanh toán và lưu trạng thái giỏ hàng. 
        updateTotal();
        updatePayingProducts();
        saveCart();
    });
    // Cập nhật giao diện sau khi khôi phục dữ liệu.
    updatePrice(false);
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
// Mở giao diện giỏ hàng ban đầu.
chuyenGiaoDien(0);
// Nút chuyển từ giỏ hàng sang vận chuyển
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
        shippingFee.textContent =
            shippingCost.toLocaleString("vi-VN") + "đ";
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

//KHỞI TẠO GIAO DIỆN SAU KHI TẢI TRANG
// Cập nhật sản phẩm ở bước thanh toán.
updatePayingProducts();
// Tính lại tổng tiền và phí vận chuyển.
updateTotal();
// Cập nhật trạng thái mã QR.
showQR();
