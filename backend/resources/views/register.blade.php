<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Créer un compte FarmLink</title>
    <style>
        body { background-color: #f0f4f8; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .form-container { background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 450px; }
        h2 { font-weight: bold; font-size: 24px; color: #333; margin-top: 0; }
        p { color: #888; margin-top: 5px; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; font-size: 14px; color: #555; margin-bottom: 8px; }
        input[type="text"], input[type="email"], input[type="tel"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
        .radio-group { display: flex; gap: 20px; margin-top: 10px; }
        .radio-option { display: flex; align-items: center; gap: 8px; font-size: 16px; }
        .btn-primary { width: 100%; padding: 12px; background-color: #5b55e3; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 20px; }
        .btn-primary:hover { background-color: #4a45c7; }
        .login-link { text-align: center; margin-top: 20px; }
        .login-link a { text-decoration: none; color: #5b55e3; font-weight: bold; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Créer un compte FarmLink</h2>
        <p>Rejoignez notre communauté de fermiers et de consommateurs.</p>
        <form method="POST" action="{{ route('register.submit') }}">
            @csrf
            <div class="form-group">
                <label for="name">Nom complet</label>
                <input type="text" id="name" name="name" placeholder="Votre nom complet" required>
            </div>
            <div class="form-group">
                <label for="email">Adresse e-mail</label>
                <input type="email" id="email" name="email" placeholder="votre.email@exemple.com" required>
            </div>
            <div class="form-group">
                <label for="phone">Numéro de téléphone</label>
                <input type="tel" id="phone" name="phone" placeholder="0123456789" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" placeholder="Votre mot de passe" required>
            </div>
            <div class="form-group">
                <label for="password_confirmation">Confirmer le mot de passe</label>
                <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirmer le mot de passe" required>
            </div>
            
            <div class="form-group">
                <label>Vous êtes...</label>
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="client" name="role" value="client" required>
                        <label for="client">Client</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="agriculteur" name="role" value="agriculteur" required>
                        <label for="agriculteur">Agriculteur</label>
                    </div>
                </div>
            </div>
            
            <button type="submit" class="btn-primary">S'inscrire</button>
        </form>
        <div class="login-link">
            Vous avez déjà un compte ? <a href="{{ route('login.form') }}">Connectez-vous ici</a>.
        </div>
    </div>
</body>
</html>