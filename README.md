# Raycasting

Este projeto representa um trabalho de Raycasting para a disciplina de Computação Gráfica (EEL882) ministrada pelo Prof. Cláudio Esperança. O trabalho visa estudar e implementar um ambiente interativo para demonstração do uso da técnica de raycasting. 

O projeto foi feito em Javascript com o auxílio da biblioteca p5. O arquivo p5.js se refere a biblioteca e não é de minha autoria e apenas foi incluído no repositório para facilidade de instalação (mais informações no site do p5 - https://p5js.org/)

## Instalação

Para instalar o software, basta apenas clonar o repositório e abrir a página "index.html" em um navegador com compatibilidade para o uso da biblioteca p5.

O projeto foi programado e testado no navegador Chrome (versão 70.0.3538.77)

## Funcionalidades básicas

O projeto funciona a partir do uso de um dos 4 modos de edição:

Modo Padrão -> Cursor não possui interatividade com a tela
Modo de criação de formas -> Clique na tela para introduzir um ponto que será uma extremidade de um polígono. Repita quantas vezes desejado. Clique duplo para concluir o polígono.
Modo de criação de raios -> Clique na tela para posicionar a origem desejada do raio. Segure e arraste para definir o raio desejado.
Modo de edição -> Clique e arraste em um dos pontos vermelhos que surgirão na tela para modificar a posição daquele ponto. Podem ser editadas as localizações dos vértices dos polígonos e a origem e o ângulo dos raios.