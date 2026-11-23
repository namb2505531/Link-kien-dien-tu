// Trần Nguyễn Kha - B2410672


const CART_KEY = "gioHangPCStore";   // danh sách sản phẩm trong giỏ (cho trang giỏ hàng đọc)
let loaiDangChon = "all";            // loại đang chọn: all, cpu, vga, ...
let hen = null;                      // bộ hẹn giờ để ẩn thông báo


// ============ 1. TÌM SẢN PHẨM TRONG data.js THEO MÃ ============
function timSanPham(ma) {
    return products.find(function (sp) {
        return sp.ma === ma;
    });
}


// ============ 2. GIỎ HÀNG ============

// Hiện thông báo "Đã thêm sản phẩm vào giỏ hàng" (giống cách của Nam), tự ẩn sau 3 giây
function hienThongBao() {
    let thongBao = document.querySelector(".js-notify");
    if (!thongBao) return;

    thongBao.style.transform = "translateY(0px)";
    clearTimeout(hen);
    hen = setTimeout(function () {
        thongBao.style.transform = "translateY(100px)";
    }, 3000);
}

// Thêm 1 sản phẩm vào giỏ
function themVaoGio(ma) {
    let sp = timSanPham(ma);
    if (!sp) return;

    // (1) Tăng số trên giỏ hàng - cùng khóa "quantityCart" với base.js
    let soLuongGio = Number(localStorage.getItem("quantityCart")) || 0;
    soLuongGio = soLuongGio + 1;
    localStorage.setItem("quantityCart", soLuongGio);
    document.querySelector(".header__notify").textContent = String(soLuongGio);

    // (2) Lưu sản phẩm vào danh sách giỏ hàng (đã có thì tăng số lượng)
    let gio = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    let daCo = gio.find(function (item) {
        return item.ma === ma;
    });

    if (daCo) {
        daCo.soLuong = daCo.soLuong + 1;
    } else {
        gio.push({
            ma: sp.ma,
            ten: sp.ten,
            gia: Number(sp.giaban),
            hinhAnh: sp.hinh,
            soLuong: 1
        });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(gio));

    // (3) Báo cho người dùng biết
    hienThongBao();
}


// ============ 3. LỌC THEO LOẠI + SẮP XẾP THEO GIÁ ============

function sortPrice() {
    let kieuSapXep = document.getElementById("sortSelect").value;   // default / asc / desc
    let danhSach = document.querySelector(".product-list");
    let cacThe = Array.from(danhSach.querySelectorAll(".product-card"));

    // Bước 1: lọc - thẻ không đúng loại thì ẩn đi
    cacThe.forEach(function (the) {
        let sp = timSanPham(the.dataset.id);
        if (loaiDangChon === "all" || sp.category === loaiDangChon) {
            the.style.display = "";
        } else {
            the.style.display = "none";
        }
    });

    // Bước 2: sắp xếp (giá lấy từ data.js)
    cacThe.sort(function (a, b) {
        let giaA = Number(timSanPham(a.dataset.id).giaban);
        let giaB = Number(timSanPham(b.dataset.id).giaban);

        if (kieuSapXep === "asc") return giaA - giaB;     // giá tăng dần
        if (kieuSapXep === "desc") return giaB - giaA;    // giá giảm dần
        return a.dataset.id.localeCompare(b.dataset.id);  // mặc định: theo mã 001, 002, ...
    });

    // Xếp lại các thẻ theo thứ tự mới
    cacThe.forEach(function (the) {
        danhSach.appendChild(the);
    });
}


// ============ 4. CHẠY KHI TRANG TẢI XONG ============
// Số trên giỏ hàng lúc mới mở trang đã do base.js hiển thị, nên ở đây không cần làm lại.
document.addEventListener("DOMContentLoaded", function () {

    // Nút "Thêm vào giỏ hàng"
    document.querySelectorAll(".add-cart").forEach(function (nut) {
        nut.addEventListener("click", function () {
            let ma = nut.closest(".product-card").dataset.id;
            themVaoGio(ma);
        });
    });

    // Bấm vào tên hoặc ảnh sản phẩm -> sang trang chi tiết
    document.querySelectorAll(".product-card h4, .product-card img").forEach(function (phanTu) {
        phanTu.style.cursor = "pointer";
        phanTu.addEventListener("click", function () {
            let ma = phanTu.closest(".product-card").dataset.id;
            window.location.href = "product-detail.html?id=" + ma;
        });
    });

    // Bấm chọn loại sản phẩm ở menu bên trái
    let cacMuc = document.querySelectorAll(".filter-category li");
    cacMuc.forEach(function (muc) {
        muc.addEventListener("click", function () {
            cacMuc.forEach(function (m) {
                m.classList.remove("active");
            });
            muc.classList.add("active");

            loaiDangChon = muc.dataset.category;
            sortPrice();
        });
    });

    // Nếu từ trang chủ sang có kèm ?cat=cpu thì tự bấm vào mục đó
    let cat = new URLSearchParams(window.location.search).get("cat");
    if (cat) {
        let muc = document.querySelector('.filter-category li[data-category="' + cat + '"]');
        if (muc) {
            muc.click();
        }
    }
});