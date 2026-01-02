const express = require('express');
const cors = require('cors');
const { getJson } = require("serpapi");
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3300;
const RESULTS_PER_PAGE = 20;
const DEFAULT_RESULTS_PER_PAGE = 10;

app.use(cors());
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    const maxResults = Number(searchParams.get('maxResults')) || RESULTS_PER_PAGE;
    const resultsNumber = maxResults === DEFAULT_RESULTS_PER_PAGE ? DEFAULT_RESULTS_PER_PAGE : RESULTS_PER_PAGE;

    const fetchPage = (start = 0, acc = []) => {
    return getJson({
      engine: "google_scholar",
      api_key: process.env.SERP_API_KEY,
      q: query,
      num: resultsNumber,
      start
    }).then((result) => {
      const pageResults = result['organic_results'] || [];
      const nextAcc = acc.concat(pageResults);

      const hasNext = Boolean(result.pagination && result.pagination.next);
      const reachedLimit = nextAcc.length >= maxResults;

      if (!hasNext || reachedLimit) {
        return nextAcc.slice(0, maxResults);
      }

      return fetchPage(start + RESULTS_PER_PAGE, nextAcc);
    });
  };

  fetchPage()
    .then((results) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ results }));
    })
    .catch((error) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
    });
});

app.listen(port, () => {
  console.log(`Server works on port: ${port}`);
});