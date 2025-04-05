const express = require('express');
const app = express();
const path = require('path');

const publicDirectoryPath = path.join(__dirname, 'public', 'html');

app.use(express.static(publicDirectoryPath));

const port = 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});