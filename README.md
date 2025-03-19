# 📘 API Metrolympiades

## Installation

`npm install`

`npx prisma migrate dev --name init`

`npx prisma generate`

## Start the project

`npm run dev`

---

## Base URL

`https://localhost:3000`

---

## 🔑 Authentification

### 🔹 Inscription

**POST** `/auth/register`

#### Body (JSON)

```json
{
	"email": "captain@example.com",
	"username": "John Doe",
	"password": "securepassword",
	"teamName": "Team Alpha"
}
```

#### Réponse

```json
{
	"id": "user_id",
	"email": "captain@example.com",
	"username": "John Doe",
	"team": {
		"id": "team_id",
		"name": "Team Alpha"
	},
	"token": "jwt_token"
}
```

### 🔹 Connexion

**POST** `/auth/login`

#### Body (JSON)

```json
{
	"email": "captain@example.com",
	"password": "securepassword"
}
```

#### Réponse

```json
{
	"id": "user_id",
	"email": "captain@example.com",
	"name": "John Doe",
	"team": {
		"id": "team_id",
		"name": "Team Alpha"
	},
	"token": "jwt_token"
}
```

---

## 🏆 Gestion des équipes

### 🔹 Récupérer les infos de son équipe

**GET** `/teams/me`

#### Headers

```
Authorization: Bearer jwt_token
```

#### Réponse

```json
{
	"id": "team_id",
	"name": "Team Alpha",
	"members": ["Alice", "Bob", "Charlie"]
}
```

### 🔹 Modifier les informations de son équipe

**PUT** `/teams/me`

#### Headers

```
Authorization: Bearer jwt_token
```

#### Body (JSON)

```json
{
	"name": "Nouvelle Team Alpha",
	"members": ["Alice", "Bob", "Charlie", "Dave"]
}
```

#### Réponse

```json
{
	"message": "Team updated"
}
```

---

## ⚽ Gestion des matchs

### 🔹 Créer un match

**POST** `/matches`

#### Headers

```
Authorization: Bearer jwt_token
```

#### Body (JSON)

```json
{
	"team2Id": "team_id",
	"activityId": "activity_id",
	"startedAt": "2025-04-01T10:00:00Z",
	"team1Score": 0,
	"team2Score": 0
}
```

#### Réponse

```json
{
	"message": "Match created"
}
```

### 🔹 Récupérer les matchs d’une équipe

**GET** `/matches/me`

#### Headers

```
Authorization: Bearer jwt_token
```

#### Réponse

```json
[
	{
		"id": "match_id",
		"team1": "Team Alpha",
		"team2": "Team Beta",
		"activity": "Football",
		"startedAt": "2025-04-01T10:00:00Z",
		"team1Score": 10,
		"team2Score": 8
	}
]
```

---

## 📊 Classement des équipes

### 🔹 Récupérer le classement général

**GET** `/ranking`

#### Réponse

```json
[
	{ "team": "Team Alpha", "points": 9 },
	{ "team": "Team Beta", "points": 6 },
	{ "team": "Team Gamma", "points": 3 }
]
```

---

## 🎯 Gestion des activités

### 🔹 Ajouter une activité

**POST** `/activities`

#### Body (JSON)

```json
{
	"name": "Football"
}
```

#### Réponse

```json
{
  "id": "activity_id",
  "name": "Football",
},
```

### 🔹 Lister les activités disponibles

**GET** `/activities`

#### Réponse

```json
[
	{ "id": "activity_id", "name": "Football" },
	{ "id": "activity_id", "name": "Basketball" }
]
```

---

## ❌ Suppression

### 🔹 Supprimer un match

**DELETE** `/matches/:matchId`

#### Réponse

```json
{
	"message": "Match deleted"
}
```
