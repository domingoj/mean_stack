'use strict';
const Enigma = require('./enigma');
const eng = new Enigma('jermiepogi');

let encodedString = eng.encode("Don't panic!");
let decodedString = eng.decode(encodedString);

console.log("Encoded: ", encodedString);
console.log("Decoded: ",decodedString);

let qr = eng.qrgen("Jermie pogi", "jermiepogi.png");

qr ? console.log('QR generated!') : console.log('QR Failed!');