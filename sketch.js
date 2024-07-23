let curveEditor;

function setup() {
    createCanvas(1024,512)
    background(0)
    frameRate(60)
    curveEditor = new BezierCurveEditor(createVector(256,256))
    //noLoop()
}

function draw() {
    background(128)
    curveEditor.draw()
    for (const point of curveEditor.points) {
        point.update()
        point.draw()
    }
}

function keyPressed() {
    if (key === 'y') {
        curveEditor.addPoint(mouseX, mouseY)
    }
    if (key === 'u') {
        curveEditor.makeLoop()
    }
    if (key === 'i') {
        draw()
    }
  }

function mousePressed() {
    for (const point of curveEditor.points) {
        point.pressed()
    }
}

function mouseReleased() {
    for (const point of curveEditor.points) {
        point.released()
    }
}