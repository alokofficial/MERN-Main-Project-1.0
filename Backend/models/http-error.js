class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // Add a "message" property
        this.code = errorCode; // add a "code" property
    }
}

export default HttpError