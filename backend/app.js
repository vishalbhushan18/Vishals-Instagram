const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/keys'); 
//HeMKTJIE4oE3mEBT


mongoose.connect(process.env.MONGODB_URI || MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',() => {
    console.log('Connected to Mongo Database!!!');
})


mongoose.connection.on('error',(err) => {
    console.log('Error Connecting to Mongo Database',err);
})

require('./models/user')
require('./models/post')

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendfile(path.resolve(_dirname,'./client','build','index.html'))
    })
}


app.listen(PORT, () => {
console.log("server is running on", PORT)
})