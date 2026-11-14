
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