const getNutrients = require('./communication/getNutrients')


function sumIngredients(ingredients){
    let allNutrients = {};
    Object.keys(ingredients[0]).forEach(nutr=>{
        let sum = ingredients.reduce((total, obj) => obj[nutr] + total,0);
        allNutrients[nutr] = sum;
    })
    return allNutrients;
}

module.exports = async function calculateRecipe(ingredients){
    let amounts = [];

    for await (let i of Object.keys(ingredients)){
        // call getNutrients
        let nutrients = await getNutrients(i)
        // map to *=amount/100
        let factor = ingredients[i]/100;
        Object.keys(nutrients).map(nutr=> {
            nutrients[nutr]=nutrients[nutr]*factor;
        });
        //append to amounts
        amounts.push(nutrients);
    }
    return sumIngredients(amounts);
}