
let currentEditFormula = null;
let currentListItem = null;

function showEditModal(id, name, listItem) {
    currentEditFormula = { id, name };
    currentListItem = listItem;
    namesplit=name.split(":")
    document.getElementById('editInputName').value = namesplit[0].trim();
    document.getElementById('editInputFormula').value=namesplit[1].trim();
        
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

function confirmEdit() {
    const newName = document.getElementById('editInputName').value;
    const newFormula = document.getElementById('editInputFormula').value;

    if (newName && newFormula) {
        const newSave= currentListItem.querySelector('.btn-secondary')
        newSave.textContent = newName+": "+newFormula;
        newSave.id = newFormula;
        removeFormulaFromLocalStorage(currentEditFormula.id);
        saveFormulaToLocalStorage({ id: newFormula, name: newName+": "+newFormula });
        const savedFormulasElement = document.getElementById('savedFormulas');
        savedFormulasElement.innerHTML=''
        loadFormulas()
        closeModal()
    }
}


function closeModal() {
    const editModal = document.getElementById('editModal');
    const modal = bootstrap.Modal.getInstance(editModal);
    modal.hide();
}