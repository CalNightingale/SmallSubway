import p5 from 'p5';
import { StationType } from './StationType';
import { Constants } from '../constants';
import { Shape } from '../shapes/Shape';
import { Circle } from '../shapes/Circle';
import { Triangle } from '../shapes/Triangle';
import { Square } from '../shapes/Square';
import { Person } from './Person';
import { StationPort } from './StationPort';
import { Line } from './Line';
import { StationGraph } from '../StationGraph';
import { Edge } from './Edge';

export class Station {
    static lastID = 0;

    x: number;
    y: number;
    id: number;
    size: number;
    private visual: Shape;
    people: Person[];
    stationType: StationType;
    outlineColor: string;
    private ports: Map<StationPort, Edge[]>;

    constructor(x: number, y: number, stationType: StationType, p: p5) {
        this.x = x;
        this.y = y;
        this.size = Constants.STATION_SIZE;
        this.stationType = stationType;
        this.outlineColor = 'black';
        this.people = [];
        // populate ports with empty arrays
        this.ports = new Map<StationPort, Edge[]>();

        this.id = Station.lastID++; // Assign a unique ID to the station.
        console.log(`creating station of type ${this.stationType}`);
        switch (this.stationType) {
            case StationType.Circle:
                console.log(`theoretically valid visual created`);
                this.visual = new Circle(x, y, this.size/2, 'white');
                break;
            case StationType.Square:
                this.visual = new Square(x, y, this.size, 'white');
                break;
            case StationType.Triangle:
                this.visual = new Triangle(x, y, this.size, 'white');
                break;
            default:
                throw new Error(`INVALID STATION TYPE: ${this.stationType}`);
        }
    }

    getLines(): Line[] {
        let lines: Line[] = [];
        this.ports.forEach((edgeList) => {
            edgeList.forEach(edge => { 
                if (!lines.includes(edge.line)) {
                    lines.push(edge.line);
                }
            })})
        return lines;
    }

    getLineForNewEdge(): Line | null {
        const lineUsageCount = new Map<Line, number>();
    
        // Count the number of ports used by each line
        this.ports.forEach((edgeList) => {
            edgeList.forEach(edge => {
                if (edge.line !== null) {
                    lineUsageCount.set(edge.line, (lineUsageCount.get(edge.line) || 0) + 1);
                }
            })
        });
    
        // Find and return the first line that uses only one port
        for (let [line, count] of lineUsageCount) {
            if (count === 1) {
                return line;
            }
        }
    
        // If no line uses only one port, return null
        return null;
    }
    
    resolveEdgeOverlaps(): void {
        // TODO
    }

    addEdgeToPort(edge: Edge, port: StationPort) {
        let portEdges = this.ports.get(port);
        if (portEdges) {
            // if the port has been initialized already, append
            portEdges.push(edge);
        } else {
            // otherwise make a new list
            portEdges = [edge];
        }
        this.ports.set(port, portEdges);
        this.resolveEdgeOverlaps();
    }

    setOutlineColor(newColor: string): void {
        this.outlineColor = newColor;
    }

    draw(p: p5): void {
        p.stroke(this.outlineColor);
        p.strokeWeight(Constants.STATION_OUTLINE);
        // first draw visual
        this.visual.draw(p);
        // now draw people
        this.drawPeople(p);
    }

    drawPeople(p: p5): void {
        p.strokeWeight(0);
        p.fill('black');
        const startX = this.x + this.size + Constants.PERSON_XOFFSET;
        const startY = this.y - this.size/2;
        for (let i = 0; i < this.people.length; i++) {
            const personToDraw = this.people[i];
            const yOffset = i < Constants.STATION_ROW_CAP ? 0 : 1;
            const personY = startY + (Constants.PERSON_SIZE+Constants.PERSON_YOFFSET) * yOffset;
            const xOffset = i < Constants.STATION_ROW_CAP ? i : i - Constants.STATION_ROW_CAP;
            const personX = startX + (Constants.PERSON_SIZE+Constants.PERSON_XOFFSET) * xOffset;
            personToDraw.drawWaiting(p, personX, personY);
        }
    }

    getCenterX(): number {
        return this.x + this.size/2;
    }

    getCenterY(): number {
        return this.y + this.size/2;
    }

    isMouseOver(x: number, y: number): boolean {
        return this.visual.isMouseOver(x, y);
    }

    addPerson(person: Person, graph: StationGraph): void {
        this.people.push(person);
        this.recalculatePassengerRoutes(graph);
    }

    isAtCapacity(): boolean {
        return this.people.length >= Constants.STATION_CAPACITY;
    }

    recalculatePassengerRoutes(graph: StationGraph): void {
        for (let person of this.people) {
            person.calculateTargetStation(this, graph);
            //console.log(`PERSON ${person} taking ${person.targetLine} (reversed: ${person.isReversed}) to ${person.targetStation}`);
        }
    }

    removePerson(): Person | undefined {
        return this.people.pop();
    }

    toString(): string {
        // Assuming the station has an 'id' property that is unique
        return `Station(${this.id}) at coordinates (${this.x}, ${this.y})`;
    }
}