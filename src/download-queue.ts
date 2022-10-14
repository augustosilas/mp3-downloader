import Bull from "bull";
import ytdl from "ytdl-core";
import fs from "fs";

class DownloadQueue {
  private queue: Bull.Queue;
  constructor() {
    this.queue = this.createQueue();
    this.process().then().catch(console.error);
  }

  getQueue() {
    return this.queue;
  }

  private createQueue() {
    return new Bull("download audio", {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
  }

  private async process() {
    await this.queue.process(async (job, done) => {
      const { url } = job.data;

      const info = await ytdl.getBasicInfo(url);

      const title = info.videoDetails.title;

      const path = `C:/Users/augus/Music/`;
      const newFilename = `${title}.mp3`;

      const pathfile = path + newFilename;

      ytdl(url, { quality: "highestaudio", filter: "audioonly" })
        .pipe(fs.createWriteStream(pathfile))
        .on("finish", () => {
          console.log(`finished: ${newFilename}`);
          done();
        })
        .on("error", (error) => {
          console.error(error);
          done(error);
        })
        .on("ready", () => console.log(`started ${newFilename}`));
    });
  }
}

export default new DownloadQueue();
