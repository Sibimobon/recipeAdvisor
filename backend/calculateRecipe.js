

module.exports = function calculateRecipe(ingredientList){
    let allNutrients = {};
    Object.keys(ingredientList[0]).forEach(nutr=>{
        let sum = ingredientList.reduce((total, obj) => obj[nutr] + total,0);
        allNutrients[nutr] = sum;
    })
    return allNutrients;
}