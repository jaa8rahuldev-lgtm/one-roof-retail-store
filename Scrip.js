import { db, collection, addDoc } from "./firebase.js";
// ===== CART =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    let count = document.getElementById("cart-count");
    if (count) {
        count.innerText = cart.length;
    }
}

function addToCart(name, price, image = "") {

    cart.push({
        name: name,
        price: price,
        image: image
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " Added To Cart");
}

updateCartCount();


// ===== PRODUCTS =====

let products = JSON.parse(localStorage.getItem("products")) || [];
let category = document.getElementById("category").value;

async function addProduct() {

    let name = document.getElementById("name").value;

    let price = document.getElementById("price").value;

    let file = document.getElementById("image").files[0];

    if (name == "" || price == "") {

        alert("Please Fill All Fields");

        return;

    }

    let image = "";

    if (file) {

        image = URL.createObjectURL(file);

    }
    let stock = document.getElementById("stock").value;
    await addDoc(collection(db, "products"), {
    name: name,
    price: Number(price),
    image: image,
    category: category,
    stock: Number(stock)
});

alert("✅ Product Saved to Firebase");

    document.getElementById("name").value = "";

    document.getElementById("price").value = "";

    document.getElementById("image").value = "";

    showProducts();

    loadProducts();

    alert("Product Added Successfully");

}
// ===== SHOW PRODUCTS =====

function showProducts() {

    let list = document.getElementById("list");

    if (!list) return;

    list.innerHTML = "";

    products.forEach((item, index) => {

        list.innerHTML += `

        <div class="product">

            <img src="${item.image}" width="80">

            <h3>${item.name}</h3>

            <p>₹${item.price}</p>
            <p>Category: ${item.category}</p>
            <p><b>Stock:</b> ${item.stock}</p>

            <button onclick="editProduct(${index})">
            ✏ Edit
            </button>

            <button onclick="deleteProduct(${index})">
            🗑 Delete
            </button>

        </div>

        `;

    });

}

// ===== EDIT PRODUCT =====

function editProduct(index) {

    let newName = prompt("Product Name", products[index].name);

    let newPrice = prompt("Price", products[index].price);

    if (newName && newPrice) {

        products[index].name = newName;

        products[index].price = newPrice;

        localStorage.setItem("products", JSON.stringify(products));

        showProducts();

        loadProducts();

    }

}

// ===== DELETE PRODUCT =====

function deleteProduct(index) {

    if (confirm("Delete this product?")) {

        products.splice(index, 1);

        localStorage.setItem("products", JSON.stringify(products));

        showProducts();

        loadProducts();

    }

}

// ===== LOAD PRODUCTS =====

async function loadProducts() {

    let container = document.getElementById("dynamic-products");

    if (!container) return;

    container.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {

        let item = doc.data();

        container.innerHTML += `
        <div class="product">

            <img src="${item.image}" alt="">

            <h3>${item.name}</h3>

            <p>₹${item.price}</p>

            <p>${item.category}</p>

            <p>Stock : ${item.stock}</p>

            <button onclick="addToCart('${item.name}',${item.price},'${item.image}')">
                Add To Cart
            </button>

        </div>
        `;

    });

}
// ===== SEARCH =====

function searchProducts(){

let input = document.getElementById("search");

if(!input) return;

let filter = input.value.toLowerCase();

let products = document.querySelectorAll(".product");

products.forEach(product=>{

let text = product.innerText.toLowerCase();

if(text.includes(filter)){

product.style.display="";

}else{

product.style.display="none";

}

});

}

// ===== CART PAGE =====

function loadCart(){

let cartItems=document.getElementById("cart-items");

let total=document.getElementById("total");

if(!cartItems) return;

cartItems.innerHTML="";

let grandTotal=0;

cart.forEach((item,index)=>{

grandTotal+=Number(item.price);

cartItems.innerHTML+=`

<div class="product">

<img src="${item.image}" width="80">

<h3>${item.name}</h3>

<p>₹${item.price}</p>

<button onclick="removeCart(${index})">

Remove

</button>

</div>

`;

});

if(total){

total.innerHTML=grandTotal;

}

}

function removeCart(index){

cart.splice(index,1);

localStorage.setItem("cart",JSON.stringify(cart));

updateCartCount();

loadCart();

}

window.onload=function(){

updateCartCount();

showProducts();

loadProducts();

loadCart();

};
function openProduct(index){

    localStorage.setItem(
        "selectedProduct",
        JSON.stringify(products[index])
    );

    window.location.href = "product.html";
}
let quantity = 1;

function plusQty(){

    quantity++;

    let q = document.getElementById("qty");

    if(q) q.innerText = quantity;

}

function minusQty(){

    if(quantity > 1){

        quantity--;

        let q = document.getElementById("qty");

        if(q) q.innerText = quantity;

    }

}

function buyNow(){

    localStorage.setItem("buyNowQty", quantity);

    window.location.href = "checkout.html";

}
function addWishlist(){

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

let product = JSON.parse(localStorage.getItem("selectedProduct"));

wishlist.push(product);

localStorage.setItem("wishlist", JSON.stringify(wishlist));

alert("Added To Wishlist ❤️");

}
function filterCategory(category){

if(category=="All"){

loadProducts();

return;

}

let container=document.getElementById("dynamic-products");

container.innerHTML="";

products.forEach(item=>{

if(item.category==category){

container.innerHTML+=`

<div class="product">

<img src="${item.image}">

<h3>${item.name}</h3>

<p>₹${item.price}</p>

<button onclick="addToCart('${item.name}',${item.price},'${item.image}')">

Add To Cart

</button>

</div>

`;

}

});

}
function openProduct(name,price,image){

localStorage.setItem("selectedProduct",
JSON.stringify({
name:name,
price:price,
image:image
}));

location.href="product.html";

}
function placeOrder(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0){
        alert("Your cart is empty!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        status: "Pending",
        items: cart
    };

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    alert("🎉 Order Placed Successfully!");

    window.location.href = "index.html";
}
function showOrders(){

let orders = JSON.parse(localStorage.getItem("orders")) || [];

let html = "";

orders.forEach((order,index)=>{

html += `
<div class="product">
<h3>Order #${order.id}</h3>
<p><b>Name:</b> ${order.name}</p>
<p><b>Mobile:</b> ${order.mobile}</p>
<p><b>Address:</b> ${order.address}</p>
<p><b>Status:</b> ${order.status}</p>

<button onclick="markDelivered(${index})">
Delivered
</button>

</div>
`;

});

let box = document.getElementById("orders-list");

if(box){
box.innerHTML = html;
}

}
function markDelivered(index){

let orders = JSON.parse(localStorage.getItem("orders")) || [];

orders[index].status = "Delivered";

localStorage.setItem("orders", JSON.stringify(orders));

showOrders();

}
window.onload = function(){

    showProducts();

    loadProducts();

    showOrders();
    updateDashboard();

}
function updateDashboard(){

let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

document.getElementById("total-products").innerText = products.length;
document.getElementById("total-orders").innerText = orders.length;

let pending = orders.filter(o=>o.status==="Pending").length;
let delivered = orders.filter(o=>o.status==="Delivered").length;

document.getElementById("pending-orders").innerText = pending;
document.getElementById("delivered-orders").innerText = delivered;

let category = document.getElementById("category").value;
}
