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
        // fill("blue")
        // ellipse(firstControl.x, firstControl.y, 10,10)
        // ellipse(x, y, 10, 10)
        // ellipse((firstControl.x+x)/2, (firstControl.y+y)/2, 10, 10)
        // console.log(firstControl.x)
        // console.log(firstControl.y)

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
        this.isLoop = this.isLoop ? false : true
        //MAKE LOOP HERE
        console.log(this.isLoop)
    }
    //this not gonna work do it with inheritence
    // update() {
    //     for (const [index, point] of this.points.entries()) {
    //         if(!point.isAnchor && index !== 1 && index !== this.points.length - 2) {
                
    //         }
    //     }
    // }

    draw() {
        // for (const point of this.points) {
        //     point.update()
        //     point.draw()
        // }
        for (let i = 0; i < this.points.length; i+=3) {
            if(this.points[i+1] === undefined) {
                stroke(color(0,0,0,80))
                line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
                break
            }
            if(i === 0) {
                stroke(color(0,0,0,80))
                line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
            } else {
                stroke(color(0,0,0,80))
                line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
                line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
            }
            this.drawBezierCurve(this.points[i].pos, this.points[i+1].pos, this.points[i+2].pos, this.points[i+3].pos);
        }
        //drawBezierCurve(this.points[0].pos, this.points[1].pos, this.points[2].pos, this.points[3].pos);
    }

    drawBezierCurve(p0, p1, p2, p3) {
        let previousPoint = p0;
        for (let t = 0; t <= 1; t += 0.1) {
            let result = this.CubicCurve(p0, p1, p2, p3, t);
            stroke("green");
            line(previousPoint.x, previousPoint.y, result.x, result.y);
            noStroke();
            previousPoint = result;
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