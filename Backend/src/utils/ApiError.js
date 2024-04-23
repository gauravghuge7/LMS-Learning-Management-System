class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors  = [],
        stack = "",
        data = null
    ) 
    
    {
        super(message);

        this.statusCode = statusCode
        this.message = message;     
        this.errors = errors;
       
        this.data = data;
        this.success = false;

        if(stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, ApiError);
        }
        

        
    }
}

export {
    ApiError
}