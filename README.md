<div align="center">

<img src="https://i.imgur.com/AyLDjQi.png" alt="VALORANT logo" width="150px" />

# VLR eSports API

**vlresports-api** é uma **API não oficial** para acessar dados do site _VLR.gg_, uma plataforma popular para notícias, estatísticas e resultados relacionados ao cenário competitivo de VALORANT. Esta API permite que desenvolvedores acessem informações sobre partidas, jogadores, equipes e muito mais, facilitando a integração desses dados em projetos pessoais e aplicativos.

![Static Badge](https://img.shields.io/badge/license-MIT-green)
![Static Badge](https://img.shields.io/badge/version-v1-red)

[Instalação](#instalação) •
[Endpoints](#endpoints) •
[Contribuição](#contribuição) •
[Aviso de Isenção de Responsabilidade](#aviso-de-isenção-de-responsabilidade)
[Licença](#licença)

</div>

## Instalação

Para utilizar a API em seu projeto, siga os passos abaixo:

### Clone o repositório

```
git clone https://github.com/jjr-dev/vlresports-api.git
```

### Instale as dependências

```
cd vlresports-api
npm install
```

### Executando o projeto

```
npm start
```

## Endpoints

Toda chamada deve conter o prefixo `/api/v1`.

Os filtros devem ser enviados por **Query Param**.

### Partidas

-   **GET** `/matches`: Lista todas as partidas não concluídas disponíveis.

    -   Filtros:
        -   page (`?page=1`)

-   **GET** `/matches/results`: Lista todas as partidas concluídas disponíveis.
    -   Filtros:
        -   page (`?page=1`)

### Eventos

-   **GET** `/events/:id/matches`: Lista todas as partidas de um evento.
    -   Filtros:
        -   status (`?status[]=completed`) [ ongoing | live | completed ]

## Contribuição

Contribuições são bem-vindas! Se você deseja contribuir para este projeto, por favor, siga as etapas abaixo:

1. Faça um fork do projeto
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`)
4. Envie para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

## Aviso de Isenção de Responsabilidade

Este projeto é uma API não oficial e não é de forma alguma afiliado, patrocinado, endossado ou associado à Riot Games, Inc. "League of Legends", "Valorant", "Teamfight Tactics" e todas as marcas relacionadas são marcas registradas da Riot Games, Inc.

Este projeto foi desenvolvido por fãs com o objetivo de fornecer funcionalidades adicionais e não visa violar os direitos de propriedade intelectual ou de marca registrada da Riot Games. O uso desta API é de responsabilidade do usuário e deve respeitar os Termos de Serviço da Riot Games.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
