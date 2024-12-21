import { DestinationInfo } from "./destinationInfo";
import { SourceInfo } from "./sourceInfo";

export class Arc {
    id : string;
    sourceInfo : SourceInfo[];
    destinationInfo : DestinationInfo[];
    airline : string;
    equipment : string;


    constructor(id:string, airline:string, source:SourceInfo[], destination:DestinationInfo[], equipment : string){
        this.id = id;
        this.airline = airline;
        this.sourceInfo = source;
        this.destinationInfo = destination;
        this.equipment = equipment;
    }
}