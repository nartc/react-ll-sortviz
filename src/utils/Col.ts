import { MAX_COLS } from "../App";

export class Col {
    width: number;
    color: string;
    constructor(public height: number, public canvasCtx: CanvasRenderingContext2D, canvasWidth: number) {
        this.width = canvasWidth / MAX_COLS;
        this.color = '';
    }

    draw(index: number) {
        this.canvasCtx.beginPath();
        this.canvasCtx.rect(index * this.width, 0, this.width, this.height);
        this.canvasCtx.fillStyle = this.color;
        this.canvasCtx.fill();
        this.canvasCtx.closePath();
    }

    update(index: number) {
        this.color = `hsl(${index}, 100%, 50%)`;
        this.draw(index);
    }
}
