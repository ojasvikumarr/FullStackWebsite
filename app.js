if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl = process.env.ATLASDB_URL ;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs"); //app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views")); //app.set("views" , path.join(__dirname , "views"))
app.use(express.urlencoded({ extended: true })); //app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessionOptions = {
  secret: "Code",
  resave : false ,
  saveUninitialized : true ,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000 ,
    maxAge: 7*24*60*60*1000,
    httpOnly : true ,
  }

}

app.use(session(sessionOptions));
app.use(flash());//flash is to be used after sessions and before the routes as flash will be used using the routes 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.deleted = req.flash("deleted");
  res.locals.updated = req.flash("updated");
  res.locals.currUser = req.user ;
  next();
})//this is a middleware used for storing the flash message in the req.locals whenever flash is called with the key success


app.get("/demouser", async (req,res) => {
  let fakeUser = new User({
    email: "Ojasvi@gmail.com",
    username: "Ojasvi",
  });

  let registeredUser = await User.register(fakeUser , "helloworld");
  res.send(registeredUser);
})


app.use("/listings", listingRouter);//for roustes of listings

app.use("/listings/:id/reviews", reviewRouter);//for routed of reviews 

app.use("/" , userRouter);

main()
  .then(() => {
    console.log("Cnnected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// app.use((err, req, res, next) => {
//   let { statusCode, message } = err;
//   //res.status(statusCode).send(message);
//   res.status(statusCode).render("Error.ejs", { err });
// });

app.listen(777, () => {
  console.log("Server is listening to port 777");
});
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.status(statusCode || 500).render("Error.ejs", { err });
});
