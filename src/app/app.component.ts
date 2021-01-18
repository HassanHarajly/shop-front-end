import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('video')
  public video: ElementRef;

  @ViewChild('canvas')
  public canvas: ElementRef;

  public captures: Array<any>;
  product = {
    shop_id: 1,
    product_name: 'choco bar',
    product_quantity: 234,
    product_barcode: '2323443',
    product_price: 2.345,
    latitude: 46.321,
    longitude: -90.32445,
    image : ''
  }

  public constructor(private http: HttpClient) {
    this.captures = [];
  }

  public ngOnInit() { }

  public ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      &&  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
      navigator.mediaDevices.getUserMedia({  video: {
          facingMode: { exact: 'environment' }
        } }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      });
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({  video: true }).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
      });
    }
  }

  public capture() {
    const context = this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    this.product.image = this.captures[0];
    this.submitToApi();
  }
  public submitToApi() {

    this.http.post<any>('https://small-business-app-api.herokuapp.com/api/v1/addNewProduct', this.product)      .subscribe(response => {
console.log(response);
      },
      error => {
      console.log('error');
      console.log(error);
      });;
  }
}
