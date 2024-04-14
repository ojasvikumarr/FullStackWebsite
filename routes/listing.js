const express = require("express");
const router = express.Router(); //router object
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route && Create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get(
  "/new",
  isLoggedIn,
  // validateListing,shouldnt be there
  listingController.renderNewForm
);
//if show route was above new route then it will give error because the compiler will be searching for id with name "new"
//&& new route must be above the id route also otherwise it will interpret the new as id and will try to search the new in database
//show route && update route && delete route
router
  .route("/:id")
  .get(
    // validateListing, shouldnt be there
    wrapAsync(listingController.showListing)
  )
  .put(isLoggedIn,upload.single("listing[image]"), isOwner, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
