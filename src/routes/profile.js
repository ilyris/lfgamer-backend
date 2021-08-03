const { Router } = require("express");
const router = Router();
const { findUsersBy, findProfileInformation} = require("../models/users");

router.post('/', async function(req, res) {
    console.log({userid: req.body.user_id})
    const user = await findUsersBy({id: req.body.user_id}).first();

    console.log({user: user});
    const profileData = await findProfileInformation({user_id: req.body.user_id});

    console.log(profileData[0]);

    const userDataWithProfileData = {
        profile: profileData[0],
        user: user,
    }
    res.json(userDataWithProfileData);

});
module.exports = router;
