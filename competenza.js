const skills = [
    { name: 'Atletica', stat: 'FOR' },
    { name: 'Acrobazia', stat: 'DEX' },
    { name: 'Rapidità di mano', stat: 'DEX' },
    { name: 'Furtività', stat: 'DEX' },
    { name: 'Arcano', stat: 'INT' },
    { name: 'Indagare', stat: 'INT' },
    { name: 'Storia', stat: 'INT' },
    { name: 'Natura', stat: 'INT' },
    { name: 'Religione', stat: 'INT' },
    { name: 'Percezione', stat: 'SAG' },
    { name: 'Intuizione', stat: 'SAG' },
    { name: 'Medicina', stat: 'SAG' },
    { name: 'Sopravvivenza', stat: 'SAG' },
    { name: 'Addestrare animali', stat: 'SAG' },
    { name: 'Persuasione', stat: 'CAR' },
    { name: 'Intimidazione', stat: 'CAR' },
    { name: 'Inganno', stat: 'CAR' },
    { name: 'Intrattenere', stat: 'CAR' },
];



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
    return Math.floor((stat-10)/2)
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
    let stats ={
        
        // "level" : parseInt(level),
        "FOR" : modifier(strength),
        "DEX" : modifier(dexterity),
        "COS" : modifier(constitution),
        "INT" : modifier(intelligence),
        "SAG" : modifier(wisdom),
        "CAR" : modifier(charisma),
        // "proficency":bonus,
        // "name": name,
    }

    // Recupera le abilità selezionate dall'utente
    let proficientSkills = getSelectedSkills();

    // Salva le abilità con competenza nel localStorage
    localStorage.setItem("proficientSkills", JSON.stringify(proficientSkills));
    character = {
        ...stats,
    };

   

    let rowRollCharModal=document.querySelector("#rowRollCharModal").innerHTML=`<div class="btn-group mb-3" role="group" aria-label="Basic checkbox toggle button group">
  <input type="checkbox" class="btn-check" id="vantaggio" autocomplete="off">
  <label class="btn btn-outline-success" for="vantaggio">Vantaggio</label>

  <input type="checkbox" class="btn-check" id="svantaggio" autocomplete="off">
  <label class="btn btn-outline-danger" for="svantaggio">Svantaggio</label>

</div>`
    let titleModal=name?name:"Character"
    localStorage.removeItem("Character")

    Object.entries(stats).forEach(function ([key, value],i) {
                
        let symbol = value < 0 ? "-" : "+";
        let id = "d20" + symbol + Math.abs(value);
        let formula = { "id": id, "name": key };
        createButtonStats(id, key,i);
        saveFormulaToLocalStorage(formula, "Character");
    });

    skills.forEach(skill => {
        let skillBonus = calculateSkillBonus(skill, stats, bonus, proficientSkills);
        let symbol = skillBonus < 0 ? "-" : "+";
        let id = "d20" + symbol + Math.abs(skillBonus);
        let formula = { "id": id, "name": skill.name };
        createButtonStats(id, skill.name);
        saveFormulaToLocalStorage(formula, "Character");
    });

    document.querySelector("#statsModalLabel1").innerHTML=titleModal
    localStorage.setItem("CharacterName",titleModal)    
    // loadFormulas()
    closeModal("statsModal")
  }

  function createButtonStats(id,name,i=false){
    // Recupera le abilità con competenza dal localStorage
    let proficientSkills = JSON.parse(localStorage.getItem("proficientSkills")) || [];
    const rowRollCharModal=document.querySelector("#rowRollCharModal")
    const col= document.createElement('div')
    if (i===0) {
        i++
    }
    let numcol= i<6&&i?"col-4 ":"col-6 "
    col.className=numcol+"btn-group p-1 btn-group-lg"+(i===3||i===4||i===5?" mb-3 ":"")
    const button= document.createElement('button')
     // Verifica se l'abilità è competente e assegna una classe di colore diversa
     if (proficientSkills.includes(name)) {
        button.className = "btn btn-success"; // Cambia colore se l'abilità ha competenza
    } else {
        button.className = "btn btn-secondary"; // Colore di default
    }
    button.dataset.id = id;
    button.innerHTML=name
    // const buttonv= document.createElement('button')
    // buttonv.className="btn btn-success"
    // buttonv.dataset.id = id.replace("d20", "d20v");
    // buttonv.innerHTML="V"
    // const buttons= document.createElement('button')
    // buttons.className="btn btn-danger"
    // buttons.dataset.id = id.replace("d20", "d20s");
    // buttons.innerHTML="S"
   

    // let buttonn=[button,buttons,buttonv]
    let buttonn=[button]
    buttonn.forEach(function(element) {
    element.addEventListener('click', function (event) {
        let result = this.dataset.id
                
        if(document.querySelector("#vantaggio").checked===true){
            result= result.replace("d20", "d20v");
            }
        if(document.querySelector("#svantaggio").checked===true){
            result= result.replace("d20", "d20s");
            }
        document.getElementById('display').value = result;
        rollDice();
        lastButtonWasDice = true;
    });
});
    
col.appendChild(button)
    // col.appendChild(buttonv)
    // col.appendChild(buttons)
    rowRollCharModal.appendChild(col)
  }

function loadModificators(){
    let titleModal =localStorage.getItem("CharacterName")
    document.querySelector("#statsModalLabel1").innerHTML=titleModal
    const savedFormulas = JSON.parse(localStorage.getItem("Character")) || [];
    document.querySelector("#rowRollCharModal").innerHTML=`<div class="btn-group mb-3" role="group" aria-label="Basic checkbox toggle button group">
  <input type="checkbox" class="btn-check" id="vantaggio" autocomplete="off">
  <label class="btn btn-outline-success" for="vantaggio">Vantaggio</label>

  <input type="checkbox" class="btn-check" id="svantaggio" autocomplete="off">
  <label class="btn btn-outline-danger" for="svantaggio">Svantaggio</label>

</div>`
        savedFormulas.forEach((formula,i) => {
            createButtonStats(formula.id,formula.name,i)
       
    });
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
