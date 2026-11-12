let estadoPokedex = {
    digitando: false,
}
let numPokemon = '';
let pokemonAtualId = 0;
const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10');
const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');
const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const numberDisplay = document.querySelector('#number-display');
const btnAdicionarDez = document.querySelector ('#btn-up');
const btnDiminuirDez = document.querySelector ('#btn-down');
const btnGrito = document.querySelector ('#btn-round');
const btnDiminuir= document.querySelector ('#btn-left');
const btnAdicionar = document.querySelector ('#btn-right');

key1.addEventListener('click', () => leituraTeclado('1'));
key2.addEventListener('click', () => leituraTeclado('2'));
key3.addEventListener('click', () => leituraTeclado('3'));
key4.addEventListener('click', () => leituraTeclado('4'));
key5.addEventListener('click', () => leituraTeclado('5'));
key6.addEventListener('click', () => leituraTeclado('6'));
key7.addEventListener('click', () => leituraTeclado('7'));
key8.addEventListener('click', () => leituraTeclado('8'));
key9.addEventListener('click', () => leituraTeclado('9'));
key10.addEventListener('click', () => leituraTeclado('0'));
btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);
btnAdicionarDez.addEventListener('click', adicionarDezBotao);
btnDiminuirDez.addEventListener('click', diminuirDezBotao);
btnAdicionar.addEventListener('click', adicionarBotao);
btnDiminuir.addEventListener('click', diminuirBotao);
btnGrito.addEventListener('click', gritarPokemon);

function leituraTeclado(tecla)
{
    if(!estadoPokedex.digitando)
    {
        infoScreen.textContent = '';
        estadoPokedex.digitando = true;
    }
    numPokemon += tecla;
    infoScreen.textContent = numPokemon;
}
function apagar()
{
    if(estadoPokedex.digitando)
    {
        numPokemon = numPokemon.slice(0, -1);
        if(numPokemon.length < 1)
        {
            estadoPokedex.digitando = false;
            infoScreen.textContent = 'Aguardando dados…';
        }
        else
        {
            infoScreen.textContent = numPokemon;
        }
    }
}
async function consultarApi(msg)
{
    try
    {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${msg}`);
        
        if (response.status === 404)
        {
            throw new Error('pokemon não encontrado');
        }
        if (!response.ok)
        {
            throw new Error('api falhou');
        }
        
        const data = await response.json();

        const urlImage = data.sprites.front_default;
        pokemonAtualId = data.id;
        atualizarNum (data.id);
        exibirDados(data);
        exibirSprite(urlImage);
        
    }
    catch(erro)
    {
        console.error('Erro ao consultar Pokémon:', erro);
        mainScreen.textContent = erro.message === 'pokemon não encontrado'
            ? 'Pokémon não encontrado.'
            : 'Não foi possível carregar o Pokémon. Verifique a conexão e tente novamente.';
    }
    finally
    {
        numPokemon = '';
        estadoPokedex.digitando = false;
    }
}
function buscarPokemon()
{
    if(estadoPokedex.digitando) consultarApi(numPokemon);
}

function exibirSprite(urlImage)
{
    mainScreen.textContent = '';
    const img = document.createElement('img');
    img.src = urlImage;
    if (window.innerWidth < 600) //mobile
    {
        img.style.width = '70px';
    }
    else //desktop
    {
        img.style.width = '190px';
        img.style.transform = 'translate(0, -25px)';
    }
    mainScreen.appendChild(img);
}

function atualizarNum (id)
{
    let idString = '' + id;
    while(idString.length < 4) idString = '0' + idString;
    idString = '#' + idString;
    numberDisplay.textContent = idString;
}

function exibirDados(data)
{
    infoScreen.textContent = ' ';
    const nome = document.createElement('p');
    nome.textContent = capitalizar(data.name);
    nome.style.fontSize = '1.5rem';
    nome.style.fontWeight = 'bold';

    const tipo = document.createElement('p');
    tipo.textContent = 'Tipo: ' + capitalizar(data.types[0].type.name);

    const pesoAltura = document.createElement('p');
    pesoAltura.textContent = 'Peso: ' + (data.weight / 2.205).toFixed(2) + 'kg'; 
    pesoAltura.textContent += '| Altura: ' + (data.height / 39.07).toFixed(2) + 'm';

    const regiao = document.createElement('p');
    regiao.textContent = 'Região: ' + capitalizar(obterRegiao(data.id));

    infoScreen.append(nome, tipo, pesoAltura, regiao);
}

function obterRegiao(id)
{
    if (id <= 151) return 'Kanto';
    if (id <= 251) return 'Johto';
    if (id <= 386) return 'Hoenn';
    if (id <= 493) return 'Sinnoh';
    if (id <= 649) return 'Unova';
    if (id <= 721) return 'Kalos';
    if (id <= 809) return 'Alola';
    if (id <= 905) return 'Galar';
    if (id <= 1025) return 'Paldea';
    return 'Desconhecida';
}

function capitalizar(str)
{
    const strCapitalizar = str.charAt(0).toUpperCase() + str.slice(1);
    return strCapitalizar;
}
function adicionarDezBotao ()
{
    if (pokemonAtualId > 0)
    {
        consultarApi(pokemonAtualId + 10);
    }
}
function diminuirDezBotao ()
{
    if (pokemonAtualId > 1)
    {
        consultarApi(pokemonAtualId - 10);
    }
}

function adicionarBotao ()
{
    if (pokemonAtualId > 0)
    {
        consultarApi(pokemonAtualId + 1);
    }
}
function diminuirBotao ()
{
    if (pokemonAtualId > 1)
    {
        consultarApi(pokemonAtualId - 1);
    }
}

function gritarPokemon ()
{
    if (pokemonAtualId === 0) return;

    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemonAtualId}.ogg`);
    audio.play();
}
