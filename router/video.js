const express = require("express");

const router = express.Router();
const { getVideoResource, getFile } = require("../router_handler/video");

router.get("/chunk/:file", getVideoResource);

router.get("/:file", getFile);

module.exports = router;
