# Neighbourhood Map Project 

Descrição do projeto
--------------
Este projeto tem como objetivo buscar 15 estabelecimentos no raio de 1km de uma localização pré-definida ou baseada na localização do usuário, sendo possível filtrar por categoria e ver informações básicas sobre os locais. A app foi desenvolvido com o framework MVVM KnockoutJs, e utilizou as API's do Google Maps e Foursquare para usar as funcionalidades do mapa e buscar conteúdo sobre os estabelecimentos pesquisados.

## Instruções para rodar o projeto

1. Clone ou baixe o projeto para o seu computador;
2. Instale os pacotes de dependência do projeto, navegando até a pasta e executando o npm com os seguintes comandos:

  ````
  $> cd /path/to/Neighbourhood-Map-Project
  $> npm install
  $> npm install -g grunt-cli
  
  ````

3. Depois de instalar os pacotes, execute o grunt para gerar a pasta "dist", onde estará o código otimizado e com os caminhos corretos para o projeto funcionar corretamente.

  ``
  $> grunt
  ``

4. Depois de concluídas as etapas 1, 2 e 3, abra o arquivo **index.html** e ache locais legais no seu bairro S2.


## Instruções para navegar pelo app

1. Abra o [projeto](https://alinealvesvianna.github.io/Neighbourhood-Map-Project/) no seu desktop ou mobile.

2. O navegador vai solicitar a sua autorização para pegar sua geolocalização:
  * Caso seja autorizado, o app buscará 15 locais em um raio de 1km do local onde você está.
  * Caso não seja autorizado, o app buscará  os 15 locais a partir de um endereço default, definido na Tijuca, bairro localizado no Rio de Janeiro.

3. É possível digitar mudar o local procurado na caixa de busca. O endereço será auto completado à medida em que o endereço for digitado.

4. O app possui um filtro que exibe mais informações de cada estabelecimento localizado. Para abrir, basta clicar na aba "ver filtro". E para fechar, basta clicar na aba "esconder filtro"

5. É possível filtrar os resultados por categoria. Basta abrir o filtro na aba "ver filtro", e clicar na categoria desejada, logo no topo do filtro. Após clicar, serão exibidos apenas estabelecimentos daquela categoria no filtro e no mapa.

6. Ao clicar no título de cada estabelecimento listado no filtro, o mapa será centraliza no seu pin, e exibirá uma janela com as suas informações.
