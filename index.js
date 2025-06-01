const express = require('express');
const cors = require('cors');

let app = express();
app.use(cors);
    




app.listen(3200, ()=>{
    console.log("Server started")
})
