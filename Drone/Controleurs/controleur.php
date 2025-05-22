<?php
require_once __DIR__.'/../Modeles/modele.inc.php';

if (filter_input(INPUT_SERVER, 'REQUEST_METHOD') == 'GET') {
    $action = filter_input(INPUT_GET, "action");
    switch ($action) {
        case 'obtenirUtilisateurs':
            header('Content-Type: application/json');
            echo json_encode(obtenirUtilisateurs());
            break;
        default:
            echo json_encode(["error" => "Action non reconnue"]);
            break;
    }
}