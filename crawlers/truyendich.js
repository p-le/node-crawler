const cheerio = require('cheerio');
const axios = require('axios');
const winston = require('winston');
const Chapter = require('../models/chapter');

class TruyenDichCrawler {
  constructor() {
    this.origin = "truyendich";
    this.baseUrl = "http://truyendich.org/doc-truyen";
  }

  setNovel(novel, chapter) {
    this.novel = novel;
    this.chapter = chapter;

    return this;
  }

  crawl() {
    const url = `${this.baseUrl}/${this.novel.path}/chuong-${this.chapter}`;
    winston.info(`> Crawl: ${url}`);

    return new Promise((resolve, reject) => {
      axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
        }
      }).then(async (response) => {
        const $ = cheerio.load(response.data);
        const title = $('#chapter_name').text();
        $('#chapter_content .row').remove();
        const wrapper = $('#chapter_content').contents();
        const content = [];

        for (let i=0; i<wrapper.length; i++) {
          if (wrapper[i].data) {
            content.push(wrapper[i].data.trim());
          }
        }

        const chapter = new Chapter({
          num: this.chapter,
          title,
          novel: this.novel.title,
          content
        });

        try {
          const result = await chapter.save();
          resolve(result);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      }). catch(err => console.log(err));
    });
  }
}

module.exports = TruyenDichCrawler;