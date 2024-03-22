export const sendToken = (user, statuscode, res, message) => {
    const token = user.generateAccessToken();
    const options = {
        httpOnly: true
    };
    res.status(statuscode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token
    });
};