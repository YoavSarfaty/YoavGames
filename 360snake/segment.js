//This is a js version of my 360snake. original here: https://www.openprocessing.org/sketch/444434

/*
  The segment class is inspired by The Coding Train's video on youtube: https://youtu.be/hbgDqyy8bIw
  Segments are simple object with two points (vectors) and a length (the distance betwwen the two points).
  A segment is meant to follow a point by moving the b point to it and calculating a using inverse kinematics (so a is like a tale of b).
  A segment can also have a child, in that case it forwords any instractions to the child and follows it (witch creates a "robot-arm" like efect).
*/

class Segment {
  constructor(_len, _x, _y) { // simple constructor, all segments start vertically
    // the two points of the segment
    this.a = createVector(0, 0);
    this.b = createVector(0, 0);
    this.len = _len;
    this.a.x = _x;
    this.a.y = _y;
    this.b.x = _x;
    this.b.y = _y + this.len;
    this.child = null;
  }

  addSegment(_len) { // creates a child or forwords the instraction to the child
    if (this.child == null) {
      this.child = new Segment(_len, this.b.x, this.b.y);
    } else {
      this.child.addSegment(_len);
    }
  }

  follow(x, y, speed) { // uses the calculate method to move point b to the child's point a; if no child is found it just calculates the position based on the given parameters
    if (speed != undefined) {
      let myX = this.pos().x,
        myY = this.pos().y;
      if (dist(myX, myY, x, y) < speed) {
        this.follow(x, y);
      } else {
        let angle = atan2(x - myX, y - myY);
        x = myX + speed * sin(angle);
        y = myY + speed * cos(angle);
        this.follow(x, y);
      }
    } else {
      if (this.child != null) {
        this.child.follow(x, y);
        this.calculate(this.child.a.x, this.child.a.y);
      } else {
        this.calculate(x, y);
      }
    }
  }

  calculate(x, y) { // moves point b to the x and y and than calculates a using iverse kinematics; for more information watch the video linked above
    let angle = atan2(this.b.x - this.a.x, this.b.y - this.a.y);
    let optimalAngle = PI + atan2(x - this.a.x, y - this.a.y);
    this.b.x = x;
    this.b.y = y;
    this.a.x = this.b.x + this.len * sin(optimalAngle);
    this.a.y = this.b.y + this.len * cos(optimalAngle);
  }

  show() { // draws the segment and forwards the instruction to a child if available
    if (this.child != null) {
      this.child.show();
    }
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }

  pos() { // finds the position of the b point of the last child in the linked-chain
    if (this.child != null) {
      return this.child.pos();
    }
    return this.b;
  }

  posI(i) {
    if (i > 0) {
      return this.child.posI(i - 1);
    }
    return this.b;
  }
}