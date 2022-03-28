import { CustomError } from "ts-custom-error";

export default class ApiError extends CustomError {
  status;
  errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static BadRequest(message: string = 'Неверный запрос', errors: any[] = []) {
    const error = new ApiError(400, message, errors);
    return error;
  }

  static NotFound(message: string = 'Ресурс не найден', errors: any[] = []) {
    return new ApiError(404, message, errors);
  }
}