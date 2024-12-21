export class SourceInfo {
    airportId : string;
    city : string;
    country : string;
    nameAirport : string;


    constructor(airportId:string, city:string, country:string, nameAirport:string){
        this.airportId = airportId;
        this.city = city;
        this.country = country;
        this.nameAirport = nameAirport;
    }
}