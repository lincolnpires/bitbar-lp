import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {NavController, NavParams} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {VerifyUber} from '../verifyUber/verifyUber';
import { AppAvailability, InAppBrowser } from 'ionic-native';

/*
  Generated class for the Result page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-result',
  templateUrl: 'result.html'
})
export class Result {

navParams:NavParams;
  venueInfo:any;
  uberInfo:any;
  lat:string;
  long:string;
  initialLat:string;
  initialLong:String;

  constructor(public navCtrl: NavController, navParams: NavParams, private http: Http) {
        this.navParams = navParams;

        this.lat = navParams.get("lat");
        this.long = navParams.get("long");

        this.initialLat = navParams.get("initalLat");
        this.initialLong = navParams.get("initialLong");

        this.venueInfo = this.uberInfo = {};
        this.venueInfo.image = "img/map-placeholder.png";

        let apiUrl:string = "https://api.foursquare.com/v2/venues/search?ll="+this.lat+","+this.long+"&client_id=CGU3LEY2QNJ50AMQLQJOBEZDTFZ3VYB22HZTZONIUJLEO2KC&client_secret=APAKIP4VQCBSNFS4JXOR4OTUQXS331XERZONOKWPVDACSCBU&v=20140806%20&m=foursquare&categoryId=4bf58dd8d48988d116941735&limit=5&radius=300";

        this.http.get(apiUrl).map(res => res.json())
        .subscribe(data => {
          if(data.response.venues.length > 0){

            let venue = data.response.venues[Math.floor(Math.random()*data.response.venues.length)];
            let venueApiUrl = "https://api.foursquare.com/v2/venues/"+venue.id+"?client_id=CGU3LEY2QNJ50AMQLQJOBEZDTFZ3VYB22HZTZONIUJLEO2KC&client_secret=APAKIP4VQCBSNFS4JXOR4OTUQXS331XERZONOKWPVDACSCBU&v=20140806%20&m=foursquare";


            this.http.get(venueApiUrl).map(res => res.json())
            .subscribe(data => {
              this.venueInfo = data.response.venue;


              this.venueInfo.url = this.venueInfo.shortUrl;
              this.venueInfo.exists = true;
              this.venueInfo.price = (this.venueInfo.attributes.groups.length > 0) ? (this.venueInfo.attributes.groups[0].summary):"$?";
              this.venueInfo.address = this.venueInfo.location.formattedAddress[0];
              this.venueInfo.image = this.venueInfo.bestPhoto ? (this.venueInfo.bestPhoto.prefix + "512x512" + this.venueInfo.bestPhoto.suffix):"https://maps.googleapis.com/maps/api/staticmap?center="+this.venueInfo.location.lat+","+this.venueInfo.location.lng+"&zoom=14&size=515x512&style=element:labels|visibility:off&key=AIzaSyD5aQsKh5xWGeHo4UUgIXwlRSjaBlGHCyA";

              let crossOrigin = false;
              let uberApiUrl = "https://api.uber.com/v1/estimates/price?server_token=LzyN5uUA7uOM2cYk-aEhmv8YHuyCqbH-gXXtcZIk&start_longitude="+this.initialLong+"&start_latitude="+this.initialLat+"&end_longitude="+this.long+"&end_latitude="+this.lat;

              if(crossOrigin) uberApiUrl = "https://crossorigin.me/"+uberApiUrl;

              this.http.get(uberApiUrl).map(res => res.json())
              .subscribe(data => {
                  let uberData = data.prices;

                  if(!(uberData.length > 9))

                  this.uberInfo.length = uberData.length;
                  if(uberData[0]) this.uberInfo.uberX = (uberData[0].display_name == "uberX") ? uberData[0].estimate:uberData[1].estimate;
              });
            });
          } else {
            this.venueInfo.noResults = true;
          }
        });

  }


  onPageDidEnter(){
      document.getElementById("map_canvas").style.display = 'none';
  }

  openUber(origin:string) {

      AppAvailability.check('com.ubercab')
      .then(
        (yes) => {
          InAppBrowser.open("uber://?client_id=KNl7Zu4pd3IsFM3WAcuDmtwRESofvFRX&action=setPickup&pickup=my_location&dropoff[longitude]="+this.long+"&dropoff[latitude]="+this.lat+"&dropoff[nickname]="+this.venueInfo.name+"&link_text=Saiba%20mais%20sobre%20o%20bar&partner_deeplink="+this.venueInfo.url, '_system', 'location=true');
        },
        (no) => {
          this.navCtrl.push(VerifyUber);
        }
      );
  }

  openFoursquare(){
    InAppBrowser.open(this.venueInfo.url, '_system', 'location=true');
  }

}
