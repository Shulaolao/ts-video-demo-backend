const fs = require("fs");
const request = require("request");
const path = require("path");
const { Parser } = require("m3u8-parser");

/* m3u8 文件分片下载为 .ts 文件 */
const m3u8ToTsFromUrl = (url) => {
  const m3u8Url = url;

  const parser = new Parser();

  let m3u8Content = "";
  request(m3u8Url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      m3u8Content = body;
    }
  });
  parser.push(m3u8Content);
  parser.end();

  let fileName = path.basename(m3u8Url);
  let baseUrl = path.dirname(m3u8Url);
  let data = parser.manifest;
  let tsArray = data.segments;
  console.log(fileName, baseUrl, data, tsArray);

  for (let i = 0; i < tsArray.length; i++) {
    let url = baseUrl + "/" + tsArray[i].uri;
    let filePath = fileName.replace(".m3u8", "") + "-" + String(i) + ".ts";
    let content = "";
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        content = body;
        fs.writeFile(filePath, content, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("保存文件", filePath);
          }
        });
      }
    });
  }
};

// m3u8ToTsFromUrl();

exports.getVideoResource = (req, res) => {
  const range = req.headers.range;

  if (range) {
    let filePath = path.join(__dirname, req.params.file);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,POST",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    let filePath = "",
      indexOfFile = -1;

    const files = fs.readdirSync(__dirname + "/chunk");
    if ((indexOfFile = files.indexOf(req.params.file)) !== -1) {
      filePath = path.join(__dirname + "/chunk", req.params.file);
    } else {
      filePath = path.join(__dirname, req.params.file);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const head = {
      "Content-Length": fileSize,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,POST",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
};

exports.getVideoBytesLength = (req, res) => {
  let filePath = path.join(__dirname, req.params.file);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  res.send({
    msg: "success",
    status: 200,
    data: {
      size: fileSize,
    },
  });
};

exports.getFile = (req, res) => {
  const fileName = req.params.file;
  console.log(fileName);
  const filePath = path.resolve(__dirname, fileName);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const head = {
    "Content-Length": fileSize,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,POST",
  };
  res.writeHead(200, head);
  fs.createReadStream(filePath).pipe(res);

  // console.log(file);
  // res.send({
  //   msg: "success",
  //   status: 200,
  //   data: file,
  // });
};
