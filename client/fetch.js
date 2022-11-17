const btn = document.querySelector("button[data-js-fetch]")
const list = document.querySelector("#data-visualizer")
const input = document.querySelector("input[name='idChoice']")

const getDetails = (value, callback) => {
    const fromStorage = JSON.parse(localStorage.getItem(value))?.text

    fromStorage ? callback(fromStorage)
        : fetch(`/details${value ? '?id=' + value : ''}`)
            .then(res => res.json())
            .then(data => localStorage.setItem(value, JSON.stringify(data)) ?? data.text)
            .then(callback)
}

btn.addEventListener("click", function () {
    getDetails(input.value, (txt) => {
        let child = list.childNodes[0]
        if(child) {
            child.innerText = txt
        } else {
            child = document.createElement("li")
            child.innerText = txt
            list.appendChild(child)
        }
    })
})