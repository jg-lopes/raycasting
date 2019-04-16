// Define o estado do programa
// Lista de estados:
// DEFAULT = estado padrão, nada está sendo construído
// CREATING_SHAPE = usuário está no processo de criar uma forma
// CREATING_RAY = usuário está no processo de criar um raio
// EDIT = usuário está no processo de edição 
let state = "DEFAULT"

class Ray {

    constructor() {
        // Define o estado da construção do raio
        // POSITION = processo de definir posição
        // DIRECTION = processo de definir direção
        // DONE = raio já construído
        this.state = "POSITION";
    }

    addOrigin(x_coord, y_coord) {
        this.x = x_coord;
        this.y = y_coord;
        this.state = "DIRECTION";
    }

    addRay(x_coord, y_coord) {
        this.angle = atan2(x_coord - rayInConstruction.y, y_coord - rayInConstruction.x);
        this.ray_endX = rayInConstruction.x + cos(angle) * max_size;
        this.ray_endY = rayInConstruction.y + sin(angle) * max_size;

        this.state = "DONE";

        rayList.push(rayInConstruction);
        rayInConstruction = new Ray();    
    }

    drawRay(){
        circle(this.x, this.y, 10);
        line(this.x, this.y, this.ray_endX, this.ray_endY);
    }
}

// Armazena todas as formas anteriormente desenhadas pelo usuário
// Cada índice representa uma shapeVertexList
let shapeList = [];

// Armazena todas os raios anteriormente desenhados pelo usuário
// Cada índice representa um objeto Ray
let rayList = [];

// Lista representando os pontos da forma sendo desenhada atualmente
// Entradas alternas entre valores x e y de um vértice, logo um vértice ocupa 2 entradas
// Vazia se uma forma não está sendo desenhada
let shapeVertexList = [];

let rayInConstruction = new Ray();

function setup() {
    createCanvas(640, 480); 
    background(200); 

    max_size = max(width, height);
}

function draw() {
    
    background(200);     

    let c = color(0, 50);
    fill(c);
    
    drawFinishedShapes();
    drawFinishedRays(); 

    switch (state) {
        case "DEFAULT":
            break;
        case "CREATING_SHAPE":
            drawShapeCreation();
            break;
        case "CREATING_RAY":
            
            switch (rayInConstruction.state) {
                case "POSITION":
                    circle(mouseX, mouseY, 10);
                    break;
                case "DIRECTION":
                    circle(rayInConstruction.x, rayInConstruction.y, 10);
                    angle = atan2(mouseY - rayInConstruction.y, mouseX - rayInConstruction.x);
                    line_endX = rayInConstruction.x + cos(angle) * max_size;
                    line_endY = rayInConstruction.y + sin(angle) * max_size;
                    line(rayInConstruction.x, rayInConstruction.y, line_endX, line_endY);
                    break;
                case "DONE":
                    break;    
            }
        case "EDIT":
            break; 
    }

    debug();
}

// Representa na tela as formas que já foram desenhadas pelo usuário
function drawFinishedShapes() {
    for (var i = 0; i < shapeList.length; i += 1){
        beginShape();
        for (var v = 0; v < shapeList[i].length; v += 2){
            vertex(shapeList[i][v], shapeList[i][v+1]);
        }
        endShape(CLOSE);
    }
}

function drawFinishedRays(){
    for (var r = 0; r < rayList.length; r++) {
        rayList[r].drawRay();
    }
}

// Representa a forma que está atualmente sendo desenhada pelo usuário
function drawShapeCreation(){
    beginShape();
    for (var v = 0; v < shapeVertexList.length; v += 2){
        vertex(shapeVertexList[v], shapeVertexList[v+1]);
    }
    vertex(mouseX, mouseY);
    endShape(CLOSE);
}


function debug() {
    document.getElementById("state").innerHTML = state;
}

function keyPressed() {
    console.log(key);
    switch (key) {
        case 'a':
            state = "DEFAULT";
            break;
        case 's':
            state = "CREATING_SHAPE";
            break;
        case 'd':
            state = "CREATING_RAY";
            break;
        case 'f':
            state = "EDIT";
            break;
    }
}

function mousePressed() {
    
    switch (state) {
        case "DEFAULT":
            break;
        case "CREATING_SHAPE":
            // Indica que o usuário quer desenhar uma figura e armazena o ponto atual do cursor como vértice a se desenhar
            shapeVertexList.push(mouseX, mouseY);
            break;
        case "CREATING_RAY":

            switch (rayInConstruction.state) {
                case "POSITION":
                    rayInConstruction.addOrigin(mouseX, mouseY);
                    break;
                case "DIRECTION":
                    rayInConstruction.addRay(mouseX, mouseY);
                    break;
            }

        case "EDIT":
            break; 
    }
    
}

function doubleClicked() {
    
    switch (state) {
        case "DEFAULT":
            break;
        case "CREATING_SHAPE":
            // Salva a forma dentro de lista de formas, removendo o último vértice pois ele representa o segundo click do double-click
            shapeList.push(shapeVertexList.slice(0, -2));

            // Termina o desenho da forma, apagando a memória e redefinindo o estado
            shapeVertexList = [];
            state = "DEFAULT";
            break;
        case "CREATING_RAY":
            break;
        case "EDIT":
            break; 
    }
    
}