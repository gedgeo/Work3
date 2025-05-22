$(document).ready(initApp);

// Fonction pour afficher une alerte Bootstrap dans #alert-container
function showAlert(message, type = 'success') {
    const alertId = `alert-${Date.now()}`;
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
        </div>
    `;
    $('#alert-container').append(alertHtml);

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        $(`#${alertId}`).alert('close');
    }, 5000);
}

// Fonction pour échapper les caractères spéciaux (sécurité XSS)
function escapeHtml(text) {
    return $('<div>').text(text).html();
}

function initApp() {
    loadUserTable();
    loadClassesForSelect();
    initAddClasse();
    initAddUtilisateur();
    initEditUtilisateur();
    initDeleteUtilisateur();
}

// Charge la table des utilisateurs
function loadUserTable() {
    var urlComplete = window.location.href;
    var basePath = urlComplete.substring(0, urlComplete.lastIndexOf("/") + 1);
    var urlJsonFr = basePath + "/libs/datatables/fr-FR.json";

    $.ajax({
        url: '../Controleurs/controleur_utilisateur.php',
        method: 'GET',
        data: { action: 'getUsers' },
        dataType: 'json',
        success: function(users) {
            // Si la table DataTable existe déjà, on la détruit avant de la recréer
            if ( $.fn.DataTable.isDataTable('#user-table') ) {
                $('#user-table').DataTable().clear().destroy();
            }

            $('#user-table').DataTable({
                data: users,
                columns: [
                    { data: 'id_utilisateur', title: 'ID' },
                    { data: 'nom', title: 'Nom', render: function(data) { return escapeHtml(data); } },
                    { data: 'prenom', title: 'Prénom', render: function(data) { return escapeHtml(data); } },
                    { data: 'nom_classe', title: 'Classe', render: function(data) { return escapeHtml(data); } },
                    { 
                        data: null, 
                        title: 'Actions',
                        orderable: false,
                        searchable: false,
                        render: function(data, type, row) {
                            return `
                                <i class="bi bi-pencil-square mod" title="Modifier" style="cursor:pointer;" data-id="${row.id_utilisateur}"></i>
                                &nbsp;&nbsp;
                                <i class="bi bi-trash supp" title="Supprimer" style="cursor:pointer;" data-id="${row.id_utilisateur}"></i>
                            `;
                        }
                    }
                ],
                paging: true,
                searching: true,
                ordering: true,
                language: {
                    url: urlJsonFr
                },
                createdRow: function(row, data, dataIndex) {
                    $(row).attr('data-id', data.id_utilisateur);
                },
                drawCallback: function(settings) {
                    bindTableActions();  // Rebind des actions sur les icônes après chaque redraw
                }
            });
        },
        error: showAjaxError
    });
}

// Charge la liste des classes dans les <select>
function loadClassesForSelect() {
    $.ajax({
        url: '../Controleurs/controleur_utilisateur.php',
        method: 'GET',
        data: { action: 'getClasses' },
        dataType: 'json',
        success: function(classes) {
            let options = '<option value="">-- Sélectionnez une classe --</option>';
            classes.forEach(c => {
                options += `<option value="${c.id_classes}">${escapeHtml(c.nom_classe)}</option>`;
            });
            $('#classeSelect').html(options);
            $('#editClasse').html(options);
        },
        error: showAjaxError
    });
}

// Initialisation de l'ajout de classe
function initAddClasse() {
    $('#ajout').on('click', function(e) {
        e.preventDefault();
        const classe = $('#classeAdd').val().trim();
        if (!classe) {
            showAlert('Veuillez saisir une classe.', 'warning');
            return;
        }
        $.ajax({
            url: '../Controleurs/controleur_utilisateur.php?action=ajouterClasse',
            method: 'POST',
            data: { classe },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('Classe ajoutée avec succès.', 'success');
                    $('#addClasseModal').modal('hide');
                    $('#classeAdd').val('');
                    loadClassesForSelect();
                } else {
                    showAlert('Erreur : ' + (response.message || 'Inconnue.'), 'danger');
                }
            },
            error: showAjaxError
        });
    });
}

// Initialisation de l'ajout d'utilisateur
function initAddUtilisateur() {
    $('#ajoutUtilisateur').on('click', function(e) {
        e.preventDefault();

        const nom = $('#nomAdd').val().trim();
        const prenom = $('#prenomAdd').val().trim();
        const id_classes = $('#classeSelect').val();

        if (!nom || !prenom || !id_classes) {
            showAlert('Veuillez remplir tous les champs.', 'warning');
            return;
        }

        $.ajax({
            url: '../Controleurs/controleur_utilisateur.php?action=ajouterUtilisateur',
            method: 'POST',
            data: { nom, prenom, id_classes },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('Utilisateur ajouté avec succès.', 'success');
                    $('#addUserModal').modal('hide');
                    $('#addUserForm')[0].reset();
                    loadUserTable();
                } else {
                    showAlert('Erreur : ' + (response.message || 'Inconnue.'), 'danger');
                }
            },
            error: showAjaxError
        });
    });
}

// Liaison des actions sur les icônes modifier et supprimer dans la table
function bindTableActions() {
    // Modifier
    $('.mod').off('click').on('click', function() {
        const tr = $(this).closest('tr');
        const id = tr.data('id');
        const nom = tr.children('td').eq(1).text();
        const prenom = tr.children('td').eq(2).text();
        const classeNom = tr.children('td').eq(3).text();

        $('#editUserId').val(id);
        $('#editNom').val(nom);
        $('#editPrenom').val(prenom);

        // Sélectionner la classe correspondante dans le select
        $('#editClasse option').each(function() {
            if ($(this).text() === classeNom) {
                $(this).prop('selected', true);
            }
        });

        $('#editUserModal').modal('show');
    });

    // Supprimer
    $('.supp').off('click').on('click', function() {
        const tr = $(this).closest('tr');
        const id = tr.data('id');
        $('#deleteConfirmModal').data('id', id).modal('show');
    });
}

// Initialisation modification utilisateur
function initEditUtilisateur() {
    $('#modifierUtilisateur').on('click', function(e) {
        e.preventDefault();

        const id = $('#editUserId').val();
        const nom = $('#editNom').val().trim();
        const prenom = $('#editPrenom').val().trim();
        const id_classes = $('#editClasse').val();

        if (!nom || !prenom || !id_classes) {
            showAlert('Veuillez remplir tous les champs.', 'warning');
            return;
        }

        $.ajax({
            url: '../Controleurs/controleur_utilisateur.php?action=modifierUtilisateur',
            method: 'POST',
            data: { id_utilisateur: id, nom, prenom, id_classes },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('Utilisateur modifié avec succès.', 'success');
                    $('#editUserModal').modal('hide');
                    loadUserTable();
                } else {
                    showAlert('Erreur : ' + (response.message || 'Inconnue.'), 'danger');
                }
            },
            error: showAjaxError
        });
    });
}

// Initialisation suppression utilisateur
function initDeleteUtilisateur() {
    $('#confirmDeleteBtn').on('click', function() {
        const id = $('#deleteConfirmModal').data('id');

        $.ajax({
            url: '../Controleurs/controleur_utilisateur.php?action=supprimerUtilisateur',
            method: 'POST',
            data: { id_utilisateur: id },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    showAlert('Utilisateur supprimé avec succès.', 'success');
                    $('#deleteConfirmModal').modal('hide');
                    loadUserTable();
                } else {
                    showAlert('Erreur : ' + (response.message || 'Inconnue.'), 'danger');
                }
            },
            error: showAjaxError
        });
    });
}

// Gestion des erreurs AJAX
function showAjaxError(xhr, status, error) {
    showAlert(`Erreur de communication : ${error}`, 'danger');
}
