import p5 from 'p5'
// these are the variables you can use as inputs to your algorithms
// console.log(fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
let features = {
     "white stars": 0,
     "yellow stars": 0,
     "gold stars": 0,
     "micro stars": 0,
     "medium stars": 0,
     "mega stars": 0,
     "giga stars": 0,
}
window.$fxhashFeatures = features

let canvas_size = Math.min(window.innerWidth, window.innerHeight);

const padValue = (n, mp, padding) => {
    if (n >= mp) {
        n -= padding
    } else {
        n += padding
    }
    return n
}

const genGradient = (p5) => {
    p5.noFill()
    let seed = fxrand()
    let c1 = p5.color(7, 7, 9)
    let c2
    p5.background(c1)

    if (seed < .10)  {
        c2 = p5.color(117, 0, 0)
        features.sky = "dusk"
    } else if (seed >= .10 && seed <= .35) {
        c2 = p5.color(84, 107, 171)
        features.sky = "moonlit"
    } else {
        c2 = p5.color(12, 16, 48)
        features.sky = "midnight"
    }

    for (let i = 0; i<= canvas_size; i++) {
        let inter = p5.map(i, 0, canvas_size, 0, 1)
        let c = p5.lerpColor(c1, c2, inter)
        p5.stroke(c)
        p5.strokeWeight(3)
        p5.line(0, i, canvas_size, i)
    }
}

const fillStar = (p5) => {
    let seed = fxrand()
    let star
    if (seed < .10)  {
        // star = "#ffeaac"
        star = "#ffcd3c"
        features["gold stars"] += 1
    } else if (seed >= .10 && seed <= .35) {
        // star = "#feffa6"
        star = "#fffdb3"
        features["yellow stars"] += 1
    } else {
        star = "#ffffff"
        features["white stars"] += 1
    }
    p5.fill(star)
}

const genStars = (p5) => {
    let starCords = []
    let middle_point = canvas_size / 2
    let padding = canvas_size * .2
    let stars = fxrand() * 16
    stars = Math.round(stars)
    if (stars <= 4) {
        stars = 4
        features["constellation size"] = "micro"
    } else if (stars > 4 && stars <= 9) {
        features["constellation size"] = "medium"
    } else if (stars > 9 && stars <= 13) {
        features["constellation size"] = "mega"
    } else {
        features["constellation size"] = "giga"
    }
    for (let i = 0; i < stars; i++) {
        let sc = []
        let x = padValue(fxrand() * canvas_size, middle_point, padding)
        let y = padValue(fxrand() * canvas_size, middle_point, padding)
        fillStar(p5)
        sc.push(x)
        sc.push(y)
        p5.stroke("#ffffff")
        p5.strokeWeight(0)
        // anything smaller than 2 is too small
        let starSize = (fxrand() * 10) + 2
        if (starSize <= 4) {
            features["micro stars"] += 1
        } else if (starSize > 4 && starSize <= 7) {
            features["medium stars"] += 1
        } else if (starSize > 7 && starSize <= 10){
            features["mega stars"] += 1
        } else {
            features["giga stars"] += 1
        }
        p5.ellipse(x, y, starSize)
        starCords.push(sc)
    }

    return starCords
}

const leftToRight = (stars) => {
    return stars.sort((a,b) => {
        return a[0] - b[0]
    })
}

const topToBottom = (stars) => {
    return stars.sort((a,b) => {
        return a[1] - b[1]
    })
}

const chooseAlgo = (stars) => {
    let seed = fxrand()
    if (seed < .30)  {
        features.algorithm = "descend"
        return topToBottom(stars)
    } else if (seed >= .30 && seed < .80) {
        features.algorithm = "orderly"
        return leftToRight(stars)
    } else {
        features.algorithm = "chaotic"
        return stars
    }
}

let sketch = (p5) => {
    let stars
    p5.frameRate(1)

    p5.setup = () => {
        p5.createCanvas(canvas_size, canvas_size);
        p5.noStroke()
        genGradient(p5)
        stars = chooseAlgo(genStars(p5))
    }

    let i = 0
    p5.draw = () => {
        let x
        let y
        let nextX
        let nextY
        if (i !== stars.length - 1) {
            x = stars[i][0]
            y = stars[i][1]
            nextX  = stars[i + 1][0]
            nextY  = stars[i + 1][1]
            p5.stroke("#ffffff")
            p5.strokeWeight(3)
            p5.line(x, y, nextX, nextY)
            i++
            } else {
            x = stars[i][0]
            y = stars[i][1]
            nextX  = stars[0][0]
            nextY  = stars[0][1]
            p5.stroke("#ffffff")
            p5.strokeWeight(3)
            p5.line(x, y, nextX, nextY)
            p5.noLoop()
            fxpreview()
            }
    }
}

let myp5 = new p5(sketch, window.document.body);