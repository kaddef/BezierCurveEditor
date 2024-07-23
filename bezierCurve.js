class BezierCurveEditor {
    constructor(center) {
        this.points = [];
        this.center = center
        this.anchorCount = 0
        this.controlCount = 0
        this.isLoop = false
        this.generatePoints()
    }

    generatePoints() {
        this.points.push(new DraggableCircle(createVector(this.center.x - 100, this.center.y), true, `${this.anchorCount}`))
        this.anchorCount += 1
        this.points.push(new DraggableCircle(createVector(this.center.x - 50, this.center.y - 50), false, `${this.controlCount}`))
        this.controlCount += 1
        this.points.push(new DraggableCircle(createVector(this.center.x + 50, this.center.y + 50), false, `${this.controlCount}`))
        this.controlCount += 1
        this.points.push(new DraggableCircle(createVector(this.center.x + 100, this.center.y), true, `${this.anchorCount}`))
        this.anchorCount += 1
        this.points[1].setPairAndAnchor(null, this.points[0])
        this.points[2].setPairAndAnchor(null, this.points[3])
        this.points[0].setControls([this.points[1]])
        this.points[3].setControls([this.points[2]])
    }
    
    addPoint(x, y) {
        if(this.isLoop) {
            console.log("How do you add a point to a closed loop?")
            return 
        }
        if(x >= width || y>= height) {
            console.log("Cannot add point out of canvas")
            return
        }
        let lastPointPos = this.points[this.points.length-1].pos
        let lastPointIndex = this.points.length-1

        let firstControl = createVector(
            2 * this.points[lastPointIndex].pos.x - this.points[lastPointIndex - 1].pos.x,
            2 * this.points[lastPointIndex].pos.y - this.points[lastPointIndex - 1].pos.y,
        )
        let secondControl = createVector((firstControl.x+x)/2, (firstControl.y+y)/2)
        let firstAnchor = createVector(x,y)

        this.points.push(new DraggableCircle(firstControl, false, `${this.controlCount}`))
        this.controlCount += 1
        this.points.push(new DraggableCircle(secondControl, false, `${this.controlCount}`))
        this.controlCount += 1
        this.points.push(new DraggableCircle(firstAnchor, true, `${this.anchorCount}`))

        this.points[lastPointIndex].setControls([this.points[lastPointIndex - 1], this.points[lastPointIndex + 1]])
        this.points[lastPointIndex + 3].setControls([this.points[lastPointIndex + 2]])

        this.points[lastPointIndex - 1].setPairAndAnchor(this.points[lastPointIndex + 1], this.points[lastPointIndex])
        this.points[lastPointIndex + 1].setPairAndAnchor(this.points[lastPointIndex - 1], this.points[lastPointIndex])
        this.points[lastPointIndex + 2].setPairAndAnchor(null, this.points[lastPointIndex + 3])
        this.anchorCount += 1
    }

    makeLoop() {
        if(this.anchorCount <= 2 && !this.isLoop) {
            console.log("Cannot make loop with 2 anchors")
            return
        }
        if(this.isLoop) {
            this.points.pop()
            this.points.pop()
        } else {
            let firstControl = createVector(
                2 * this.points[this.points.length-1].pos.x - this.points[this.points.length-2].pos.x,
                2 * this.points[this.points.length-1].pos.y - this.points[this.points.length-2].pos.y,
            )

            let secondControl = createVector(
                2 * this.points[0].pos.x - this.points[1].pos.x,
                2 * this.points[0].pos.y - this.points[1].pos.y,
            )

            this.points.push(new DraggableCircle(firstControl, false, `${this.controlCount}`))
            this.controlCount += 1
            this.points.push(new DraggableCircle(secondControl, false, `${this.controlCount}`))
            this.controlCount += 1
    
            this.points[this.points.length - 3].controls.push(this.points[this.points.length - 2])
            this.points[0].controls.push(this.points[this.points.length - 1])
            
            this.points[this.points.length - 2].setPairAndAnchor(this.points[this.points.length - 4], this.points[this.points.length - 3])
            this.points[this.points.length - 4].setPairAndAnchor(this.points[this.points.length - 2], this.points[this.points.length - 3])
            
            this.points[1].setPairAndAnchor(this.points[this.points.length - 1], this.points[0])
            this.points[this.points.length - 1].setPairAndAnchor(this.points[1], this.points[0])
        }
        
        this.isLoop = !this.isLoop
    }

    draw() {
        for (let i = 0; i < this.isLoop ?  this.points.length-2 : this.points.length ; i+=3) {
            if(this.points[i+1] === undefined || (this.isLoop && this.points[i+3] === undefined)) {
                if(isPointsActive) {
                    stroke(color(0,255,0,80))
                    line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
                }
                break
            }
            this.drawBezierCurve(this.points[i].pos, this.points[i+1].pos, this.points[i+2].pos, this.points[i+3].pos);
            if(isPointsActive) {    
                if(i === 0) {
                    stroke(color(0,255,0,80))
                    line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
                } else {
                    stroke(color(0,255,0,80))
                    line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
                    line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
                }
            }
        }
        if(this.isLoop) {
            this.drawBezierCurve(this.points[this.points.length - 3].pos, this.points[this.points.length - 2].pos, this.points[this.points.length - 1].pos, this.points[0].pos);
            if(isPointsActive) {
                stroke(color(0,255,0,80))
                line(this.points[this.points.length - 3].pos.x, this.points[this.points.length - 3].pos.y, this.points[this.points.length - 2].pos.x, this.points[this.points.length - 2].pos.y)
                line(this.points[this.points.length - 1].pos.x, this.points[this.points.length - 1].pos.y, this.points[0].pos.x, this.points[0].pos.y)
            }
        }
    }

    drawBezierCurve(p0, p1, p2, p3) {
        let previousPoint = null;
        let previousSegment = null
        for (let t = 0; t <= 1; t += 0.01) {//When +=0.1 last quad is not drawing correctly i dont know why
            let result = this.CubicCurve(p0, p1, p2, p3, t);
            if(previousPoint && isPointsActive) {
                stroke("green");
                line(previousPoint.x, previousPoint.y, result.x, result.y);
            }
            if(previousPoint) {
                let dir = p5.Vector.sub(previousPoint, result).normalize().mult(-1);
                let upDir = createVector(dir.y, -1 * dir.x).mult(20);
                let downDir = createVector(-1 * dir.y, dir.x).mult(20)
                if(previousSegment && isRoadActive) {
                    stroke("#28221c")
                    fill("#28221c")
                    quad(
                        previousSegment.p1.x,
                        previousSegment.p1.y,
                        previousSegment.p2.x,
                        previousSegment.p2.y,
                        previousPoint.x + downDir.x,
                        previousPoint.y + downDir.y,
                        previousPoint.x + upDir.x,
                        previousPoint.y + upDir.y,
                        10,10
                    )
                }
                previousSegment = {
                    p1: {
                        x: previousPoint.x + upDir.x,
                        y: previousPoint.y + upDir.y
                    },
                    p2: {
                        x: previousPoint.x + downDir.x,
                        y: previousPoint.y + downDir.y
                    }
                };
            }
            previousPoint = result;
        }
        if (previousSegment && isRoadActive) {
            let endPoint = this.CubicCurve(p0, p1, p2, p3, 1);
            let endDir = p5.Vector.sub(previousPoint, endPoint).normalize().mult(-1);
            let endUpDir = createVector(endDir.y, -1 * endDir.x).mult(20);
            let endDownDir = createVector(-1 * endDir.y, endDir.x).mult(20);
            stroke("#28221c")
            fill("#28221c")
            quad(
                previousSegment.p1.x,
                previousSegment.p1.y,
                previousSegment.p2.x,
                previousSegment.p2.y,
                endPoint.x + endDownDir.x,
                endPoint.y + endDownDir.y,
                endPoint.x + endUpDir.x,
                endPoint.y + endUpDir.y
            );
        }
    }

    Lerp(p1,p2,t) {
        let sub = p5.Vector.sub(p2, p1)
        sub.mult(t);
        let add = p5.Vector.add(p1, sub);
        return add
    }
    
    QuadratricCurve(p1,p2,p3,t) {
        let a = this.Lerp(p1,p2,t)
        let b = this.Lerp(p2,p3,t)
    
        // stroke("white")
        // line(p1.x, p1.y, p2.x, p2.y)
        // line(p2.x, p2.y, p3.x, p3.y)
        // noStroke()
        // fill(255)
        // stroke("blue")
        // line(a.x, a.y, b.x, b.y)
        // noStroke()
        // ellipse(a.x, a.y, 5, 5);
        // ellipse(b.x, b.y, 5, 5);
    
        let pResult = this.Lerp(a,b,t)
        // fill("blue")
        // ellipse(pResult.x, pResult.y, 5, 5);
        return pResult
    }
    
    CubicCurve(p1,p2,p3,p4,t) {
        let a = this.QuadratricCurve(p1,p2,p3,t)
        let b = this.QuadratricCurve(p2,p3,p4,t)
        let pResult = this.Lerp(a,b,t)
        // stroke("green")
        // line(a.x, a.y, b.x, b.y)
        // noStroke()
        // fill("green")
        // ellipse(pResult.x, pResult.y, 5, 5);
        return pResult
    }
}