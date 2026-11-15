
var products = document.querySelectorAll(".cart-item");
var totals = document.querySelectorAll(".price-total2");
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
    let finalPrice = sum - sum * discount;
    totals[1].innerText = finalPrice.toLocaleString("vi-VN") + "đ";
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
// // Ban đầu hiển thị giỏ hàng
// cart.style.display = "flex";
// shopping.style.display = "none";
// paying.style.display = "none";
// buttons[0].style.display = "block";
// buttons[1].style.display = "none";
// buttons[2].style.display = "none";
// // Chuyển sang vận chuyển
// buttons[0].addEventListener("click", function () {
//     cart.style.display = "none";
//     shopping.style.display = "flex";
//     buttons[0].style.display = "none";
//     buttons[1].style.display = "block";
// });
// //Chuyển sang thanh toán
// buttons[1].addEventListener("click", function () {
//     shopping.style.display = "none";
//     paying.style.display = "flex";
//     buttons[1].style.display = "none";
//     buttons[2].style.display = "block";
// });

// // Xác nhận đặt hàng
// buttons[2].addEventListener("click", function () {
//     alert("Đặt hàng thành công!");
// });
// Lấy các giao diện
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