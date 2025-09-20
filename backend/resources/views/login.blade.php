<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion à FarmLink</title>
    <style>
        body { background-color: #f0f4f8; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .form-container { background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 350px; text-align: center; }
        .logo-container { margin-bottom: 20px; }
        .logo { width: 100px; }
        h2 { font-weight: bold; font-size: 24px; color: #333; margin: 0; }
        p { color: #888; margin-top: 5px; margin-bottom: 30px; }
        .form-group { text-align: left; margin-bottom: 20px; }
        label { display: block; font-weight: 600; font-size: 14px; color: #555; margin-bottom: 8px; }
        input[type="email"], input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
        .btn-primary { width: 100%; padding: 12px; background-color: #5b55e3; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
        .btn-primary:hover { background-color: #4a45c7; }
        .forgot-password { display: block; text-align: center; margin-top: 15px; text-decoration: none; color: #5b55e3; font-size: 14px; }
        .btn-secondary { width: 100%; padding: 12px; border: 2px solid #5b55e3; color: #5b55e3; background-color: white; border-radius: 8px; text-decoration: none; display: block; margin-top: 20px; font-weight: bold; }
        .btn-secondary:hover { background-color: #f0f4f8; }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="logo-container">
            <img src="https://via.placeholder.com/100x40" alt="FarmLink Logo" class="logo">
        </div>
        <h2>Connexion à FarmLink</h2>
        <p>Ravi de vous revoir !</p>
        <form method="POST" action="{{ route('login.submit') }}">
            @csrf
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" placeholder="votre.email@exemple.com" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>
            <button type="submit" class="btn-primary">Se connecter</button>
            <a href="{{ route('password.request') }}" class="forgot-password">Mot de passe oublié ?</a>
        </form>
        <a href="{{ route('register.form') }}" class="btn-secondary">Créer un compte</a>
    </div>
</body>
</html>