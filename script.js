
        let lastButtonWasDice = false;
        let lastButtonWasVantageOrDisadvantage = false;
        let rollHistory = [];


        document.addEventListener('DOMContentLoaded', () => {
            loadFormulas();
            loadRollHistory();
        });
        document.addEventListener('keydown', event => {
            if (event.key === "Enter") {
                event.preventDefault();
                rollDice()
            }
        });


        // Nasconde il banner se clicchi in qualsiasi punto della pagina, eccetto i pulsanti
        document.addEventListener('click', function () {
            const resultBanner = document.getElementById('resultBanner');
            if (!resultBanner.classList.contains('d-none')) {
                resultBanner.classList.add('d-none');
            }
        });

        // Impedisce che il click sui pulsanti chiuda il banner
        document.getElementById('resultBanner').addEventListener('click', function (event) {
            event.stopPropagation(); // Impedisce che il click sul banner lo nasconda
        });

        // Interrompe la propagazione del click sul banner per evitare che si chiuda
        document.getElementById('resultBanner').addEventListener('click', function (event) {
            event.stopPropagation();
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
        }

        function backspaceDisplay() {
            const display = document.getElementById('display');
            display.value = display.value.slice(0, -1);
        }

        function rollDice() {
            const display = document.getElementById('display').value.trim();
            let total = 0;
            let detailedResult = '';
            if (!display) {
                return
            }
            // Controllo se il display contiene solo "s" o "v"
            else if (display === 's' || display === 'v') {
                const roll1 = Math.floor(Math.random() * 20) + 1;
                const roll2 = Math.floor(Math.random() * 20) + 1;
                total = display === 'v' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
                detailedResult = `(${roll1}, ${roll2}) => ${total}[d20]`;
            } else {
                const dicePattern = /(\d*)d(\d+)([vs])?/g;
                let match;
                let modifiedDisplay = display;

                while ((match = dicePattern.exec(display)) !== null) {
                    const rolls = match[1] ? parseInt(match[1]) : 1;
                    const sides = parseInt(match[2]);
                    const modifier = match[3];
                    let rollResults = [];

                    for (let i = 0; i < rolls; i++) {
                        let roll1 = Math.floor(Math.random() * sides) + 1;
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
                    detailedResult += '<br>';
                    const rollTotal = rollResults.reduce((sum, roll) => sum + roll, 0);
                    modifiedDisplay = modifiedDisplay.replace(match[0], rollTotal);
                }
                

                try {
                    total = eval(modifiedDisplay);
                } catch (error) {
                    alert('Errore nella formula inserita.');
                    return;
                }
            }

            const resultBanner = document.getElementById('resultBanner');
            
            
            resultBanner.innerHTML = `<h1>Risultato: ${total}</h1><p>${detailedResult}</p><button class="btn btn-success mt-2" onclick="event.stopPropagation(); rollDice()">
    <h1 class="m-1">🔄</h1>
</button>`;
            resultBanner.classList.remove('d-none');
            updateRollHistory(display, total, detailedResult);

        }

        function updateRollHistory(roll, result, details) {
            const rollHistoryElement = document.getElementById('rollHistory');
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';

            const currentTime = new Date().toLocaleTimeString();

            listItem.innerHTML = `<p class="text-center mb-0">${currentTime}<br><strong>Formula:</strong> <a class="link-opacity-50-hover link-offset-2 link-danger">${roll}</a> - <strong>Risultato:</strong> ${result} <br> <small>${details}</small></p>`;
            listItem.id=roll

            listItem.onclick= event=> {
                document.getElementById('display').value = roll;
                event.stopPropagation()
               rollDice();
               lastButtonWasDice = true;
           };
            

            rollHistoryElement.prepend(listItem);

            rollHistory.unshift({ roll, result, details, time: currentTime });

            if (rollHistory.length > 10) {
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
                listItem.innerHTML = `<p class="text-center mb-0">${rollItem.time}<br><strong>Formula:</strong> <a class="link-opacity-50-hover link-offset-2 link-danger">${rollItem.roll}</a> - <strong>Risultato:</strong> ${rollItem.result} <br> <small>${rollItem.details}</small></p>`;
                listItem.id=rollItem.roll
                listItem.onclick= event=> {
                    document.getElementById('display').value = rollItem.roll;
                    event.stopPropagation()
                   rollDice();
                   lastButtonWasDice = true;
               };

                rollHistoryElement.appendChild(listItem);
            });

            rollHistory = savedRollHistory;
        }

        function saveFormula() {
            const display = document.getElementById('display').value;
            let name = prompt("Inserisci un nome per la formula:");
            if (display && name) {
                name += ": " + display;
                const savedFormulas = document.getElementById('savedFormulas');
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex align-items-center ';

                const formulaButton = document.createElement('button');
                formulaButton.className = 'btn btn-secondary  rounded-0 rounded-start-2 w-100';
                formulaButton.dataset.id = display;
                formulaButton.textContent = name;

                formulaButton.addEventListener('click', function (event) {
                     event.stopPropagation();
                    document.getElementById('display').value = this.dataset.id;
                    rollDice();
                    lastButtonWasDice = true;
                });

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-warning rounded-0 h-100 flex-shrink-1 align-self-stretch';
                editButton.innerHTML = '✏️';
                editButton.addEventListener('click', function () {
                    showEditModal(display, name, listItem);
                });

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger rounded-0 h-100 rounded-end-2  flex-shrink-1';
                deleteButton.innerHTML = '🗑️';
                deleteButton.addEventListener('click', function () {
                    savedFormulas.removeChild(listItem);
                    removeFormulaFromLocalStorage(display);
                });

                listItem.appendChild(formulaButton);
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                savedFormulas.appendChild(listItem);
                saveFormulaToLocalStorage({ id: display, name });
            } else {
                alert("Non è possibile salvare una formula vuota o senza nome.");
            }
        }

        function saveFormulaToLocalStorage(formula) {
            let formulas = JSON.parse(localStorage.getItem('formulas')) || [];
            formulas.push(formula);
            localStorage.setItem('formulas', JSON.stringify(formulas));
        }

        function removeFormulaFromLocalStorage(id) {
            let formulas = JSON.parse(localStorage.getItem('formulas')) || [];
            formulas = formulas.filter(f => f.id !== id);
            localStorage.setItem('formulas', JSON.stringify(formulas));
        }

        function loadFormulas() {
            const savedFormulas = JSON.parse(localStorage.getItem('formulas')) || [];
            const savedFormulasElement = document.getElementById('savedFormulas');
            savedFormulas.forEach(formula => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center ';

                const formulaButton = document.createElement('button');
                formulaButton.className = 'btn btn-secondary rounded-0 rounded-start-2 w-100';
                formulaButton.dataset.id = formula.id;
                formulaButton.textContent = formula.name;

                formulaButton.addEventListener('click', function (event) {
                        event.stopPropagation();
                    document.getElementById('display').value = this.dataset.id;
                    rollDice();
                    lastButtonWasDice = true
                });

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-warning rounded-0 h-100 flex-shrink-1';
                editButton.innerHTML = '✏️';
                editButton.addEventListener('click', function () {
                    showEditModal(formula.id, formula.name, listItem);
                });

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger rounded-0 h-100 rounded-end-2 flex-shrink-1';
                deleteButton.innerHTML = '🗑️';
                deleteButton.addEventListener('click', function () {
                    savedFormulasElement.removeChild(listItem);
                    removeFormulaFromLocalStorage(formula.id);
                });

                listItem.appendChild(formulaButton);
                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                savedFormulasElement.appendChild(listItem);
            });
        }
