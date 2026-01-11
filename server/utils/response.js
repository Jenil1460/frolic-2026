// server/utils/response.js
export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
        message,
    });
};

export const sendError = (res, message = 'An error occurred', statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};
