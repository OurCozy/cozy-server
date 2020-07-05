module.exports = {
    success: (status, message, data) => {
        return {
            status: status,
            message: message,
            data: data
        }
    },
    fail: (status, message) => {
        return {
            status: status,
            message: message
        }
    },
};