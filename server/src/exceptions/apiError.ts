import { CustomError } from "ts-custom-error";

export default class ApiError extends CustomError {
  status;
  errors;

  constructor(status: number, message: string, errors: any[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message: string = 'Пользователь не авторизован') {
    return new ApiError(401, message);
  }

  static ForbiddenError(message: string = 'Отказано в доступе') {
    return new ApiError(403, message);
  }

  static BadRequest(message: string = 'Неверный запрос', errors: any[] = []) {
    const error = new ApiError(400, message, errors);
    return error;
  }

  static NotFound(message: string = 'Ресурс не найден', errors: any[] = []) {
    return new ApiError(404, message, errors);
  }
}