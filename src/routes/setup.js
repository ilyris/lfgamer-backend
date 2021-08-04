const { Router } = require("express");
const router = Router();
const {addUser, findUsersBy} = require("../models/users");
const db = require("../../data/db")
const axios = require("axios");
const RGAPI = process.env.RGAPI;


router.post("/", async (req, res) => {
    let user = await findUsersBy({email: req.body.email}).first();
    const {champions, rank, lanes,mic, aboutMe} = req.body
    const profileSetUp = {
        user_id: user.id,
        rank: rank[0],
        champions: champions,
        roles: lanes,
        mic: mic,
        about_me: aboutMe,
    }
    db('Profile').insert(profileSetUp).then( function (result) {
        res.json({ success: true, message: 'ok' });
    });
  });

router.get("/", async (req, res) => {
    // const user = await findUsersBy({id: req.body.user_id}).first();
    // console.log(user);
});



const getLeagueAccountInfo = async (alias) => {
    try {
        // Get summoner information
        const res = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${alias}?api_key=${RGAPI}`)
        const info = {
            summonerId: res.data.id,
            accountId: res.data.accountId,
            puuid: res.data.puuid,
            username: res.data.name

        }
        return info;
    }
    catch(err) {
        console.log(err);
    }
}
const getLeagueAccountLeagueInfo = async summonerId => {
    try {
        const res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${RGAPI}`);
        console.log(res.data)
        const info = {
            queueType: res.data[0].queueType,
            tier: res.data[0].tier,
            rank: res.data[0].rank,
            summonerName: res.data[0].summonerName,
            wins: res.data[0].wins,
            losses: res.data[0].losses
        }
        return info;
    }
    catch(err) {
        console.log(err)
    }
}
const getLeagueChampionMastery = async (summonerId,championData) => {
    try {
        const res = await axios.get(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${RGAPI}`);

        // loop through the users champions, grab the first 3.
        let championPool = []
        for(let i = 0; i < res.data.length; i++) {
            let champion = res.data[i]
            if(i < 3) {
                const championName = await getChampionName(championData,  champion.championId)
                championPool.push({
                    champion: championName,
                    championPoints: champion.championPoints,
                })
            } else {
                break;
            }
        }
        return championPool;
    }
    catch(err) {
        console.log(err)
    }
}

const getMatchList = async accountId => {
    try {
        const res = await axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=10&api_key=${RGAPI}`)
        let filteredMatches = [];
        res.data.matches.forEach( (match,i) => {
            filteredMatches.push({ 
                gameId: match.gameId,
                lane: match.lane
            })
        })
        return filteredMatches
    }
    catch(err) {
        console.log(err)
    }
}
const getChampionName = async (championData, championId) => {
    const championInfo = Object.values(championData);
    const championName = championInfo.filter(champion => {
        if(champion.key == championId) {
            return champion.id
        }
    })
    return championName[0].id;

}
const getMatchStatus = async (matchListArr, summonerId, championData) => {
    try {
        let matchListStatus = [];
        for( const match of matchListArr) {

            const res = await axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${RGAPI}`)
            // Get the participant ID per game (used to locate game stats);
            const participantId = res.data.participantIdentities.find( parcipitants => {
                return parcipitants.player.summonerId == summonerId;
            });
            for(const participant of res.data.participants) {
                if(participant.participantId == participantId.participantId) {
                    const championName = await getChampionName(championData,participant.championId)
                    // console log if their game is a win || loss
                    matchListStatus.push({
                        ...match,
                        gameCreated: new Date(res.data.gameCreation),
                        champion:championName,
                        kills: participant.stats.kills,
                        deaths: participant.stats.deaths,
                        assists: participant.stats.assists,
                        win: participant.stats.win,
                        wardsPlaced: participant.stats.wardsPlaced,
                        spell1Id: participant.spell1Id,
                        spell2Id: participant.spell2Id,
                        items: [
                            participant.stats.item0,
                            participant.stats.item1,
                            participant.stats.item2,
                            participant.stats.item3,
                            participant.stats.item4,
                            participant.stats.item5,
                            participant.stats.item6
                        ]
                    })
                }
            }
        }
       return matchListStatus
    }
    catch(err) {
        console.log(err)
    }
}
router.post("/getSummonerInfo", async (req, res) => {
    const {user_id,leagueAlias, uuid} = req.body;

    try {

        // Get summoner information
        const accountInfo = await getLeagueAccountInfo(leagueAlias)

        const leagueAccountInfo = {
            user_id: user_id,
            summonerId: accountInfo.summonerId,
            accountId: accountInfo.accountId,
        }
        const resData = await axios.get(`https://na1.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${accountInfo.summonerId}?api_key=${RGAPI}`)
        console.log(resData)
        if(uuid == resData.data) {

            await db('Profile_League_Account_Info').insert(leagueAccountInfo).then( function (result) {
                res.status(200).json(leagueAccountInfo);
            });
        } else {
            res.status(400);
        }


        console.log(leagueAccountInfo);


    }
    catch(err) {
        console.log(err);
    }
});
router.post("/getLeagueInfo", async (req, res) => {
    const {user_id} = req.body;
    try {
        const userLeagueInfo = await db("Profile_League_Account_Info").select('user_id','summonerId', 'accountId').where({user_id: user_id}).first();

        const championDataResponse = await axios.get(`https://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/champion.json`)
        // Get summoner league information
        const leagueInfo = await getLeagueAccountLeagueInfo(userLeagueInfo.summonerId);

        // summoner champion masteries
        const championPool = await getLeagueChampionMastery(userLeagueInfo.summonerId, championDataResponse.data.data);
        // Get summoner match list
        const matches = await getMatchList(userLeagueInfo.accountId)

        const matchesWithStatus = await getMatchStatus(matches,userLeagueInfo.summonerId, championDataResponse.data.data);

        const leagueData = {
            leagueInfo,
            championPool,
            recentMatches: matchesWithStatus,
        }
        res.status(200).json(leagueData);

        console.log(leagueData);

    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;
