// start with "node app.js"
const express = require('express')
const app = express()
var port = 3000
var path = '../build/web';

if(process.argv[2]) {
    port = process.argv[2];
}
if(process.argv[3]) {
    path = process.argv[3];
}
//console.log(process.argv, port, path);

// Add headers
app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");

    // Pass to next layer of middleware
    next();
});

app.use(express.static(path));

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server started. Listening on port ${port} serving ${path}`)
})

