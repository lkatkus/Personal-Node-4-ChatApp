// DEPENDENCIES IMPORTS
const express = require('express');
const path = require('path');

// CONFIG
const publicPath = path.join(__dirname, '../public'); /* Sets public files folder path */
const PORT = process.env.PORT || 3000;

const app = express(); /* Creates express app */

// MIDDLEWARE
app.use(express.static(publicPath)); /* Sets public files folder */

// ROUTES
app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})