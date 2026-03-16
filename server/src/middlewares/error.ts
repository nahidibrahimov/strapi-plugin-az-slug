export default ({ strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {

      if (error.name === 'SlugAlreadyExists') {
        strapi.log.warn(`Slug conflict: ${error.message}`);
        ctx.status = 409;
        ctx.body = {
          data: null,
          error: {
            status: 409,
            name: 'ConflictError',
            message: 'Slug already exists',
          },
        };
        return;
      }

      throw error;
    }
  };
};
