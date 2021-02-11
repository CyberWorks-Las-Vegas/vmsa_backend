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

const sendAccessToken = (req, res, accessToken, first_login = undefined) => {

  first_login !== undefined ?
    res.send({
      accessToken,
      premises_id: req.body.premises_id,
      correct: true,
      first_login
    })
    :
    res.send({
      accessToken,
      premises_id: req.body.premises_id,
      correct: true
    })
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('profile_token', refreshToken, {
    httpOnly: true,
    path: '/p_r_ofile_token'
  })
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
}