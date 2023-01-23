const { User, Thought } = require("../models");

const thoughtController = {
    getAllthought(req, res) {
        Thought.find({})
            .populate({
                path: "reactions",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: " No thought found with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err)
        });
    },

    //Create thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: "Thought created but no user with this id!" });
                }
                res.json({ message: "Thought successfully created!" });
            })
            .catch((err)  => res.json(err));
    },

    //update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            reunValidators: true,
        })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought found with this id!" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.status(400).json(err));
    },

    //delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: "no thought with thos id!" });
                }
                return User.findOneAndUpdate(
                    { thoughts: params.id },
                    { $pull: { thoughts: params.id } },
                    { new: true });
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(404).json({ message: " Thought created but no user with this id" });
                }
                res.json({ message: "Thought successfully deleted!" });
            })
            .catch((err) => res.json(err));
    },

    //add reaction
    addReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtid },
            { $addToSet: { reactions: body } },
            { new: true, reunValidators: true }
        )
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "no thought found by  tis id!" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },

    //delete reaction
    removeReaction({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.json(err));
    },

};

module.exports = thoughtController;