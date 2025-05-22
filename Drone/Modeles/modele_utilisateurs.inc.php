<?php

require_once __DIR__ . '/modele.inc.php';
/*
function obtenirDepartementsDeLaRegion($idRegion) {
    try {
        $bdd = connexionBdd();

        $requete = $bdd->prepare('SELECT departement_id, departement_nom FROM departements where departement_region_id = :id;');
        $requete->bindParam(":id", $idRegion);
        $requete->execute();

        $departements = array();
        while ($reponse = $requete->fetch(PDO::FETCH_ASSOC)) {
            array_push($departements, $reponse);
        }
        $requete->closeCursor();
        return $departements;
    } catch (PDOException $exc) {
        print(" Pb obtenirDepartementsDeLaRegion :" . $exc->getMessage());
        die();
    }
}
 * */
 
function getAllUsers()
{
    try {
        $bdd = connexionBdd();

        $sql = "SELECT U.id_utilisateur, U.nom, U.prenom, C.nom_classe 
                FROM UTILISATEURS U
                LEFT JOIN CLASSES C ON U.id_classes = C.id_classes";
        $requete = $bdd->query($sql);

        $users = array();
        while ($ligne = $requete->fetch(PDO::FETCH_ASSOC)) {
            array_push($users, $ligne);
        }
        $requete->closeCursor();
        return $users;
    } catch (PDOException $exc) {
        print("Pb getAllUsers :" . $exc->getMessage());
        die();
    }
}

function getClasses(PDO $pdo): array {
    $stmt = $pdo->query("SELECT id_classes, nom_classe FROM CLASSES");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function delUser(int $id): array {
    $pdo = connexionBdd();
    $stmt = $pdo->prepare("DELETE FROM UTILISATEURS WHERE id_utilisateur = :id");
    $success = $stmt->execute(['id' => $id]);
    return ['success' => $success];
}

