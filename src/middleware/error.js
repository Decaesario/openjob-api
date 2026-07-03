import ClientError from '../exceptions/client-error.js';

const errorHandler = (err, req, res, next) => {
    if (err instanceof ClientError) {
        return res.status(err.statusCode).json({
            status: 'failed',
            message: err.message,
        });
    }

    if (err.code === '23503') {
        return res.status(400).json({
            status: 'failed',
            message: 'Resource yang direferensikan tidak ditemukan',
        });
    }

    console.error(err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};

export default errorHandler;