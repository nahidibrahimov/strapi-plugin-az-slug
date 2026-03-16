import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import UuidInputIcon from './components/UuidInputIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'az-slug',
      pluginId: PLUGIN_ID,
      type: 'string',
      intlLabel: {
        id: 'strapi-plugin-az-slug.label',
        defaultMessage: 'AZ Slug',
      },
      intlDescription: {
        id: 'strapi-plugin-az-slug.description',
        defaultMessage: 'Slug with Azerbaijani transliteration and existence check',
      },
      icon: UuidInputIcon,
      components: {
        Input: async () => import('./components/AzSlugInput'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'strapi-plugin-az-slug.settings',
              defaultMessage: 'AZ Slug settings',
            },
            items: [
              {
                name: 'options.targetField',
                type: 'text',
                intlLabel: {
                  id: 'strapi-plugin-az-slug.targetField',
                  defaultMessage: 'Target field name',
                },
                description: {
                  id: 'strapi-plugin-az-slug.targetField.description',
                  defaultMessage: 'Field to generate slug from, for example title',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            name: 'required',
            type: 'checkbox',
            intlLabel: {
              id: 'strapi-plugin-az-slug.required',
              defaultMessage: 'Required field',
            },
            description: {
              id: 'strapi-plugin-az-slug.required.desc',
              defaultMessage: 'Make this slug field required',
            },
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  }
};
