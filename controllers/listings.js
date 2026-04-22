const Listing = require('../models/listing.js');
// const axios = require("axios");

module.exports.index = async (req, res,next) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res,next) => {
    console.log("Logged in user:", req.user);
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate: { path: "author" }})
    .populate("Owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req,res,next) =>{
    let url = req.file.path;
    let filename = req.file.filename;

     //let{ title, description, image, price, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.Owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res,next ) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) { 
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_20/h_20,c_fill");
    req.flash("success", "Listing edited successfully!");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

// module.exports.index = async (req, res,next) => {
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// }

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res,next) => {
    console.log("Logged in user:", req.user);
    let { id } = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate: { path: "author" }})
    .populate("Owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


// module.exports.createListing = async (req,res,next) =>{
//     let url = req.file.path;
//     let filename = req.file.filename;

//      //let{ title, description, image, price, location, country } = req.body;
//     const newListing = new Listing(req.body.listing);
//     newListing.image = { url, filename };
//     newListing.Owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing created successfully!");
//     res.redirect("/listings");
// }


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    console.log("REQ.BODY:", req.body);
    const newListing = new Listing({
    title: req.body.listing.title,
    description: req.body.listing.description,
    price: req.body.listing.price,
    location: req.body.listing.location,
    country: req.body.listing.country,
    category: req.body.listing.category ||"Trending", // ✅ FIXED
});
    // 🌍 Convert location → coordinates (FREE API)
    const axios = require("axios");

try {
    let geoRes = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                format: "json",
                q: req.body.listing.location
            },
            headers: {
                "User-Agent": "WanderoApp/1.0 (rk@gmail.com)"
            }
        }
    );

    if (geoRes.data.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(geoRes.data[0].lon),
                parseFloat(geoRes.data[0].lat)
            ]
        };
    } else {
        throw new Error("Location not found");
    }

} catch (err) {
    console.log("Geocoding failed:", err.message);

    // fallback
    newListing.geometry = {
        type: "Point",
        coordinates: [77.5946, 12.9716]
    };
}

    newListing.image = { url, filename };
    newListing.Owner = req.user._id;

    await newListing.save();

    console.log("SAVED LISTING:", newListing); 
    req.flash("success", "New Listing created successfully!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res,next ) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) { 
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_20/h_20,c_fill");
    req.flash("success", "Listing edited successfully!");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;

//     console.log("REQ BODY:", req.body); // DEBUG

//     let listing = await Listing.findById(id);

//     Object.assign(listing, req.body.listing);

//     if (req.file) {
//         listing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     await listing.save();

//     req.flash("success", "Listing updated successfully!");
//     res.redirect(`/listings/${id}`);
// };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    console.log("REQ BODY:", req.body);

    // ✅ FIX ARRAY → STRING
    if (Array.isArray(req.body.listing.category)) {
        req.body.listing.category = req.body.listing.category[0];
    }

    // ✅ fallback
    if (!req.body.listing.category) {
        req.body.listing.category = "Trending";
    }

    let listing = await Listing.findById(id);

    Object.assign(listing, req.body.listing);

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

  module.exports.deleteListing = async (req, res,next) => {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing deleted successfully!");
      res.redirect("/listings");
  }

  module.exports.deleteListing = async (req, res,next) => {
      let { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing deleted successfully!");
      res.redirect("/listings");
  }