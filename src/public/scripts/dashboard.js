import {loadPage} from './script.js'

var list;
var toggle;
var navigation;
var main; 

export default () => {
    // add hovered class to selected list item
    list = document.querySelectorAll(".navigation li");

    function activeLink() {
        list.forEach((item) => {
            item.classList.remove("hovered");
        });
        this.classList.add("hovered");
    }

    loadPage()

    list.forEach((item) => item.addEventListener("mouseover", activeLink));

    toggle = document.querySelector(".toggle");
    navigation = document.querySelector(".navigation");
    main = document.querySelector(".main");

    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };

}