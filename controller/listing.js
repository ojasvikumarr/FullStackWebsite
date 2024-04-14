const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  res.render("listings/index.ejs", { allListings }); //shit bhai sirf ek slash extra tha aur kuch nhi brooooo
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }) //this is nested population i.e the reviews get populated as well as the author in the name of the revieew
    .populate("owner");
  if (!listing) {
    req.flash("deleted", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location ,
    limit: 1 ,
  }).send();

  console.log("The coordinates are : ",response.body.features[0].geometry);
  
  let url = req.file.path ;
  let filename = req.file.filename ;
  console.log("The url of image is : ", url , " and the filename is ", filename)
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //this req.user is a req that is stored by the passport
  newListing.image = {url , filename};
  newListing.geometry.type = 'Point';
  newListing.geometry.coordinates = response.body.features[0].geometry.coordinates;
  //and every user has a _id given to them

  let saved = await newListing.save();
  console.log(saved);
  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
  console.log("The listing saved is : ",req.body.listing);
  next();
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  let orignalImageUrl = listing.image.url ;
  orignalImageUrl = orignalImageUrl.replace("/upload" , "/upload/h_150,w_250");
  res.render("listings/edit.ejs", { listing , orignalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path ;
    let filename = req.file.filename ;
    listing.image = {url , filename};
    await listing.save();
  }
  req.flash("updated", "Listing Updated");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("deleted", "Listing Deleted");
  res.redirect("/listings");
};
