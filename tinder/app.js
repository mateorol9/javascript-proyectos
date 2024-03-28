const DECISION_THRESHOLD = 80;
let isAnimating = false; // Cuando se este animando vamos a evitar los eventos
let pullDeltaX = 0; // distancia que la card se esta desplazando (Delta es la diferencia entre 2 posiciones)
let lastCard = []; // Ultima card que se esta mostrando

function startDrag (e) {
    if (isAnimating) {
        return;
    } // (bandera)Si esta animando no hacemos nada

    //Tomamos el primer elemento article más cerca del evento
    const actualCard = e.target.closest('article');
    if(!actualCard) {
        return;
    }

    //Tomamos la posicion inicial del mouse o el dedo
    const startX = e.pageX ?? e.touches[0].pageX;

    //Escuhamos cuando el mouse o el dedo se mueve
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    //Escuhamos cuando el dedo se mueve
    document.addEventListener('touchmove', onMove, {passive: true});
    document.addEventListener('touchend', onEnd, {passive: true});

    function onMove(e) {
        //posicion actual del mouse o finger
        const currentX = e.pageX ?? e.touches[0].pageX 
        //La instancia inicual y la actual
        pullDeltaX = currentX - startX;

        //No hay distancia recorrida, no hacemos nada
        if(pullDeltaX === 0) return;
        // Cambiamos el estado de la bandera a true, se esta animando
        isAnimating = true;

        // Calculamos la rotación de la card usando la distancia recurrida
        const deg = pullDeltaX / 15;

        // Aplicamos el transformX en la card usando la distancia recorrida
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;  
        
        //Cambiamos el cursor con la manito cerrada/ agarrando
        actualCard.style.cursor = 'grabbing'; 
        
        //Definimos la opacidad que va a tener el elemento al desplazarse y si va a la derecha o izquierda
        const opacity = Math.abs(pullDeltaX)/ 100;
        const isRight = pullDeltaX > 0;

        const choiceEl = isRight 
        ? actualCard.querySelector('.like') 
        : actualCard.querySelector('.nope');
        
        //Cambiamos la opacidad
        choiceEl.style.opacity = opacity;              
    }

    function onEnd(e) {
       //Quitamos los eventos de mouse
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);  
        // Quitamos los eventos de touch
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        
        //Decidir si el usuario tomo una decisión
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

        if (decisionMade) {
            const goRight = pullDeltaX >= 0

            // agrega una clase de acuerdo a la decisión
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', () => {
            
            //Luego de la animación reseteo estilos y creo un clon para almacenarlo en un array
            actualCard.classList.remove('go-right', 'go-left');
            actualCard.removeAttribute('style');
            const clonedCard = actualCard.cloneNode(true);
            lastCard.unshift(clonedCard);
            //Elimino la card actual
            actualCard.remove();
            });
          } else {
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');

            actualCard.querySelectorAll('.choice').forEach(choice => {
            choice.style.opacity = 0
        })
      }
        // resetea las variables
        actualCard.addEventListener('transitionend', () => {
        actualCard.removeAttribute('style');
        actualCard.classList.remove('reset');

        pullDeltaX = 0
        isAnimating = false
      })
      // resetea la elección de la card
      actualCard.querySelectorAll(".choice").forEach((el) => (el.style.opacity = 0));
    }
}


//Selecciono el manejador de eventos
const phoneContainer = document.querySelector('.phone');

document.addEventListener('mousedown', startDrag); // Evento para mouse
document.addEventListener('touchstart', startDrag, {passive: true}); // Evento para touch y passive true.

// Botones de la App 
const spanMessage = document.querySelector('.messageCard');
const footerContainer = document.querySelector('footer');


//Funciones de los botones para los botones
function btnClics(e) {
    
    e.preventDefault();
    
    //Definimos la Actual Card y las elecciones Like y Dislike
    let actualCard = spanMessage.previousElementSibling !== true ? spanMessage.previousElementSibling : false;
    console.log(actualCard);
    
    //Función para el botón de undo <--------------------
    if(e.target.matches('.is-undo') && !isAnimating) {
        isAnimating = true;
        
        if (Math.abs(pullDeltaX) === 0 && lastCard.length > 0) { 

        spanMessage.insertAdjacentElement('beforebegin', lastCard[0]); 
        lastCard.shift(); 

    } else {
        isAnimating = false;
        return;
    }
    isAnimating = false;
 }
    //Función para el botón de nope <--------------------
    else if(e.target.matches('.is-remove') && actualCard && !isAnimating) {
        isAnimating = true;
        let nopeOpacity = actualCard.querySelector('.nope');
        //remueve los estilos inline y luego agrega el opacity
        nopeOpacity.removeAttribute('style');
        nopeOpacity.classList.add('opacity');
        
        //Una vez acaba la animación del nope empieza el swipe
        actualCard.addEventListener('transitionend', () => {
       
        actualCard.classList.add('go-left--btn');
        
        //Reseteamos y eliminamos la card una vez acabe el swipe
        actualCard.addEventListener('transitionend', () => {
            //Removemos clases y atributos
            nopeOpacity.classList.remove('opacity');
            actualCard.classList.remove('go-left--btn');
    
            //Clonamos la card
            const clonedCard = actualCard.cloneNode(true);
            lastCard.unshift(clonedCard);
            //Elimino la card actual
            actualCard.remove();
        });
    });
        //Desactivamos la animación
        isAnimating = false; 
    } 

    //Función para el botón de like <--------------------

    else if(e.target.matches('.is-fav') && actualCard) {

        let likeOpacity = actualCard.querySelector('.like');

        likeOpacity.removeAttribute('style');
        likeOpacity.classList.add('opacity');
        actualCard.classList.add('go-right--btn');
        
        //Reseteamos y eliminamos la card
        actualCard.addEventListener('transitionend', () => {
            //Removemos clases y atributos
            likeOpacity.classList.remove('opacity');
            actualCard.classList.remove('go-right--btn');
    
            //Clonamos la card
            const clonedCard = actualCard.cloneNode(true);
            lastCard.unshift(clonedCard);
            //Elimino la card actual
            actualCard.remove(); 
        });
    } else {return}

} //Finaliza la funcion btnClics


 // Manejador de eventos botones
 footerContainer.addEventListener('click', btnClics);