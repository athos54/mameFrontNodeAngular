import { Component } from '@angular/core';
import axios from 'axios';
import { NgLocaleLocalization } from '@angular/common';
declare var Gamepad: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  listaJuegos: string[];
  imagen: string = null;
  video: string = null;
  videoElement: any;
  indiceActivo = -1;

  juegoIniciado = false;


  ngOnInit(): void {
    console.log('window', window);
    const gamepad: any = new Gamepad();
    console.log('gamepad', gamepad);

    gamepad.init();
    gamepad.bind(Gamepad.Event.CONNECTED, (device) => {
    // a new gamepad connected
    console.log('CONECTADO');

   });

    gamepad.bind(Gamepad.Event.BUTTON_DOWN, (e) => {
    // e.control of gamepad e.gamepad pressed down
    console.log('ABAJO');
    console.log('e', e);
    this.abrir(this.listaJuegos[7]);

  });

    gamepad.bind(Gamepad.Event.AXIS_CHANGED, (e) => {
      // e.axis changed to value e.value for gamepad e.gamepad
      console.log('AXIS', e);
      if (e.axis === 'LEFT_STICK_Y' && e.value !== 0) {
        if (e.value === 1) {
          this.flechaAbajo();
        } else {
          this.flechaArriba();
        }
      }
  	});


    window.addEventListener('keydown', (e) => {
      console.log(e.keyCode);

      // space and arrow keys
      if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }

      if (e.keyCode === 40) {
        this.flechaAbajo();
      } else if (e.keyCode === 38) {
        this.flechaArriba();
      } else if (e.keyCode === 13) {
        this.abrir(this.listaJuegos[7]);
      }
  }, false);
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    axios.get('http://localhost:3000/getjuegos').then(result => {
      this.listaJuegos = result.data;
      console.log(this.listaJuegos);

    });
  }

  loadDemo(juego) {
    this.imagen = '../assets/media/Wheel/' + juego.split('.')[0] + '.png';
    this.video = '../assets/media/Video/' + juego.split('.')[0] + '.mp4';

    setTimeout(() => {
      this.videoElement = document.getElementById('video');
      console.log(this.videoElement);
      this.videoElement.play();
    }, 1000);
  }

  abrir(juego) {
    if (this.juegoIniciado === true) { return; }

    console.log(juego);
    this.juegoIniciado = true;
    axios.get('http://localhost:3000/lanzar?juego=' + juego).then(result => {
      console.log('then');
      this.juegoIniciado = false;
    }).catch(() => {
      this.juegoIniciado = false;
    });
    this.imagen = null;
    this.video = null;
  }


  flechaArriba() {
    if (this.juegoIniciado === true) { return; }

    const ultimo = this.listaJuegos[this.listaJuegos.length - 1];
    this.listaJuegos.unshift(ultimo);
    this.listaJuegos.splice(this.listaJuegos.length - 1, 1);
    this.loadDemo(this.listaJuegos[7]);
  }
  flechaAbajo() {
    if (this.juegoIniciado === true) { return; }

    const primero = this.listaJuegos[7];
    this.listaJuegos.push(primero);
    this.listaJuegos.splice(0, 1);
    this.loadDemo(this.listaJuegos[7]);
  }
}
