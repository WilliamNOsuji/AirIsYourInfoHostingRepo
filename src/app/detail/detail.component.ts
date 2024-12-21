import { Component, OnInit } from '@angular/core';
import { Arc } from '../models/arc';
import { SourceInfo } from '../models/sourceInfo';
import { DestinationInfo } from '../models/destinationInfo';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{
  flagUrlSource: string = '';
  flagUrlDestination : string = "";
  arc: Arc[] = [];
  sourceInfo : SourceInfo[] = []
  destinationInfo : DestinationInfo[] = []
  constructor( public http : HttpClient){

  }
  
  ngOnInit(): void {
    
    let result = localStorage.getItem("storedArcs");
    if (result) {
      let arcsData = JSON.parse(result);
      arcsData.forEach((arcData: any) => {
        console.log(arcData); // Log arcData to inspect its structure
  
        // Create SourceInfo object
        let srcInfo = new SourceInfo(
          arcData.sourceInfo.airportId,
          arcData.sourceInfo.city,
          arcData.sourceInfo.country,
          arcData.sourceInfo.name,
        );
        console.log(srcInfo)
        // Create DestinationInfo object
        let destInfo = new DestinationInfo(
          arcData.destinationInfo.airportId,
          arcData.destinationInfo.city,
          arcData.destinationInfo.country,
          arcData.destinationInfo.name
        );
        console.log(destInfo)
        // Create Arc object
        this.getCountryFlag(srcInfo.country, 'source'); // Fetch source flag
        this.getCountryFlag(destInfo.country, 'destination'); // Fetch destination flag

        let arc = new Arc(
          arcData.id,
          arcData.airline,
          [srcInfo], // SourceInfo objects are stored in an array
          [destInfo], // DestinationInfo objects are stored in an array
          arcData.equipment
        );
          
        // Push the Arc object into the arc array
        this.arc.push(arc);


      });
    }
  }

  sourceFlags: { [country: string]: string } = {};
  destinationFlags: { [country: string]: string } = {};

  getCountryFlag(countryName: string, type: string): void {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;
    this.http.get<any[]>(url).subscribe((data: string | any[]) => {
      if (data.length > 0 && data[0].flags) {
        if (type === 'source') {
          this.sourceFlags[countryName] = data[0].flags.svg;
        } else if (type === 'destination') {
          this.destinationFlags[countryName] = data[0].flags.svg;
        }
      }
    });
  }
}




// const axios = require('axios');
// const params = {
//   access_key: 'eff8c66b2e9b9c08df34c75fbf2aea95'
// }

// axios.get('https://api.aviationstack.com/v1/flights', {params})
//   .then(response => {
//     const apiResponse = response.data;
//     if (Array.isArray(apiResponse['results'])) {
//         apiResponse['results'].forEach(flight => {
//             if (!flight['live']['is_ground']) {
//                 console.log(`${flight['airline']['name']} flight ${flight['flight']['iata']}`,
//                     `from ${flight['departure']['airport']} (${flight['departure']['iata']})`,
//                     `to ${flight['arrival']['airport']} (${flight['arrival']['iata']}) is in the air.`);
//             }
//         });
//     }
//   }).catch(error => {
//     console.log(error);
//   });