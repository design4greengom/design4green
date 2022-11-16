const http = require('http')
const fs = require("fs")

const filepath = "./index.html"
const errorFile = "<html><body><h1>Something went wrong</h1></body></html>"

const server = http.createServer(function (req, res) {   // 2 - creating server
    // set response header
    res.writeHead(200, { 'Content-Type': 'text/html' });

    if(fs.existsSync(filepath))
        fs.readFile(filepath, (error, data) => {
            res.write(error ? errorFile : data)
            res.end()
        })
    else {
        res.write(errorFile)
        res.end()
    }
});

server.listen(5000); //3 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')