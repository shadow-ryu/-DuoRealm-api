"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChatByID = exports.getUserChats = exports.createPersonalChat = void 0;
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const createPersonalChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiver } = req.body;
        // validate that receiver is provided in the request body
        if (!receiver) {
            return res
                .status(400)
                .json({ success: false, error: "Receiver is required" });
        }
        const currentuser = req.user.id;
        const members = [receiver, currentuser];
        // check if there is an existing chat document with the same members
        const existingChat = yield Chat_1.default.findOne({ members: { $all: members } });
        if (existingChat) {
            return res.status(200).json({
                success: true,
                message: "chat found",
                existingChat,
            });
        }
        const chat = yield Chat_1.default.create({ members });
        res.status(200).json({
            success: true,
            message: "chat created",
            chat,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ sucess: false, error: "Server error" });
    }
});
exports.createPersonalChat = createPersonalChat;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.user.id;
        // find all chats where the current user is a member
        const chats = yield Chat_1.default.find({ members: currentUserId }).populate("members");
        res.status(200).json({
            success: true,
            message: "user chats",
            chats,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
exports.getUserChats = getUserChats;
const getUserChatByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const messages = yield Message_1.default.find({ chatId: chatID }).populate("members");
        if (!messages) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "messages",
            messages,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
});
exports.getUserChatByID = getUserChatByID;
