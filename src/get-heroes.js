'use strict';

module.exports.public = async (event) => {
  console.log('Requesting public route...', new Date().toISOString());

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: "Aerith",
          power: "Mage"
        }
      ]
      ,
      null,
      2
    ),
  };
};

module.exports.private = async (event) => {
  console.log('Requesting private route...', new Date().toISOString());

  console.log({ 'User': JSON.parse(event.requestContext.authorizer.user) });

  return {
    statusCode: 200,
    body: JSON.stringify(
      [
        {
          id: 1,
          name: "Cloud",
          power: "Swordsman"
        }
      ]
      ,
      null,
      2
    ),
  };
};
