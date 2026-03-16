import { SlugAlreadyExists } from '../errors/slug-already-exists';

type LifecycleEvent = {
  action: string;
  model?: { uid?: string } | Array<{ uid?: string }> | string[] | string;
  params: {
    data?: Record<string, unknown>;
    where?: Record<string, unknown>;
  };
};

type ContentTypeAttribute = {
  customField?: string;
};

type ContentTypeWithAttributes = {
  attributes?: Record<string, ContentTypeAttribute>;
};

async function validateSlug(event: LifecycleEvent, strapi: any) {
  const uid = getUidFromEvent(event);

  if (!uid) return;

  const contentType = strapi.contentTypes[uid] as ContentTypeWithAttributes | undefined;

  if (!contentType?.attributes) return;

  const slugFields = Object.entries(contentType.attributes)
    .filter(([, attribute]) => attribute?.customField === 'plugin::strapi-plugin-az-slug.az-slug')
    .map(([fieldName]) => fieldName);

  if (slugFields.length === 0) return;

  const data = event.params?.data ?? {};
  const where = event.params?.where ?? {};

  for (const fieldName of slugFields) {
    const slugValue = data[fieldName];

    if (typeof slugValue !== 'string' || !slugValue.trim()) {
      continue;
    }

    const filters: Record<string, unknown> = {
      [fieldName]: slugValue,
    };

    const documentId = (where as any)?.documentId;
    if (documentId) {
      filters.documentId = { $ne: documentId };
    }

    const existing = await strapi.documents(uid).findFirst({
      filters,
      fields: [fieldName, 'documentId'],
    });

    if (existing) {
      throw new SlugAlreadyExists(slugValue);
    }
  }
}

function getUidFromEvent(event: LifecycleEvent): string | undefined {
  const model = event.model;

  if (!model) return undefined;

  if (typeof model === 'string') return model;

  if (Array.isArray(model)) {
    const first = model[0];

    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'uid' in first) {
      return first.uid;
    }
  }

  if (typeof model === 'object' && 'uid' in model) {
    return model.uid;
  }

  return undefined;
}

export { validateSlug };
