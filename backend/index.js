const { once } = require('events');
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const spawn = require("child_process").spawn;
const getStats = require('./getStats');
const getNutrients = require('./communication/getNutrients')
const calculateRecipe = require('./calculateRecipe')


app.use(bodyParser.urlencoded({
    extended: true
}))

//Endpoint
app.post('/recipes', (req, res) => {
    // check url
    // for each ingredient -> translate ingredient into ingredient from database (if not found in foundation foods -> search in branded)
    // translate measurements
    // return object [{ingredient: amount in grams},...]

    
    let receipe = req;
    console.log("Getting new request")
    console.log(receipe)
    res.send("receipe");
});

app.post('/food', (req, res) => {
    let body = req.body;

});


app.post('/recipe', async (req, res) => {
    let ingredients = req.body;
    console.log(ingredients);
    let amounts = [];
    //Object.keys(ingredients).forEach(async i=> {
    //    // call getNutrients
    //    let nutrients = await getNutrients(i)
    //    // map to *=amount/100
    //    let factor = ingredients[i]/100;
    //    Object.keys(nutrients).map(nutr=> {
    //        nutrients[nutr]=nutrients[nutr]*factor;
    //    });
    //    //append to amounts
    //    amounts.push(nutrients);
    //})

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
    //amounts into calculate recipe
    res.end(JSON.stringify(calculateRecipe(amounts)));
    // res.send(JSON.stringify(ingredients))
});


let food = [
    {
        "name": "pizza",
        "protein": 15,
        "calories": 600
    },
    {
        "name": "eis",
        "protein": 7,
        "calories": 400
    },
    {
        "name": "nudeln",
        "protein": 20,
        "calories": 400
    },
    {
        "name": "burger",
        "protein": 18,
        "calories": 550
    },
    {
        "name": "chicken",
        "protein": 30,
        "calories": 450
    } 
]


app.get('/', async (req, res) => {
    console.log('in hello world')
    // try {    
        // executeScript(JSON.stringify(food), 10, 1500).then((solution)=>{
            // console.log(solution);
            // res.send(solution);
        // })
    // } catch(e) {
        // console.log(e);
        // res.sendStatus(500);
    // }
    // getStats()
    let result = await getNutrients(req.query.name);
    console.log("sending res "+result);
    res.send(JSON.stringify(result))
})


const executeScript = async (food, prot_min, cal_max)=>{
    const pythonProcess = spawn('python',["./model.py", food, prot_min, cal_max]);
    console.log('in execute script')
    let resString = "";
    pythonProcess.stdout.on('data', (data) => {
        console.log("received from buffer");
        const buff = Buffer.from(data, "utf-8");
        resString += buff.toString();
    });
    await once(pythonProcess, 'exit');
    return resString.split('-SEPERATOR-')[1];
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})