const { Router } = require("express");
const router = Router();
const { findUsersBy, getAllDuoListing,getFilteredDuoListings, addDuoPost} = require("../models/users");

router.post('/search', async function(req, res) {
    const duoListings = await getFilteredDuoListings(
        {
            champions:req.body.champions,
            rank: req.body.rank,
            roles: req.body.lanes,
            mic: req.body.mic
        }
        );


    const duoSubmissionData = {
        listing: duoListings,
    }
    console.log(duoSubmissionData)
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
