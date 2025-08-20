class ApiResponse {
  constructor(statusCode, data, message = "Success", paused) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    if (paused !== undefined) this.paused = paused;
  }
}
export { ApiResponse };
