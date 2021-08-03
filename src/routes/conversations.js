const { Router } = require("express");
const router = Router();
const { addConversation, getSingleConversationMessages, getConversationNew } = require("../models/messages");

router.post('/', async (req, res) => {

    // If a conversation doesn't exist, create a new one
    const newConversation = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        members: [req.body.senderId, req.body.receiverId]
    }
    // else add the convo / messages to the existing convo between the sender / receiverId

   try{
    const savedConversation = await addConversation(newConversation);
    res.status(200).json(savedConversation);
   } catch(err) {
       res.status(500).json(err)
   }
})

router.get('/:uid', async (req, res) => {
    const filter = {userId: req.params.uid};

    try{
        const conversation = await getConversationNew(filter);
        res.status(200).json(conversation);
    }catch(err) {
        res.status(500).json(err)
    }
})
router.post('/getConversation', async (req, res) => {
    const filter = {cid: req.body.cid};

    try{
        const messages = await getSingleConversationMessages(filter);
        res.status(200).json(messages);
    }catch(err) {
        res.status(500).json(err)
    }
})

router.post('/startConversation', async (req, res) => {
    const conversation = {
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
        members: [req.body.senderId, req.body.receiverId]
    }
    console.log('passed convo', conversation);
    try{
        const savedConversation = await addConversation(conversation);
        console.log('savedConvo', savedConversation);
        res.status(200).json(savedConversation);
       } catch(err) {
           res.status(500).json(err)
       }
})
module.exports = router;
