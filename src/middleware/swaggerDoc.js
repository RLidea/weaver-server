// import swaggerUI from 'swagger-ui-express';
// import swaggerJsDoc from 'swagger-jsdoc';
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

module.exports = () => {
  const controllerDirectory = `${__dirname}/../app/controllers`;
  const options = {
    swaggerDefinition: {
      info: {
        title: `${process.env.APP_NAME} API`,
        version: '0.0.1',
        description: `${process.env.APP_NAME} API Document`,
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

  const specs = swaggerJsDoc(options);
  return {
    path: swaggerUI.serve,
    handlers: swaggerUI.setup(specs),
  };
};
