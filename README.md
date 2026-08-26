# La Maison Alba — Menu digital via QR Code

Menu de restaurant consultable en ligne, pensé pour être scanné depuis un QR Code posé en salle. Le client scanne, parcourt la carte par catégorie, ajoute ce qui l'intéresse à un panier pour garder une vue d'ensemble de sa sélection — le tout sans application à installer.

Projet de démonstration réalisé pour présenter ce type de site aux restaurants.

**Démo en ligne : [ak-alb0.github.io](https://ak-alb0.github.io/)**

![Backend](https://img.shields.io/badge/backend-aucun-1a1a1a)
![Responsive](https://img.shields.io/badge/responsive-mobile--first-1a1a1a)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-1a1a1a)

---

## Fonctionnalités

- Carte organisée par catégories (Entrées, Plats, Burgers, Desserts, Boissons), avec filtre au clic
- Fiche produit : photo, nom, description, prix
- Panier latéral : ajout depuis la carte, ajustement des quantités, total en temps réel
- Panier conservé dans `localStorage` — la sélection reste affichée même après fermeture du navigateur
- QR Code généré directement dans la page, pointant vers l'URL du site
- Mise en page responsive, du mobile au grand écran

## Stack technique

HTML, CSS et JavaScript, sans framework ni backend :

- Aucune base de données, aucun serveur à maintenir
- Panier et filtres gérés côté navigateur
- QR Code généré côté client avec [QRCode.js](https://github.com/davidshimjs/qrcodejs), chargé via CDN
- Polices Google Fonts (DM Sans, Playfair Display)

Ce choix est volontaire pour ce projet : un site de ce type n'a pas besoin de plus pour être pleinement fonctionnel et rapide à héberger.

## Structure du projet

```
.
├── index.html          Structure de la page
├── style.css            Mise en page et thème visuel
├── script.js             Données du menu, panier, QR Code
├── assets/
│   └── placeholder.svg   Image de secours si une photo ne charge pas
└── README.md
```

## Utilisation en local

Aucune installation nécessaire : ouvrir `index.html` dans un navigateur suffit.

Pour un rendu identique à l'hébergement (recommandé, notamment pour le QR Code) :

```bash
npx serve .
```

## Déploiement sur GitHub Pages

1. Créer un dépôt GitHub nommé `ak-alb0.github.io`.
2. Ajouter `index.html`, `style.css`, `script.js` et le dossier `assets/` à la racine du dépôt.
3. Aller dans **Settings → Pages**.
4. Choisir **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`.
5. Le site est accessible à `https://ak-alb0.github.io/`.

Le QR Code de la page encode déjà cette adresse.

## Personnalisation

**Menu** — le tableau `products` dans `script.js` centralise chaque plat (catégorie, nom, description, prix, image). Ajouter, modifier ou retirer un plat ne demande de toucher qu'à cette liste.

**Images** — les visuels de démonstration viennent d'Unsplash. Pour utiliser ses propres photos, les déposer dans `assets/` et remplacer les URLs `image:` correspondantes dans `script.js`. Format conseillé : WebP ou AVIF, 1200 px de large maximum.

**QR Code** — il encode la constante `MENU_URL` en haut de `script.js`. La modifier si le site change d'adresse.

## Licence

Projet personnel à but de démonstration.