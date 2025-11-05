<?php
session_start();

if (!isset($_SESSION['user'])) {
  header("Location: login.php");
  exit;
}

$user = $_SESSION['user'];
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Profil</title>
  <link rel="stylesheet" href="style.css">
</head>
<body style="background:black; color:white; display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column;">
  <h1>Bienvenue, <?= htmlspecialchars($user['username']); ?> 👋</h1>
  <p>Email : <?= htmlspecialchars($user['email']); ?></p>
  <a href="logout.php" style="color:red;">Se déconnecter</a>
</body>
</html>
