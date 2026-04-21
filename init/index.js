// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Wandero";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }
 
// const initDB = async () => {
//   await Listing.deleteMany({});

//   initData.data = initData.data.map((obj) => ({
//     ...obj, Owner: "698eb6e65db4737a5cbf4336"
//   }));

//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js"); // your sampleListings file
const axios = require("axios");
const User = require("../models/user");

require("dotenv").config();
const MONGO_URL = process.env.ATLAS_URI;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // await Listing.deleteMany({});
  try {
    await Listing.deleteMany({});
    console.log("Old listings deleted");

     const user = await User.findOne();

      if (!user) {
      console.log("❌ No user found! Please signup first.");
      process.exit();
    }

    console.log("Using user:", user.username);

  for (let listingObj of initData.data) {
    const newListing = new Listing(listingObj);

    await delay(3000); 

    try {
      const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { format: "json", q: listingObj.location },
        headers: { "User-Agent": "WanderoApp/1.0" },
      });

      if (geoRes.data.length > 0) {
        newListing.geometry = {
          type: "Point",
          coordinates: [
            parseFloat(geoRes.data[0].lon),
            parseFloat(geoRes.data[0].lat),
          ],
        };
      } else {
        console.log("Location not found, using default for", listingObj.title);
        newListing.geometry = {
          type: "Point",
          coordinates: [77.5946, 12.9716], // fallback
        };
      }
    } catch (err) {
      console.log("Geocoding failed:", err.message);
      newListing.geometry = {
        type: "Point",
        coordinates: [77.5946, 12.9716],
      };
    }

    // Set Owner ID
    // newListing.Owner = "6998fc0c49b993b4cfec9ec0"; // your user ID
    newListing.Owner = user._id; // assign to found user
    await newListing.save();
  }

  console.log("Data seeded with correct coordinates!");
  process.exit();
}catch (err) {
    console.log("❌ Error:", err);
    process.exit();
  }
};

initDB();