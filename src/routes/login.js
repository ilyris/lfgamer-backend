const { Router } = require("express");
const router = Router();
const { addUser, findUsersBy, findProfileInformation, getRiotId } = require("../models/users");
const { generateToken } = require("../herlper_funcs/generateToken");
const { compareSync, hashSync } = require("bcryptjs");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const axios = require("axios");
const btoa = require("btoa");

const env_url = process.env.URL_ENV || "http://localhost:3000/";
const redirection_url =
  process.env.REDIRECTION_URL ||
  "http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fcallback";
let userData;
const getUser = (data, api_res) => {
  axios
    .get(`https://discordapp.com/api/v8/users/@me`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(async (response) => {
      userData = response.data;

      // Grab the user by their email
      let user = await findUsersBy({ email: userData.email }).first();

      // stringify discordData to hash it to use it as a comparison string
      let discordString = JSON.stringify({
        email: userData.email,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
      });

      const hash = hashSync(discordString, 10);

      // if no user exists, create the object.
        if (!user) {
          await addUser({
            discord_id: userData.id,
            email: userData.email,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            hash: hash,
          });
          // maybe just pull the user in the /user route.
          let user = await findUsersBy({ email: userData.email }).first();
          let riotId = await getRiotId({user_id: user.id}).first();

          console.log(riotId)
          userData.user_id = user.id;
          userData.riot_id = riotId;

        } else {
          // compare the sync
          const result = compareSync(discordString, user.hash);

          if (result) {
            userData.user_id = user.id;
            userData.riot_id = user.riot_id
          } else {
            addUser({
              email: userData.email,
              username: userData.username,
              discriminator: userData.discriminator,
              avatar: userData.avatar,
              hash,
            });
            userData.user_id = user.id;
            userData.riot_id = user.riot_id

          }
        }

      console.log({userData: userData});
      const token = generateToken(userData);

      // start storining the token in cookies, this local storage stuff probably aint working.
      const profileData = await findProfileInformation({user_id: userData.user_id}).first();

      console.log(profileData);
      // coiokie information
      const oneDayToSeconds = 24 * 60 * 60;
      api_res.cookie('token', token,  
      { maxAge: oneDayToSeconds,
      // You can't access these tokens in the client's javascript
        // httpOnly: true,
        // Forces to use https in production
        secure: process.env.NODE_ENV === 'production'? true: false
        });
      if(profileData) {
        api_res.redirect(`${env_url}profile/${profileData.user_id}?token=${token}`);

      } else {
        api_res.redirect(`${env_url}setup?token=${token}`);
      }

    })
    .catch((err) => console.log(err));
};

const getDiscordToken = (code, creds, api_res) => {
  let data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: decodeURIComponent(redirection_url),
  };
  let params = _encode(data);

  axios
    .post(`https://discordapp.com/api/oauth2/token`, params, {
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      getUser(res.data, api_res);
    })
    .catch((err) => console.log(err));
};

router.get("/", (req, res) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=850815958943268904&redirect_uri=${redirection_url}&response_type=code&scope=identify%20email`
  );
});

router.get("/callback", (req, api_res) => {
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  getDiscordToken(code, creds, api_res);
});

  router.get("/user", (req, res) => {
    // I think this being in the global scope is causing issues
    // let user = await findUsersBy({ email: userData.email }).first();
    res.json(userData);
    userData = {};
    console.log(userData);
  });  

router.post("/user", async (req,res) => {
  console.log(req.body);
  try {
    const userInformation = await findUsersBy({id: req.body.user_id }).first();
    
    const sanitizedUserInformation = {
      id: userInformation.id,
      avatar: userInformation.avatar,
      dis:userInformation.discord_id,
      username: userInformation.username,
      discriminator: userInformation.discriminator,

    }
    res.status(200).json(sanitizedUserInformation);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);

  }
})

function _encode(obj) {
  let string = "";

  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    string += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  return string.substring(1);
}
module.exports = router;
