function query(queryStr) {
    return (obj) => !queryStr || queryStr.split(";")
        .map(filter => {
            const [key, filters] = filter.split("=")

            return [key, ...filters.split("-")]
        })
        .every(([key, ...filters]) => {
            const value = obj[key]

            return filters.reduce((acc, current) => acc || current.toLowerCase() == value.toLowerCase(), false)
        })
}

function getDetails(value, callback) {
    const fromStorage = JSON.parse(localStorage.getItem(value))

    fromStorage?.fetched ? callback(fromStorage)
        : fetch(`/details?id=${value}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem(value, JSON.stringify({...fromStorage, ...data, fetched: true}))

                return data
            })
            .then(callback)
}

let lastFilter
function display(page, filter = lastFilter) {
    (async function fetchList(next = 0, limit = 10, filter = lastFilter) {
        if(Date.now() - (parseInt(localStorage.getItem("lastFetch"), 10) || Infinity) > 360000)
            localStorage.clear()

        const data = Object.keys(localStorage)
            .filter(Number)
            .sort()
            .map(id => ({id, ...JSON.parse(localStorage.getItem(id))}))
            .filter(query(filter))
            .slice(next, next + limit)

        if (data.length < 10) {
            debugger
            return await fetch(`/list?next=${Math.max(0, next - data.length)}&limit=${limit}${filter ? '&filter=' + filter : ''}`)
                .then(res => res.json())
                .then(list => {
                    localStorage.setItem("lastFetch", Date.now())

                    list.forEach(async ({id, ...data}) => await localStorage.setItem(id, JSON.stringify(data)))

                    return list
                })
        }

        return data
    })((page - 1) * 10, 10, filter).then(array => {
        lastFilter = filter
    document.querySelector("table[data-list] tbody")
        .replaceChildren(
            ...array.map(({id, duree, intitule, localisation, acces}) => {
                const $el = document.createElement("tr")
                $el.setAttribute("data-id", id)

                $el.innerHTML = `<td>${intitule}</td><td>${localisation}</td>
                                 <td>${duree}</td><td>${acces}</td>`

                return $el
            })
        )
    })
}
display(1)

document.getElementById("updateFilter")
    .addEventListener("click", (e) => {
        const grouped = [...e.target.parentNode.querySelectorAll("input[type='checkbox']:checked")]
            .reduce((acc, current) => {
                const name = current.parentNode.parentNode.getAttribute("data-filtername")
                acc[name] = acc[name] ?? []
                acc[name].push(current.getAttribute("data-filtervalue"))

                return acc
            }, {})

        const query = Object.keys(grouped)
            .reduce((acc, current) => {
                acc += `;${current}=${grouped[current].join("-")}`
                return acc
            }, "")

        display(1, !query ? '' : query.substring(1))

        e.preventDefault()
        e.stopPropagation()
    })
document.querySelectorAll(".btn-toolbar > button")
        .forEach(btn => btn.addEventListener("click", ({target}) => display(target.getAttribute("data-page") ?? 1)))

document.getElementById("email-btn").addEventListener("click",function(){
    document.querySelector(".popup").style.display = "flex"
})

document.querySelector(".close").addEventListener("click",function(){
    document.querySelector(".popup").style.display = "none";
})