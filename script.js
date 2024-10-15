
let lastButtonWasDice = false;
let lastButtonWasVantageOrDisadvantage = false;
let rollHistory = [];
let media=[]

vantaggiobtnclick = () => {

    if (vantaggiobtn.checked === true && svantaggiobtn.checked === true) {
        svantaggiobtn.checked = false
    }
}


svantaggiobtnclick = () => {
    

    if (vantaggiobtn.checked === true && svantaggiobtn.checked === true) {
        vantaggiobtn.checked = false
    }
}
document.addEventListener('DOMContentLoaded', () => {
    InsertSkill()
    loadStats()
    loadFormulas();
    loadRollHistory();
    loadModificators()
    loadSelectedSkills();
    vantaggiobtn = document.querySelector('#vantaggio')
    svantaggiobtn = document.querySelector('#svantaggio')

    vantaggiobtn.addEventListener("click", vantaggiobtnclick)
    svantaggiobtn.addEventListener("click", svantaggiobtnclick)
});

document.addEventListener('keydown', event => {
    if (event.key === "Enter") {
        event.preventDefault();
        rollDice()
    }
});



function appendToDisplay(value, isDice) {
    const display = document.getElementById('display');
    if (lastButtonWasVantageOrDisadvantage) {
        // Se l'ultimo tasto era "v" o "s" e il prossimo è un numero, aggiungi un "+"
        display.value += '+';
    }
    if (isDice && lastButtonWasDice && display.value.length > 0) display.value += '+';
    else if (lastButtonWasDice && !isNaN(parseInt(value))) display.value += '+';
    // else if(!lastButtonWasDice && isDice&& display.value.length != 0)  display.value += '+';
    display.value += value;
    lastButtonWasDice = isDice;
    lastButtonWasVantageOrDisadvantage = value === 'v' || value === 's'; // Aggiorna il flag
}

function clearDisplay() {
    document.getElementById('display').value = '';
    lastButtonWasDice = false;
    lastButtonWasVantageOrDisadvantage = false;
}

function backspaceDisplay() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function safeEvaluate(expression) {
    // Rimuove spazi e convalida solo numeri e operatori di base
    expression = expression.replace(/[^-()\d/*+.]/g, '');
    try {
        // Usa il costrutto Function per valutare l'espressione in modo sicuro
        return new Function('return ' + expression)();
    } catch (error) {
        throw new Error('Errore nella formula inserita.');
    }
}

function rollDice(isopen = false, resultName = false) {
    const display = document.getElementById('display').value.trim();
    let total = 0;
    let detailedResult = '';
    if (!display) {
        return
    }
        else if(display==='media'){
console.log(media.reduce((total, num) => total + parseInt(num),0))
        }
    // Controllo se il display contiene solo "s" o "v"
    else if (display === 's' || display === 'v') {
        const roll1 = Math.floor(Math.random() * 20) + 1;
        const roll2 = Math.floor(Math.random() * 20) + 1;
        total = display === 'v' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
        detailedResult = `(${roll1}, ${roll2}) => ${total}[d20]`;
    } else 
        const dicePattern = /(\d*)d(\d+)([vs])?/g;
        let match;
        let modifiedDisplay = display;
        let modifiers = display;

        while ((match = dicePattern.exec(display)) !== null) {
                        
            const rolls = match[1] ? parseInt(match[1]) : 1;
            const sides = parseInt(match[2]);
            const modifier = match[3];
            let rollResults = [];

            for (let i = 0; i < rolls; i++) {
                let roll1 = Math.floor(Math.random() * sides) + 1;
                if(sides===20) media.push(roll1)
                let roll2 = Math.floor(Math.random() * sides) + 1;
                let finalRoll = roll1;
                if (modifier === 'v') {
                    finalRoll = Math.max(roll1, roll2);
                    detailedResult += `(${roll1}, ${roll2}) => ${finalRoll}[d${sides}]`;
                } else if (modifier === 's') {
                    finalRoll = Math.min(roll1, roll2);
                    detailedResult += `(${roll1}, ${roll2}) => ${finalRoll}[d${sides}]`;
                } else {
                    detailedResult += `${finalRoll}[d${sides}]`;
                }

                rollResults.push(finalRoll);

                if (i < rolls - 1) {
                    detailedResult += ' + ';
                }
            }
            
            const rollTotal = rollResults.reduce((sum, roll) => sum + roll, 0);
            
            modifiedDisplay = modifiedDisplay.replace(match[0], rollTotal);
            modifiers = modifiers.replace(match[0], "0");
            
            
            detailedResult += '<br>';
        }
        try {
            modifiers=safeEvaluate(modifiers);
        } catch (error) {
            alert('Errore nella formula inserita.');
            return;
        }
        
        modifiers= modifiers>0? "+"+modifiers:modifiers 
       if(modifiers != 0) detailedResult += modifiers
        try {
            total = safeEvaluate(modifiedDisplay);
        } catch (error) {
            alert('Errore nella formula inserita.');
            return;
        }
    }
    // Aggiorna il contenuto del modale
    const modalResultContent = document.getElementById('modalResultContent');
    modalResultContent.innerHTML = `<p class='text-center display-1 fw.bold'>${resultName ? resultName : "Risultato"}: ${total}</p><p class='text-center h3'>${detailedResult}</p>`;

    if (!isopen) {
        const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
        resultModal.show();

    }
    // Mostra il modale
    updateRollHistory(display, total, detailedResult, resultName ? resultName : "Risultato");

}

function updateRollHistory(roll, result, details, resultName) {
    const rollHistoryElement = document.getElementById('rollHistory');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';

    const currentTime = new Date().toLocaleTimeString();

    listItem.innerHTML = `<p class="text-center mb-0">${currentTime}<br><a class="link-opacity-50-hover link-offset-2 link-danger">${roll}</a> - <strong>${resultName}:</strong> ${result} <br> <small>${details}</small></p>`;
    listItem.id = roll
    listItem.onclick = event => {
        document.getElementById('display').value = roll;
        event.stopPropagation()
        rollDice();
        lastButtonWasDice = true;
    };



    rollHistoryElement.prepend(listItem);

    rollHistory.unshift({ resultName, roll, result, details, time: currentTime });

    if (rollHistory.length > 20) {
        rollHistory.pop();
        rollHistoryElement.lastChild.remove();
    }

    saveRollHistoryToLocalStorage();
}

function saveRollHistoryToLocalStorage() {
    localStorage.setItem('rollHistory', JSON.stringify(rollHistory));
}

function loadRollHistory() {
    const savedRollHistory = JSON.parse(localStorage.getItem('rollHistory')) || [];
    const rollHistoryElement = document.getElementById('rollHistory');

    savedRollHistory.forEach(rollItem => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<p class="text-center mb-0">${rollItem.time}<br><a class="link-opacity-50-hover link-offset-2 link-danger">${rollItem.roll}</a> - <strong>${rollItem.resultName}:</strong> ${rollItem.result} <br> <small>${rollItem.details}</small></p>`;
        listItem.id = rollItem.roll
        listItem.onclick = event => {
            document.getElementById('display').value = rollItem.roll;
            event.stopPropagation()
            rollDice();
            lastButtonWasDice = true;
        };

        rollHistoryElement.appendChild(listItem);
    });

    rollHistory = savedRollHistory;
}


function saveFormulaToLocalStorage(formula, localStorageName = "formulas") {
    let formulas = JSON.parse(localStorage.getItem(localStorageName)) || [];
    formulas.push(formula);
    localStorage.setItem(localStorageName, JSON.stringify(formulas));
}

function removeFormulaFromLocalStorage(name) {
    let formulas = JSON.parse(localStorage.getItem('formulas')) || [];
    formulas = formulas.filter(f => f.name !== name);
    localStorage.setItem('formulas', JSON.stringify(formulas));
}

function createFormulaElement(id, name, save = "savedFormulas") {
    const savedFormulasElement = document.getElementById(save);


    listItem = document.createElement('li');
    listItem.className = 'list-group-item w-100 d-flex align-items-center ';

    const btnGroup = document.createElement('div')
    btnGroup.className = 'btn-group w-100'


    const formulaButton = document.createElement('button');
    formulaButton.className = 'btn btn-secondary';
    formulaButton.style = "width:70%; overflow:hidden"
    formulaButton.dataset.id = id;
    formulaButton.textContent = name;




    formulaButton.addEventListener('click', function (event) {
        event.stopPropagation();
        textsplit = this.innerText.split(":")
        formulaname = textsplit[0]
        document.getElementById('display').value = this.dataset.id;
        rollDice(false, formulaname);
        lastButtonWasDice = true;
    });

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-custom flex-shrink-1';
    editButton.innerHTML = '✏️';
    editButton.onclick = () => {
        showEditModal(id, name, listItem);
    };

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger flex-shrink-1';
    deleteButton.innerHTML = '🗑️';
    deleteButton.addEventListener('click', function () {
        savedFormulasElement.removeChild(listItem);
        removeFormulaFromLocalStorage(name);

        loadFormulas()
    });

    listItem.innerHTML = '';
    btnGroup.appendChild(formulaButton);
    btnGroup.appendChild(editButton);
    btnGroup.appendChild(deleteButton);
    listItem.appendChild(btnGroup)
    savedFormulasElement.appendChild(listItem);

}

function saveFormula() {
    const display = document.getElementById('display').value;
    let name = prompt("Inserisci un nome per la formula:");
    if (display && name) {
        name += ": " + display;
        saveFormulaToLocalStorage({ id: display, name });
        loadFormulas()

    } else {
        alert("Non è possibile salvare una formula vuota o senza nome.");
    }
}

function loadFormulas(localStorageName = "formulas", save = 'savedFormulas') {
    const savedFormulas = JSON.parse(localStorage.getItem(localStorageName)) || [];
    const tutorialFormulas = document.getElementById(save)
    tutorialFormulas.innerHTML = '';

    if (savedFormulas.length === 0) {

        tutorialFormulas.innerHTML = '<p>Ancora nessuna formula salvata</p><p>Premi ❤ per salvare una formula tra i preferiti</p>'
    }
    else {
        savedFormulas.forEach(formula => {
            createFormulaElement(formula.id, formula.name);
        });
    }

}

