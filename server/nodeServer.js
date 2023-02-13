const client = new(require("node-static").Server)(__dirname + "/../client", {cache: 0})

function query(queryStr) {
    return (obj) => !queryStr || queryStr.split(";")
        .map(filter => {
            const [key, filters] = filter.split("=")

            return [key, ...filters.split("-")]
        })
        .every(([key, ...filters]) => {
            const value = obj[key]

            debugger

            return filters.reduce((acc, current) => acc || current.toLowerCase() == value.toLowerCase(), false)
        })
}

require("fs").readFile("../parsing/rapport.json", (error, data) => {
    data = JSON.parse(data)
        .reduce((acc, {id, duree, intitule, localisation, acces, ...details}) => {
            acc[0].push({ id, intitule, localisation, duree, acces })
            acc[1].push({ id, ...details })

            return acc
        }, [[], []])

    require('http').createServer(function (req, res) {
        const url = new URL(req.url, "http://localhost:5000")

        switch(url.pathname) {
            case "/details":
                const id = url.searchParams.get("id")
                res.end(JSON.stringify(data[1].filter(f => f.id === id)[0] ?? {}))
                break
            case "/list":
                const [next = 0, limit = 100, filter] = [url.searchParams.get("next"), url.searchParams.get("limit"), url.searchParams.get("filter")]
                res.end(JSON.stringify(data[0].filter(query(filter)).slice(next, parseInt(next) + parseInt(limit))))
                break
            default:
                client.serve(req, res)
                break
        }
    }).listen(5000)

    console.log('Node.js web server at port 50000 is running..')
})

