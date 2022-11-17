class WorldMap {
    src
    width
    height

    scale = 1
    clicked = false

    cursorX
    cursorY

    dots = [
        [50, 20],
        [140, 60]
    ]

    constructor(selector, source, height, width) {
        let map = document.querySelector(selector)
        this.src = source
        this.width = map.width = width
        this.height = map.height = height

        let ctx = map.getContext("2d")
        this.draw({ctx, width, height})

        document.addEventListener("mouseup", () => this.clicked = false)
        map.addEventListener("mousedown", (e) => {
            this.clicked = true
            this.cursorX = e.clientX
            this.cursorY = e.clientY
        })

        map.addEventListener("wheel", ({wheelDelta, offsetX, offsetY}) => {
            const fact = wheelDelta > 0 ? 1.05 : .95

            this.draw({
                ctx, dX: (width*(1-fact)) / (this.width / offsetX), dY: (height*(1-fact)) / (this.height / offsetY),
                width, height, scale: fact
            })
        })

        map.addEventListener("mousemove", (e) => {
            if(this.clicked) {
                this.draw({ctx, dX: e.clientX - this.cursorX, dY: e.clientY - this.cursorY, width, height})

                this.cursorX = e.clientX
                this.cursorY = e.clientY
            }
        })
    }

    draw({ctx, dX = 0, dY = 0, width, height, scale}) {
        requestAnimationFrame(() => {
            ctx.clearRect(0, 0, this.width, this.height)

            if(scale) {
                this.scale *= scale
                ctx.scale(scale, scale)
            }

            ctx.translate(dX /= this.scale, dY /= this.scale)

            ctx.drawImage(this.src, 0, 0, width, height)

            ctx.beginPath()
            for(let [x, y] of this.dots) {
                ctx.arc(x, y, 5, 0, 2 * Math.PI, true)
            }
            ctx.fill()
        })
    }
}

const map = new WorldMap("canvas", document.querySelector("img"), 300, 300)
