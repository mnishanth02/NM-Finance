const path = require('path');

// import to other class where we need root directory file (app.js) path.
module.exports = path.dirname(process.mainModule.filename);
