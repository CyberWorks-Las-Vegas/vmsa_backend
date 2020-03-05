const { sign } = require('jsonwebtoken');

const createAccessToken = userId => {
  return sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  )
};

const createRefreshToken = userId => {
  return sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  )
};

const sendAccessToken = (req, res, accessToken, first_login) => {
  const allowedOrigins = ['https://test.cyberworks.tech', 'https://zealous-wiles-7601ce.netlify.com'];
  const origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With, Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  res.send({
    accessToken,
    premises_id: req.body.premises_id,
    correct: true,
    first_login
  })
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('readmin_token', refreshToken, {
    httpOnly: true,
    path: '/readmin_token'
  })
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
}