
let currentEditFormula = null;
let currentListItem = null;

function showEditModal(id, name, listItem) {
    currentEditFormula = { id, name };
    currentListItem = listItem;
    document.getElementById('editInputName').value = name
    document.getElementById('editInputFormula').value = id;

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

function confirmEdit() {
    const newName = document.getElementById('editInputName').value;
    const newFormula = document.getElementById('editInputFormula').value;

    if (newName && newFormula) {
        const savedFormulas = JSON.parse(localStorage.getItem("formulas")) || [];
        
        
        const formula = savedFormulas.find(f => f.name === currentEditFormula.name);
        
        
        if (formula) {
            formula.name = newName;
            formula.id = newFormula;
        }
        removeFormulaFromLocalStorage(currentEditFormula.name);
        saveFormulaToLocalStorage(formula);
        const savedFormulasElement = document.getElementById('savedFormulas');
        savedFormulasElement.innerHTML = ''
        closeModal('editModal')
        location.reload();
        
    }
}


function closeModal(modalName) {
    const thisModal = document.getElementById(modalName);
    const modal = bootstrap.Modal.getInstance(thisModal);
    modal.hide();
}
