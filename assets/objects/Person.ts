import p5 from 'p5';
import { StationType } from './StationType';
import { Constants } from '../constants';
import { Circle } from '../shapes/Circle';
import { Square } from '../shapes/Square';
import { Triangle } from '../shapes/Triangle';
import { Shape } from '../shapes/Shape';
import { Station } from './Station';
import { StationGraph } from '../StationGraph';
import { Line } from './Line';
import { Edge } from './Edge';

export class Person {
    destination: StationType;
    visual: Shape;
    targetStation: Station | null = null;
    targetLine: Line | null = null;
    isReversed: boolean = false;

    constructor(destination: StationType) {
        this.destination = destination;
        // start drawing off screen
        const startPos = {x: -1000, y: -1000};
        switch (this.destination) {
            case StationType.Circle:
                this.visual = new Circle(startPos.x, startPos.y, Constants.PERSON_SIZE, 'black');
                break;
            case StationType.Square:
                this.visual = new Square(startPos.x, startPos.y, Constants.PERSON_SIZE, 'black');
                break;
            case StationType.Triangle:
                this.visual = new Triangle(startPos.x, startPos.y, Constants.PERSON_SIZE, 'black');
                break;
        }
    }


    calculateTargetStation(startStation: Station, graph: StationGraph): void {
        const visited = new Set<Station>();
        const queue: Array<{
            currentStation: Station, 
            edge: Edge | null, 
            transferStation: Station | null, 
            currentLines: Set<Line>,
            firstEdge: Edge | null
        }> = [];
        const startLines = new Set(startStation.getLines());

        queue.push({
            currentStation: startStation, 
            edge: null, 
            transferStation: null, 
            currentLines: startLines,
            firstEdge: null
        });
        visited.add(startStation);

        while (queue.length > 0) {
            const { currentStation, edge, transferStation, currentLines, firstEdge } = queue.shift()!;

            // Check if station type matches destination
            if (currentStation.stationType === this.destination) {
                this.targetStation = transferStation ?? currentStation;
                this.targetLine = firstEdge ? firstEdge.line : null;
                this.isReversed = firstEdge ? firstEdge.to === startStation : false;
                return;
            }

            // Get accessible edges and enqueue them if not visited
            const accessibleEdges = graph.getEdgesAccessibleFromStation(currentStation);
            for (let nextEdge of accessibleEdges) {
                let nextStation = nextEdge.from === currentStation ? nextEdge.to : nextEdge.from;
                if (!visited.has(nextStation)) {
                    visited.add(nextStation);
                    // Determine if a line transfer is happening
                    const nextStationLines = new Set(nextStation.getLines());
                    const isTransfer = ![...currentLines].some(line => nextStationLines.has(line));
                    const newTransferStation = isTransfer ? currentStation : transferStation;
                    const newFirstEdge = firstEdge || (isTransfer ? null : nextEdge);
                    queue.push({ 
                        currentStation: nextStation,
                        edge: nextEdge,
                        transferStation: newTransferStation,
                        currentLines: isTransfer ? nextStationLines : currentLines,
                        firstEdge: newFirstEdge
                    });
                }
            }
        }

        // If no station found, target station and other properties remain null
        this.targetStation = null;
        this.targetLine = null;
        this.isReversed = false;
    }

    draw(p: p5, x: number, y: number, size: number) {
        this.visual.draw(p);
    }

    drawWaiting(p: p5, x: number, y: number): void {
        this.visual.x = x;
        this.visual.y = y;
        this.visual.size = Constants.PERSON_SIZE;
        this.visual.color = 'black';
        this.visual.draw(p);
    }

    drawPassenger(p: p5, x: number, y: number, line: string) {
        const trainColor = p.color(line);
        // create lighter passenger color
        const passengerColor = p.lerpColor(trainColor, p.color('white'), Constants.PASSENGER_LIGHTNESS_FACTOR);
        this.visual.size = Constants.PERSON_SIZE * Constants.PASSENGER_SIZE_MULTIPLIER;
        this.visual.x = x;
        this.visual.y = y;
        this.visual.color = passengerColor.toString();
        this.visual.draw(p);
    }

    toString(): string {
        return `PERSON taking ${this.targetLine} (reversed: ${this.isReversed}) to ${this.targetStation}`
    }
}