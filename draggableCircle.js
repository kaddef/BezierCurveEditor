class DraggableCircle {
    constructor(pos, diameter, color) {
        this.pos = pos;
        this.diameter = diameter;
        this.color = color;
        this.dragging = false;
        this.offsetX = 0; // For Dragging
        this.offsetY = 0; // For Dragging
    }

    isOver() {
        let distance = sqrt(pow(abs(mouseX - this.pos.x), 2) + pow(abs(mouseY - this.pos.y), 2));
        return distance <= this.diameter / 2;
    }

    pressed() {
        let distance = sqrt(pow(abs(mouseX - this.pos.x), 2) + pow(abs(mouseY - this.pos.y), 2));
        if (distance <= this.diameter / 2) {
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
        if (this.dragging) {
            this.pos.x = mouseX + this.offsetX;
            this.pos.y = mouseY + this.offsetY;
        }
    }

    draw() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
    }
}

class AnchorCircle extends DraggableCircle {
    constructor(pos) {
        super(pos, 16, color(255, 0, 0)); // 16 diameter ve kırmızı renk
        this.controls = [];
    }

    setControls(controls) {
        this.controls = controls;
    }

    update() {
        let prevPosX = this.pos.x;
        let prevPosY = this.pos.y;
        super.update(); // Üst sınıfın update metodunu çağır
        if (this.dragging) {
            this.controls.forEach(control => {
                let offset = p5.Vector.sub(createVector(prevPosX, prevPosY), this.pos);
                control.pos.x += offset.x * -1;
                control.pos.y += offset.y * -1;
            });
        }
    }
}

class ControlCircle extends DraggableCircle {
    constructor(pos) {
        super(pos, 8, color(255, 255, 255)); // 8 diameter ve beyaz renk
        this.pair = null;
        this.anchor = null;
    }

    setPairAndAnchor(pair, anchor) {
        this.pair = pair;
        this.anchor = anchor;
    }

    update() {
        super.update(); // Üst sınıfın update metodunu çağır
        if (this.pair && this.pair.dragging) {
            let dst = p5.Vector.sub(this.anchor.pos, this.pos).mag()
            let dir = p5.Vector.sub(this.anchor.pos, this.pair.pos).normalize()
            let newPos = p5.Vector.mult(dir, dst)
            newPos.add(this.anchor.pos)
            this.pos = newPos;
        }
    }
}