const Hotel = require('../models/hotel')


module.exports.index = async (req, res) => {
    const hotels = await Hotel.find({}).populate("Reviews");
    res.render("Hotels/index", { hotels });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("Hotels/new");
}

module.exports.createHotelasync = async (req, res, next) => {

    const body = req.body.hotel;
    const hotel = new Hotel(body);
    hotel.Owner = req.user._id;
    await hotel.save();
    req.flash('success', 'Successfully made a new hotel!');
    console.log(`${hotel.name} Hotel saved`);
    res.redirect(`/hotels/${hotel.id}`);

}

module.exports.showHotel = async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: 'Reviews',
        populate: {
            path: 'Owner'
        }
    }).populate('Rooms').populate('Owner');
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