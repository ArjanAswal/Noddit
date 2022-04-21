module.exports = {
  definition: {
    openapi: '3.0.2',
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT',
        },
      },
    },
    info: {
      title: 'Noddit API',
      version: '1.0',
      contact: {
        name: 'Arjan Aswal',
        email: 'arjanaswal@gmail.com',
        url: 'https://www.arjanaswal.com',
      },
      license: {
        name: 'GPL-3.0',
        url: 'https://www.gnu.org/licenses/gpl-3.0.en.html',
      },
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [
      {
        url: process.env.SERVER_URL + '/api/v1',
        description: 'API server',
      },
    ],
  },
  apis: ['./src/routes/*', './src/models/*', './src/controllers/*'],
};
