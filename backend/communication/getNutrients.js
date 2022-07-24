var request = require('request');

function fetchProductList(product_name){
  console.log("called product list")
  var query = {
    json: true,
    action: "process",
    search_terms: product_name,
    fields: "code,product_name",
  }
  let params = new URLSearchParams(query).toString();
  var options = {
    'method': 'GET',
    // 'url': 'https://world.openfoodfacts.org/cgi/search.pl?json=true&action=process&fields=code,product_name&search_terms='+product_name,
    // 'url': 'https://world.openfoodfacts.org/cgi/search.pl?'+'fields=code,product_name&'+query,
    'url': 'https://world.openfoodfacts.org/cgi/search.pl?'+params,
    'headers': {
    },
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(response.body).products[0]);
      } else {
        reject(error);
      }
    });
  });
}

//gets all nutrients per 100g for a product by code 
function fetchNutrients(code){
  var options = {
    'method': 'GET',
    'url': 'https://world.openfoodfacts.org/api/v2/product/'+code+'?fields=nutriments',
    'headers': {
    }
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(response.body).product.nutriments);
      } else {
        reject(error);
      }
    });
  });
}

async function processNutrients(code){
  console.log("called get nutrients with "+code)
  let nutrientsOrig = await fetchNutrients(code);
  if(nutrientsOrig) {
    let nutrients = {}
    Object.keys(nutrientsOrig).forEach(name => {
      let nameSplit = name.split('_');
      if(nameSplit[1]=='100g'){
        nutrients[nameSplit[0]] = nutrientsOrig[name];
      }
    })
    return nutrients;
  }

}

module.exports = async function getNutrients(name){
  console.log("called get nutrients")

  // let product = await fetchProductList('skyr').then(res=>{
    // return res;
  // })
  // console.log(product);
  // let nutrients = await getNutrients(product.code)
  // return nutrients;

  let res = await fetchProductList(name);
  if(res) {
    console.log(res.product_name)
    let name = res.product_name;
    let nutrients = await processNutrients(res.code);
    // let obj = {}
    // obj[name] = nutrients;
    // return obj;
    return nutrients;
  }
}