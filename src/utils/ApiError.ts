class ApiError extends Error {
  success: boolean;
  data: any;
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public errors = [] as any[],
    public stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    let response = {
      success: this.success,
      data: this.data,
      message: this.message,
      errors: this.errors,
    };

    if (!this.data) { 
      delete response.data;
    }
     
    if (this.errors.length === 0) {
      delete response.errors;
    }

    console.error(this.stack);

    return response;
  }
}

export default ApiError;
