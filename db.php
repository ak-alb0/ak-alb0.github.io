<?php
$host = 'localhost';
$user = 'Andi';       // ton utilisateur MySQL
$pass = '12345678';       // ton mot de passe MySQL
$dbname = 'boutique'; // le nom de ta base de données

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connexion réussie !";
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>
