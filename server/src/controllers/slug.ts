import type { Core } from "@strapi/strapi";

const slug = ({ strapi }: { strapi: Core.Strapi }) => ({
  async check(ctx: any) {

    const { contentType, field = 'slug', value, locale, documentId } = ctx.request.query;

    if (!contentType || !value) {
      return ctx.badRequest('contentType and value are required');
    }

    const filters: Record<string, any> = {
      [field]: value,
    };

    if (documentId) {
      filters.documentId = { $ne: documentId };
    }

    const query: Record<string, any> = {
      filters,
      fields: [field, 'documentId'],
    };

    if (locale) {
      query.locale = locale;
    }

    const existing = await strapi.documents(contentType).findFirst(query);

    ctx.body = {
      exists: !!existing,
      available: !existing,
    };
  },
});

export default slug;
