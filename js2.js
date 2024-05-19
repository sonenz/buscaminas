let columna = 0
let fila = 0
var allcont = [];
var filacont = [];

for (let i = 0; i <= 64; i++) {
    if (columna < 8) {
        filacont[columna] = i
        columna++
        console.log(i);
    }
    else {
        filacont.push("x");
    allcont[fila] = filacont.slice(0,8);
    fila++
    columna = 0;
    filacont[columna] = i
    columna++
    }
    
}
console.log(allcont);