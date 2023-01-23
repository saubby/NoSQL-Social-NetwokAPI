const router = require("express").Router();
const {
    getAllThought,
    getThoughtbyID,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
} = require("../../controllers/thought-controller");

router.route("/").get(getAllThought).post(createThought);

router.route("/:id").get(getAllThought).put(updateThought).delete(deleteThought);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;