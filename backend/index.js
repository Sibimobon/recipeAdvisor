const { once } = require('events');
const express = require('express')
const app = express()
const port = 3000

const spawn = require("child_process").spawn;


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
try {    
        executeScript(JSON.stringify(food), 10, 1500).then((solution)=>{
            console.log(solution);
            res.send(solution);
        })
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
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
    return resString;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})