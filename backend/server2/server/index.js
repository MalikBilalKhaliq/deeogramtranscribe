const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const fs = require('fs/promises');
var cors = require('cors');

app.use(cors());

app.get("/",(req,res)=>{
    res.json({"Done":"Api is working fine"})
})

app.post("/api/updatedata",(req,res,next)=>{
    try{
        const data1 = req.body;
        fs.readFile("data.json", 'utf8', (err, data) => {
            // Read/modify file data here
            console.log(data1);
            var jsondata = JSON.parse(data);
            jsondata.livestream = `${jsondata.livestream1} ${data1}` 
            console.log(jsondata);
            // fs.writeFile("data.json", JSON.stringify(jsondata));
            res.json({"success":data1});
          })


       
        
//Serialize as JSON and Write it to a file

    }catch(e){
        next(e);
    }
    
})

app.get("/api/getdata", async(req,res,next)=>{
    try{
        fs.readFile("data.json")
        .then((data) => {
            res.send(JSON.parse(data));
          // Do something with the data
        })
        .catch((error) => {
            res.send(JSON.parse({"error":error}));
          // Do something if error 
        });
    }catch(e){
        next(e);
    }
    
})
app.listen(PORT,()=>{
    console.log(`Server Is live running on http://localhost:${PORT}`);
})