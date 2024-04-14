const mongoose = require("mongoose");
const Schema = mongoose.Schema;// so as to not right it again n again 
const Review = require("./review.js");
const listingSchema = new Schema({
    title: {
        type : String ,
        required : true ,
    },
    description : {
        type : String ,
    }, 
    image: {
        url: String , 
        filename: String ,    
    },
    price: Number , 
    location: String , 
    country: String ,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type : Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type:{
            type: String ,
            enum: ['Point'] ,
            // required: true,
        },
        coordinates:{
            type: [Number],
            // required: true ,
        }
    }
});
//post mongoose middleware
listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
})
const Listing = mongoose.model("Listing" , listingSchema); // creating a model
module.exports = Listing ;//exporting the model 

