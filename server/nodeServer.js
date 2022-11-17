const client = new(require("node-static").Server)(__dirname + "/../client", {cache: 0})

const details = {
    id1: "Contenu numéro 1",
    id2: "Contenu numéro 2",
    id3: "Contenu numéro 3",
    id4: "Contenu numéro 4",
    DEFAULT: "Contenu par défaut"
}

require('http').createServer(function (req, res) {
    if(req.url.startsWith("/details")) res.end(JSON.stringify({
        text: details[new URL(req.url, "http://localhost:5000").searchParams.get("id")] ?? details["DEFAULT"]
    }))
    else client.serve(req, res)
}).listen(5000)

console.log('Node.js web server at port 50000 is running..')