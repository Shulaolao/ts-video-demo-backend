const express = require("express");
const app = express();

const cors = require("cors");
/* 全局配置跨域中间件 */
app.use(cors());

/* 解析 JSON 格式的请求体数据 */
app.use(express.json());
/* 全局配置表单数据解析中间件 */
app.use(express.urlencoded({ extended: false }));

/* 全局错误中间件 */
app.use((req, res, next) => {
  res.cc = (err, status = 400) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

const videoRouter = require("./router/video");
app.use("/", videoRouter);

app.listen(3456, () => {
  console.log("Video fragmentation start listen!");
});
