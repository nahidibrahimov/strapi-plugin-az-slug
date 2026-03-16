import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'az-slug',
    plugin: 'strapi-plugin-az-slug',
    type: 'string',
    inputSize: {
      default: 6,
      isResizable: true,
    },
  });
};

export default register;
