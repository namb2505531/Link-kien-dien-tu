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
//Thông báo thêm vào giỏ hàng
const buyBtns = document.querySelectorAll('.product__item-btn');
const buyNotify = document.querySelector('.js-notify');
let quantityCart = Number(localStorage.getItem('quantityCart')) || 0;
document.querySelector('.header__notify').textContent = String(quantityCart);
for (let i = 0; i < buyBtns.length; i++) {
    buyBtns[i].addEventListener('click', function () {
        buyNotify.style.transform = "translateY(0px)";
        quantityCart = quantityCart + 1;

        localStorage.setItem('quantityCart', quantityCart);

        document.querySelector('.header__notify').textContent = String(quantityCart);

        clearTimeout(clearTime);

    });
    const clearTime = setInterval(function () {
        buyNotify.style.transform = "translateY(100px)";
    }, 3000);
}
//Đặng Hoàng Nam B2505531

//Nguyễn Hoàng Gia Thịnh - B2405055
//Cập nhật nút tài khoản trên header
function updateHeaderAccount() {
    const accountBtn = document.querySelector('.header__account-btn');
    const customerId = localStorage.getItem('electroshopCurrentUser');
    let text = 'Đăng nhập';
    // Tìm tên tài khoản theo mã khách hàng
    for (let slot = 1; slot <= 3; slot++) {
        if (customerId && localStorage.getItem('electroshopUser' + slot + '.customerId') === customerId) {
            const username = localStorage.getItem('electroshopUser' + slot + '.username');
            text = username.length > 6 ? username.slice(0, 6) + '...' : username;
        }
    }
    accountBtn.lastChild.textContent = ' ' + text;
}
updateHeaderAccount();
//Nguyễn Hoàng Gia Thịnh - B2405055