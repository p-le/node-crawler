const schedule = require('node-schedule');
const winston = require('winston');
const db = require('./libs/db');
const Novel = require('./models/novel');
const Log = require('./models/log');
const TruyenDichCrawler = require('./crawlers/truyendich');

const crawlers = [];
crawlers.push(new TruyenDichCrawler());

schedule.scheduleJob('*/15 * * * * *', () => {
  Promise.all([
    Novel.find().exec(), 
    Log.find().exec()
  ]).then(([novels, logs]) => {
    novels.forEach(novel => {
      const filtered = isNovelCrawled(novel, logs)
      if (filtered.length == 0) {
        const log = new Log({
          novel: novel.title
        });
        log.save();
      } else {
        const crawler = crawlers.filter(crawler => crawler.origin == novel.origin)[0];
        crawler
          .setNovel(novel, filtered[0].chapter)
          .crawl()
          .then(chapter => {
            console.log(chapter.num);
            Log.findOneAndUpdate({ novel: novel.title }, {$set: { chapter: chapter.num + 1}}, (err, result) => {
              if (err) console.log(err);
              else console.log(result);
            });
          });
      }
    });
  }).catch(err => {
    console.log(err);
  });
});

const isNovelCrawled = (novel, logs) => {
  return logs.filter(log => log.novel === novel.title);
}