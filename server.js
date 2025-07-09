const express = require('express');
const cron = require('node-cron');
const polresRoutes = require('./src/routes/polres');
const articlesRoutes = require('./src/routes/articles');
const scraper = require('./src/scraper/scraper');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/polres', polresRoutes);
app.use('/polres/:polresId/articles', articlesRoutes);

// schedule scraping every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled scrape...');
  await scraper.run();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
