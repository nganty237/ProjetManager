# 🎬 EXEMPLES D'UTILISATION

## Scénarios Pratiques

---

## 📋 Scénario 1 : Lancer un Nouveau Projet E-commerce

### Étapes

**1. Créer le Projet**
```
Page: Projets → Nouveau Projet

Titre: Refonte Boutique en Ligne
Description: Modernisation du site e-commerce avec React et Stripe
Statut: Planification
Priorité: Haute
Date début: 2024-03-01
Date fin: 2024-08-31
Budget: 80000 €
Tags: Web, E-commerce, React
Équipe: Alice (Chef de projet), Bob (Dev), Claire (Designer)
```

**2. Ajouter les Tâches Principales**

```
Tâche 1:
- Titre: Analyse des besoins clients
- Description: Recueil des exigences et création du cahier des charges
- Statut: À faire
- Priorité: Critique
- Assigné à: Alice Martin
- Date limite: 2024-03-15

Tâche 2:
- Titre: Maquettes UI/UX
- Description: Création des wireframes et design système
- Statut: À faire
- Priorité: Haute
- Assigné à: Claire Bernard
- Date limite: 2024-04-15

Tâche 3:
- Titre: Configuration backend API
- Description: Setup Node.js + Express + MongoDB
- Statut: À faire
- Priorité: Haute
- Assigné à: Bob Dupont
- Date limite: 2024-04-30

Tâche 4:
- Titre: Intégration Stripe
- Description: Paiements sécurisés et webhooks
- Statut: À faire
- Priorité: Critique
- Assigné à: Bob Dupont
- Date limite: 2024-06-15
```

**3. Suivi Hebdomadaire**
- Dashboard → Vérifier progression
- Mettre à jour statuts des tâches
- Ajuster budget dépensé
- Modifier progression globale

---

## 👥 Scénario 2 : Gérer une Équipe de Développement

### Organisation

**Création de 3 Projets Simultanés**

```
Projet A: Application Mobile Banking
- Équipe: Alice, Bob, David
- Tâches: 8 tâches
- Priorité: Critique

Projet B: Dashboard Analytics
- Équipe: Bob, Claire
- Tâches: 5 tâches
- Priorité: Moyenne

Projet C: Site Vitrine Entreprise
- Équipe: Claire, Emma
- Tâches: 4 tâches
- Priorité: Basse
```

**Suivi par Membre**

```
Page Équipe:

Alice Martin (Chef de Projet)
→ 2 projets, 6 tâches, 3 terminées

Bob Dupont (Dev Full-Stack)
→ 3 projets, 10 tâches, 7 terminées

Claire Bernard (Designer)
→ 3 projets, 7 tâches, 5 terminées

David Moreau (Dev Backend)
→ 1 projet, 4 tâches, 2 terminées

Emma Rousseau (QA)
→ 1 projet, 3 tâches, 3 terminées
```

**Répartition Optimale**
- Utiliser vue Kanban pour voir la charge
- Équilibrer les tâches entre membres
- Vérifier les dates d'échéance

---

## 🔍 Scénario 3 : Rechercher et Filtrer Efficacement

### Cas d'Usage

**Trouver tous les projets urgents en retard**

```
1. Page Projets
2. Cliquer "Filtres"
3. Cocher: Priorité "Critique" et "Haute"
4. Cocher: Statut "En cours"
5. Observer Dashboard → Section "Projets en retard"

Résultat: Liste des projets nécessitant attention immédiate
```

**Trouver tous les projets Web**

```
1. Page Projets
2. Barre de recherche: taper "Web"

Résultat: Tous les projets avec tag "Web" ou "Web" dans titre/description
```

**Voir uniquement les projets terminés**

```
1. Page Projets
2. Cliquer "Filtres"
3. Cocher: Statut "Terminé"
4. Changer vue → Grille

Résultat: Cartes de tous les projets complétés
```

---

## 📊 Scénario 4 : Analyser la Performance

### Workflow Mensuel

**Dashboard - Vue d'ensemble**

```
Métriques à Surveiller:

✅ Total Projets: 15
✅ Actifs: 8 (53%)
✅ Terminés: 5 (33%)
✅ En Pause: 2 (14%)

✅ Tâches: 45/120 terminées (38%)
✅ Budget: 850,000 € total
✅ Dépensé: 475,000 € (56%)
```

**Actions Correctives**

```
Si taux de complétion < 50%:
→ Revoir priorités
→ Ajouter ressources
→ Décomposer tâches complexes

Si projets en retard > 3:
→ Alerter stakeholders
→ Ajuster deadlines
→ Revoir scope

Si budget > 70% dépensé et progression < 70%:
→ Alerte dépassement
→ Optimiser ressources
→ Réviser estimations
```

---

## 🔄 Scénario 5 : Workflow Agile Hebdomadaire

### Sprint de 2 Semaines

**Lundi - Planification Sprint**

```
1. Vue Kanban
2. Déplacer tâches de "À faire" vers "En cours"
3. Assigner aux membres disponibles
4. Définir dates d'échéance pour vendredi prochain
```

**Mercredi - Point Milieu Sprint**

```
1. Dashboard → Vérifier progression
2. Tâches bloquées ? → Statut "En révision"
3. Mettre à jour pourcentage progression projet
```

**Vendredi - Revue Sprint**

```
1. Vue Kanban → Colonnes "En révision" et "Terminé"
2. Valider tâches terminées
3. Changer statut → "Terminé"
4. Calculer vélocité: X tâches/sprint
```

**Pattern de Statuts**

```
À faire → En cours → En révision → Terminé
   ↓         ↓           ↓
 (todo)  (in-progress) (review)    (done)
```

---

## 💡 Scénario 6 : Gestion des Urgences

### Nouveau Projet Urgent

**Situation: Bug Critique en Production**

```
1. Créer projet express:
   - Titre: "FIX - Bug Critique Paiements"
   - Statut: En cours
   - Priorité: CRITIQUE 🔥
   - Date fin: Aujourd'hui + 4 heures

2. Ajouter tâches immédiates:
   - Identifier la source
   - Corriger le bug
   - Tester en staging
   - Déployer en prod
   - Vérifier metrics

3. Assigner à l'équipe disponible

4. Dashboard → Sera visible en "Projets en retard" si non terminé à temps

5. Mise à jour temps réel des statuts
```

---

## 📈 Scénario 7 : Reporting Mensuel

### Préparer un Rapport pour la Direction

**Collecte des Données**

```
1. Dashboard - Capturer les 6 cartes de stats:
   - Total projets: 15
   - Actifs: 8
   - Terminés: 5
   - En pause: 2
   - Tâches: 45/120
   - Budget: 475k€ / 850k€

2. Page Projets - Vue Liste:
   - Trier par priorité
   - Identifier projets à risque (rouge)
   - Noter projets en avance (vert)

3. Page Équipe:
   - Performance par membre
   - Taux de complétion
   - Charge de travail

4. Projets en retard:
   - Lister causes
   - Actions correctives
```

**Format du Rapport**

```
📊 RAPPORT MENSUEL - Mars 2024

1. SYNTHÈSE
   - 15 projets actifs
   - 5 terminés ce mois (+25%)
   - 8 en cours (53%)
   - Budget: 56% utilisé

2. PERFORMANCES
   - Tâches: 38% complétées
   - Vélocité: 15 tâches/semaine
   - Qualité: 0 bugs critiques

3. ALERTES
   - 2 projets en retard (Action: Ressources++)
   - 1 projet à risque budget

4. PRÉVISIONS
   - 3 livraisons prévues mois prochain
   - Besoin: 1 développeur supplémentaire
```

---

## 🎯 Scénario 8 : Onboarding Nouveau Membre

### Intégrer Emma (QA Engineer)

**Étapes d'Intégration**

```
1. Ajouter dans l'équipe:
   - Page Équipe → Ajouter nouveau membre
   - Nom: Emma Rousseau
   - Rôle: QA Engineer
   - Email: emma.rousseau@example.com

2. Assigner à 2 projets initiaux:
   - Projet A: Application Mobile (1 tâche simple)
   - Projet B: Dashboard Analytics (2 tâches)

3. Créer tâches d'onboarding:
   - Formation outils (À faire)
   - Setup environnement (À faire)
   - Premier test (À faire)

4. Suivi première semaine:
   - Dashboard → Vérifier progression
   - 3 tâches terminées = Intégration réussie ✅
```

---

## 🔧 Scénario 9 : Maintenance et Optimisation

### Nettoyage Trimestriel

**Audit des Projets**

```
1. Identifier projets "zombies":
   - Filtrer: Statut "En cours"
   - Dernière mise à jour > 30 jours
   - Action: Passer en "En pause" ou "Annulé"

2. Archiver projets terminés:
   - Filtrer: Statut "Terminé"
   - Date fin < 3 mois
   - Action: Exporter données, supprimer

3. Réassigner tâches orphelines:
   - Tâches sans assignation
   - Redistribuer équitablement

4. Mettre à jour budgets:
   - Projets avec budget dépassé
   - Ajuster ou closer
```

---

## 🎨 Scénario 10 : Personnalisation Entreprise

### Adapter à Votre Organisation

**Modifier les Tags**

```
Secteur Tech:
- Frontend, Backend, Mobile, DevOps, QA

Secteur Marketing:
- SEO, Content, Social, Email, Analytics

Secteur Design:
- UI, UX, Branding, Print, Video
```

**Ajuster les Priorités**

```
Startup:
- P0 (Survie) → Critique
- P1 (Growth) → Haute
- P2 (Nice-to-have) → Moyenne

Enterprise:
- Critical Business → Critique
- Revenue Impact → Haute
- Optimization → Moyenne
- Internal → Basse
```

**Personnaliser les Statuts**

```
Agile:
- Backlog → Planification
- Sprint → En cours
- Review → En révision
- Done → Terminé

Waterfall:
- Spec → Planification
- Develop → En cours
- Testing → En révision
- Deployed → Terminé
```

---

## ✨ Conseils Pro

### Raccourcis Mentaux

**Règle des 3**
- Pas plus de 3 projets "Critique" simultanés
- Pas plus de 3 tâches "À faire" par personne
- Check dashboard minimum 3x/semaine

**Codes Couleur**
- 🔴 Rouge = Attention immédiate
- 🟠 Orange = Surveillance
- 🟢 Vert = On track
- 🔵 Bleu = En préparation

**Rituels**
- Lundi: Planification (Vue Kanban)
- Mercredi: Check-in (Dashboard)
- Vendredi: Revue (Stats + Équipe)

---

## 📱 Cas d'Usage par Rôle

### Chef de Projet
```
- Vue principale: Dashboard
- Action quotidienne: Vérifier projets en retard
- Outil favori: Filtres avancés
```

### Développeur
```
- Vue principale: Projets (Liste)
- Action quotidienne: Mettre à jour statuts tâches
- Outil favori: Vue Kanban
```

### Designer
```
- Vue principale: Projets (Grille)
- Action quotidienne: Checker dates d'échéance
- Outil favori: Tags visuels
```

### Manager
```
- Vue principale: Dashboard + Équipe
- Action hebdomadaire: Reporting et réallocation
- Outil favori: Statistiques globales
```

---

🎯 **Ces exemples montrent la flexibilité de l'application pour s'adapter à vos workflows !**
