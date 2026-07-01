const sendResponse = (res, { code = 200, status = 'success', message = '', data = undefined } = {}) => {
    const payload = { code, status, message };
    if (data !== undefined) payload.data = data;
    return res.status(code).json(payload);
};

export default sendResponse;