class DraggableCircle {
    constructor(pos, isAnchor = false, name = "") {
        this.pos = pos;
        this.isAnchor = isAnchor;
        this.name = name;
        this.dragging = false;
        this.diameter = isAnchor ? 16 : 8;
        this.color = isAnchor ? color(255, 0, 0) : color(255, 255, 255);
        this.pair;
        this.anchor;
        this.controls;
    }

    setPairAndAnchor(pair, anchor) {
        if(this.isAnchor && controls) {
            console.log("Cannot Set Pair To Anchor")
            return
        }
        this.anchor = anchor;
        this.pair = pair;
    }

    setControls(controls) {
        this.controls = controls
    }

    isOver() {
        let distance = sqrt(pow(abs(mouseX - this.pos.x),2) + pow(abs(mouseY - this.pos.y),2))
        if(distance <= this.diameter/2) {
            return true
        } else {
            return false
        }
    }

    pressed() {
        let distance = sqrt(pow(abs(mouseX - this.pos.x),2) + pow(abs(mouseY - this.pos.y),2))
        if (distance <= this.diameter/2) {
          this.dragging = true;
          this.offsetX = this.pos.x - mouseX;
          this.offsetY = this.pos.y - mouseY;
        }
    }

    released() {
        //console.log(this)
        this.dragging = false;
    }

    update() {
        let prewPosX = this.pos.x
        let prewPosY = this.pos.y
        if (this.dragging) {
            this.pos.x = mouseX + this.offsetX;
            this.pos.y = mouseY + this.offsetY;
        } else if(this.pair && this.pair.dragging) {
            let dst = p5.Vector.sub(this.anchor.pos, this.pos).mag()
            let dir = p5.Vector.sub(this.anchor.pos, this.pair.pos).normalize()
            let newPos = p5.Vector.mult(dir, dst)
            newPos.add(this.anchor.pos)
            this.pos = newPos;
        }
        if (this.isAnchor && this.dragging) {
            this.controls.forEach(control => {
                let offset = p5.Vector.sub(createVector(prewPosX, prewPosY), this.pos);
                control.pos.x += offset.x * -1;
                control.pos.y += offset.y * -1;
            });
        }
    }

    draw() {
        fill(this.color)
        if(this.name != "") {
            //text(this.name, this.pos.x+10, this.pos.y-10)
        }
        ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter)
    }
}