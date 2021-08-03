const { Router } = require("express");
const router = Router();
const { findUsersBy, getAllDuoListing, addDuoPost} = require("../models/users");

router.post('/search', async function(req, res) {
    // query all the user duo submissions, based on the filtered results.
    // get user data for their name (to see their username and to connect with them)
    console.log({userid: req.body.user_id})
    const user = await findUsersBy({id: req.body.user_id}).first();

    // get profile data to get their champion selections
    console.log({user: user});
    const profileData = await getAllDuoListing({user_id: req.body.user_id});

    console.log(profileData);

    const duoSubmissionData = {
        profile: profileData,
        user: user,
    }
    res.json(duoSubmissionData);
});

router.get('/', async function(res, res) {
    const userInfo = await getAllDuoListing();
    console.log(userInfo)
    res.json(userInfo)
    // get all users with all their duo submissions
})
router.post('/add', async (req, res) => {
    const {id, rank, champions, lanes, mic, desc} = req.body;
    console.log(req.body);

    const formattedDuoPost = {
        user_id: id,
        rank,
        champions,
        roles: lanes,
        mic,
        post_description: desc
    }

    const dbRes = await addDuoPost(formattedDuoPost);
    dbRes ? res.json(dbRes) : res.status(400);
})

module.exports = router;
