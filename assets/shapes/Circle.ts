import p5 from "p5";
import { Shape } from "./Shape.js";
import { Constants } from "../constants.js";

export class Circle implements Shape{
    x: number;
    y: number;
    size: number;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.size = radius * 2;
    }

    draw(p: p5): void {
        p.strokeWeight(Constants.STATION_OUTLINE);
        p.ellipse(this.x + this.size/2, this.y + this.size/2, this.size);
    }

    move(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
    }
}

