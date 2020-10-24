
//Variables globales.

//Preguntas
let questions = [];
//Posicion temporal de quiz.
let position = -1;
//Puntaje.
let score = -1;
//Respuesta seleccionada.
let selectRes = "";
//Respuesta correcta.
let correctAnswer = "";

//Llamar categorias.
function getCategory(){
    fetch("https://opentdb.com/api_category.php")
        .then(response => response.json())
        .then(data => printCategoryes(data.trivia_categories))
}

getCategory()

//Agregar categorias al selector de midoom.
function printCategoryes(categorys){
    const selector = document.getElementById("category");
    categorys.forEach((category) => {
        const options = `<option value="${category.id}">${category.name}</option>`
        selector.innerHTML += options
    });
}

//Llamar preguntas.
function getQuestions(){
    const questionsQuantity = document.getElementById("quantity").value;
    const categoryQuestion = document.getElementById("category").value;
    const questionDificulty = document.getElementById("dificulty").value;
    const typeQuestion = document.getElementById("type").value;
    fetch(`https://opentdb.com/api.php?amount=${questionsQuantity}&category=${categoryQuestion}&difficulty=${questionDificulty}&type=${typeQuestion}`)
        .then(response => response.json())
        .then(d => {
            questions = d.results;
            //paso body de mis preguntas ya el formato armado.
            if(questions.length === 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There are no questions for this selection. Please select other options to continue'
                  })
            }else{
                printQuiz(removeForm())
            }
        })
        // .catch((error) => {
        //     console.error(error);
        //  });
}

//Metodo quitar elementos a mi doom. 
function removeForm(){
    const searchForm = document.getElementById("conatiner01").getElementsByTagName("div")[0];
    const searchChild = searchForm.getElementsByTagName("form")[0];
    const remove = searchForm.removeChild(searchChild);
    return remove;
}

//Obtener Puntaje
function myScore(){
    if(selectRes == correctAnswer){
        score += 1;
    }
}

//Agregar cuerpo al doom del quiz.
function printQuiz(idButton){
    //Ciclo controlado
    position++;
    const searchbutton = document.getElementById(idButton);
    if(searchbutton){
        selectRes = `${searchbutton.value}`;
    }
    myScore();
    const container = document.getElementById("quiz");
    container.innerHTML = "";
    const body = cycleQuestions(questions);
    container.innerHTML += body;
}

function realoadedAction() {
    const refresh = location.reload();
    return refresh;
}

//Posisicion de mi quiz.
function cycleQuestions(myquestion) {
    const currentQuestion = myquestion[position];
    let html = '';
    let htmFinish = `<div class="score">
                        <div class="style-finish-window">This is Your Hits</div>
                        <div class="style-finish-score">${score}</div>
                        <button class="btn btn-warning style-button-start shadow-buttons" onclick="realoadedAction()">Play Again</button>
                    </div>`;
    if(position > questions.length -1) {
        return htmFinish;
    } else {
        return html = returnBody(currentQuestion);
    }
}


//Cuerpo de preguntas
function returnBody(q){
    const body = `<div class="progress-questions">
                    <div>Questions</div>
                    <div>${position+1}/${questions.length}</div>
                    <div class="score">
                        <div>HITS</div>
                        <div class="your-hits">${score}</div>
                    </div>
                </div>
                <div class="style-question">
                    ${q.question}
                </div>
                <div>
                    ${answersHTML(q.correct_answer, q.incorrect_answers)}
                </div>
                `
    correctAnswer = q.correct_answer;
    return body;
}


//Respuestas.
function answersHTML(correct,incorrects){
    incorrects.push(correct);
    let buttonAnswer = ``;
    //Acomodo aleatoreo
    let shuffleArray = array => {
        let NewPosition,temp;
        for(let i = array.length-1; i > 0; i--){
            NewPosition = Math.floor(Math.random()*(i+1));
            temp = array[i];
            array[i] = array[NewPosition];
            array[NewPosition] = temp;
        }
        return array;
    }
    let newArray = shuffleArray(incorrects);
    newArray.forEach((answer, index) => {
        buttonAnswer += `<button type="button" class="btn btn-primary btn-lg btn-block" onclick="printQuiz(${index})" id="${index}" value="${answer}"> ${answer} </button>`;
    })
    return buttonAnswer;
}