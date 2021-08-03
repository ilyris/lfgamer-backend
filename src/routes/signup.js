const { Router } = require("express");
const router = Router();
const { hashSync} = require("bcryptjs") // bcrypt will encrypt passwords to be saved in db
const {
    addUser,
} = require("../models/users")

router.post(`/`, async (req, res, next) => {
    // Listen to trafic on the /signup path from our Front-End routerlication
    console.log(req.body);
    try {
        // try the code below and exectue if the req comes back good.
        let { name, email, password } = req.body // store the request body to the newUser varliable.
        console.log(name, email, password)
        if (password.length >= 8 && email.length >= 8 && name.length) {
            const hashedPassword = await hashSync(password, 14)
            password = hashedPassword
            const newUser = {
                email: email,
                password: password,
                name: name
            }
            await addUser(newUser)
            console.log("user has been created")
            res.sendStatus(201)
        } else {
            console.log("User was not created")
            res.sendStatus(401)
        }
    } catch (error) {
        // if the code above fails in the try, run the code in the catch block.
        next("There was an error " + error)
    }
})

module.exports = router
