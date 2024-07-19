const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
var ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

/* ffmpeg 对MP4 进行切片 */
exports.sliceMp4ToTs = (inputFile, outputPath) => {
  const command = ffmpeg(inputFile);
  // command.videoCodec('libx264') // 设置视频编解码器
  command.outputFormat("hls"); // 输出视频格式
  command.outputOptions("-hls_list_size 0"); // -hls_list_size n:设置播放列表保存的最多条目，设置为0会保存有所片信息，默认值为5
  command.outputOption("-hls_time 5"); // -hls_time n: 设置每片的长度，默认值为2。单位为秒
  command.output(outputPath + "/34min.m3u8"); // 输出文件
  command.on("progress", (progress) => {
    // 监听切片进度
    let number = Number(progress.percent).toFixed(2);
    console.log(`Processing: ${number}%`);
  });
  command.on("end", () => {
    // 监听结束
    console.clear();
    console.log(`${inputFile}:视频切片已完成`);
  });
  command.on("error", function (err, stdout, stderr) {
    if (err) {
      console.log(err.message);
      console.log("stdout:\n" + stdout);
      console.log("stderr:\n" + stderr);
    }
  });
  command.run(); // 执行
};
