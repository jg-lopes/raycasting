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
        this.angle = atan2(y_coord - this.y, x_coord - this.x);
        this.ray_endX = this.x + cos(this.angle) * max_size;
        this.ray_endY = this.y + sin(this.angle) * max_size;

        this.state = "DONE";
        
        this.finishConstruction();
    }


    drawRayConstruction(){
        
        switch (this.state) {
            case "POSITION":
                circle(mouseX, mouseY, 10);

                break;
            case "DIRECTION":
                circle(this.x, this.y, 10);
                
                var temp_angle = atan2(mouseY - this.y, mouseX - this.x);
                var temp_endX = this.x + cos(temp_angle) * max_size;
                var temp_endY = this.y + sin(temp_angle) * max_size;
                
                line(this.x, this.y, temp_endX, temp_endY);
                
                break;
        }
    }

    drawRay() {
        circle(this.x, this.y, 10);
        line(this.x, this.y, this.ray_endX, this.ray_endY);
    }

    finishConstruction() {

        rayList.push(rayInConstruction);
        rayInConstruction = new Ray();  

    }

}

class Polygon {

    constructor() {
        this.vertex_list = [];
    }

    addVertex(x_coord, y_coord) {
        this.vertex_list.push([x_coord, y_coord]);
    }

    drawPolygon() {
        beginShape();
        for (var v = 0; v < this.vertex_list.length; v++){
            vertex(this.vertex_list[v][0], this.vertex_list[v][1]);
        }
        endShape(CLOSE); 
    }



    // Métodos chamados apenas durante a construção do polígono

    drawPolygonConstruction() {
        beginShape();
        for (var v = 0; v < this.vertex_list.length; v++){
            vertex(this.vertex_list[v][0], this.vertex_list[v][1]);
        }
        vertex(mouseX, mouseY);
        endShape(CLOSE);    
    }

    finishConstruction() {

        polygonList.push(polygonInConstruction);
        polygonInConstruction = new Polygon();  

    }

}

// Define o estado do programa
// Lista de estados:
// DEFAULT = estado padrão, nada está sendo construído
// CREATING_SHAPE = usuário está no processo de criar uma forma
// CREATING_RAY = usuário está no processo de criar um raio
// EDIT = usuário está no processo de edição 
let state = "DEFAULT"

// Armazena todas as formas anteriormente desenhadas pelo usuário
// Cada índice representa uma shapeVertexList
let polygonList = [];

// Armazena todas os raios anteriormente desenhados pelo usuário
// Cada índice representa um objeto Ray
let rayList = [];

// Armazenam objetos que estão temporáriamente em construção
let rayInConstruction = new Ray();
let polygonInConstruction = new Polygon();

function setup() {
    createCanvas(640, 480); 
    background(200); 

    max_size = max(width, height);
}

function draw() {
    
    background(200);     

    let c = color(0, 50);
    fill(c);
    
    drawFinishedPolygons();
    drawFinishedRays(); 

    switch (state) {
        case "DEFAULT":
            break;

        case "CREATING_SHAPE":
            polygonInConstruction.drawPolygonConstruction();
            break;

        case "CREATING_RAY":
            rayInConstruction.drawRayConstruction();
            break;
            
        case "EDIT":
            break; 
    }

    debug();
}

function drawFinishedPolygons() {
    for (var i = 0; i < polygonList.length; i++) {
        polygonList[i].drawPolygon();
    }
}

function drawFinishedRays(){
    for (var r = 0; r < rayList.length; r++) {
        rayList[r].drawRay();
    }
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
            polygonInConstruction.addVertex(mouseX, mouseY);
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
            // Chama o método que finaliza a construção do polígono
            polygonInConstruction.finishConstruction();
            break;
        case "CREATING_RAY":
            break;
        case "EDIT":
            break; 
    }
    
}

function debug() {
    document.getElementById("state").innerHTML = state;
}
