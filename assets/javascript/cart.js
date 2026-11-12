// // Hàm chuyển đổi các bước và tô màu tiến trình
// function showStep(step){
//     if (step==1){
//         document.getElementById("main__cart").style.display = "flex";
//         document.getElementById("main__shopping").style.display = "none";
//         document.getElementById("main__paying").style.display = "none";
//         document.getElementsByClassName("button-next")[0].style.display ="flex";
//         document.getElementsByClassName("button-next")[1].style.display ="none";
//         document.getElementsByClassName("button-next")[2].style.display ="none";
//         document.querySelector(".line1-2").style.background = "#11ffee00";
//         document.querySelector(".line2-3").style.background = "#11ffee00";
//     }
//     else if (step==2){
//         document.getElementById("main__cart").style.display = "none";
//         document.getElementById("main__shopping").style.display = "flex";
//         document.getElementById("main__paying").style.display = "none";
//         document.querySelector(".line1-2").style.background = "var(--primary-gradient)";
//         document.querySelector(".line2-3").style.background = "#11ffee00";
//         document.getElementsByClassName("button-next")[0].style.display ="none";
//         document.getElementsByClassName("button-next")[1].style.display ="flex";
//         document.getElementsByClassName("button-next")[2].style.display ="none";
//     }
//     else if(step==3){
//         document.getElementById("main__cart").style.display = "none";
//         document.getElementById("main__shopping").style.display = "none";
//         document.getElementById("main__paying").style.display = "flex";
//         document.querySelector(".line1-2").style.background = "var(--primary-gradient)";
//         document.querySelector(".line2-3").style.background = "var(--primary-gradient)";
//         document.getElementsByClassName("button-next")[0].style.display ="none";
//         document.getElementsByClassName("button-next")[1].style.display ="none";
//         document.getElementsByClassName("button-next")[2].style.display ="flex";
//     }
// }
var products = document.querySelectorAll(".cart-item");
// var total = document.querySelector(".total-price2");
// function updateTotal() {
//     let sum = 0;
//     products.forEach(function(item) {
//         var checkbox = item.querySelector('input[type="checkbox"]');
//         var price_item = item.querySelector(".price-item");
//         if (checkbox.checked) {
//             sum += Number(price_item.innerText.replace(/[^\d]/g, ""));
//         }
//         else{
//             sum -= Number(price_item.innerText.replace(/[^\d]/g, ""));
//         }
//     });
//     total.innerText = sum.toLocaleString("vi-VN") + "đ";
// }
products.forEach(function(item) {
    var minus = item.querySelector(".minus");
    var plus = item.querySelector(".plus");
    var quantity = item.querySelector(".quantity-value");
    var del = item.querySelector(".delproduct");
    var price_item = item.querySelector(".price-item");
    var price_init = Number(price_item.innerText.replace(/[^\d]/g, ""));
    var price_item1 = item.querySelector(".price-item1");
    if (price_item1){
        var price_init1 = Number(price_item1.innerText.replace(/[^\d]/g, ""));
    }
    var checkbox = item.querySelector('input[type="checkbox"]');
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
        if ((value - 1)>1){
            quantity.innerText = value - 1;   
        }
        quantity.innerText = 0;
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
});