const routes = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/slug/check',
        handler: 'slug.check',
        config: {
          policies: [],
        },
      },
    ],
  },
};

export default routes;
