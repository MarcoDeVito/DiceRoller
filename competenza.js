

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
    character={
        
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
    
    document.querySelector("#rowRollCharModal").innerHTML=""
    let titleModal=name?name:"Character"
    localStorage.removeItem("Character")
    Object.entries(character).forEach(function([key, value]) {
        let symbol= value<0?"-":"+"
        let id="d20"+symbol+Math.abs(value)
        formula={"id":id,"name":key}
        createButtonStats(id,key)
        
        saveFormulaToLocalStorage(formula,"Character")
        
    });
    document.querySelector("#statsModalLabel1").innerHTML=titleModal
    localStorage.setItem("CharacterName",titleModal)    
    // loadFormulas()
    closeModal("statsModal")
  }

  function createButtonStats(id,name){
    const rowRollCharModal=document.querySelector("#rowRollCharModal")
    const col= document.createElement('div')
    col.className="col-4"
    const button= document.createElement('button')
    button.className="btn btn-success w-100 mb-2"
    button.dataset.id = id;
    button.innerHTML=name
   
    button.addEventListener('click', function (event) {
        
        document.getElementById('display').value = this.dataset.id;
        rollDice();
        lastButtonWasDice = true;
    });
    col.appendChild(button)
    rowRollCharModal.appendChild(col)
  }

function loadModificators(){
    let titleModal =localStorage.getItem("CharacterName")
    document.querySelector("#statsModalLabel1").innerHTML=titleModal
    const savedFormulas = JSON.parse(localStorage.getItem("Character")) || [];
    document.querySelector("#rowRollCharModal").innerHTML=""
        savedFormulas.forEach(formula => {
            createButtonStats(formula.id,formula.name)
       
    });
}