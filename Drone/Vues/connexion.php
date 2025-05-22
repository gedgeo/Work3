<!DOCTYPE html>
<html>
    <head>
        <title>Authentification</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">   
        <link href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <script src="libs/bootstrap/js/bootstrap.min.js"></script>
        <script src="libs/jquery/jquery.min.js" ></script>        
        <script src="auth.js" ></script>
    </head>
    <body>

        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">

                    <!-- BOUTONS DE BASCULE -->
                    <div class="text-center mb-4">
                        <button id="showLogin" class="btn btn-primary">Connexion</button>
                    </div>

                    <!-- FORMULAIRE DE CONNEXION -->
                    <div id="loginForm">
                        <h3 class="text-center">Connexion</h3>
                        <form id="formLogin">
                            <div class="mb-3">
                                <label for="loginPseudo" class="form-label">Pseudo</label>
                                <input type="text" class="form-control" id="loginPseudo" required>
                            </div>
                            <div class="mb-3">
                                <label for="loginPassword" class="form-label">Mot de passe</label>
                                <input type="password" class="form-control" id="loginPassword" required>
                            </div>
                            <div class="d-grid">
                                <button type="submit" class="btn btn-success">Se connecter</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>

    </body>
</html>