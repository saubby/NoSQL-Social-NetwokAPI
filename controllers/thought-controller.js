const { User, Thought } = require("../models");

const userController = {
    getAllUder(req, res) {
        User.find({})
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .select("-__v")
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: " No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    
}