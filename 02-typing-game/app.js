// '$' para identificar los elementos del DOM
const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

const TEXT = 'the quick brown fox jumps over the lazy dog and you is trying to clone monkey type for fun and profit using vanilla js for the typing test speed';

let words = [];
let currentTime = INITIAL_TIME;

//Llamamos las funciones
initGame();
initEvents();

function initGame() {
    // Iniciamos el estado, separamos el texto por espacios
    words = TEXT.split(' ').slice(0, 32);
    // Reiniciamos el tiempo del juego
    currentTime = INITIAL_TIME;

    $time.textContent = currentTime;
    $paragraph.innerHTML = words.map((word, index) => {
        // De cada palabra vamos a sacar las letras
        const letters = word.split('');
        // Creamos una etiqueta <x-word> (creamos un custom element) y dentro de ella cada letra de la palabra va a ir dentro de una etiqueta <letter>
        return `<x-word>
            ${letters.map(letter => `<x-letter>${letter}</x-letter>`).join('')}
        </x-word>`;
    }).join(''); // Agregar .join('') al final para convertir el array de strings en un solo string HTML
    //Establecemos el contador de tiempo
    
}
function initEvents() {};
