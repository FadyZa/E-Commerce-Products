let CardsSection = document.querySelector(".products-cards");
let aside = document.querySelector("aside");
let sidebarToggle = document.getElementById("sidebar-toggle");
let closesSidebar = document.getElementById("close-arrow");
let openSidebar = document.getElementById("open-arrow");
let cartToggle = document.getElementById("cart-toggle");
let html = document.documentElement;
let themeToggle = document.getElementById("theme-toggle");
let darkIcon = document.getElementById("dark-icon");
let lightIcon = document.getElementById("light-icon");
let themeText = document.querySelector("#theme-toggle span");
let dragable = document.getElementById("dragable");
let cartList = document.querySelector(".cart-list");
let closeCart = document.getElementById("close-cart");
let cart = document.querySelector(".cart-container");

// load products in HTML
(async function loadData(callback){
    try{
        let res = await fetch('/js/data.json');
        let data = await res.json();

        // loob through products
        data.product.forEach((product,i) => {
            const card = `<div id="card-${i+1}" class="card">
            <div class="card-img">
                <img src="${product.img}" alt="${product.name}">
            </div>

            <div class="card-content">
                <h3>${product.name}</h3>
                <p class="desc">${product.description}</p>
                <div class="color-switch">
                    <span>colors:</span>
                    <div class="colors">
                    ${product.color_switch.map(color=>`<span class="dots" data-color="${color}" style="background-color:${color};"></span>`).join("")}
                    </div>
                </div>
                <div data-category="${product.category}" hidden></div>
                <p class="instock" data-instock="5">only left ${product.instock}</p>
                <div class="price">
                    <h5 class="price">${product.price}</h5>
                    <div class="cart">
                        <ion-icon class="add-cart" name="cart-outline"></ion-icon>
                        <ion-icon name="star-half-outline"></ion-icon>
                    </div>
                </div>
            </div>
        </div>`;
        CardsSection.innerHTML += card;
    });
    }catch{
        console.log("Error")
    }

    callback();

})(handleData);

// side bar open and close functions
sidebarToggle.addEventListener("click",()=>{
    aside.classList.toggle("close");
    arrowToggle();
})

function arrowToggle(){
    if(aside.classList.contains("close")){
        openSidebar.classList.remove("hide");
        closesSidebar.classList.add("hide");
    }else{
        closesSidebar.classList.remove("hide");
        openSidebar.classList.add("hide");
    }
}
arrowToggle();


// theme toggle functions
themeToggle.addEventListener("click",()=>{
    html.hasAttribute("theme") ? html.removeAttribute("theme") : html.setAttribute("theme","dark");
    lightIcon.classList.toggle("hide");
    darkIcon.classList.toggle("hide");
    themeText.innerHTML = html.getAttribute("theme") == 'dark' ? 'light' : 'dark';
    localStorage.setItem("theme",html.getAttribute("theme"));
})

const storedTheme = localStorage.getItem("theme");
if(storedTheme == 'dark'){
        html.setAttribute('theme',storedTheme);
        lightIcon.classList.toggle("hide");
        darkIcon.classList.toggle("hide");
        themeText.innerHTML = 'light'
}


// switch card colors && add cart functions
function handleData() {
    let cards = document.querySelectorAll(".card");
    const cartList = document.querySelector(".cart-container");
    const productsList = document.querySelector(".prod-list");
    
    // get dots color
    cards.forEach(card=>{
        let cardImg = card.querySelector(".card-img");
        let colorDots = card.querySelectorAll(".dots");
        let defaultDot = card.querySelector(".colors span");

        // switch color and store at localStorage
        colorDots.forEach(dot=>{
            dot.addEventListener("click",(e)=>{
                const clicked = e.target;
                cardImg.style.backgroundColor = clicked.dataset.color;
                    
                const selectedColor = {color:clicked.dataset.color,id:card.id};
                localStorage.setItem(card.id,JSON.stringify(selectedColor));
                
                colorDots.forEach(dot=>{
                    dot.classList.remove("selected");
                })
                clicked.classList.add("selected");
            })
        })

        let storedColor = JSON.parse(localStorage.getItem(card.id));
        if(storedColor){
            cardImg.style.backgroundColor = storedColor.color;
            colorDots.forEach(dot=>{
                if(storedColor.color == dot.dataset.color && card.id == storedColor.id)
                dot.classList.add("selected");
            })
        }else{
            const selectedColor = { color: defaultDot.dataset.color, id: card.id };
            localStorage.setItem(card.id, JSON.stringify(selectedColor));      
        }
//////////////////////////////////////////////////////
card.addEventListener("click",(e)=>{        
    if(e.target.name == 'cart-outline' && !e.target.classList.contains('added')){
        const img = card.querySelector("img").src;
        const prodName = card.querySelector("h3").innerText;
        const prodPrice = card.querySelector("h5").innerText;
        cartPlaceholder.classList.add("hide");
        productsList.innerHTML += createProductHtml(card.id,prodPrice,img,prodName);
        cartList.classList.remove("hide");
        // Retrieve the existing array from localStorage, or initialize it if it doesn't exist yet
        const storedCart = localStorage.getItem('myCart');
        const myArray = storedCart ? JSON.parse(storedCart) : [];
        // Add the new object to the array
        myArray.push({id: card.id, quantity: 1});
        
        // Store the updated array back in localStorage
        localStorage.setItem('myCart', JSON.stringify(myArray));
        e.target.classList.add("added");
        totalPrice.innerHTML = totalPrice.innerHTML === "" ? parseInt(prodPrice) : parseInt(prodPrice) + parseInt(totalPrice.innerHTML); 
        getQuantity();
    }
    });
})
    
/////////////////////////////////////////////////////////////////////     
const cartPlaceholder = document.querySelector(".cart-placeholder");
const totalPrice = document.querySelector(".total");
const storedCart = JSON.parse(localStorage.getItem('myCart'));


// add to cart and store at localStorage
function createProductHtml(cardId,prodPrice,img,prodName){
    return `<div data-id="${cardId}" class="prod">
    <div class="prod-img"><img src="${img}"></div>
    <div class="prod-info">
        <h4>${prodName}</h4>
        <p>${prodPrice}</p>
    </div>
    <div class="quantity">
        <div class="box">
            <span class="quantity-increase">+</span>
        </div>
        <div class="box">
            <span class="quantity-num">1</span>
        </div>
        <div class="box">
            <span class="quantity-decrease">-</span>
        </div>
    </div>
    <div><ion-icon class="delete" name="trash-outline"></ion-icon></div>
    </div>`;
}


// Retrieve the stored data from localStorage

if(storedCart){
    let total = 0;
    storedCart.forEach((ele)=>{
        const card = document.getElementById(ele.id);
        const img = card.querySelector("img").src;
        const prodName = card.querySelector("h3").innerText;
        const prodPrice = card.querySelector("h5").innerText;
        cartPlaceholder.classList.add("hide");
        productsList.innerHTML += createProductHtml(card.id,prodPrice,img,prodName);
        card.querySelector(".add-cart").classList.add("added");
        const products = productsList.querySelectorAll(".prod");
        let prod = Array.from(products).find((prod)=>prod.dataset.id == ele.id);
        let quantity = prod.querySelector(".quantity-num");
        quantity.innerHTML = ele.quantity;  
        let price = prod.querySelector(".prod-info p").innerHTML;
        total += parseInt(price) * parseInt(ele.quantity);
        totalPrice.innerHTML = total;
    })
    getQuantity();
}   

function getQuantity(){
const cardProducts = document.querySelectorAll(".prod");
    cardProducts.forEach(ele=>{     
        let storedCart = JSON.parse(localStorage.getItem('myCart'));
        ele.addEventListener("click",(e)=>{
            if(e.target.classList.contains("quantity-increase")){
                let ind = storedCart.findIndex((cart)=>cart.id == ele.dataset.id);
                let quantity = ++ele.querySelector(".quantity-num").innerText;
                storedCart[ind] = {id:ele.dataset.id , quantity:quantity};
                localStorage.setItem("myCart",JSON.stringify(storedCart));
                let price = ele.querySelector(".prod-info p").innerHTML;
                totalPrice.innerHTML = parseInt(price) + parseInt(totalPrice.innerHTML);
            } else if(e.target.classList.contains("quantity-decrease")){
                if(parseInt(ele.querySelector(".quantity-num").innerHTML) > 1){
                    let ind = storedCart.findIndex((cart)=>cart.id == ele.dataset.id)
                    let quantity = --ele.querySelector(".quantity-num").innerText;
                    storedCart[ind] = {id:ele.dataset.id , quantity:quantity};
                    localStorage.setItem("myCart",JSON.stringify(storedCart));
                    let price = ele.querySelector(".prod-info p").innerHTML;
                    totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - parseInt(price);             
                }
            } else if(e.target.classList.contains("delete")){
                let ind = storedCart.findIndex((cart)=>cart.id == ele.dataset.id);
                console.log(storedCart[ind].quantity);
                let price = ele.querySelector(".prod-info p").innerHTML;
                totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - (parseInt(price) * storedCart[ind].quantity);             
                storedCart.splice(ind,1);
                localStorage.setItem("myCart",JSON.stringify(storedCart));
                ele.remove();
            } 
        })
    })
}

}

////////////////////// cart list functions

// make cart list dragble
const dragEle = (ele,dragZone) =>{
    let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

    const dragMouseUp = ()=>{
        document.onmouseup = null;
        document.onmousemove = null;
        ele.classList.remove("drag")
    }

    const dragMove = (e)=>{
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        ele.style.top = `${ele.offsetTop - pos2}px`
        ele.style.left = `${ele.offsetLeft - pos1}px`
    }

    const dragMouseDown = (e)=>{
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        ele.classList.add("drag");

        document.onmouseup = dragMouseUp;
        document.onmousemove = dragMove;
    };

    dragZone.onmousedown = dragMouseDown;
};
dragEle(dragable, cartList);

closeCart.addEventListener("click",()=>{
    cart.classList.add("hide");
})

if (window.matchMedia("(max-width: 992px)").matches) {
    cart.removeAttribute("id");
}

// toggle cart list
cartToggle.addEventListener("click",()=>{
    cart.classList.toggle("hide");
})