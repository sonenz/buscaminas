var camp;
var Primera = true
var ContenedorDeCampos = [];
var ContenedorDeIndicesDeCampos = [];
var cc = 0
var boxMineds = [];
let i = 0
var elVerdaderoCamp = []

const limpiar = () => {
    document.getElementById("grid-cont").innerHTML = ""
}

class box { 
    constructor(haveMine,row,column,num) {
        this.state = "default"
        this.haveMine = haveMine;
        this.row = row;
        this.column = column;
        if (!haveMine){
            this.numcasilla = num
            this.numero = 0;
        }
    }

    static gameOver (minaAbierta) {
        for (let fila of elVerdaderoCamp) {
            for (let c of fila) {
                if (c.state == "flag") {
                    //funcion o imagen representando la bandera correcta
                    if (c.haveMine) c.HTMLcode.innerHTML = "flagOK"
                    //funcion o imagen representando la bandera incorrecta
                    else c.HTMLcode.innerHTML ="flagBAD"
                }
                if (c.state == "flag" || c.haveMine && c != minaAbierta) {
                    //funcion o imagen representando las minas
                    document.getElementById("grid-cont").replaceChild(c.HTMLcode, c.botonHtml);
                }
            }
        }
        crearBotonRePlay()
    }

    static spawnModal (resul) {
        const divModal = document.createElement("DIV");
        const nodoModal = document.createTextNode(resul);
        divModal.appendChild(nodoModal);

        divModal.classList.add("modal")

        document.getElementById("grid-cont").appendChild(divModal)
        console.log(resul);
    }

    get getObj () {
        return this
    }

    get getHaveMine () {
        return this.haveMine
    }

setEventListener () {
    this.botonHtml.addEventListener("click", ()=> {
        this.abrirCasilla()
    })

    this.botonHtml.addEventListener("contextmenu",e => {
            e.preventDefault();
            if (this.state == "flag") {
                this.botonHtml.innerHTML= ""
                this.state = "default"
                
            }
            else if (this.state = "default") {
                this.botonHtml.innerHTML= "flag"
                this.state = "flag"  
            }
        })
}
    setNumHTML () {
        this.HTMLcode = document.createElement("LI")
        this.HTMLcode.classList.add("box")
        if (this.haveMine) this.HTMLcode.appendChild(document.createTextNode("mina"))
        else this.HTMLcode.appendChild(document.createTextNode(this.numero))
    }
    abrirCasilla() {
        
        if (!this.haveMine && this.state != "flag") {
            maxboxes--;
            //reemplazamos el boton por la casilla correspondiente
            document.getElementById("grid-cont").replaceChild(this.HTMLcode, this.botonHtml);
            this.state = "open"

            if(this.numero == 0) {
                verificarRadio(this.row,this.column,(y,x)=>{elVerdaderoCamp[y][x].abrirCasilla()},(y,x)=> elVerdaderoCamp[y][x].haveMine == false && elVerdaderoCamp[y][x].state == "default",elVerdaderoCamp)
            }
        }
        else if (this.haveMine && this.state != "flag") {
        document.getElementById("grid-cont").replaceChild(this.HTMLcode, this.botonHtml);
        this.state = "mineOpen"
        box.spawnModal("MineOpened")
        box.gameOver(this)
    }
    if (maxboxes == maxmines) {
        box.spawnModal("wins")
    }

    }
}

//funcion que recibiendo como parametro una cordenada busca que si se cumple la condicion del callback cbV ejecute cbF
const verificarRadio = (y,x,cbF,cbV,c) => {
    if(c[y] != undefined && c[y][x+1]!=undefined && cbV(y,x+1)) cbF(y,x+1)//x+ (este)
    if(c[y] != undefined && c[y][x-1]!=undefined && cbV(y,x-1)) cbF(y,x-1)//x- (oeste)
    if(c[y+1] != undefined && c[y+1][x]!=undefined && cbV(y+1,x)) cbF(y+1,x)//y+ (sur)
    if(c[y-1] != undefined && c[y-1][x]!=undefined && cbV(y-1,x)) cbF(y-1,x)//y- (norte)
    if(c[y-1] != undefined && c[y-1][x+1]!=undefined && cbV(y-1,x+1)) cbF(y-1,x+1)//y- x+ (noreste)
    if(c[y-1] != undefined && c[y-1][x-1]!=undefined && cbV(y-1,x-1)) cbF(y-1,x-1)//y- x- (noroeste)
    if(c[y+1] != undefined && c[y+1][x+1]!=undefined && cbV(y+1,x+1)) cbF(y+1,x+1)//y+ x+ (sureste)
    if(c[y+1] != undefined && c[y+1][x-1]!=undefined && cbV(y+1,x-1)) cbF(y+1,x-1)//y+ x- (suroeste)
} 

//establecemos mediante la dificultad el maximo de minas y de casillas que debemos generar
const calculateDif = dif=> {
    if (dif == "easy") {
        maxmines = 10;
        maxboxes = 64;
        maxcolumn = maxrow = 8;
    }
    else if (dif == "medium") {
        maxmines = 50;
        maxboxes = 256;
        maxcolumn = maxrow = 16;
    }
    else if (dif == "hard") {
        maxmines = 99;
        maxboxes = 480;
        maxcolumn = 30;
        maxrow = 16;
    }
}

const pasarHtml = c => {
    for (y of c){
        for (x of y) {
            document.getElementById("grid-cont").appendChild(x.botonHtml)
            // document.getElementById("grid-cont").appendChild(x.HTMLcode)

        } 
    }
}

const generateBoxs = () => {
    let row = 0;
    let column = 0
    let i = 0
    var casilleroCont = [];
    let rowcont = []
    do {
        if (boxMineds.includes(i)) haveMine = true
        else haveMine = false
        var campBox = new box(haveMine,row,column,i);

        if (column < maxcolumn) {
            
            rowcont[column] = campBox;
            column++;
        }
        else {
            casilleroCont[row] = rowcont.splice(0,maxcolumn);
            row++
            column = 0
            campBox.column = column;
            campBox.row = row;
            rowcont[column] = campBox;
            column++
        }
        
        i++;
        //TODO probar y seguir el generador de campos, paso siguiente arrays que guarden las minas
} while (i < maxboxes);
casilleroCont[row] = rowcont.splice(0,maxcolumn);
return casilleroCont
}

const generateMines = (m,b,n) => {
    i = 0;
    if (n == undefined) {
        do {
            let num = Math.round(getRandomArbitrary(0, b))
            if (!boxMineds.includes(num)) {
                boxMineds[i] = num
                i++
            }
        } while (boxMineds.length !=m);
    }
    else {
        do {
            let num = Math.round(getRandomArbitrary(0, b))
            if ((!boxMineds.includes(num)) && (!n.includes(num))) {
                boxMineds[i] = num
                i++
            }
        } while (i != m);
    }
}

//funcion para generar numeros
const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min

const preparacionDeCampos = async dif => {
    //establece limites del tablero que se utilizaran para ciertas funciones
    calculateDif(dif);
    let i = 0;
    let fin = true
    do {

        if (i == 0) {
            generateMines(maxmines,maxboxes);
            camp = await generateBoxs();
            calcularNums(camp,i)
            ContenedorDeCampos[i] = camp.splice(0,maxrow);
            i++;
        }
        else {
            cc = 0;
            let casillasDondeNoAbraMinas = []
            var numBuscarCero = undefined
            for(let j = 0; j < ContenedorDeIndicesDeCampos.length; j++) {
                if (ContenedorDeIndicesDeCampos[j] == undefined) {
                    numBuscarCero = j 
                    break;
            }} 
            if (numBuscarCero == undefined) {
                fin = false
            }
            else {
            casillasDondeNoAbraMinas[cc] = numBuscarCero;
            cc++;
            let cordsNumBuscarCero = pasarDeNumACords(numBuscarCero)
            verificarRadioCeros(parseFloat(cordsNumBuscarCero.fila),parseFloat(cordsNumBuscarCero.columna),ayudaDeNumARow(),(n)=> {
            casillasDondeNoAbraMinas[cc] = n;
            cc++;
            })
            generateMines(maxmines,maxboxes,casillasDondeNoAbraMinas)
            camp = await generateBoxs();
            calcularNums(camp,i)
            ContenedorDeCampos[i] = camp.splice(0,maxrow);
            i++;
            
        }
        }
    } while (fin);
    htmlBasico(dif)


}

const verificarRadioCeros = (y,x,c,cb) => {
    if(c[y] != undefined && c[y][x+1]!=undefined) cb(c[y][x+1])//x+ (este)
    if(c[y] != undefined && c[y][x-1]!=undefined) cb(c[y][x-1])//x- (oeste)
    if(c[y+1] != undefined && c[y+1][x]!=undefined) cb(c[y+1][x])//y+ (sur)
    if(c[y-1] != undefined && c[y-1][x]!=undefined) cb(c[y-1][x])//y- (norte)
    if(c[y-1] != undefined && c[y-1][x+1]!=undefined) cb(c[y-1][x+1])//y- x+ (noreste)
    if(c[y-1] != undefined && c[y-1][x-1]!=undefined) cb(c[y-1][x-1])//y- x- (noroeste)
    if(c[y+1] != undefined && c[y+1][x+1]!=undefined) cb(c[y+1][x+1])//y+ x+ (sureste)
    if(c[y+1] != undefined && c[y+1][x-1]!=undefined) cb(c[y+1][x-1])//y+ x- (suroeste)
} 

const htmlBasico = dif => {
    let co = 0
    let ro = 0;
    if (document.getElementById("grid-cont").classList.item(0) == undefined) {
        document.getElementById("grid-cont").classList.add(dif);
    }
    else {
        document.getElementById("grid-cont").classList.replace(document.getElementById("grid-cont").classList.item(0), dif);
    }
    for(let c of ContenedorDeIndicesDeCampos){
        let btn = document.createElement("BUTTON");
        let nodoBTN = document.createTextNode("");
        btn.appendChild(nodoBTN); 

        if (co < maxcolumn) {
            btn.classList.add(ro,co)
            co++;
        }
        else {
            ro++
            co = 0
            btn.classList.add(ro,co)
            co++
        }

        btn.addEventListener("click",async (e)=> {
            if (Primera) {
                pasarCampAHTML(e)
                Primera = false
            }
        })
        document.getElementById("grid-cont").appendChild(btn)
    }
}

const calcularNums = (c,i) => {
    for (y in c) {
        for (x in c[y]) {
            if (c[y][x].numero != undefined) {
                    verificarRadio(parseFloat(y),parseFloat(x),() => {c[y][x].numero++}, (y,x)=> camp[y][x].haveMine == true,camp)
                    // c[y][x].setNumHTML()
                    if (c[y][x].numero == 0) ContenedorDeIndicesDeCampos[c[y][x].numcasilla] = i;
                }
            }
        }
}

const ayudaDeNumARow = () => {
    let c = 0;
    let r = 0;
    let filaDeAyuda = []
    var ArrayTotalDePrueba = []

    for (let i = 0; i <= maxboxes; i++) {
    if (c < maxcolumn) {
            filaDeAyuda[c] = i;
            c++;
        }
        else {
            ArrayTotalDePrueba[r] = filaDeAyuda.splice(0,maxcolumn);
            r++
            c = 0
            filaDeAyuda[c] = i;
            c++
        }
    }
    return ArrayTotalDePrueba
}

const pasarDeNumACords = (num) => {
    let ArrayTotalDePrueba = ayudaDeNumARow()
    for(fila in ArrayTotalDePrueba) {
        if(ArrayTotalDePrueba[fila].indexOf(num) != -1) {
            return {"fila" : fila,"columna" : ArrayTotalDePrueba[fila].indexOf(num)}
        }
    }
}

const pasarCampAHTML = (e) => {
    let y;
    let x;
    y = e.target.classList.item(0)
    if (e.target.classList.item(1) != undefined) {x = e.target.classList.item(1) }
    else {x = y}
    let ayuda = ayudaDeNumARow();
    let listaBotones = document.getElementsByTagName("button")
    let i = 0;
    elVerdaderoCamp = ContenedorDeCampos[ContenedorDeIndicesDeCampos[ayuda[y][x]]]
    for (let fila of elVerdaderoCamp) {
        for(let casilla of fila){
            casilla.botonHtml = listaBotones [i]
            casilla.setNumHTML()
            casilla.setEventListener();
            i++;
        }
    }
    elVerdaderoCamp[y][x].abrirCasilla()
}
//seleccionar dif
// estructura basica html
// estilo
// desarrollo final

const crearBotonRePlay = () => {
    const botonRePlay = document.createElement("button")
    const nodoBotonRePlay = document.createTextNode("Jugar de nuevo")

    botonRePlay.appendChild(nodoBotonRePlay);

    botonRePlay.classList.add("boton-re-jugar")

    document.body.appendChild(botonRePlay);
    botonRePlay.addEventListener("click", reiniciarJuego)
}

const reiniciarJuego = () => {
    if (document.querySelector(".boton-re-jugar") != undefined) {
        document.querySelector(".boton-re-jugar").removeEventListener("click", reiniciarJuego)
        document.body.removeChild(document.querySelector(".boton-re-jugar"))
    console.log("limpiando");
    }
    

    i = 0
    cc = 0
    Primera = true
    camp = [];
    ContenedorDeCampos = [];
    ContenedorDeIndicesDeCampos = [];
    boxMineds = [];
    elVerdaderoCamp = [];

    limpiar()
    preparacionDeCampos(document.getElementById("dificultad").value);
}

preparacionDeCampos(document.getElementById("dificultad").value);

document.getElementById("dificultad").addEventListener("change", () => {
    reiniciarJuego();
})
