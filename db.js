const mongoose = require('mongoose')

let mongoconn =()=>{

 mongoose.connect('mongodb://127.0.0.1:27017/test').then(() => {
    console.log("Connected to Db Successfully!!");
}).catch((e) => {

    console.log("Error : ", e.message);
})
}

module.exports = mongoconn