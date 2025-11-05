<?php
session_start();
require 'db.php';

$message = "";

// --- INSCRIPTION ---
if (isset($_POST['register'])) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    try {
        $stmt->execute([$username, $email, $password]);
        $message = "✅ Compte créé avec succès ! Vous pouvez vous connecter.";
    } catch (PDOException $e) {
        $message = "⚠️ Erreur : cet email est déjà utilisé.";
    }
}

// --- CONNEXION ---
if (isset($_POST['login'])) {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user;
        header("Location: profil.php");
        exit;
    } else {
        $message = "⚠️ Email ou mot de passe incorrect.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Connexion / Inscription</title>
  <link rel="stylesheet" href="style.css">
</head>
<body class="login-body">

  <?php if($message): ?>
    <div class="auth-message"><?= $message ?></div>
  <?php endif; ?>

  <div class="auth-container">

    <!-- Formulaire Connexion -->
    <div class="auth-box">
      <h3>Connexion</h3>
      <form method="POST">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Mot de passe" required>
        <button type="submit" name="login">Se connecter</button>
      </form>
    </div>

    <!-- Formulaire Inscription -->
    <div class="auth-box">
      <h3>Inscription</h3>
      <form method="POST">
        <input type="text" name="username" placeholder="Nom d'utilisateur" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Mot de passe" required>
        <button type="submit" name="register">Créer un compte</button>
      </form>
    </div>

  </div>

</body>
</html>
