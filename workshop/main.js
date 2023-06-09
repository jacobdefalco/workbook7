"use strict";
//search page
const searchByDDL = document.querySelector("#search-by-DDL");
const categoriesDDL = document.querySelector("#categories-DDL");
const productsTbody = document.querySelector("#products-tbody");
const searchResultHeader = document.querySelector("#search-results-header");

window.onload = function defaultPage() {
  searchByDDL.value == "0";
};

function fetchAndDisplayAllProducts() {
  fetch("http://localhost:8081/api/products")
    .then((response) => response.json())
    .then((jsonedProducts) => displayProductsInTable(jsonedProducts));
}

function displayProductsInTable(products) {
  productsTbody.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    let row = productsTbody.insertRow(-1);

    let cell1 = row.insertCell(0);
    cell1.innerText = products[i].productId;

    let cell2 = row.insertCell(1);
    let anchor = document.createElement("a");
    anchor.href = `details.html?productid=${products[i].productId}`;
    anchor.innerText = products[i].productName;
    cell2.appendChild(anchor);

    let cell3 = row.insertCell(2);
    let cell3num = Number(products[i].unitPrice);
    cell3.innerText = "$" + cell3num.toFixed(2);
    productsTbody.appendChild(row);
  }
}

function fetchAndDisplayCategories() {
  fetch("http://localhost:8081/api/categories")
    .then((response) => response.json())
    .then((jsonedCategories) => populateDDLWithCategories(jsonedCategories));
}

function populateDDLWithCategories(categories) {
  categoriesDDL.innerHTML = "";
  let defaultOption = new Option("Select a category");
  categoriesDDL.appendChild(defaultOption);
  for (let i = 0; i < categories.length; i++) {
    let newOption = new Option(categories[i].name, categories[i].categoryId);
    categoriesDDL.appendChild(newOption);
  }
}

function filterProductsByCategory() {
  fetch("http://localhost:8081/api/products")
    .then((response) => response.json())
    .then((jsonedProducts) => {
      let filteredProducts = jsonedProducts.filter(
        (p) => p.categoryId == categoriesDDL.value
      );
      displayProductsInTable(filteredProducts);
    });
}

function handleDDLChoice() {
  if (searchByDDL.value == "view-all") {
    categoriesDDL.style.display = "none";
    searchResultHeader.innerText = "All Products";
    fetchAndDisplayAllProducts();
  } else if (searchByDDL.value == "category") {
    productsTbody.innerHTML = "";
    categoriesDDL.style.display = "block";
    searchResultHeader.innerText = "Products by category";
    fetchAndDisplayCategories();
  } else {
    productsTbody.innerHTML = "";
    searchResultHeader.innerText = "";
    categoriesDDL.style.display = "none";
  }
}
//details page

const productNameTitle = document.querySelector("#product-name-title");
const productDetailsTbody = document.querySelector("#product-details-tbody");

function loadProductDetailsTable(product) {
  let row = productDetailsTbody.insertRow(-1);
  productNameTitle.innerText = product.productName;

  let cell1 = row.insertCell(0);
  cell1.innerText = product.productName;

  let cell2 = row.insertCell(1);
  let cell2num = Number(product.unitPrice);
  cell2.innerText = "$" + cell2num.toFixed(2);

  let cell3 = row.insertCell(2);
  cell3.innerText = product.unitsInStock;

  let cell4 = row.insertCell(3);
  cell4.innerText = product.supplier;

  let cell5 = row.insertCell(4);
  cell5.innerText = product.discontinued;
}

function fetchProductDetails(productId) {
  fetch(`http://localhost:8081/api/products/${productId}`)
    .then((response) => response.json())
    .then((jsonedProductDetails) =>
      loadProductDetailsTable(jsonedProductDetails)
    );
}

window.addEventListener("load", (event) => {
  const urlParams = new URLSearchParams(location.search);

  let productId = -1;
  if (urlParams.has("productid") === true) {
    productId = urlParams.get("productid");

    fetchProductDetails(productId);
  }
});
