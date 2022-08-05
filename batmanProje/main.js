let currentPage = 0;
let uniqueList = [];


function getAllDeals(
  url = "https://www.cheapshark.com/api/1.0/deals?title=batman&onSale=1&pageSize=60&sortBy=Savings",
  page = 0,
  previousResponse = []
) {
  return fetch(`${url}&pageNumber=${page}`)
    .then(response => response.json())
    .then(newResponse => {
      const response = [...previousResponse, ...newResponse];

      if (newResponse.length !== 0) {
        page++;

        return getAllDeals(url, page, response);
      }

      return response;
    });
}

function loadDeals(pageNumber) {
  let selectedGames = [];

  if (pageNumber * 10 <= uniqueList.length) {
    selectedGames = uniqueList.slice(pageNumber * 10, (pageNumber + 1) * 10);
  } else {
    window.removeEventListener('scroll', loadMoreDeals);
    return false;
  }
  for (let index = 0; index < selectedGames.length; index++) {
    let deal = selectedGames[index];
    let saving = parseInt(deal.savings)
    let component = `<div class="product bg-white border-solid border-2 border-gray-600... rounded-2xl p-3">
      <div class="product-row flex justify-end">
      <button onclick="this.classList.toggle('bg-red-500'), favoriAdd(this,'${deal.title}','${deal.gameID}')" class="product_button rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
      <svg fill="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg></button></div>
      <div class="product-row rounded-lg h-64 overflow-hidden">
      <img alt="content" class="product-image object-contain object-center h-full w-full" src=" ${deal.thumb}  "></div>
      <h2 class="product-title title-font text-xl h-16 font-medium text-gray-900 mt-3  font-serif"> ${deal.title} </h2>
      <div class="flex items-center mb-4">
      <img src="https://www.cheapshark.com/img/stores/icons/0.png" class="w-5 h-5">
      <p class="ml-2 text-sm font-bold text-gray-900 dark:text-black">${deal.steamRatingPercent == 0 ? '' : `${deal.steamRatingPercent}/100`}</p>
      <span class="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
      <a href="#" class="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-black">${deal.steamRatingCount} reviews</a>
      </div>  
      <p class="text-sm inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-600 text-white rounded-full product-saving leading-relaxed text-base"> Save %${saving}  </p>
      <div class="product-row flex flex-row items-center">    
      <p class="product-price text-2xl mr-2 text-black"> $${deal.salePrice}  </p>
      <p class="product-old-price text-sm line-through text-red-600">  $${deal.normalPrice}  </p>
      <button onclick="basketTextChange(this), basketAdd('${deal.storeID}','${deal.title}','${deal.salePrice}')"  class="add-to-cart flex mx-auto text-white bg-green-600 border-0 py-2 px-4 mr-0 focus:outline-none hover:bg-green-700 rounded m-4"> Add To Cart</button></div>
    
      </div>`
    let div = document.createElement('div');
    div.className = 'xl:w-1/4 sm:w-1/2 mb-10 px-4';
    div.innerHTML = component
    document.getElementById('games').appendChild(div);
  }
}

function favoriAdd(element, name, gameID) {
  let productDetailFav = {
    productName: name,
    productGameID: gameID
  }
  
  if (element.className.includes("bg-red-500") == false) {
    let favList = JSON.parse(localStorage.getItem("favProducts"));
    for (let i = 0; i < favList.length; i++) {
      if (favList[i].productGameID == gameID) {
        favList.splice(i, 1);
        break;
      }
    }
    localStorage.setItem("favProducts", JSON.stringify(favList));
  }else{
    if (localStorage.getItem("favProducts") == null) {
      let favProducts = [];
      favProducts.push(productDetailFav);
      localStorage.setItem("favProducts", JSON.stringify(favProducts));
    } else {
      favProducts = JSON.parse(localStorage.getItem("favProducts"));
      favProducts.push(productDetailFav);
      localStorage.setItem("favProducts", JSON.stringify(favProducts));
    }
  }

}


function basketTextChange(id) {
  if (id.className.includes("add-to-cart")) {
    id.classList.add("added-to-cart");
    id.classList.remove("add-to-cart");
    id.innerHTML = 'Basket added';
  }
}




function basketAdd(storeID, name, price) {
  let productDetail = {
    productName: name,
    productStoreID: storeID,
    productPrice: price
  }

  if (localStorage.getItem("basketProducts") == null) {
    let basketProducts = [];
    basketProducts.push(productDetail);
    localStorage.setItem("basketProducts", JSON.stringify(basketProducts));
  } else {
    basketProducts = JSON.parse(localStorage.getItem("basketProducts"));
    basketProducts.push(productDetail);
    localStorage.setItem("basketProducts", JSON.stringify(basketProducts));

  }

}




getAllDeals().then(dealData => {
  let existingGames = [];

  for (i = 0; i < dealData.length; i++) {
    let currentDeal = dealData[i];
    if (!existingGames.includes(currentDeal.gameID)) {
      uniqueList.push(currentDeal);
      existingGames.push(currentDeal.gameID);
    }
  }

  loadDeals(currentPage);
});

function loadMoreDeals() {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    currentPage = currentPage + 1;
    loadDeals(currentPage);
  }
}

window.addEventListener('scroll', loadMoreDeals);