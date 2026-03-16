export class SlugAlreadyExists extends Error {
  status: number;
  body: any;

  constructor(slug: string) {
    super('Slug already exists');

    this.name = 'SlugAlreadyExists';

    this.status = 409;

    this.body = {
      error: {
        message: 'Slug already exists',
        details: { slug },
      },
    };

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
