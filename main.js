import { items } from './items.js';

//-------Prevents JS from execution prior to rendering HTML and CSS---------//
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    ready();
  }
};

function ready() {
  document.querySelector('.item-msg').style.display = 'none';

  const itemBlock = document.querySelector('.item-block');
  let i;
  let myItemInfo = '';
  for (i = 0; i < items.length; i++) {
    myItemInfo += `
    <div class="myitem">
         <span class="item-name">${items[i].itemName}</span>
        <img src="images/${items[i].itemImage}" class="item-image" alt="${items[i].itemName}">
        <span class="item-price">${items[i].itemPrice}</span>
        <button class="btn-add-cart">Add To Cart</button>
    </div>
    `;
  }

  itemBlock.innerHTML = myItemInfo;

  const addItem = document.querySelectorAll('.btn-add-cart');
  for (let i = 0; i < addItem.length; i++) {
    const button = addItem[i];
    button.addEventListener('click', addToCart);
  }

  //-----------Purchase Event-----------------//
  const purchaseBtn = document.querySelector('.btn-purchase');
  purchaseBtn.addEventListener('click', itemPurchased);
}

// --------------Add Items To Cart-------------------//

let itemSno = 0;
const cartItemList = document.createElement('div');
cartItemList.classList.add('cart-item-list');
function addToCart(event) {
  const btnElem = event.target;
  const myItem = btnElem.parentElement;
  const itemName = myItem.querySelector('.item-name').innerText;
  const itemPic = myItem.querySelector('.item-image').src.split('/');

  const itemPrice = myItem.querySelector('.item-price').innerText;

  //---------Prevent duplicate items----------------//
  const cartItemNames = document.querySelectorAll('.cart-item-title');
  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == itemName) {
      alert('The item is already added to the cart');
      return;
    }
  }

  //--------------Create only one cartItemList Element------------/

  if (cartItemList.children.length == 0) {

    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    cartItems.insertBefore(cartItemList, cartTotal);
  }

  cartItemList.innerHTML += `
     <div class="cart-row">
                    <span class="cart-item-sno cart-column">${++itemSno}</span>
                    <div class="cart-item cart-column">
                        <img src="images/${
    itemPic[4]
    }" class="cart-item-image cart-column">
                        <span class="cart-item-title">${itemName}</span>
                    </div>
                    <span class="cart-price  cart-column">${itemPrice}</span>
                    <div class="cart-quantity cart-column">
                        <input class="cart-quantity-input" type="number" value="1">
                        <button class="btn-mycart btn-danger" type="button">REMOVE</button>
                    </div>
                </div>
  `;
  document.querySelector('.item-msg').style.display = 'block';
  setTimeout(() => {
    document.querySelector('.item-msg').style.display = 'none';
  }, 3000);

  updateTotalPrice();

  //------------Attaching Remove Item Event---------------//

  const removeBtn = document.querySelectorAll('.btn-danger');
  for (let i = 0; i < removeBtn.length; i++) {
    let button = removeBtn[i];
    button.addEventListener('click', removeCartItem);
  }

  //------------Attaching Change  Item Quantity Event---------------//
  const quantityInputs = document.querySelectorAll('.cart-quantity-input');
  for (let i = 0; i < quantityInputs.length; i++) {
    let qtyInputElement = quantityInputs[i];
    qtyInputElement.addEventListener('change', changeQuantity);
  }

  //--------Enable Purchase button--------------//
  const purchaseBtn = document.querySelector('.btn-purchase');
  purchaseBtn.removeAttribute('disabled');
}

// --------------Change Item Quantity-------------------//
function changeQuantity(event) {
  const qtyInput = event.target;
  if (isNaN(qtyInput.value) || qtyInput.value < 1) {
    qtyInput.value = 1;

  } else {
    updateTotalPrice();
  }
}

// --------------Remove Cart Item-------------------//

function removeCartItem(event) {

  const btnElem = event.target;
  btnElem.parentElement.parentElement.remove();
  updateTotalPrice();
}

// --------------Update Cart Item-------------------//

function updateTotalPrice() {
  const cartItemList = document.querySelector('.cart-item-list');
  if (!cartItemList) {
    const total = 0;
    document.querySelector('.cart-total-price').innerText = '$' + total;
    //---------- disable Purchase Button --------------//
    const purchaseBtn = document.querySelector('.btn-purchase');
    purchaseBtn.setAttribute('disabled', true);
    return;
  }
  const cartRow = cartItemList.querySelectorAll('.cart-row');
  let total = 0;
  for (let i = 0; i < cartRow.length; i++) {
    let cartPrice = cartRow[i]
      .querySelector('.cart-price')
      .innerText.replace('$', '');
    let cartQty = cartRow[i].querySelector('.cart-quantity-input').value;
    total = total + parseFloat(cartPrice) * cartQty;
  }
  total = Math.round(total * 100) / 100;
  document.querySelector('.cart-total-price').innerText = '$' + total;
}

//--------------Item Purchased------------------------//

function itemPurchased() {
  alert('Your order has been placed.Thanks for using our service !!!:)');
  const cartItems = document.querySelector('.cart-items');
  const cartItemsChildren = cartItems.children;
  for (let i = 0; i < cartItemsChildren.length; i++) {
    if (cartItemsChildren[i].classList.contains('cart-item-list')) {
      cartItemList.innerHTML = '';
      cartItems.removeChild(cartItemsChildren[i]);
      updateTotalPrice();
      break;
    }
  }
}
