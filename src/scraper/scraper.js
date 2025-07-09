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

async function fetchArticleDetails(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const summary =
      $('meta[name="description"]').attr('content') ||
      $('p').first().text().trim();
    const published_at =
      $('meta[property="article:published_time"]').attr('content') ||
      null;
    const category = $('meta[property="article:section"]').attr('content') || null;
    const tags = $('meta[property="article:tag"]').map((i, el) => $(el).attr('content')).get();
    const image_url = $('meta[property="og:image"]').attr('content') || null;
    const author = $('meta[name="author"]').attr('content') || null;
    return { summary, published_at, category, tags, image_url, author };
  } catch (err) {
    console.error(`failed to fetch details for ${url}`, err.message);
    return {};
  }
}

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
      const details = await fetchArticleDetails(art.link);
      await articleModel.create({
        ...art,
        ...details,
        published_at: details.published_at ? new Date(details.published_at) : new Date(),
        source: new URL(art.link).hostname,
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
