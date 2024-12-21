import { Component, OnInit } from '@angular/core';
import Globe from 'globe.gl';
import indexBy from 'index-array-by';
import * as d3 from 'd3';
import { Router } from '@angular/router';

import { Arc } from '../models/arc';

// Define interfaces for Airport and Route
interface Airport {
  airportId: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  icao: string;
  lat: number;
  lng: number;
  alt: number;
  timezone: string;
  dst: string;
  tz: string;
  type: string;
  source: string;
}

interface Route {
  airline: string;
  airlineId: string;
  srcIata: string;
  srcAirportId: string;
  dstIata: string;
  dstAirportId: string;
  codeshare: string;
  stops: string;
  equipment: string;
  srcAirport: Airport;
  dstAirport: Airport;
}


// Assuming byIata is of type NestedResult | FlatResult, define the proper interface for it
interface NestedResult {
  [key: string]: Airport;
}

interface FlatResult {
  [key: string]: string; // or any other type if byIata can have different types
}


@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  countryName: string = ''; // Variable to store the country name entered by the user

  storedArcs : Arc[] = []; 


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeGlobe(this.countryName);
  }

  private initializeGlobe(countryName : string): void {
    localStorage.clear();
    const OPACITY: number = 0.20;

    const globeContainer: HTMLElement | null = document.getElementById('globeViz');
    if (!globeContainer) {
      console.error('Element with ID "globeViz" not found.');
      return;
    }

    const myGlobe = Globe()(<HTMLElement>globeContainer);

    myGlobe
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .pointOfView({ lat: 39.6, lng: -98.5, altitude: 2 }) // aim at continental US centroid
  .arcLabel((d: any) => `${d.airlineId}: ${d.srcIata} → ${d.dstIata}`)
  .arcStartLat((d: any) => +d.srcAirport.lat)
  .arcStartLng((d: any) => +d.srcAirport.lng)
  .arcEndLat((d: any) => +d.dstAirport.lat)
  .arcEndLng((d: any) => +d.dstAirport.lng)
  .arcDashLength(0.25)
  .arcDashGap(1)
  .arcDashInitialGap(() => Math.random())
  .arcDashAnimateTime(4000)
  .arcColor((d: any) => [`rgba(0, 255, 0, ${OPACITY})`, `rgba(255, 0, 0, ${OPACITY})`])
  .arcsTransitionDuration(0)
  .pointColor(() => 'orange')
  .pointAltitude(0)
  .pointRadius(0.02)
  .pointsMerge(true)
  .onArcClick((event: any, arc: any) => {
    this.onArcClicked(arc,event);
  });
  
  
  
    // Load data
    const airportParse = ([airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source]: string[]) => ({
      airportId, name, city, country, iata, icao, lat, lng, alt, timezone, dst, tz, type, source
    });

    const routeParse = ([airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment]: string[]) => ({
      airline, airlineId, srcIata, srcAirportId, dstIata, dstAirportId, codeshare, stops, equipment
    });

    Promise.all([
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, airportParse)),
      fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat').then(res => res.text())
        .then(d => d3.csvParseRows(d, routeParse))
    ]).then(([airports, routes]) => {
      const byIata = indexBy(airports, 'iata', false);

      const filteredRoutes = routes
        .filter((d: any) => byIata.hasOwnProperty(d.srcIata) && byIata.hasOwnProperty(d.dstIata)) // exclude unknown airports
        .filter((d: any) => d.stops === '0') // non-stop flights only
        .map((d: any) => ({
          ...d,
          srcAirport: (byIata as NestedResult)[d.srcIata],
          dstAirport: (byIata as NestedResult)[d.dstIata]
        }))
        .filter((d: Route) => d.srcAirport.country === this.countryName && d.dstAirport.country !== this.countryName); // international routes from country

      myGlobe
        .pointsData(airports)
        .arcsData(filteredRoutes);
    });
  }
  onArcClicked(event: any, arc: any): void {
    console.log('Arc clicked:', arc);
    this.storeArcLocally(new Arc(arc.airlineId, arc.airline, arc.srcAirport, arc.dstAirport, arc.equipment));
    console.log('Arc ID:', arc.airlineId);
    this.router.navigate(['/detail', arc.airlineId]);
  }

  onSubmit(): void {
    if (this.countryName !== "") {
      this.initializeGlobe(this.countryName);
    }
  }

  getStoredArcs(): Arc[] {
    // Retrieve stored arcs from local storage
    return JSON.parse(localStorage.getItem("storedArcs") || "[]");
  }

  storeArcLocally(arc: Arc): void {
    // Retrieve existing arcs from local storage or initialize an empty array
    let storedArcs: Arc[] = JSON.parse(localStorage.getItem("storedArcs") || "[]");

    // Push the new arc to the array
    storedArcs.push(arc);

    // Store the updated array back to local storage
    localStorage.setItem("storedArcs", JSON.stringify(storedArcs));
  }
}
