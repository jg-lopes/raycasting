// Determina se o sistema está em modo de criação de polígono
let creatingShape = false;

// Define o estado do programa
// Lista de estados:
// DEFAULT = estado padrão, nada está sendo construído
// CREATING_SHAPE = usuário está no processo de criar uma forma
// CREATING_RAY = usuário está no processo de criar um raio
// EDIT = usuário está no processo de edição 
let state = "DEFAULT"

// switch (state) {
//     case "DEFAULT":
//         break;
//     case "CREATING_SHAPE":
//         break;
//     case "CREATING_RAY":
//         break;
//     case "EDIT":
//         break; 
// }

// Armazena todas as formas anteriormente desenhadas pelo usuário
// Cada índice representa uma shapeVertexList
let shapeList = [];

// Lista representando os pontos da forma sendo desenhada atualmente
// Entradas alternas entre valores x e y de um vértice, logo um vértice ocupa 2 entradas
// Vazia se uma forma não está sendo desenhada
let shapeVertexList = [];

function setup() {
    createCanvas(640, 480); 
    background(200); 
}

function draw() {
    
    background(200);     

    let c = color(0, 50);
    fill(c);
    
    drawFinishedShapes();

    switch (state) {
        case "DEFAULT":
            break;
        case "CREATING_SHAPE":
            drawShapeCreation();
            break;
        case "CREATING_RAY":
            break;
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

function mousePressed() {
    
    switch (state) {
        case "DEFAULT":
            state = "CREATING_SHAPE";
            // Indica que o usuário quer desenhar uma figura e armazena o ponto atual do cursor como vértice a se desenhar
            shapeVertexList.push(mouseX, mouseY);
            break;
        case "CREATING_SHAPE":
            // Indica que o usuário quer desenhar uma figura e armazena o ponto atual do cursor como vértice a se desenhar
            shapeVertexList.push(mouseX, mouseY);
            break;
        case "CREATING_RAY":
            break;
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