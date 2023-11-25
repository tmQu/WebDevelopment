const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Web server is running on http://localhost:${port}/static/html/index.html`);
});
