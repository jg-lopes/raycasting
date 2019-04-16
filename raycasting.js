// Define a classe que encapsulará o raio
class Ray {
    
    // Define o estado da construção do raio
    constructor() {
        // POSITION = processo de definir posição
        // DIRECTION = processo de definir direção
        // DONE = raio já construído
        this.state = "POSITION";
    }

    // Insere a origem do raio (APENAS CHAMADA DURANTE POSITION)
    // Recebe as coordenadas de origem
    addOrigin(x_coord, y_coord) {
        this.x = x_coord;
        this.y = y_coord;
        this.state = "DIRECTION";
    }

    // Insere a direção do raio (APENAS CHAMADA DURANTE DIRECTION)
    // Recebe as coordenadas 
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

    line(50,50, 100, 100);
    line(50,100, 100, 50);

    lineIntersection([50,50], [100,100], [50,100], [100,50]);
    
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

function lineIntersection(l1_start, l1_end, l2_start, l2_end) {
    // Fonte para a teoria matemática por trás da função: http://paulbourke.net/geometry/pointlineplane/

    x1 = l1_start[0];
    x2 = l1_end[0];
    x3 = l2_start[0];
    x4 = l2_end[0];

    y1 = l1_start[1];
    y2 = l1_end[1];
    y3 = l2_start[1];
    y4 = l2_end[1];

    ua_numerator = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    ua_denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    ub_numerator = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
    ub_denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

    ua = ua_numerator / ua_denominator;
    ub = ub_numerator / ub_denominator;

    // Das anotações
    // The equations apply to lines, if the intersection of line segments is required then it is only necessary to test if ua and ub lie between 0 and 1. 
    // Whichever one lies within that range then the corresponding line segment contains the intersection point. If both lie within the range of 0 to 1 then the intersection point is within both line segments.

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        circleX = x1 + (ua * (x2 - x1));
        circleY = y1 + (ua * (y2 - y1));
    
        circle(circleX,circleY, 20);
    }
}

function debug() {
    document.getElementById("state").innerHTML = state;
}
