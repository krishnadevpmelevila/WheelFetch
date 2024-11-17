function ensureAuthenticated(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.user) {
        return next(); // User is authenticated, proceed to the next middleware or route
    }

    // If not authenticated, redirect to the login page
    res.redirect("/auth/login");
}

module.exports = ensureAuthenticated;
