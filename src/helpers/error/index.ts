export class CustomError<T> extends Error {
  constructor(
    public readonly code: T,
    public readonly message: string,
  ) {
    super();
    this.code = code;
    this.message = message;
  }
}
