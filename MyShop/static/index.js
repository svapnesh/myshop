
// Get products by search parameter
async function getProducts(search_param){
    let response = await fetch('http://localhost:8000/api/product/search/?'+search_param);
    let data = response.json();
    return data;
}


// Generate unique id
function generateSecretId(){
    return Math.random().toString(16).slice(2);
}

// Add product to cart
async function addProductToCart(product){
    var secretId = window.sessionStorage.getItem('secretId') || undefined;
    if(secretId === undefined){
        window.sessionStorage.setItem('secretId', generateSecretId());
    }

    // Send POST request to server to add item into cart
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this);
        }
    };
    xhttp.open("POST", "http://localhost:8000/api/product/cart/item/add/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("secret_id="+secretId+"&product_id="+product.id);

    // Fetch cart items if already exists in session
    var cartItems = JSON.parse(window.sessionStorage.getItem('cartItems')) || [];

    // Find id of the item if item is already exists in session
    var idIndex = cartItems && cartItems.map(function(item) { return item.id; }).indexOf(product.id);
    if (idIndex >= 0){
        alert("This item is already added to cart");   
    }
    else{
        // Add new item to cart
        cartItems.push({
            'id': product.id,
            'title': product.title,
            'price': product.price,
            'quantity': 1
        });
        // Set session values
        window.sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}


async function getCartItems(){
    // let response = await fetch('http://localhost:8000/api/product/cart/items/');
    // let data = response.json();
    // return data;
    return JSON.parse(window.sessionStorage.getItem('cartItems'));
}


document.getElementById("btn_search").addEventListener('click', (event) => {
    var search_param = document.getElementById("search").value;
    location.href = location.origin + location.pathname + '#' + 'products?q='+search_param;
});


// Handle popstate change event 
window.addEventListener('popstate', (event) => {
    module.renderOnPageLoadOrURLChange();
})


// Create module and functions to perform specific task
var module = {
    // To reset renderer
    setRendererNull: (renderId) => {
        document.getElementById(renderId).innerHTML = null;
    },
    // Render product list
    renderProducts: (products, renderId) => {
        module.setRendererNull('productsRenderer');
        var div = document.createElement('div');
        products.map(product=> {
            // Title/description span for item
            var span = document.createElement('span');
            span.innerText = "Title: " + product.title + "\n" + "Description: " + product.description;
            div.appendChild(span);

            div.appendChild(document.createElement('br'));

            // Add to cart button for item
            var addToCartBtn = document.createElement('button');
            addToCartBtn.type = 'button';
            addToCartBtn.innerHTML = 'Add to cart';
            addToCartBtn.className = 'btn btn-success';
            addToCartBtn.onclick = function(){
                addProductToCart(product);
                location.href = location.origin + location.pathname + '#' + 'cart';
            }
            div.appendChild(addToCartBtn);
            div.appendChild(document.createElement('hr'));
        });
        document.getElementById(renderId).appendChild(div);
    },
    // Render cart items
    renderCartItems: (cartItems, renderId) => {
        module.setRendererNull('cartRenderer');
        var div = document.createElement('div');
        var totalPriceSpan = document.createElement('span');
        if (cartItems.length == 0) {
            var span = document.createElement('span');
            span.innerText = "Your cart is empty, add items to see here.";
            div.appendChild(span);
        }
        cartItems.map(cartItem => {
            
            // Cart item content span
            var span = document.createElement('span');
            span.innerText = "Title: " + cartItem.title;
            div.appendChild(span);
            div.appendChild(document.createElement('br'));

            // Price span for item
            var priceSpan = document.createElement('span');
            priceSpan.id = 'cartitem' + cartItem.id;
            priceSpan.innerText = "Total price: " + cartItem.price;
            div.appendChild(priceSpan);
            div.appendChild(document.createElement('br'));

            // Quantity span for item
            var quantitySpan = document.createElement('span');
            quantitySpan.innerText = cartItem.quantity;
            quantitySpan.className = 'm-2';
            
            // Increase quantity span for item
            var increaseQuantityBtn = document.createElement('button');
            increaseQuantityBtn.type = 'button';
            increaseQuantityBtn.innerHTML = '+';
            increaseQuantityBtn.className = 'btn btn-dark btn-sm';
            increaseQuantityBtn.onclick = function(){
                cartItem.quantity += 1;
                quantitySpan.innerText = cartItem.quantity;
                document.getElementById('cartitem'+cartItem.id).innerText = "Total price: " + cartItem.price * cartItem.quantity;
            }
            div.appendChild(increaseQuantityBtn);
            div.appendChild(quantitySpan);

            // Decrease quantity span for item
            var decreaseQuantityBtn = document.createElement('button');
            decreaseQuantityBtn.type = 'button';
            decreaseQuantityBtn.innerHTML = '-';
            decreaseQuantityBtn.className = 'btn btn-dark btn-sm';
            decreaseQuantityBtn.onclick = function(){
                if(cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    quantitySpan.innerText = cartItem.quantity;
                    document.getElementById('cartitem'+cartItem.id).innerText = "Total price: " + cartItem.price * cartItem.quantity;
                }
            }
            div.appendChild(decreaseQuantityBtn);

            div.appendChild(document.createElement('br'));
            div.appendChild(document.createElement('br'));

            // Remove item button for item
            var removeItemBtn = document.createElement('button');
            removeItemBtn.type = 'button';
            removeItemBtn.innerHTML = 'Remove Item';
            removeItemBtn.className = 'btn btn-danger';
            removeItemBtn.onclick = function(){
                var removeItemConfirmation = window.confirm("Are you sure, you want to remove this item?");
                if (removeItemConfirmation == true){
                    var xhttp = new XMLHttpRequest();
                    var secretId = window.sessionStorage.getItem('secretId') || undefined;
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var idIndex = cartItems && cartItems.map(function(item) { return item.id; }).indexOf(cartItem.id);
                            cartItems.splice(idIndex, 1);
                            if (cartItems.length == 0){
                                window.sessionStorage.removeItem('cartItems');
                            }
                            else{
                                window.sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
                            }
                            module.renderCartItems(cartItems, 'cartRenderer');
                        }
                    };
                    xhttp.open("POST", "http://localhost:8000/api/product/cart/item/remove/", true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send("secret_id="+secretId+"&product_id="+cartItem.id);                    
                }
            }
            div.appendChild(removeItemBtn);
            div.appendChild(document.createElement('hr'));
        });
        div.appendChild(totalPriceSpan);
        div.appendChild(document.createElement('br'));
        if (cartItems.length != 0){
            var placeOrderBtn = document.createElement('button');
            placeOrderBtn.type = 'button';
            placeOrderBtn.innerHTML = 'PLACE ORDER';
            placeOrderBtn.className = 'btn btn-warning';
            placeOrderBtn.onclick = function(){
                alert("You need to login to proceed further");
            }
            div.appendChild(placeOrderBtn);
        }
        document.getElementById(renderId).appendChild(div);
    },
    renderOnPageLoadOrURLChange: () => {
        var currentPathWithQueryParam = location.hash.substr(1);
        var currentPath = currentPathWithQueryParam.split("?")[0];
        if(currentPath === 'products'){
            var searchParam = currentPathWithQueryParam.split("?")[1];
            getProducts(searchParam).then(data => {
                if(data.length == 0){
                    alert("No product found with search item, please try again!");
                    document.getElementById('search').value = '';
                    module.setRendererNull('productsRenderer');
                }
                else{
                    var products = data;
                    module.renderProducts(products, 'productsRenderer');
                    var titleSpan = document.createElement('span');
                    titleSpan.innerText = products.length + " products found";
                    document.getElementById('productsRenderer').appendChild(titleSpan);
                }
            });
        }
        else if(currentPath == 'cart'){
            getCartItems().then(data => {
                if(data.length == 0){
                    alert("Cart is Empty");
                }
                else{
                    var cartItems = data;
                    module.renderCartItems(cartItems, 'cartRenderer');
                }
            });
        }
        else{

        }
    }
}