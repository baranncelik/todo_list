const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const isAuth = require("../middlewares/is-auth");

router.get("/home", isAuth, homeController.getHome);
router.post("/home", isAuth, homeController.postHome);
router.put("/home/:id", isAuth, homeController.putHome);
router.delete("/home/:id", isAuth, homeController.deleteHome);

module.exports = router;