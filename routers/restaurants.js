const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Restaurant = require("../models").restaurant;
const Tag = require("../models").tag;
const RestaurantTag = require("../models").restaurantTag;

const router = new Router();

// Get all restaurants from logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const restaurants = await Restaurant.findAll({
      where: { userId: userId },
      include: [
        {
          model: Tag,
          attributes: ["id", "name", "color"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).send(restaurants);
  } catch (error) {
    next(error.message);
  }
});

// Get specific restaurant
router.get("/restaurantId", authMiddleware, async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: [
        {
          model: Tag,
          attributes: ["id", "name", "color"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).send(restaurant);
  } catch (error) {
    next(error.message);
  }
});

// Add restaurant
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    // Create new restaurant for logged in user
    const userId = req.user.id;
    const restaurant = await Restaurant.create({ userId, ...req.body });

    // Add tags
    const tags = req.body.tags;
    const tagsToInsert = tags.map((t) => ({
      tagId: t,
      restaurantId: restaurant.id,
    }));
    await RestaurantTag.bulkCreate(tagsToInsert);

    // Send restaurant with tags
    const restaurantWithTags = await Restaurant.findByPk(restaurant.id, {
      include: [
        {
          model: Tag,
          attributes: ["id", "name", "color"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).send(restaurantWithTags);
  } catch (error) {
    next(error.message);
  }
});

// Update restaurant
router.patch("/:restaurantId", authMiddleware, async (req, res, next) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const restaurant = await Restaurant.findByPk(restaurantId);

    // Check if restaurant exists
    if (!restaurant) {
      res.status(404).send({ message: "Restaurant not found" });
    }

    // Check if restaurant is owned by logged in user
    if (restaurant.userId === req.user.id) {
      // Update restaurant
      const updatedRestaurant = await restaurant.update(req.body);

      // Delete previous tags
      await RestaurantTag.destroy({
        where: { restaurantId: updatedRestaurant.id },
      });

      // Add new tags
      const tags = req.body.tags;
      const tagsToInsert = tags.map((t) => ({
        tagId: t,
        restaurantId: restaurant.id,
      }));
      await RestaurantTag.bulkCreate(tagsToInsert);

      // Send restaurant with tags
      const restaurantWithTags = await Restaurant.findByPk(
        updatedRestaurant.id,
        {
          include: [
            {
              model: Tag,
              attributes: ["id", "name", "color"],
              through: { attributes: [] },
            },
          ],
        }
      );
      res.status(200).send(restaurantWithTags);
    } else {
      res.status(401).send({ message: "Not allowed" });
    }
  } catch (error) {
    next(error.message);
  }
});

// Delete restaurant
router.delete("/:restaurantId", authMiddleware, async (req, res, next) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    const restaurant = await Restaurant.findByPk(restaurantId);

    // Check if restaurant exists
    if (!restaurant) {
      res.status(404).send({ message: "Restaurant not found" });
    }

    // Check if restaurant is owned by logged in user
    if (restaurant.userId === req.user.id) {
      await restaurant.destroy();
      res.status(200).send({ message: "Restaurant deleted" });
    } else {
      res.status(401).send({ message: "Not allowed" });
    }
  } catch (error) {
    next(error.message);
  }
});

module.exports = router;
