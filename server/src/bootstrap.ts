import type { Core } from "@strapi/strapi";
import { validateSlug } from './utils';
import error from "./middlewares/error"

type LifecycleEvent = {
  action: string;
  model?: { uid?: string } | Array<{ uid?: string }> | string[] | string;
  params: {
    data?: Record<string, unknown>;
    where?: Record<string, unknown>;
  };
};

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {

  strapi.db.lifecycles.subscribe({
    async beforeCreate(event: LifecycleEvent) {
      await validateSlug(event, strapi);
    },

    async beforeUpdate(event: LifecycleEvent) {
      await validateSlug(event, strapi);
    },
  });

  const middleware = error({ strapi });

  strapi.server.use(middleware);

};

export default bootstrap;
