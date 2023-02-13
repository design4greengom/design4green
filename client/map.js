class WorldMap {
    src
    width
    height

    scaleX = 1
    scaleY = 1
    clicked = false

    cursorX
    cursorY

    dots = [
        [0, 0],
        [745, 361],
        [1490, 722]
    ]

    constructor(selector, source, close) {
        let map = document.querySelector(selector)
        this.src = source
        const [width, height] = [source.width, source.height]

        this.width = map.width = window.innerWidth
        this.height = map.height = window.innerHeight

        let ctx = map.getContext("2d")
        this.draw({ctx, width, height})

        document.addEventListener("mouseup", () => this.clicked = false)
        close.addEventListener("click", () => {
            map.removeAttribute("data-opened")
            const [scaleX, scaleY] = this.width >= this.height ? [(this.width/this.height), 1] : [1, (this.height/this.width)]
            this.draw({ctx, scaleX, scaleY})
        })
        map.addEventListener("click", ({target}) => {
            if(!target.hasAttribute("data-opened")) {
                target.setAttribute("data-opened", true)

                const [scaleX, scaleY] = this.width >= this.height ? [1/(this.width/this.height), 1] : [1, 1/(this.height/this.width)]

                this.draw({ctx, scaleX, scaleY})
            }
        })
        map.addEventListener("mousedown", (e) => {
            this.clicked = true
            this.cursorX = e.clientX
            this.cursorY = e.clientY
        })

        map.addEventListener("wheel", ({target, wheelDelta, offsetX, offsetY}) => {
            if(target.hasAttribute("data-opened")) {
                const fact = wheelDelta > 0 ? 1.05 : .95

                this.draw({
                    ctx, dX: (width*(1-fact)) / (this.width / offsetX), dY: (height*(1-fact)) / (this.height / offsetY),
                    scaleX: fact, scaleY: fact
                })
            }
        })

        map.addEventListener("mousemove", (e) => {
            if(this.clicked && e.target.hasAttribute("data-opened")) {
                this.draw({ctx, dX: e.clientX - this.cursorX, dY: e.clientY - this.cursorY})

                this.cursorX = e.clientX
                this.cursorY = e.clientY
            }
        })
    }

    draw({ctx, dX = 0, dY = 0, scaleX = 1, scaleY = 1}) {
        requestAnimationFrame(() => {
            ctx.clearRect(0, 0, this.width, this.height)

            this.scaleX *= scaleX
            this.scaleY *= scaleY
            ctx.scale(scaleX, scaleY)

            ctx.translate(dX /= this.scaleX, dY /= this.scaleY)

            ctx.drawImage(this.src, 0, 0, this.width, this.height)

            ctx.beginPath()
            for(let [x, y] of this.dots) {
                ctx.arc(x, y, 4, 0, 2 * Math.PI, true)
            }
            ctx.fill()
        })
    }
}

const map = new WorldMap("canvas", document.querySelector("img"), document.querySelector(".map-container button[data-close]"))
