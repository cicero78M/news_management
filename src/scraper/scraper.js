const axios = require('axios');
const cheerio = require('cheerio');
const polresModel = require('../models/polres');
const articleModel = require('../models/article');

// Example generic selectors. Real sites might need custom configuration.
const defaultSelectors = {
  article: 'article',
  title: 'h1,h2',
  link: 'a',
  content: 'p'
};

function extractArticles($, selectors = defaultSelectors, baseUrl) {
  const articles = [];
  $(selectors.article).each((i, el) => {
    const title = $(el).find(selectors.title).first().text().trim();
    const link = $(el).find(selectors.link).first().attr('href');
    if (!title || !link) return;
    const absoluteLink = link.startsWith('http') ? link : new URL(link, baseUrl).href;
    const content = $(el).find(selectors.content).text().trim();
    articles.push({ title, link: absoluteLink, content });
  });
  return articles;
}

async function scrape(polres) {
  try {
    const res = await axios.get(polres.website);
    const $ = cheerio.load(res.data);
    const articles = extractArticles($, defaultSelectors, polres.website);
    for (const art of articles) {
      await articleModel.create({
        ...art,
        published_at: new Date(),
        polres_id: polres.id
      });
    }
  } catch (err) {
    console.error(`scrape failed for ${polres.website}`, err.message);
  }
}

async function run() {
  const polresList = await polresModel.getAll();
  for (const polres of polresList) {
    await scrape(polres);
  }
}

module.exports = { run };
