const path = require("path");
const { sliceMp4ToTs } = require("../utils/sliceMp4ToTs");
sliceMp4ToTs(
  path.resolve(__dirname + "/34min.mp4"),
  path.resolve(__dirname + "/chunk")
);
