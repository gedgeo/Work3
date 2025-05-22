<?php
session_start();

require_once __DIR__ . '/../Modeles/modele.inc.php';
require_once __DIR__ . '/../Modeles/modele_utilisateurs.inc.php';

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

if ($method === 'GET') {
    $action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING);

    switch ($action) {
        case 'getUsers':
            echo json_encode(getAllUsers());
            break;

        case 'deleteUser':
            $id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
            echo json_encode(delUser($id)); // assure-toi que cette fonction existe
            break;

        case 'getClasses':
            $pdo = connexionBdd();
            echo json_encode(getClasses($pdo));
            break;

        default:
            echo json_encode(['error' => "Action GET inconnue : $action"]);
    }

} elseif ($method === 'POST') {
    $action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING); // toujours en GET même en POST

    switch ($action) {
        case 'ajouterClasse':
            $classe = filter_input(INPUT_POST, 'classe', FILTER_SANITIZE_SPECIAL_CHARS);
            if ($classe) {
                $pdo = connexionBdd();
                $resultat = ajouterClasse($pdo, $classe);
                echo json_encode(['success' => $resultat]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Classe invalide']);
            }
            break;

        case 'ajouterUtilisateur':
            $nom = filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_SPECIAL_CHARS);
            $prenom = filter_input(INPUT_POST, 'prenom', FILTER_SANITIZE_SPECIAL_CHARS);
            $id_classes = filter_input(INPUT_POST, 'id_classes', FILTER_VALIDATE_INT);

            if ($nom && $prenom && $id_classes) {
                $pdo = connexionBdd();
                $resultat = ajouterUtilisateur($pdo, $nom, $prenom, $id_classes);
                echo json_encode(['success' => $resultat]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Données utilisateur invalides']);
            }
            break;
            
            case 'modifierUtilisateur':
    $id = filter_input(INPUT_POST, 'id_utilisateur', FILTER_VALIDATE_INT);
    $nom = filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_SPECIAL_CHARS);
    $prenom = filter_input(INPUT_POST, 'prenom', FILTER_SANITIZE_SPECIAL_CHARS);
    $id_classes = filter_input(INPUT_POST, 'id_classes', FILTER_VALIDATE_INT);

    if ($id && $nom && $prenom && $id_classes) {
        $pdo = connexionBdd();
        $resultat = modifierUtilisateur($pdo, $id, $nom, $prenom, $id_classes);
        echo json_encode(['success' => $resultat]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Données invalides pour la modification']);
    }
    break;


        default:
            echo json_encode(['error' => "Action POST inconnue : $action"]);
    }
}