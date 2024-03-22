export const sendToken = (user, statuscode, res, message) => {
    const token = user.generateAccessToken();
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: true
    };
    res.status(statuscode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token
    });
};