const Hotel = require('../models/hotel')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({}).populate("Reviews");
    res.render("Hotels/index", { hotels });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("Hotels/new");
}

module.exports.createHotelasync = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send()
    const body = req.body.hotel;
    const hotel = new Hotel(body);
    hotel.geometry = geoData.body.features[0].geometry;
    hotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    hotel.Owner = req.user._id;
    await hotel.save();
    console.log(hotel);
    req.flash('success', 'Successfully made a new hotel!');
    console.log(`${hotel.name} Hotel saved`);
    res.redirect(`/hotels/${hotel.id}`);

}

module.exports.showHotel = async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id)
      .populate({
        path: "Reviews",
        populate: {
          path: "Owner",
        },
      })
      .populate({
        path: "Rooms",
        populate: {
          path: "Reservations.id",
        },
      })
      .populate("Owner");
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    console.log(hotel)

    res.render("Hotels/show", { hotel });

}

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }

    res.render("Hotels/edit", { hotel });
}

module.exports.updateHotel = async (req, res, next) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { ...req.body.hotel, });
    const geoData = await geocoder
      .forwardGeocode({
        query: updatedHotel.location,
        limit: 1,
      })
      .send();
    updatedHotel.geometry = geoData.body.features[0].geometry;

    const images = req.files.map(f => ({ url: f.path, filename: f.filename })) 
    updatedHotel.images.push(...images);
    await updatedHotel.save();
    if (req.body.dleteImages) {
        for (let filename of req.body.dleteImages) {
            await cloudinary.uploader.destroy(filename)

        }
        await Hotel.updateOne({
            $pull: { images: { filename: { $in: req.body.dleteImages } } },
        });
    }
    await updatedHotel.save();

    console.log(`${updatedHotel.name} updated`);
    req.flash('success', 'Successfully updated hotel!');
    res.redirect(`/hotels/${req.params.id}`);
}

module.exports.deleteHotel = async (req, res) => {
    console.log(`${req.params.id} deleted`);
    await Hotel.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted hotel!');

    res.redirect(`/hotels`);
}