# strapi-plugin-az-slug

A lightweight Strapi v5 custom input component for generating and validating unique slugs.

The plugin provides a slug field UI for the admin panel and prevents duplicate slugs from being saved.

---

## Installation

Install the plugin from npm:

```bash
npm install strapi-plugin-az-slug
```

---

## Usage

Use the plugin input component as the field type for any slug field in your content-type.

The component will:

- generate slug values
- allow manual editing
- validate slug uniqueness
- prevent saving duplicates
