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
        fill(color("#5B483A"));
        circle(this.x, this.y, 20);

        stroke(0);
        line(this.x + 10 * cos(this.angle), this.y + 10 * sin(this.angle), this.ray_endX, this.ray_endY);


        strokeWeight(5);
        strokeCap(SQUARE);
        //fill(color("#5B483A"));

        push();

        stroke("#5B483A");
        translate(this.x, this.y);
        rotate(this.angle);
        
        triangle(40, 0, 32, 5, 32, -5);
        
        strokeWeight(5);
        line(10, 0, 30, 0);

        pop();
        //line(this.x + 12 * cos(this.angle), this.y + 12 * sin(this.angle), this.x + 30 * cos(this.angle), this.y + 30 * sin(this.angle));
        
        
        strokeWeight(1);
        stroke(0);
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
                circle(mouseX, mouseY, 20);

                break;
            case "DIRECTION":
                circle(this.x, this.y, 20);
                
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

    angleMode(DEGREES);

    max_size = max(width, height);
}

function draw() {
    
    background("#E7DFB9");     

    // Parâmetros do desenho de polígonos
    let p_fill = color("#D68649");
    p_fill.setAlpha(200);

    fill(p_fill);
    drawFinishedPolygons();
    
    // Parâmetros do desenho dos raios
    let r_fill = color("#343127");
    
    fill(r_fill);
    drawFinishedRays(); 

    // Parâmetros da interseção do raycasting
    let cast_fill = color("#D68649");
    
    fill(cast_fill);
    raycasting();
    

    switch (state) {
        case "DEFAULT":
            break;

        case "CREATING_SHAPE":

            // Parâmetros do desenho de polígonos
            fill(p_fill);
            polygonInConstruction.drawPolygonConstruction();
            break;

        case "CREATING_RAY":
            // Parâmetros da interseção do raycasting
            fill(r_fill);
            rayInConstruction.drawRayConstruction();
            break;
            
        case "EDIT":
            break; 
    }

    debug();
}



// Itera pela lista de polígonos concluídos e desenha eles
function drawFinishedPolygons() {
    for (var i = 0; i < polygonList.length; i++) {
        polygonList[i].drawPolygon();
    }
}

// Itera pela lista de polígonos concluídos e desenha eles
function drawFinishedRays(){
    for (var r = 0; r < rayList.length; r++) {
        rayList[r].drawRay();
    }
}


// Responsável pela orquestração da mudança de estado do programa
function keyPressed() {
    switch (key) {
        case 'a':
            state = "DEFAULT";

            rayInConstruction = new Ray();
            polygonInConstruction = new Polygon();
            break;
        case 's':
            state = "CREATING_SHAPE";

            rayInConstruction = new Ray();
            polygonInConstruction = new Polygon();
            break;
        case 'd':
            state = "CREATING_RAY";

            rayInConstruction = new Ray();
            polygonInConstruction = new Polygon();
            break;
        case 'f':
            state = "EDIT";

            rayInConstruction = new Ray();
            polygonInConstruction = new Polygon();
            break;
    }
}


// Orquestra as ações de clique no mouse
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
                    // Marca a origem como a origem desejada
                    rayInConstruction.addOrigin(mouseX, mouseY);
                    break;
                case "DIRECTION":
                    // Marca a direção como a direção desejada
                    rayInConstruction.addRay(mouseX, mouseY);
                    break;
            }

        case "EDIT":
            break; 
    }
    
}

// Orquestra as ações de clique duplo
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

// Código responsável pela indicação das interseções entre linhas existentes
function lineIntersection(l1_start, l1_end, l2_start, l2_end) {
    // Fonte para a teoria matemática por trás da função: http://paulbourke.net/geometry/pointlineplane/

    intersectionList = [];

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
        intersectionX = x1 + (ua * (x2 - x1));
        intersectionY = y1 + (ua * (y2 - y1));

        // Retorna ua para poder encontrar quais são os pontos mais próximos do raio
        return [intersectionX, intersectionY, ua];
    }

}

// Procura por todos elementos gerados (raios e polígonos) por interseções
// Os armazena em uma estrutura hierárquica chamada rayIntersectionList
function intersectionSearch () {
    
    // Dados armazenados em estrutura hierárquica
    // rayIntersectionList tem índice representando um raio, seguindo a ordem de rayList
    // Cada raio possui uma lista de polígonos, contendo informações sobre todos os polígonos criados (presentes na PolygonList)
    // Cada polígono possui informações sobre as interseções contidas entre o raio e o polígono
    // Cada interseção possui o ponto x e y onde ocorre a interseção

    let rayIntersectionList = [];
    let polygonIntersectionList = [];
    let sideIntersectionList = [];

    let rayLine, sideLine, intersectionResult;

    // Primeira parte da função de raycasting, responsável por procurar interseções
    // Procura interseções em todo espaço gerado e as organiza na intersectionList
    for (r = 0; r < rayList.length; r++){
        
        // Pega posição em x, y da origem do raio e do seu "fim"
        rayLine = rayList[r].getRayLine();

        polygonIntersectionList = []; 

        for (p = 0; p < polygonList.length; p++){

            sideIntersectionList = [];
            
            for (s = 0; s < polygonList[p].side_count; s++) {
                // Pega semireta que descreve o lado
                sideLine = polygonList[p].getSide(s);

                // Calcula a interseção e retorna sua posição
                // Retorna undefined se não existir
                intersectionResult = lineIntersection(rayLine[0], rayLine[1], sideLine[0], sideLine[1]);
                
                // Remove casos onde não há interseção
                if (intersectionResult != undefined) {
                    sideIntersectionList.push(intersectionResult);
                }
            }

            polygonIntersectionList.push(sideIntersectionList);
        }

        rayIntersectionList.push(polygonIntersectionList);
    }

    return rayIntersectionList;
}

// Desenha na tela as interseções encontradas, seguindo regras de cor para entrada e saída
function intersectionDraw(rayIntersectionList) {

    entryColor = color(0);
    exitColor = color(255);

    for (r = 0; r < rayIntersectionList.length; r++) {
        
        rayPoint = [rayList[r].x, rayList[r].y];
        
        for (p = 0; p < rayIntersectionList[r].length; p++) {
            
            // Para implementar as cores de entrada e saída, precisamos saber em qual ordem o raio faz interseção com o polígono
            // Para isso, usamos a distância ua do cálculo da interseção de semiretas
            // Ua representa em que lugar do segmento de reta foi encontrada a interseção 
            // Ua próximo de zero -> interseção perto da origem do segmento de reta (origem do raio)
            // Usamos isso para criar uma função de sortByDistance que organiza a lista baseada nessa informação

            if (rayIntersectionList[r][p] != undefined) {
                
                rayIntersectionsInPolygon = rayIntersectionList[r][p];

                rayIntersectionsInPolygon = sortByDistance(rayIntersectionsInPolygon);
                
                for (i = 0; i < rayIntersectionsInPolygon.length; i++) {
                   
                    // Intercala as cores
                    if (i % 2 == 0) {
                        fill(entryColor);
                    } else {
                        fill(exitColor);
                    }

                    circle(rayIntersectionsInPolygon[i][0], rayIntersectionsInPolygon[i][1], 10);
                }
                
            }
        }

    }
}

// Itera sobre todos os lados de todos os polígonos, e calcula a possível interseção destes com os raios existentes
// Desenha na tela os círculos de interseção
function raycasting() {

    foundIntersections = intersectionSearch();

    intersectionDraw(foundIntersections);
}

// Organiza os pontos da lista 
function sortByDistance (list) {
    list.sort (function (intersection1, intersection2) {
        if (intersection1[2] > intersection2[2]) return 1;
        if (intersection1[2] < intersection2[2]) return -1;
    });

    return list;
}



// Retorna e escreve o estado do programa no HTML da página
function debug() {
    document.getElementById("state").innerHTML = state;
}
