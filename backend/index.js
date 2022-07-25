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
    let result = await calculateRecipe(ingredients);
    //amounts into calculate recipe
    res.end(JSON.stringify(result));
    // res.send(JSON.stringify(ingredients))
});


app.post('/findBest', async (req, res) => {
    // let recipes = JSON.parse(req.body);
    let recipes = req.body;
    console.log(recipes);
    // recipes = {name:{ingredients...}}
    let relevant = []
    Object.keys(recipes).forEach(r => {
        let stats = JSON.parse(recipes[r]);
        let desc = {
            "name": r,
            "protein": stats.proteins,
            "calories": stats["energy-kcal"]
        }
        relevant.push(desc);
    });
    // console.log(relevant);
    try {    
        executeScript(JSON.stringify(relevant), 10, 4000).then((solution)=>{
            console.log(solution);
            res.send(solution);
        })
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
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
    try {    
        executeScript(JSON.stringify(food), 10, 1500).then((solution)=>{
            console.log(solution);
            res.send(solution);
        })
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
    // getStats()


    //let result = await getNutrients(req.query.name);
    //console.log("sending res "+result);
    //res.send(JSON.stringify(result))
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