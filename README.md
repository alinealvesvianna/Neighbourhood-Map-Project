## Website Performance Optimization portfolio project

### Instruções

1. Abra o [projeto](https://alinealvesvianna.github.io/Neighbourhood-Map-Project/) no seu desktop ou mobile.

2. O navegador vai solicitar a sua autorização para pegar sua geolocalização:

  * Caso seja autorizado, o app buscará 15 locais em um raio de 1km do local onde você está.
  * Caso não seja autorizado, o app buscará  os 15 locais a partir de um endereço default, definido no bairro da Tijuca, no Rio de Janeiro.

3. É possível digitar o local que deseja procurar na caixa de busca. O endereço será auto completado à medida em que o endereço é digitado.

4. O app possui um filtro onde exibe mais informações de cada local achado. Para abrir, basta clicar na aba "ver filtro".

5. É possível filtrar os resultados por categoria. Basta abrir o filtro na aba "ver filtro", e clicar na categoria desejada, logo no topo do filtro. Ao clicar na categoria desejada, será exibido apenas estabelecimentos daquela categoria, assim como os pins exibidos no mapa.

```
$> cd /path/to/frontend-nanodegree-mobile-portfolio
$> npm install
```

* Depois de instalar os pacotes, execute o grunt para gerar a pasta "dist",
onde estará o código otimizado e com os caminhos corretos para o projeto funcionar corretamente.

  ``
  $> grunt
  ``

* Depois de concluídas as etapas 1 e 2, abra o browser e acesse o projeto pela pasta relativa a dist.

  * caminhoDoProjeto/dist/index.html
  * caminhoDoProjeto/dist/views/pizza.html
