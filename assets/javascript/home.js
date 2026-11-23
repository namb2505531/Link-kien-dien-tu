//Đặng Hoàng Nam B2505531
//SLIDER
const slider = [
    {
        id: 'sp001',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    },
    {
        id: 'sp002',
        url: '/assets/img/home-page/intel-core-i9-13900ks.png',
        hdg: 'Intel Core i9 ',
        hdgGra: '14900KS',
        subHdg: 'Xung nhịp kỷ lục 6.2GHz, 24 Nhân 32 Luồng - Sức mạnh vô song cho Streamer & Creator.'
    }
];
const elementImg = document.querySelector('.js-slider');
const hElement = document.querySelector('.js-hdg');
const hGraElement = document.querySelector('.js-hdgGra');
const pElement = document.querySelector('.js-subHdg');
const elementNextImg = document.querySelector('.js-n-slider');
const elementPrevImg = document.querySelector('.js-p-slider');
let numObSlider = 0;
function updateImg(n) {
    elementImg.style.backgroundImage = "url('" + slider[n].url + "')";

    hElement.innerText = slider[n].hdg;
    hGraElement.innerText = slider[n].hdgGra;
    pElement.innerText = slider[n].subHdg;
}
elementNextImg.addEventListener('click', function () {
    numObSlider = (numObSlider + 1) % slider.length; //lấy phần dư chia hết cho số lượng oB
    updateImg(numObSlider);
    resetTimer();
});
elementPrevImg.addEventListener('click', function () {
    numObSlider = (numObSlider - 1 + slider.length) % slider.length; //lấy phần dư chia hết cho số lượng oB
    updateImg(numObSlider);
    resetTimer();
});
autoSlide = setInterval(function () {
    numObSlider = (numObSlider + 1) % slider.length; //lấy phần dư chia hết cho số lượng oB
    updateImg(numObSlider);
}, 3000);
function resetTimer() { //reset lại thời gian khi click chuyển slider
    clearInterval(autoSlide);
    autoSlide = setInterval(function () {
        numObSlider = (numObSlider + 1) % slider.length; //lấy phần dư chia hết cho số lượng oB
        updateImg(numObSlider);
    }, 3000);
};
//ĐỒNG HỒ ĐẾM NGƯỢC
const finishDate = new Date();
finishDate.setHours(23, 59, 59, 999);
function updateCountdown() {
    const nowTime = new Date().getTime();
    const remainTime = (finishDate.getTime() - nowTime) / 1000; //chỉ đơn bị thời gian mili giây

    if (remainTime > 0) {
        const hours = Math.floor(remainTime / (60 * 60)); //floor: làm tròn xuống
        const minutes = Math.floor(remainTime % (60 * 60) / 60);
        const seconds = Math.floor(remainTime % 60);

        document.getElementById("js-hours").innerText = String(hours).padStart(2, "0"); //padStart: thêm kí tự vào cho tới khi đủ độ dài.
        document.getElementById("js-minutes").innerText = String(minutes).padStart(2, "0");
        document.getElementById("js-seconds").innerText = String(seconds).padStart(2, "0");
    } else {
        clearInterval(timer);
    }
}
updateCountdown();
const timer = setInterval(updateCountdown, 1000); // Lập lại hàm sau 1s

// nút lọc các sản phẩm nổi bật
const pdHot = [
    {
        id: 'sp003',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    },
    {
        id: 'sp004',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    }
];
const pdNew = [
    {
        id: 'sp001',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    },
    {
        id: 'sp004',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    },
    {
        id: 'sp005',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    }
];
const pdHRcm = [
    {
        id: 'sp003',
        url: '/assets/img/home-page/NVIDIA-RTX-4090-24GB-GDDR6X.png',
        hdg: 'NVIDIA RTX 4090',
        hdgGra: '24GB GDDR6X',
        subHdg: 'Xử lý đồ họa đỉnh cao, Ray Tracing thế hệ mới & Công nghệ DLSS 3.5 AI Super Resolution.'
    }
    
];
const elmPd = document.getElementById('products')
const pdList = elmPd.querySelectorAll('.product__item');
const pdStList = document.getElementsByClassName('products__section-item');
for (const e of pdStList) {
    e.addEventListener('click', function () {
        //Đổi màu nút
        for (const e1 of pdStList) {
            e1.classList.remove('products__section-item--active');
        }
        e.classList.add('products__section-item--active');
        //Lọc sản phẩm theo nút
        if (e.id === "pdHot") {
            locPd(pdHot);
        }else if (e.id === "pdNew") {
            locPd(pdNew);
        }else if(e.id ==="pdHRcm"){
            locPd(pdHRcm)
        }
    });
}
function locPd(List) {
    for (const e1 of pdList) {
        let check = false;
        for (let i = 0; i < List.length; i++) {
            if (e1.id === List[i].id) {
                check = true;
                break;
            }
        }
        if (check) {
            e1.classList.add('--dp-block');
            e1.classList.remove('--dp-none');
        } else {
            e1.classList.add('--dp-none');
            e1.classList.remove('--dp-block');
        }
    }
}