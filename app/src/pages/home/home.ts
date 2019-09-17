import { Component, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('elemento') elemento: ElementRef;

  mapa: any;

  api: string = 'http://localhost:3000';

  lista: any[] = [];

  constructor(private geolocation: Geolocation, private http: HttpClient){}

  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let estilo = {
        zoom: 14,
        center: latLng,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false
      };

      this.mapa = new google.maps.Map(this.elemento.nativeElement, estilo);

      this.marcadores();
    });
  }

  marcadores(){
    new Promise(resolve => {
      this.http.get(this.api).subscribe(data => {
        this.limpar();

        let keys = Object.keys(data);

        let bounds = new google.maps.LatLngBounds();

        for(let i = 0; i < keys.length; i++){
          let latLng = {
            lat: data[keys[i]].latitude,
            lng: data[keys[i]].longitude
          };

          let marcador = new google.maps.Marker({
            icon: data[keys[i]].urlicone,
            position: latLng,
            map: this.mapa
          });

          this.lista.push(marcador);

          bounds.extend(latLng);
        }

        this.mapa.fitBounds(bounds);
      }, err => {
        console.log(err);
      });
    });
  }

  limpar(){
    if(this.lista.length > 0){
      for (let i = 0; i < this.lista.length; i++){
        this.lista[i].setMap(null);
      }
      this.lista.length = 0;

      this.lista = [];
    }
  }
}
