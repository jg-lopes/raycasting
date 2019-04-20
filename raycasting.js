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

        // Angulo do raio em relação à horizontal
        this.angle = atan2(y_coord - this.y, x_coord - this.x);

        // Pontos "finais" do raio, necessários para o desenho
        // Multiplicados por 5 * max_size (maior dimensão da tela) para dar a ilusão que o raio é infinito
        this.ray_endX = this.x + cos(this.angle) * max_size * 5;
        this.ray_endY = this.y + sin(this.angle) * max_size * 5;

        this.state = "DONE";
        
        this.finishConstruction();
    }

    // Desenha o raio já construído no display
    drawRay() {
        circle(this.x, this.y, 10);
        line(this.x, this.y, this.ray_endX, this.ray_endY);
    }


    // Retorna a linha da origem do raio até o ponto de fim do raio (fora da tela)
    getRayLine() {
        return [[this.x, this.y], [this.ray_endX, this.ray_endY]];
    }



    // As funções abaixo só serão utilizadas durante a construção do raio

    // Estabelece o desenho do raío ainda em construção
    drawRayConstruction(){
        switch (this.state) {
            case "POSITION":
                circle(mouseX, mouseY, 10);

                break;
            case "DIRECTION":
                circle(this.x, this.y, 10);
                
                var temp_angle = atan2(mouseY - this.y, mouseX - this.x);
                var temp_endX = this.x + cos(temp_angle) * max_size * 5;
                var temp_endY = this.y + sin(temp_angle) * max_size * 5;
                
                line(this.x, this.y, temp_endX, temp_endY);
                
                break;
        }
    }

    // Termina a construção do raio
    finishConstruction() {
        rayList.push(rayInConstruction);
        rayInConstruction = new Ray();  
    }
}

// Define a classe que encapsulará o polígono
class Polygon {

    constructor() {
        // Lista que armazena todos os vértices
        this.vertex_list = [];

        // Determina a contagem de vértices e lados (arestas)
        this.vertex_count = 1;
        this.side_count = 0;
    }

    // Método responsável pelo desenho do polígono concluído na tela
    drawPolygon() {
        beginShape();
        for (var v = 0; v < this.vertex_list.length; v++){
            vertex(this.vertex_list[v][0], this.vertex_list[v][1]);
        }
        endShape(CLOSE); 
    }

    // Retorna um dos lados do polígono
    // Lado 0 -> vértices 0 e 1
    // Lado 1 -> vértices 1 e 2 
    // ...
    // Lado n -> vértices n e 0
    getSide(side_number) {
        let vertex1;
        let vertex2;
        
        if (side_number < this.side_count-1) {
            vertex1 = this.vertex_list[side_number];
            vertex2 = this.vertex_list[side_number+1];
        } else {
            vertex1 = this.vertex_list[side_number];
            vertex2 = this.vertex_list[0];
        }

        return [vertex1, vertex2];
    }



    // Métodos chamados apenas durante a construção do polígono
    
    // Adiciona um novo vértice ao polígono
    addVertex(x_coord, y_coord) {
        this.vertex_list.push([x_coord, y_coord]);
        this.vertex_count++;
        this.side_count++;
    }

    // Desenha o polígono ainda em construção
    drawPolygonConstruction() {
        beginShape();
        for (var v = 0; v < this.vertex_list.length; v++){
            vertex(this.vertex_list[v][0], this.vertex_list[v][1]);
        }
        vertex(mouseX, mouseY);
        endShape(CLOSE);    
    }

    // Conclui a construção do polígono
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
    
    raycasting();
    
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

function raycasting() {
    for (p = 0; p < polygonList.length; p++){
        console.log(p);
        for (s = 0; s < polygonList[p].side_count; s++) {
            for (r = 0; r < rayList.length; r++){
                let rayLine = rayList[r].getRayLine()
                let sideLine = polygonList[p].getSide(s);

                lineIntersection(rayLine[0], rayLine[1], sideLine[0], sideLine[1]);
            }
        }
    }
}

function debug() {
    document.getElementById("state").innerHTML = state;
}
