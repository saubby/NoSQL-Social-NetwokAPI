const { User } = require('../models');

const userController = {

    //Create user
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },

    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .populate({
                path: 'friends',
                select: '-__v',
            })
            .select('-__v')
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
            path: 'thoughts',
            select: '-__v',
        })
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    

    //update User
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            reunValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    //add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$addToSet: { friends: params.friendId}},
            {new: true, runValidators: true }
        )
            
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'no user found by  this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },

    //delete friend
    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: { friends: params.friendId }},
            {new: true}
        ).populate({
            path: 'friends',
            select: '-__v',
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'no user with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    }

};

module.exports = userController;