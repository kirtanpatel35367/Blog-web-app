const { validatetoken } = require('../services/authentication')

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next()
        }

        try {
            const userpayload = validatetoken(tokenCookieValue);
            req.user = userpayload
        } catch (error) { }
        return next();
    }
}

module.exports = { checkForAuthenticationCookie, };
