const foods = require('./data/FoodData').FoundationFoods;
// const foodNames = Object.keys(foods).map(a=>a.description);

function getStats (recipe) {
    // console.log(Object.keys(foods[0]))
    // console.log(foods[0])
    // foods.forEach(element => {
    //   console.log(element)  
    // });
    let test = foods[0];
    // console.log(Object.keys(test))
    // console.log(test.description)
    let test2 = test.foodNutrients[1]
    // console.log(Object.keys(test.foodNutrients))
    //test2.forEach(nut=>{
    //    console.log(nut.nutrient.name)
    //})


// 
    // for (i in Object.keys(test.foodNutrients)){
        // console.log(test.foodNutrients[i].nutrient.name)
    // }

    // console.log(test2.nutrient.name)

    // console.log(test2.nutrient.name)
    // console.log(test.foodAttributes)

    
    // Object.keys(foods).forEach(a=>console.log(a));
    foods.forEach
}

getStats()

// module.exports = getStats