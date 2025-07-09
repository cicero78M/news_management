const axios = require('axios');
const cheerio = require('cheerio');
const polresModel = require('../models/polres');
const articleModel = require('../models/article');

// Example generic selectors. Real sites might need custom configuration.
const defaultSelectors = {
  article: 'article',
  title: 'h1,h2',
  link: 'a',
  content: 'p',
  date: 'time',
  snippet: 'p',
  thumbnail: 'img'
};

function extractArticles($, selectors = defaultSelectors, baseUrl) {
  const articles = [];
  $(selectors.article).each((i, el) => {
    const title = $(el).find(selectors.title).first().text().trim();
    const link = $(el).find(selectors.link).first().attr('href');
    if (!title || !link) return;
    const absoluteLink = link.startsWith('http') ? link : new URL(link, baseUrl).href;
    const content = $(el).find(selectors.content).text().trim();
    const snippet = $(el).find(selectors.snippet).first().text().trim();
    const dateText = $(el).find(selectors.date).first().attr('datetime') || $(el).find(selectors.date).first().text();
    const image = $(el).find(selectors.thumbnail).first().attr('src');
    const published_at = dateText ? new Date(dateText) : new Date();
    articles.push({ title, link: absoluteLink, content, summary: snippet, image_url: image, published_at });
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
        polres_id: polres.id,
        category_id: null,
        author: null,
        source: polres.name,
        comment_count: null,
        share_count: null,
        view_count: null
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
