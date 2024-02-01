function main() {
    let cardsIds = [];
    let imagesIds = [];
    let valueOfImagesIds = [];
    let flashCardsElements = document.querySelectorAll('.flashCards');
    let restartButton = document.querySelectorAll('.divButtonForRestart');
    let clearButton = document.getElementById('buttonForClearScores');
    let countdownValue = 3 * 60;
    let isGameStarted = false;
    let numberOfCardsInGame = 36;
    let currentTime;
    let isCountDownOngoing = true;
    
    for (let i = 0; i <= 35; i++) {
        cardsIds.push(i);
    }

    function addNewRecordToTopScores(time){
        let positionToFill;
        if (document.getElementById('firstPlace').innerText == '') {
            localStorage.setItem('firstPlace', time);
            positionToFill = 'firstPlace';
        }
        
        else if (document.getElementById('secondPlace').innerText == '' && localStorage.getItem('firstPlace')) {
            localStorage.setItem('secondPlace', time);
            positionToFill = 'secondPlace';
        }
        
        else if (document.getElementById('thirdPlace').innerText == '' && localStorage.getItem('firstPlace') && localStorage.getItem('secondPlace')) {
            localStorage.setItem('thirdPlace', time);
            positionToFill = 'thirdPlace';
        }
        
        else if (document.getElementById('fourthPlace').innerText == '' && localStorage.getItem('firstPlace') && localStorage.getItem('secondPlace') && localStorage.getItem('thirdPlace')) {
            localStorage.setItem('fourthPlace', time);
            positionToFill = 'fourthPlace';
        }
        
        else if (document.getElementById('fifthPlace').innerText == '' && localStorage.getItem('firstPlace') && localStorage.getItem('secondPlace') && localStorage.getItem('thirdPlace') && localStorage.getItem('fourthPlace')) {
            localStorage.setItem('fifthPlace', time);
            positionToFill = 'fifthPlace';
        }
        document.getElementById(positionToFill).innerText = time;
    } 

    function loadLastScores(){
        document.getElementById('firstPlace').innerText = localStorage.getItem('firstPlace');
        document.getElementById('secondPlace').innerText = localStorage.getItem('secondPlace');
        document.getElementById('thirdPlace').innerText = localStorage.getItem('thirdPlace');
        document.getElementById('fourthPlace').innerText = localStorage.getItem('fourthPlace');
        document.getElementById('fifthPlace').innerText = localStorage.getItem('fifthPlace');
    }

    function clearAllScores(){
        localStorage.clear();
    }

    function fillCardsWithImages() {
        console.log(cardsIds);
        for (let a = 0; a <= 17; a++) {
            for (let i =0; i<2; i++){
            let randomPositionFromArray = Math.floor(Math.random() * cardsIds.length);
            let valueOfRandomPositionFromArray = cardsIds.splice(randomPositionFromArray, 1)[0]; 
            
            let imageContainer = document.getElementById(valueOfRandomPositionFromArray);
            let imgElement = document.createElement('img');
            imgElement.src = 'images/cardsContent/'+a+'.jpg';
            imageContainer.appendChild(imgElement);
            imagesIds.push(valueOfRandomPositionFromArray);
            valueOfImagesIds.push(a);
            }
        }
        console.log(valueOfImagesIds);
        console.log(imagesIds);
    }

    function removeAllMatchedClasses() {
        let matchedElements = document.querySelectorAll('.flashCards.elementMatched');
        matchedElements.forEach(function(element) {
            element.classList.remove('elementMatched');
        });
    }

    function removeAllClickedClasses() {
        let clickedElements = document.querySelectorAll('.placeForImage.clicked');
        clickedElements.forEach(function(element) {
            element.classList.remove('clicked');
        });
    }

    function getClickedElementIds() {
        let clickedPlaceForImage = document.querySelectorAll('.placeForImage.clicked');
        let clickedElementIds = Array.from(clickedPlaceForImage).map(element => element.id);

        return clickedElementIds;
    }

    function toggleClickedClass() {
        let placeForImage = this.querySelector('.placeForImage');
        let clickedElements = document.querySelectorAll('.placeForImage.clicked');
        let cardsMatched;
        let clickedElementIds = [];

        if (clickedElements.length < 2 || placeForImage.classList.contains('clicked')) {
            placeForImage.classList.add('clicked');
            if (clickedElements.length == 1 ){
                clickedElementIds = getClickedElementIds();
                firstCardId = clickedElementIds[0];
                secondCardId = clickedElementIds[1];
                console.log(firstCardId, secondCardId);
                cardsMatched = checkForPositionOfIdsInImagesIds(firstCardId, secondCardId);
                if (cardsMatched){
                    eventForFlashCardsWhenMatched(firstCardId, secondCardId);
                    numberOfCardsInGame = numberOfCardsInGame - 2;
                }
                else{
                    setTimeout(removeAllClickedClasses, 800);
                }
            }
        }
        if (numberOfCardsInGame == 0){
            getCurrentTime();
            setTimeout(function() {
                alert(`Wygrałeś! Twój wynik to: ${currentTime}.`);
              }, 1000);
              isCountDownOngoing = false;
              document.getElementById('countDownForGame').innerText = currentTime;
              addNewRecordToTopScores(currentTime);
        }
    }
  
    function getCurrentTime(){
        currentTime = document.getElementById('countDownForGame').innerText;
    }

    function eventForFlashCardsWhenMatched(firstCardId, secondCardId) {
        let firstCardElements = document.querySelectorAll('.card' + firstCardId);
        let secondCardElements = document.querySelectorAll('.card' + secondCardId);
    
        firstCardElements.forEach(function(element) {
            element.classList.add('elementMatched');
        });
        secondCardElements.forEach(function(element) {
            element.classList.add('elementMatched');
        });
    
        setTimeout(removeAllClickedClasses, 600);
    }

    function checkForPositionOfIdsInImagesIds(firstCardId, secondCardId) {
        let positionOfFirstCard;
        let positionOfSecondCard;
        let cardsMatched;

        for(let a = 0; a <= imagesIds.length; a++){
            if(firstCardId == imagesIds[a]){
                positionOfFirstCard = a
            }
        }
        for(let a = 0; a <= imagesIds.length; a++){
            if(secondCardId == imagesIds[a]){
                positionOfSecondCard = a
            }
        }
        if(valueOfImagesIds[positionOfFirstCard] == valueOfImagesIds[positionOfSecondCard]){
            cardsMatched = true;
        }else {
            cardsMatched = false
        }
        return cardsMatched;
    }

    function eventForFlashCardsWhenClicked() {
        flashCardsElements.forEach(function(flashCard) {
            flashCard.addEventListener('click', function() {
                toggleClickedClass.call(this);
                if (!isGameStarted){
                    updateCountdown();
                    isGameStarted = true;
                }
            });
        });
    }
    function eventForRestartWhenClicked() {
        numberOfCardsInGame = 36;
        restartButton.forEach(function(restart) {
            restart.addEventListener('click', restartGame);
        });
    }

    function eventForClearWhenClicked() {
        clearButton.addEventListener('click', function() {
            clearAllScores();
            loadLastScores();
        });
    }

    function restartGame(){
        location.reload();
    }
    
    window.onload = function() {
        fillCardsWithImages();
        eventForFlashCardsWhenClicked();
        eventForRestartWhenClicked();
        loadLastScores();
        eventForClearWhenClicked();
    };

    function updateCountdown() {
        if(isCountDownOngoing){
            const minutes = Math.floor(countdownValue / 60);
            const seconds = countdownValue % 60;
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            document.getElementById('countDownForGame').innerText = formattedTime;

            countdownValue--;

            if (countdownValue < 0) {
                alert("Time's up!");
            } else {
                setTimeout(updateCountdown, 1000);
            }
        }
    }
}

main();
