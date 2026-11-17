//Đặng Hoàng Nam B2505531
//bật tắt menu-mobile-btn
const menuBtn = document.getElementById("mobile-menu-btn");
const menuList = document.getElementById("mobile-menu-list");
menuBtn.addEventListener('click', function () {
    if (menuList.style.display === "block") {
        menuList.style.display = "none";
    } else {
        menuList.style.display = "block";
        viTriLucMo = window.scrollY; // lưu lại vị trí trang ngay lúc bấm mở
    }
});
window.addEventListener('scroll', function () {    //abs là trị tuyệt đối, không tắt khi lưới quá ngắn
    if (menuList.style.display === "block" && Math.abs(window.scrollY - viTriLucMo) > 15) {
        menuList.style.display = "none";
    }
});

//Đặng Hoàng Nam B2505531
