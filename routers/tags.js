const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Tag = require("../models").tag;

const router = new Router();

// Get all tags from logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tags = await Tag.findAll({
      where: { userId: userId },
    });
    res.status(200).send(tags);
  } catch (error) {
    next(error.message);
  }
});

// Add tag
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newTag = await Tag.create({ userId, ...req.body });
    res.status(200).send(newTag);
  } catch (error) {
    next(error.message);
  }
});

// Update tag
router.patch("/:tagId", authMiddleware, async (req, res, next) => {
  try {
    const tagId = parseInt(req.params.tagId);
    const tag = await Tag.findByPk(tagId);

    // Check if tag exists
    if (!tag) {
      res.status(404).send({ message: "Tag not found" });
    }

    // Check if tag is owned by logged in user
    if (tag.userId === req.user.id) {
      const updatedTag = await tag.update(req.body);
      res.status(200).send(updatedTag);
    } else {
      res.status(401).send({ message: "Not allowed" });
    }
  } catch (error) {
    next(error.message);
  }
});

// Delete tag
router.delete("/:tagId", authMiddleware, async (req, res, next) => {
  try {
    const tagId = parseInt(req.params.tagId);
    const tag = await Tag.findByPk(tagId);

    // Check if tag exists
    if (!tag) {
      res.status(404).send({ message: "Tag not found" });
    }

    // Check if tag is owned by logged in user
    if (tag.userId === req.user.id) {
      await tag.destroy();
      res.status(200).send({ message: "Tag deleted" });
    } else {
      res.status(401).send({ message: "Not allowed" });
    }
  } catch (error) {
    next(error.message);
  }
});

module.exports = router;
