const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Cnnected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj , owner: "659bc322fa655c0f6f351a0f", }));
    //this is used to add the field of owner this is a random owner id taken form the database 
    //this will introducet the new field of owner in every listing 
    await Listing.insertMany(initData.data);
    console.log("Data was saved");
};

initDB();