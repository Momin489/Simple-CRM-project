// Checks if session has user object
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Alternative: Checks by session userId
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

module.exports = {
  ensureAuth,
  isAuthenticated
};
