const { Router } = require("express")
const jwt = require("jsonwebtoken")
const { hashSync, compareSync } = require("bcryptjs") // bcrypt will encrypt passwords to be saved in db
const { JWT_SECRET } = require("../config.js")
const {
    addUser,
    findUsersBy,
    addUserProfile,
    findProfileInformation,
} = require("../models/users")

const router = Router()



// router.get("/loggedInUser", authenticateToken, async (req, res, next) => {
//     // Deconstruct emailAddr from user
//     const { emailAddr, username } = res.locals.user
//     console.log(res.locals.user)
//     // const {filter} = req.body
//     try {
//         // Make a SQL request on the column 'email/username' with the value in the variable 'emailAddr/username'
//         const loggedInUserData = await findProfileInformation({
//             email: emailAddr,
//             username: username
//         })
//         // Json the object we get back.
//         res.json({ loggedInUserData })
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })
// router.post("/profile/:id", authenticateToken, async (req, res, next) => {
//     const { profileId } = req.body
//     try {
//         // Make a SQL request on the column 'email' with the value in the variable 'emailAddr'
//         const usersProfileData = await findProfileInformation({ id: profileId }) // create a inner join to get profile data for a user based off ID
//         // Json the object we get back.
//         res.json({ usersProfileData })
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// })

// router.post(`/signin`, async (req, res, next) => {
//     let { username, password } = req.body
//     try {
//         let user
//         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) {
//             // check that it matches email
//             user = await findUsersBy({ email: username }).first()
//         } else if (/^\S*$/.test(username)) {
//             // check that it then matches a username with no spaces if its not an email address
//             console.log("this was an username")
//             user = await findUsersBy({ username }).first()
//         } else if (/^\S*$/.test(username) === false) {
//             res.sendStatus(401)
//             console.log("Invalid Username")
//         } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username) === false) {
//             console.log("invalid Email Address")
//             res.sendStatus(401)
//         }
//         const isCorrectPassword = await compareSync(password, user.password) // compare the req password with the returned user pass from db.

//         if (username == false || username === undefined || !isCorrectPassword) {
//             console.log("username or password was invalid.")
//             res.sendStatus(401)
//         } else if (
//             (username === user.username && isCorrectPassword) ||
//             (username === user.email && isCorrectPassword)
//         ) {
//             // Create jwt token
//             const token = generateToken(user)
//             res.json({ token })
//             console.log("Singed In")
//         }
//     } catch (error) {
//         next(error)
//     }
// })
router.get("/", async (req, res, next) => {
    // const { profileId } = req.body
    console.log('hit')
    // try {
    //     // Make a SQL request on the column 'email' with the value in the variable 'emailAddr'
    //     // const usersProfileData = await findProfileInformation({ id: profileId }) // create a inner join to get profile data for a user based off ID
    //     // // Json the object we get back.
    //     // res.json({ usersProfileData })
    // } catch (error) {
    //     console.log(error)
    //     next(error)
    // }
})
function generateToken(user) {
    const payload = {
        emailAddr: user.email, // sub
        username: user.username
    }
    const options = {
        expiresIn: "24h"
    }
    console.log(JWT_SECRET)
    return jwt.sign(payload, JWT_SECRET, options)
}

// Middleware function
function authenticateToken(req, res, next) {
    // create a variable for the token from the clients request.
    const token = req.headers.authorization
    // if token is false, return a 401.
    if (!token) return res.status(422).send("Access Denied")
    try {
        // Verify the JWT that we have to the clients JWT
        const verified = jwt.verify(token, JWT_SECRET)
        // store the verified payload to the user object in the locals object.
        res.locals.user = verified
        next()
    } catch (error) {
        res.status(401).json(error).send("Invalid Token")
    }
}

module.exports = router
