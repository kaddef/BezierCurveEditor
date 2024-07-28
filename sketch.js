let curveEditor;
let fps;
let lastUpdateTime = 0;
let updateInterval = 100;

function setup() {
    createCanvas(windowWidth, windowHeight)
    background(0)
    frameRate(60)
    fps = frameRate();
    curveEditor = new BezierCurveEditor(createVector(256, 256))
    //noLoop()
}

function draw() {
    background(128)
    if (millis() - lastUpdateTime > updateInterval) {
        fps = frameRate();
        lastUpdateTime = millis();
    }
    fill(0);
    stroke(0);
    textSize(24);
    text("FPS: " + fps.toFixed(0), 10, 30);
    curveEditor.draw()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 'y') {
        curveEditor.addPoint(mouseX, mouseY)
    }
    if (key === 'u') {
        curveEditor.toggleLoop()
    }
    if (key === 'i') {
        redraw()
    }
}

function mousePressed() {
    curveEditor.points.forEach(point => point.pressed());
}

function mouseReleased() {
    curveEditor.points.forEach(point => point.released());
}