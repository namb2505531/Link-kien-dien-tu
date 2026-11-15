// Hàm chuyển đổi các bước và tô màu tiến trình
function showStep(step){
    if (step==1){
        document.getElementById("main__cart").style.display = "flex";
        document.getElementById("main__shopping").style.display = "none";
        document.getElementById("main__paying").style.display = "none";
        document.getElementsByClassName("button-next")[0].style.display ="flex";
        document.getElementsByClassName("button-next")[1].style.display ="none";
        document.getElementsByClassName("button-next")[2].style.display ="none";
        document.querySelector(".line1-2").style.background = "#11ffee00";
        document.querySelector(".line2-3").style.background = "#11ffee00";
    }
    else if (step==2){
        document.getElementById("main__cart").style.display = "none";
        document.getElementById("main__shopping").style.display = "flex";
        document.getElementById("main__paying").style.display = "none";
        document.querySelector(".line1-2").style.background = "var(--primary-gradient)";
        document.querySelector(".line2-3").style.background = "#11ffee00";
        document.getElementsByClassName("button-next")[0].style.display ="none";
        document.getElementsByClassName("button-next")[1].style.display ="flex";
        document.getElementsByClassName("button-next")[2].style.display ="none";
    }
    else if(step==3){
        document.getElementById("main__cart").style.display = "none";
        document.getElementById("main__shopping").style.display = "none";
        document.getElementById("main__paying").style.display = "flex";
        document.querySelector(".line1-2").style.background = "var(--primary-gradient)";
        document.querySelector(".line2-3").style.background = "var(--primary-gradient)";
        document.getElementsByClassName("button-next")[0].style.display ="none";
        document.getElementsByClassName("button-next")[1].style.display ="none";
        document.getElementsByClassName("button-next")[2].style.display ="flex";
    }
}
function colorStep(step){}