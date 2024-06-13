const User = require('../models/user');
const { use } = require('../routes/users');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Booking!');
            res.redirect('/hotels');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || "/hotels";
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        }
        else {
            req.flash('success', 'goodbye!');
            res.redirect("/hotels");
        }

    });

}


module.exports.renderCart = async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'Reservations.hotelId',
            model: 'Hotel',
            select: 'name describtion location images'

        })
        .populate({
            path: 'Reservations.Roomid',
            model: 'Room',
            select: 'type description price'
        })

    res.render("users/cart", { user });
}