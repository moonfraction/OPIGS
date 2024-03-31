import express from 'express';
import Conversation from '../models/conversationSchema.js';
import { catchAsyncError } from '../../middlewares/catchAsyncError.js';

const router = express.Router();


//new conv => http://localhost:4000/api/v1/conversations/
router.post("/", catchAsyncError(async (req, res) => {
    const allConversations = await Conversation.find({});
    const isConversation = allConversations.find((conversation) => {
        const members = conversation.members;
        return members.includes(req.body.senderId) && members.includes(req.body.receiverId);
    });
    if(isConversation) {
        return res.status(200).json(isConversation);
    }
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
}));

//get conv of a user => http://localhost:4000/api/v1/conversations/:userId
router.get("/:userId", catchAsyncError(async (req, res) => {
    const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
}));  

export default router;