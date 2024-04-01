import express from 'express';
import Message from '../models/messageSchema.js';
import { catchAsyncError } from '../../middlewares/catchAsyncError.js';

const router = express.Router();

//add a message => http://localhost:4000/api/v1/messages/
router.post("/", catchAsyncError(async (req, res) => {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
}));


//get messages => http://localhost:4000/api/v1/messages/:conversationId
router.get("/:conversationId", catchAsyncError(async (req, res) => {
    const messages = await Message.find({
        conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
}));


export default router;