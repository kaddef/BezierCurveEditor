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
        this.addAnchor(createVector(this.center.x - 100, this.center.y));
        this.addControl(createVector(this.center.x - 50, this.center.y - 50));
        this.addControl(createVector(this.center.x + 50, this.center.y + 50));
        this.addAnchor(createVector(this.center.x + 100, this.center.y));

        this.points[1].setPairAndAnchor(null, this.points[0])
        this.points[2].setPairAndAnchor(null, this.points[3])
        this.points[0].setControls([this.points[1]])
        this.points[3].setControls([this.points[2]])
    }

    addAnchor(pos) {
        let anchor = new AnchorCircle(pos);
        this.points.push(anchor);
        this.anchorCount++
        //this.updateControls();
    }

    addControl(pos) {
        let control = new ControlCircle(pos);
        this.points.push(control);
        this.controlCount++
    }
    
    addPoint(x, y) {
        if (this.isLoop || x >= width || y >= height) {
            console.log("ERROR")
            errorText.innerHTML = "Cannot add point to loop or outside of canvas"
            return
        }

        let lastPointIndex = this.points.length-1
        let lastAnchor = this.points[lastPointIndex]

        let firstControl = createVector(
            2 * lastAnchor.pos.x - this.points[lastPointIndex - 1].pos.x,
            2 * lastAnchor.pos.y - this.points[lastPointIndex - 1].pos.y,
        )
        let secondControl = createVector((firstControl.x+x)/2, (firstControl.y+y)/2)

        this.addControl(firstControl);
        this.addControl(secondControl);
        this.addAnchor(createVector(x, y));

        lastAnchor.setControls([this.points[lastPointIndex - 1], this.points[lastPointIndex + 1]]);
        this.points[lastPointIndex - 1].setPairAndAnchor(this.points[lastPointIndex + 1], this.points[lastPointIndex]);
        this.points[lastPointIndex + 1].setPairAndAnchor(this.points[lastPointIndex - 1], this.points[lastPointIndex]);
        this.points[lastPointIndex + 2].setPairAndAnchor(null, this.points[lastPointIndex + 3]);
        this.points[lastPointIndex + 3].setControls([this.points[lastPointIndex + 2]]);
    }

    toggleLoop() {
        if(this.anchorCount <= 2 && !this.isLoop) {
            console.log("Cannot make loop with 2 anchors")
            errorText.innerHTML = "Cannot make loop with 2 anchors"
            return
        }
        if(this.isLoop) {
            this.points.pop()
            this.points.pop()
        } else {
            let lastAnchor = this.points[this.points.length - 1];
            let firstAnchor = this.points[0];

            let firstControl = createVector(
                2 * this.points[this.points.length-1].pos.x - this.points[this.points.length-2].pos.x,
                2 * this.points[this.points.length-1].pos.y - this.points[this.points.length-2].pos.y,
            )
            let secondControl = createVector(
                2 * this.points[0].pos.x - this.points[1].pos.x,
                2 * this.points[0].pos.y - this.points[1].pos.y,
            )

            this.addControl(firstControl);
            this.addControl(secondControl);

            lastAnchor.controls.push(this.points[this.points.length - 2]);//Maybe use the function
            firstAnchor.controls.push(this.points[this.points.length - 1]);

            this.points[this.points.length - 2].setPairAndAnchor(this.points[this.points.length - 4], lastAnchor);
            this.points[this.points.length - 4].setPairAndAnchor(this.points[this.points.length - 2], lastAnchor);

            this.points[1].setPairAndAnchor(this.points[this.points.length - 1], firstAnchor);
            this.points[this.points.length - 1].setPairAndAnchor(this.points[1], firstAnchor);

            // this.points.push(new DraggableCircle(firstControl, false, `${this.controlCount}`))
            // this.controlCount += 1
            // this.points.push(new DraggableCircle(secondControl, false, `${this.controlCount}`))
            // this.controlCount += 1
    
            // this.points[this.points.length - 3].controls.push(this.points[this.points.length - 2])
            // this.points[0].controls.push(this.points[this.points.length - 1])
            
            // this.points[this.points.length - 2].setPairAndAnchor(this.points[this.points.length - 4], this.points[this.points.length - 3])
            // this.points[this.points.length - 4].setPairAndAnchor(this.points[this.points.length - 2], this.points[this.points.length - 3])
            
            // this.points[1].setPairAndAnchor(this.points[this.points.length - 1], this.points[0])
            // this.points[this.points.length - 1].setPairAndAnchor(this.points[1], this.points[0])
        }
        
        this.isLoop = !this.isLoop
    }

    draw() {
        this.drawCurves();
        if (isPointsActive) this.drawPoints();
    }

    drawCurves() {
        for (let i = 0; i < this.points.length - (this.isLoop ? 2 : 3); i += 3) {//2 : 3 OR 2 : 0
            if (!this.points[i + 1] || (this.isLoop && !this.points[i + 3])) break;
            this.drawBezierCurve(this.points[i].pos, this.points[i + 1].pos, this.points[i + 2].pos, this.points[i + 3].pos);
            
            if (isPointsActive) {
                this.drawControlLines(this.points[i], this.points[i + 1]);
                this.drawControlLines(this.points[i + 2], this.points[i + 3]);
            }
        }
        if (this.isLoop) {
            this.drawBezierCurve(this.points[this.points.length - 3].pos, this.points[this.points.length - 2].pos, this.points[this.points.length - 1].pos, this.points[0].pos);
        
            if (isPointsActive) {
                this.drawControlLines(this.points[this.points.length - 3], this.points[this.points.length - 2]);
                this.drawControlLines(this.points[this.points.length - 1], this.points[0]);
            }
        }
    }

    drawControlLines(anchor, control) {
        stroke(0);
        line(anchor.pos.x, anchor.pos.y, control.pos.x, control.pos.y);
    }

    drawPoints() {
        for (const point of this.points) {
            point.update();
            point.draw();
        }
    }

    // draw() {
    //     for (let i = 0; i < this.isLoop ?  this.points.length-2 : this.points.length ; i+=3) {
    //         if(this.points[i+1] === undefined || (this.isLoop && this.points[i+3] === undefined)) {
    //             if(isPointsActive) {
    //                 stroke(color(0,255,0,80))
    //                 line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
    //             }
    //             break
    //         }
    //         this.drawBezierCurve(this.points[i].pos, this.points[i+1].pos, this.points[i+2].pos, this.points[i+3].pos);
    //         if(isPointsActive) {    
    //             if(i === 0) {
    //                 stroke(color(0,255,0,80))
    //                 line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
    //             } else {
    //                 stroke(color(0,255,0,80))
    //                 line(this.points[i].pos.x, this.points[i].pos.y, this.points[i+1].pos.x, this.points[i+1].pos.y)
    //                 line(this.points[i].pos.x, this.points[i].pos.y, this.points[i-1].pos.x, this.points[i-1].pos.y)
    //             }
    //         }
    //     }
    //     if(this.isLoop) {
    //         this.drawBezierCurve(this.points[this.points.length - 3].pos, this.points[this.points.length - 2].pos, this.points[this.points.length - 1].pos, this.points[0].pos);
    //         if(isPointsActive) {
    //             stroke(color(0,255,0,80))
    //             line(this.points[this.points.length - 3].pos.x, this.points[this.points.length - 3].pos.y, this.points[this.points.length - 2].pos.x, this.points[this.points.length - 2].pos.y)
    //             line(this.points[this.points.length - 1].pos.x, this.points[this.points.length - 1].pos.y, this.points[0].pos.x, this.points[0].pos.y)
    //         }
    //     }
    // }

    drawRoadSegment(previousPoint, result, previousSegment) {
        let dir = p5.Vector.sub(previousPoint, result).normalize().mult(-1);
        let upDir = createVector(dir.y, -dir.x).mult(20);
        let downDir = createVector(-dir.y, dir.x).mult(20);

        //console.log(previousSegment)
        if (previousSegment && isRoadActive) {
            stroke("#28221c");
            fill("#28221c");
            quad(
                previousSegment.p1.x, previousSegment.p1.y,
                previousSegment.p2.x, previousSegment.p2.y,
                previousPoint.x + downDir.x, previousPoint.y + downDir.y,
                previousPoint.x + upDir.x, previousPoint.y + upDir.y
            );
        }
        previousSegment = {
            p1: previousPoint.copy().add(upDir),
            p2: previousPoint.copy().add(downDir)
        };

        return previousSegment
    }

    drawEndSegment(previousPoint, p0, p1, p2, p3, previousSegment) {
        let endPoint = this.CubicCurve(p0, p1, p2, p3, 1);
        let endDir = p5.Vector.sub(previousPoint, endPoint).normalize().mult(-1);
        let endUpDir = createVector(endDir.y, -endDir.x).mult(20);
        let endDownDir = createVector(-endDir.y, endDir.x).mult(20);

        stroke("#28221c");
        fill("#28221c");
        quad(
            previousSegment.p1.x, previousSegment.p1.y,
            previousSegment.p2.x, previousSegment.p2.y,
            endPoint.x + endDownDir.x, endPoint.y + endDownDir.y,
            endPoint.x + endUpDir.x, endPoint.y + endUpDir.y
        );
    }

    drawBezierCurve(p0, p1, p2, p3) {
        let previousPoint = null;
        let previousSegment = null;

        for (let t = 0; t <= 1; t += 0.01) {
            let result = this.CubicCurve(p0, p1, p2, p3, t);
            if (previousPoint && isPointsActive) {
                stroke("green");
                line(previousPoint.x, previousPoint.y, result.x, result.y);
            }
            if (previousPoint) {
                previousSegment = this.drawRoadSegment(previousPoint, result, previousSegment);
            }
            previousPoint = result;
        }
        if (previousSegment && isRoadActive) this.drawEndSegment(previousPoint, p0, p1, p2, p3, previousSegment);
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