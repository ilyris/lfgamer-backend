const { Router } = require("express");
const router = Router();
const { addMessage, getLastMessage, getMessages } = require("../models/messages");

router.post('/', async (req, res) => {
    const newMessage = {
        conversationId: req.body.conversationId,
        senderId: req.body.senderId,
        read: req.body.read,
        text: req.body.text,
    }
   try{
        const savedMessage = await addMessage(newMessage);
        console.log('msg to FE', savedMessage[savedMessage.length - 1]);
        res.status(200).json(savedMessage[savedMessage.length - 1]);
   } 
    catch(err) {
       res.status(500).json(err)
   }
})
router.get('/:conversationId', async (req, res) => {
    const filter = {conversationId: req.params.conversationId};
    try{
        const messages = await getLastMessage(filter);
        res.status(200).json(messages);
    }catch(err) {
        res.status(500).json(err)
    }
})
router.get('/getAllMessages/:userId', async (req, res) => {
    // const filter = {userId: req.params.userId};
    // const currentTime = Date.now();
    // const endOfWeekTime = currentTime - ((86000 * 7)*1000)
    // const endOfWeekDate = new Date(endOfWeekTime);

        // const previousDay = new Date(timestamp - ((86400 * 1000) * 7));
        // console.log(previousDay);
        // const previousDayStr = String(previousDay).split(' ')[0];
        // console.log(previousDayStr);



    try{
        // const testData = await getWeekOldMessages(filter,date);
        // console.log(testData);
        const messages = await getMessages(filter);
        res.status(200).json(messages);
    } catch(err) {
        res.status(500).json(err)
    }
})
module.exports = router;
