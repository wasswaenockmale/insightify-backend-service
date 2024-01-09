async function verifyBearerToken(req, res, next) {
  const bearerToken = req.headers.authorization;
  // verify the bearer token
  if (bearerToken == process.env.STRAPI_TOKEN) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

async function verifySpecialToken(req, res, next) {
  const checkToken = req.headers.specialToken;

  // verify the special token.
  if (checkToken == process.env.STRAPI_TALENT_FORM_API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

async function whichCollectionPublished(req, res, next) {
  const collection = req?.body?.model;

  if (collection && collection != 'talent-request') {
    next();
  }
}

module.exports = whichCollectionPublished