
var products = document.querySelectorAll(".cart-item");
var totals = document.querySelectorAll(".price-total2");
var finalPrice;
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
products.forEach(function(item) {
    var minus = item.querySelector(".minus");
    var plus = item.querySelector(".plus");
    var quantity = item.querySelector(".quantity-value");
    var del = item.querySelector(".delproduct");
    var price_item = item.querySelector(".price-item");
    var price_init = Number(price_item.innerText.replace(/[^\d]/g, ""));
    var price_item1 = item.querySelector(".price-item1");
    var checkbox = item.querySelector('input[type="checkbox"]');
    if (price_item1){
        var price_init1 = Number(price_item1.innerText.replace(/[^\d]/g, ""));
    }
    function updatePrice(){
        let value=Number(quantity.innerText);
        price_item.innerText = (price_init * value).toLocaleString("vi-VN") +"đ";
        if (price_item1){
        price_item1.innerText = (price_init1 * value).toLocaleString("vi-VN") +"đ";
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
        updateTotal();
    })
    checkbox.addEventListener("change", function() {
        updateTotal();
    });
});
//Chuyển đổi giao diện
var cart = document.getElementById("main__cart");
var shopping = document.getElementById("main__shopping");
var paying = document.getElementById("main__paying");
var buttons = document.querySelectorAll(".button-next");
var steps = document.querySelectorAll(".step");
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
chuyenGiaoDien(0);
buttons[0].addEventListener("click", function() {
    chuyenGiaoDien(1);
});
buttons[1].addEventListener("click", function() {
    information();
    chuyenGiaoDien(2);
});
buttons[2].addEventListener("click", function() {
    alert("Đặt hàng thành công!");
});
steps.forEach(function(step, index) {
    step.addEventListener("click", function() {
        chuyenGiaoDien(index);
    });
});

// Lấy thông tin vận chuyển
var fee = 0;
var shippingCost = 0;
var shippingPrice = document.querySelectorAll(
    ".main__shopping-infor.main__shopping-price"
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
    else if (method == "Cửa hàng") {
        shippingCost = 0;
    }
    if (shippingCost == 0) {
        shippingFee.innerText = "Miễn phí";
    }
    else {
        shippingFee.innerText =
            shippingCost.toLocaleString("vi-VN") + "đ";
    }
    updateFinalTotal();
}
function updateFinalTotal() {
    var total = finalPrice + shippingCost;
    totals[1].innerText = total.toLocaleString("vi-VN") + "đ";
}
shippingMethods.forEach(function(method) {
    method.addEventListener("change", function() {
        updateShippingFee(method.value);
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
var tchuan=document.getElementById("tchuan");