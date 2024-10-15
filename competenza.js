const skills = [
    { name: 'Acrobazia', stat: 'DEX' },
    { name: 'Addestrare animali', stat: 'SAG' },
    { name: 'Arcano', stat: 'INT' },
    { name: 'Atletica', stat: 'FOR' },
    { name: 'Furtività', stat: 'DEX' },
    { name: 'Indagare', stat: 'INT' },
    { name: 'Inganno', stat: 'CAR' },
    { name: 'Intimidazione', stat: 'CAR' },
    { name: 'Intuizione', stat: 'SAG' },
    { name: 'Intrattenere', stat: 'CAR' },
    { name: 'Medicina', stat: 'SAG' },
    { name: 'Natura', stat: 'INT' },
    { name: 'Percezione', stat: 'SAG' },
    { name: 'Persuasione', stat: 'CAR' },
    { name: 'Rapidità di mano', stat: 'DEX' },
    { name: 'Religione', stat: 'INT' },
    { name: 'Sopravvivenza', stat: 'SAG' },
    { name: 'Storia', stat: 'INT' }
];
InsertSkill()


function InsertSkill() {
    let skillCheckboxes = document.querySelector('#skillsCheckboxes')
    let n = skills.length
    let col6 = document.createElement('div')
    col6.className = "col-6"
    let col6_2 = document.createElement('div')
    col6_2.className = "col-6"

    skills.forEach((skill, i) => {
        skillcheck = document.createElement('div')
        skillcheck.className = "mb-1"
        skillcheck.innerHTML += `<input type="checkbox" class="btn-check skill-checkbox" id="${skill.name}" value="${skill.name}" autocomplete="off">
    <label class="d-flex text-center btn btn-outline-primary" for="${skill.name}">${skill.name}</label>`
        if (i < n / 2)
            col6.appendChild(skillcheck)
        else col6_2.appendChild(skillcheck)
    })
    skillCheckboxes.appendChild(col6)
    skillCheckboxes.appendChild(col6_2)

}

// Calcola il bonus dell'abilità
function calculateSkillBonus(skill, stats, proficiencyBonus, proficientSkills) {
    let statModifier = stats[skill.stat];
    let isProficient = proficientSkills.includes(skill.name);
    let bonus = statModifier;

    if (isProficient) {
        bonus += proficiencyBonus; // Aggiungi il bonus di competenza se l'abilità è competente
    }

    return bonus;
}


// Recupera la caratteristica da incantatore
function getSpellcasting() {
    let spellcasting;
    let radios = document.querySelectorAll('.spellcasting');

    radios.forEach(radio => {
        if (radio.checked) {
            spellcasting = radio.id;
        }
    });
    if (spellcasting === "noSC") {
        return spellcasting
    }
    spellcasting = document.querySelector("#" + (spellcasting.replace("SC", ""))).value
    return modifier(spellcasting);
}

// Recupera le abilità con competenza dai checkbox
function getSelectedSkills() {
    let selectedSkills = [];
    let checkboxes = document.querySelectorAll('.skill-checkbox');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedSkills.push(checkbox.value);
        }
    });

    return selectedSkills;
}

// Recupera i tiri salvezza selezionati
function getSelectedSavingThrows() {
    let selectedSavingThrows = [];
    let checkboxes = document.querySelectorAll('.saving-throw-checkbox');

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedSavingThrows.push(checkbox.value);
        }
    });

    return selectedSavingThrows;
}

// Funzione per calcolare il bonus per i tiri salvezza
function calculateSavingThrowBonus(stat, stats, proficiencyBonus, proficientSavingThrows) {
    let statModifier = stats[stat];
    let isProficient = proficientSavingThrows.includes(stat);
    let bonus = statModifier;

    if (isProficient) {
        bonus += proficiencyBonus; // Aggiungi il bonus di competenza se il tiro salvezza è competente
    }

    return bonus;
}

// Funzione per salvare i tiri salvezza nel localStorage
function saveSavingThrows() {
    let proficientSavingThrows = getSelectedSavingThrows();
    localStorage.setItem("proficientSavingThrows", JSON.stringify(proficientSavingThrows));
}

// Funzione per caricare i tiri salvezza selezionati dal localStorage e aggiornare le checkbox
function loadSelectedSavingThrows() {
    let proficientSavingThrows = JSON.parse(localStorage.getItem("proficientSavingThrows")) || [];
    let checkboxes = document.querySelectorAll('.saving-throw-checkbox');

    checkboxes.forEach(checkbox => {
        if (proficientSavingThrows.includes(checkbox.value)) {
            checkbox.checked = true; // Se il tiro salvezza è salvato nel localStorage, seleziona la checkbox
        }
    });
}

function getProficiencyBonus(level) {
    if (level >= 1 && level <= 4) {
        return 2;
    } else if (level >= 5 && level <= 8) {
        return 3;
    } else if (level >= 9 && level <= 12) {
        return 4;
    } else if (level >= 13 && level <= 16) {
        return 5;
    } else if (level >= 17 && level <= 20) {
        return 6;
    } else {
        return null;
    }
}

function modifier(stat) {
    return Math.floor((stat - 10) / 2);
}

function salvaStatistiche() {
    let name = document.getElementById('name').value.trim();
    let level = document.getElementById('level').value;
    let strength = document.getElementById('strength').value;
    let dexterity = document.getElementById('dexterity').value;
    let constitution = document.getElementById('constitution').value;
    let intelligence = document.getElementById('intelligence').value;
    let wisdom = document.getElementById('wisdom').value;
    let charisma = document.getElementById('charisma').value;
    let bonus = getProficiencyBonus(level);
    let stats = {
        "FOR": modifier(strength),
        "DEX": modifier(dexterity),
        "COS": modifier(constitution),
        "INT": modifier(intelligence),
        "SAG": modifier(wisdom),
        "CAR": modifier(charisma),
    };

    // Recupera le abilità selezionate dall'utente
    let proficientSkills = getSelectedSkills();
    // Recupera i tiri salvezza selezionati dall'utente
    let proficientSavingThrows = getSelectedSavingThrows();

    // Salva le abilità e i tiri salvezza nel localStorage
    localStorage.setItem("proficientSkills", JSON.stringify(proficientSkills));
    localStorage.setItem("proficientSavingThrows", JSON.stringify(proficientSavingThrows));

    character = { ...stats };


    let titleModal = name ? name : "Character";
    localStorage.removeItem("Character");

    Object.entries(stats).forEach(function ([key, value], i) {
        let symbol = value < 0 ? "-" : "+";
        let id = "d20" + symbol + Math.abs(value);
        let formula = { "id": id, "name": key };
        saveFormulaToLocalStorage(formula, "Character");

    });



    // Aggiungi anche i tiri salvezza come pulsanti
    ['FOR', 'DEX', 'COS', 'INT', 'SAG', 'CAR'].forEach((stat, i) => {
        let savingThrowBonus = calculateSavingThrowBonus(stat, stats, bonus, proficientSavingThrows);
        let symbol = savingThrowBonus < 0 ? "-" : "+";
        let id = "d20" + symbol + Math.abs(savingThrowBonus);
        let formula = { "id": id, "name": "TS " + stat };

        saveFormulaToLocalStorage(formula, "Character");
    });
    let spellc = getSpellcasting()
    if (spellc === "noSC") {
        saveFormulaToLocalStorage({ id: "", name: "No Incantesimi" }, "Character");
    }
    else {
        let spellcasting = spellc + parseInt(bonus);
        spellcasting = "d20+" + spellcasting;
        saveFormulaToLocalStorage({ id: spellcasting, name: "Tiro per colpire incantesimi: " + spellcasting });
        let formula = { "id": spellcasting, "name": "Tiro per colpire incantesimi" };
        saveFormulaToLocalStorage(formula, "Character");
    }


    skills.forEach(skill => {
        let skillBonus = calculateSkillBonus(skill, stats, bonus, proficientSkills);
        let symbol = skillBonus < 0 ? "-" : "+";
        let id = "d20" + symbol + Math.abs(skillBonus);
        let formula = { "id": id, "name": skill.name };

        saveFormulaToLocalStorage(formula, "Character");
    });




    localStorage.setItem("CharacterName", titleModal);
    closeModal("statsModal");
    location.reload();

}

function createButtonStats(id, name, i = false) {
    let proficientSkills = JSON.parse(localStorage.getItem("proficientSkills")) || [];
    let proficientSavingThrows = JSON.parse(localStorage.getItem("proficientSavingThrows")) || [];
    const rowRollCharModal = document.querySelector("#rowRollCharModal");
    const col = document.createElement('div');
    if (i === 0) {
        i++;
    }
    let numcol = i < 12 && i ? "col-4 " : "col-6 ";
    if (i === 12) {
        numcol = "col-9 mb-3 "
    }
    col.className = numcol + "btn-group p-1 " + ((i >= 3 && i <= 5) || ((i >= 9 && i <= 11)) ? " mb-3 " : "");
    const button = document.createElement('button');
    if (proficientSkills.includes(name) || proficientSavingThrows.includes(name.replace("TS ", ""))) {
        button.className = "btn btn-custom"; // Cambia colore se è competente
    } else {
        button.className = "btn btn-secondary"; // Colore di default
    }
    button.dataset.id = id;
    button.innerHTML = name;

    button.addEventListener('click', function () {
        let result = this.dataset.id;

        if (document.querySelector("#vantaggio").checked === true) {
            result = result.replace("d20", "d20v");
        }
        if (document.querySelector("#svantaggio").checked === true) {
            result = result.replace("d20", "d20s");
        }
        document.getElementById('display').value = result;
        rollDice(false, this.innerText);
        lastButtonWasDice = true;
    });

    col.appendChild(button);
    rowRollCharModal.appendChild(col);
}

function loadModificators() {
    let CharacterName = localStorage.getItem("CharacterName")||"";
    document.querySelectorAll("#nomePG").forEach(el=>el.innerHTML = CharacterName)
    
    const savedFormulas = JSON.parse(localStorage.getItem("Character")) || [];
    document.querySelector("#rowRollCharModal").innerHTML = `<div class="btn-group mb-3" role="group" aria-label="Basic checkbox toggle button group">
        <input type="checkbox" class="btn-check" id="vantaggio" autocomplete="off">
        <label class="btn btn-outline-success" onclick="vantaggiobtnclick()" for="vantaggio">Vantaggio</label>

        <input type="checkbox" class="btn-check" id="svantaggio" autocomplete="off">
        <label class="btn btn-outline-danger" onclick="svantaggiobtnclick()" for="svantaggio">Svantaggio</label>
    </div>`;
    savedFormulas.forEach((formula, i) => {
        createButtonStats(formula.id, formula.name, i);
    });
}

// Carica le abilità e i tiri salvezza selezionati quando si ricarica la pagina
function loadSelectedSkills() {
    let proficientSkills = JSON.parse(localStorage.getItem("proficientSkills")) || [];
    let checkboxes = document.querySelectorAll('.skill-checkbox');

    checkboxes.forEach(checkbox => {
        if (proficientSkills.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
    loadSelectedSavingThrows(); // Carica i tiri salvezza selezionati
}


// Funzione per caricare le abilità con competenza dal localStorage e aggiornare le checkbox
function loadSelectedSkills() {
    // Recupera le abilità con competenza dal localStorage
    let proficientSkills = JSON.parse(localStorage.getItem("proficientSkills")) || [];

    // Aggiorna lo stato delle checkbox in base alle abilità selezionate precedentemente
    let checkboxes = document.querySelectorAll('.skill-checkbox');

    checkboxes.forEach(checkbox => {
        if (proficientSkills.includes(checkbox.value)) {
            checkbox.checked = true; // Se l'abilità è salvata nel localStorage, seleziona la checkbox
        }
    });
}


function loadStatforForce() {
    // Recupera il personaggio salvato nel localStorage
    const character = JSON.parse(localStorage.getItem("Character")) || [];

    // Ottiene il container dove inserire gli input (puoi cambiare l'ID con uno appropriato)
    const statContainer = document.querySelector("#rowforceCharModal");

    // Pulisce il contenitore prima di aggiungere nuovi elementi
    statContainer.innerHTML = "";

    // Scorriamo le statistiche del personaggio
    character.forEach(({ id, name }) => {
        // Estrai il modificatore dall'id (che è nella forma d20+X o d20-X)
        let modifier = id; // Prende il valore del modificatore (+X o -X)

        // Creiamo un div per ogni statistica
        const statDiv = document.createElement('div');
        statDiv.className = "mb-3 col-6";

        // Creiamo la label per la statistica
        const label = document.createElement('label');
        label.setAttribute("for", name);  // Imposta il "for" per legarlo all'input
        label.innerHTML = name;           // Usa il nome della statistica (es. FOR, DEX, Atletica, ecc.)
        label.className = "form-label";

        // Creiamo l'input di testo
        const input = document.createElement('input');
        input.type = "text";
        input.id = name;                   // Imposta l'id con il nome della statistica o abilità
        input.value = modifier;            // Imposta il modificatore estratto dal `id`
        input.className = "form-control";

        // Aggiungiamo la label e l'input al div della statistica
        statDiv.appendChild(label);
        statDiv.appendChild(input);

        // Inseriamo il div della statistica nel container
        statContainer.appendChild(statDiv);
    });
}

function saveModifiedStats() {
    // Recupera il personaggio salvato nel localStorage
    let character = JSON.parse(localStorage.getItem("Character")) || [];

    // Cicla su ogni statistica/abilità nell'array `Character`
    character = character.map(entry => {
        // Trova l'input associato alla statistica/abilità
        let input = document.getElementById(entry.name);

        if (input) {
            // Aggiorna l'ID con il nuovo valore dell'input (modificatore)
            let newValue = input.value.trim(); // Prende il valore modificato

            // Aggiorna l'id mantenendo il formato "d20+X" o "d20-X"
            entry.id = newValue
        }

        return entry;
    });

    // Salva il nuovo array di personaggio nel localStorage
    localStorage.setItem("Character", JSON.stringify(character));

    // Avvisa l'utente che le modifiche sono state salvate (opzionale)
    alert("Modifiche salvate con successo!");
    closeModal("forceStatsModal")
    loadModificators()
}
