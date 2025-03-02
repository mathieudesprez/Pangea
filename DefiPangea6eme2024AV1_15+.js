const questions = [
    "La valeur manquante `a cette suite logique est : <br>\
    164 &rarr; 364 &rarr; 564 &rarr; ?",
    "Mon quadruple vaut 48. Qui suis-je ?" ,
    "Trouve la valeur manquante à cette pyramide.<br>\
    Chaque case contient la somme des deux cases qui se trouvent au-dessous.",
    "Kilian choisit un nombre, il le multiplie par 7, il obtient un produit, <br>\
    puis il rajoute le triple de 7 et multiplie le résultat par 2.<br>\
    Quelle est le résultat si le nombre choisi est le 12 ?",
    "Un spectacle était programme pour une durée de 95 minutes.<br>\
    Le spectacle démarre à l’heure prévue (21h15) mais se termine<br>\
    avec 420 secondes de retard.<br>\
    A quelle heure le spectacle s’est terminé ?",
    "Quelle est la figure différente des autres ?",
    "La valeur mystère est :",
    "La valeur manquante à cette suite logique est : :<br>\
    5 &rarr; 22 &rarr; 90 &rarr; ? &rarr; 465",
    "Voici un carré spécial ; le carré en pointillés déjà illustré correspond à une somme de 24. <br>\
     Donne le nombre de carrés (composés de 4 cases) dont la somme équivaut à 36.",
    "La valeur manquante dans cette suite logique est :",

];
// Liens vers les images des questions
const baseUrl = "https://raw.githubusercontent.com/mathieudesprez/Pangea/main/";
const images = {
    2: `${baseUrl}Q18_2024_6eme.png`,
    5: `${baseUrl}Q21_2024_6eme.png`,
    6: `${baseUrl}Q22_2024_6eme.png`,
    8: `${baseUrl}Q24_2024_6eme.png`,
    9: `${baseUrl}Q25_2024_6eme.png`,
};


// Réponses possibles pour les questions à choix multiples
const responses = [
    { "A": "964", "B": "864", "C": "764", "D": "664", "E": "646" },
    { "A": "14", "B": "12", "C": "10", "D": "8", "E": "6" },
    { "A": "38", "B": "47", "C": "65", "D": "84", "E": "89" },
    { "A": "99", "B": "128", "C": "210", "D": "245", "E": "678" },
    { "A": "22h10", "B": "23h35", "C": "21h52", "D": "21h59", "E": "22h57" },
    { "A": "a)", "B": "b)", "C": "c)", "D": "d)", "E": "e)" },
    { "A": "35", "B": "32", "C": "26", "D": "13", "E": "6" },
    { "A": "100", "B": "135", "C": "274", "D": "362", "E": "465" },
    { "A": "1", "B": "2", "C": "3", "D": "4", "E": "7" },
    { "A": "430", "B": "380", "C": "579", "D": "550", "E": "860" }
];


// Réponses correctes et points associés
const correctAnswers = ["C", "B", "D", "C", "E", "E", "C", "D", "B", "D"];
const questionPoints = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
const totalPoints = questionPoints.reduce((sum, value) => sum + value, 0);
const numberOfQuestions = questionPoints.length; // Récupère le nombre d'éléments


let score = 0;
let numberOfAnswer=0;

// Fonction pour mettre à jour le score avec animation après la fermeture de la fenêtre

function updateScore(newScore) {
    let scoreContainer = document.querySelector(".score"); // Sélectionne tout le texte Score: X
    let scoreElement = document.getElementById("score");
    let trophyElement = document.getElementById("trophy"); // Emoji 🏆
    let bravoImage = document.getElementById("bravo-image");

    setTimeout(() => {
        scoreElement.textContent = newScore;

        // Effet flash sur le texte "Score: X"
        scoreContainer.classList.add("flash");
        bravoImage.style.display = "block";


        // Retirer les effets après 500ms
        setTimeout(() => {
            scoreContainer.classList.remove("flash");
            bravoImage.style.display = "none";
        }, 1000);

    }, 300);
    checkAllAnswered()
}

// Nouvelle fonction pour gérer les mauvaises réponses
function updateScoreFalse() {
    let pasBravoImage = document.getElementById("pasbravo-image");

    // Afficher "Pas Bravo!" pour une mauvaise réponse
    pasBravoImage.style.display = "block";

    setTimeout(() => {
        pasBravoImage.style.display = "none";
    }, 1500);
}




let currentQuestion = -1;
let answeredQuestions = new Array(questions.length).fill(false); // Suivi des questions répondues

function renderMath() {
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

// Fonction pour afficher la question sélectionnée
function openModal(index) {
    if (answeredQuestions[index]) return; // Vérification si la question a déjà été répondue
    currentQuestion = index;
    document.getElementById("question").innerHTML = questions[index];
    document.getElementById("modal").style.display = "block";

    // Affichage de l'image si elle existe
    const questionImage = document.getElementById("question-image");
    if (images.hasOwnProperty(index)) {
        questionImage.src = images[index];
        questionImage.style.display = "block";
        // Limiter la taille de l'image
        questionImage.style.maxWidth = "70%";   // Largeur max
        questionImage.style.maxHeight = "60%";  // Hauteur max
        questionImage.style.width = "auto";       // Ajustement proportionnel
        questionImage.style.height = "auto";      // Garde le ratio d'origine
    } else {
        questionImage.style.display = "none";
    }

    showResponses(index);
    renderMath();  // Forcer MathJax à traiter la réponse

}


// Vérification de la réponse saisie
function checkAnswer() {
    const userAnswer = document.getElementById("answer").value.toUpperCase();
    if (!answeredQuestions[currentQuestion] && userAnswer === correctAnswers[currentQuestion]) {
        score += questionPoints[currentQuestion];
        updateScore(score);
        answeredQuestions[currentQuestion] = true;
        document.getElementsByClassName("square")[currentQuestion].classList.add("answered");

    } else {
        updateScoreFalse();  // Mauvaise réponse
        answeredQuestions[currentQuestion] = true;
        document.getElementsByClassName("square")[currentQuestion].classList.add("answeredF");

    }
    document.getElementById("modal").style.display = "none";
    closeResponseList();
    document.getElementById("answer").value = "";

}

function showResponses(index) {
    const responseList = document.getElementById("response-list");
    responseList.innerHTML = "";

    for (const key in responses[index]) {
        let button = document.createElement("button");
        button.innerHTML = `${key} → ${responses[index][key]}`;
        button.onclick = function () {
            document.getElementById("answer").value = key;
        };
        responseList.appendChild(button);
    }
    // Ajouter un bouton "Retour au menu"
    let backButton = document.createElement("button");
    backButton.innerHTML = "↩️ Retour au menu";
    backButton.style.marginTop = "10px";  // Ajoute un espacement
    backButton.onclick = function () {
        responseList.style.display = "none"; // Cache la liste des réponses
        document.getElementById("modal").style.display = "none"; // Ferme la question
    };
    responseList.appendChild(backButton);

    responseList.style.display = "block";
}

function closeResponseList() {
    document.getElementById("response-list").style.display = "none";
}

// Création de la grille de questions
const grid = document.getElementById("grid");
for (let i = 0; i < questions.length; i++) {
    let square = document.createElement("div");
    square.className = "square";
    square.innerHTML = i + 1;
    square.onclick = function () {
        openModal(i);
    };
    grid.appendChild(square);
}

function answerQuestion(index, isCorrect) {
    if (!answeredQuestions[index]) {
        answeredQuestions[index] = true; // Marque la question comme répondue
    }
    checkAllAnswered();
}

function checkAllAnswered() {
    if (answeredQuestions.every(status => status)) {
        showBilan();
    }
}


function showBilan() {
 
    let message = "";
    let message1 = "";
    let answeredCount =0
    answeredCount =answeredQuestions.filter(status => status).length;
    message1 = `✅ Tu as répondu à ${answeredCount} question(s) <br>`;
    
    // Vérifier si toutes les questions sont répondues
    if (answeredCount < 5) {
        document.getElementById("quizMessage").style.display = "block"; // Affiche un message d'avertissement
        setTimeout(() => {
            document.getElementById("quizMessage").style.display = "none"; // Cache le message après 3 secondes
        }, 3000);
        return; // Arrête ici et ne montre pas le bilan
    }

    let scorePercentage = (score / totalPoints) * 100;
    if (scorePercentage === 100) {
        message = "🏆 Rien ne t’arrête, tu es au sommet ! 😎";
    } else if (scorePercentage >= 70) {
        message = "🥈 Pas mal du tout ! L’or n’était pas loin ! 😉 ";
    } else if (scorePercentage >= 50) {
        message = "🥉 Pas mal ! Encore un petit effort pour atteindre le podium ! 🤔";
    } else if (scorePercentage >= 30) {
        message = " 🍫 On sent le potentiel ! Quelques ajustements et ce sera bon ! 😉";
    } else {
        message = "💀 Oups... on dirait que le quiz t'a eu ! Retente ta chance ! 😆";

    }
    // Combine message1 et message
    let finalMessage = message1 + message;

    // Utilisation de innerHTML pour que <br> fonctionne
    document.getElementById("bilan").innerHTML = finalMessage;
    document.getElementById("bilan").style.display = "block";
}

// Simulation : Remplit toutes les réponses en cliquant sur un bouton
function simulateAnswers() {
    answeredQuestions.fill(true); // Marque toutes les questions comme répondues
    checkAllAnswered(); // Vérifie et affiche le bilan si toutes sont répondues
}

document.addEventListener("DOMContentLoaded", function () {
    let highestZ = 10; // Z-index de base

    function bringToFront(element) {
        highestZ += 1; // Augmente le z-index
        element.style.zIndex = highestZ;
    }

    // Appliquer l'événement de mise au premier plan sur les éléments modaux
    document.querySelectorAll(".modal, .response-list").forEach(el => {
        el.addEventListener("click", function () {
            bringToFront(this);
        });
    });
});


