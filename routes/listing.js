const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


// Category filter route
router.get("/category/:category", async (req, res) => {
    const category = decodeURIComponent(req.params.category);

    const allListings = await Listing.find({ category });

    res.render("listings/index", { allListings });
});

router.get("/search", async (req, res) => {
    const query = req.query.q;

    const allListings = await Listing.find({
        country: { $regex: query, $options: "i" }   // case-insensitive
    });

    res.render("listings/index", { allListings });
});

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing, 
  wrapAsync(listingController.createListing));
  
//new route
router.get("/new", isLoggedIn, listingController.newListing);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete( isLoggedIn, isOwner,
  wrapAsync( listingController.deleteListing 
));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

//Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync( listingController.deleteListing 
));

module.exports = router; 