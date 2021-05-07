const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

module.exports = () => {
  const controllerDirectory = `${__dirname}/../app/controllers`;
  const docOptions = {
    swaggerDefinition: {
      info: {
        title: `${global.config.env.APP_NAME} API`,
        version: '0.0.1',
        description: `${global.config.env.APP_NAME} API Document`,
      },
      basePath: '/',
    },
    apis: [
      `${controllerDirectory}/*.js`,
      `${controllerDirectory}/auth/*.js`,
    ],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [
      { jwt: [] },
    ],
  };

  const uiOptions = {
    customSiteTitle: `${global.config.env.APP_NAME} API Document`,
    customCssUrl: '/docs.css',
    customfavIcon: '/favicon.ico',
  };

  const specs = swaggerJsDoc(docOptions);
  return {
    path: swaggerUI.serve,
    handlers: swaggerUI.setup(specs, uiOptions),
  };
};
