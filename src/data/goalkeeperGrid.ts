// Griglia Portieri Ufficiale Serie A (Incroci e sfasamento trasferte)
// Calcolata sia per l'intera stagione (38 giornate) sia a partire dalla 6ª giornata (33 turni rimanenti)

export const GOALKEEPER_GRID_TEAMS = [
  "Atalanta",
  "Bologna",
  "Cagliari",
  "Como",
  "Fiorentina",
  "Frosinone",
  "Genoa",
  "Inter",
  "Juventus",
  "Lazio",
  "Lecce",
  "Milan",
  "Monza",
  "Napoli",
  "Parma",
  "Roma",
  "Sassuolo",
  "Torino",
  "Udinese",
  "Venezia"
] as const;

export type GridTeam = typeof GOALKEEPER_GRID_TEAMS[number];

// MATRICE RICALCOLATA DALLA 6ª ALLA 38ª GIORNATA (33 TURNI RIMANENTI - ESCLUSE LE PRIME 5 GIORNATE GIÀ DISPUTATE)
export const GOALKEEPER_GRID_MATRIX_FROM_MD6: Record<string, Record<string, number>> = {
  "Atalanta": {
    "Atalanta": 0,
    "Bologna": 6,
    "Cagliari": 5,
    "Como": 8,
    "Fiorentina": 8,
    "Frosinone": 5,
    "Genoa": 7,
    "Inter": 7,
    "Juventus": 10,
    "Lazio": 10,
    "Lecce": 11,
    "Milan": 10,
    "Monza": 6,
    "Napoli": 9,
    "Parma": 7,
    "Roma": 7,
    "Sassuolo": 12,
    "Torino": 7,
    "Udinese": 10,
    "Venezia": 8
  },
  "Bologna": {
    "Atalanta": 6,
    "Bologna": 0,
    "Cagliari": 8,
    "Como": 11,
    "Fiorentina": 9,
    "Frosinone": 9,
    "Genoa": 6,
    "Inter": 8,
    "Juventus": 10,
    "Lazio": 7,
    "Lecce": 6,
    "Milan": 9,
    "Monza": 12,
    "Napoli": 6,
    "Parma": 9,
    "Roma": 10,
    "Sassuolo": 6,
    "Torino": 7,
    "Udinese": 8,
    "Venezia": 6
  },
  "Cagliari": {
    "Atalanta": 5,
    "Bologna": 8,
    "Cagliari": 0,
    "Como": 9,
    "Fiorentina": 4,
    "Frosinone": 7,
    "Genoa": 9,
    "Inter": 11,
    "Juventus": 6,
    "Lazio": 9,
    "Lecce": 8,
    "Milan": 5,
    "Monza": 7,
    "Napoli": 10,
    "Parma": 9,
    "Roma": 7,
    "Sassuolo": 6,
    "Torino": 10,
    "Udinese": 8,
    "Venezia": 6
  },
  "Como": {
    "Atalanta": 8,
    "Bologna": 11,
    "Cagliari": 9,
    "Como": 0,
    "Fiorentina": 5,
    "Frosinone": 5,
    "Genoa": 5,
    "Inter": 8,
    "Juventus": 7,
    "Lazio": 7,
    "Lecce": 10,
    "Milan": 7,
    "Monza": 7,
    "Napoli": 4,
    "Parma": 6,
    "Roma": 8,
    "Sassuolo": 8,
    "Torino": 8,
    "Udinese": 7,
    "Venezia": 5
  },
  "Fiorentina": {
    "Atalanta": 8,
    "Bologna": 9,
    "Cagliari": 4,
    "Como": 5,
    "Fiorentina": 0,
    "Frosinone": 9,
    "Genoa": 8,
    "Inter": 10,
    "Juventus": 9,
    "Lazio": 5,
    "Lecce": 5,
    "Milan": 7,
    "Monza": 10,
    "Napoli": 6,
    "Parma": 11,
    "Roma": 12,
    "Sassuolo": 6,
    "Torino": 8,
    "Udinese": 10,
    "Venezia": 11
  },
  "Frosinone": {
    "Atalanta": 5,
    "Bologna": 9,
    "Cagliari": 7,
    "Como": 5,
    "Fiorentina": 9,
    "Frosinone": 0,
    "Genoa": 13,
    "Inter": 9,
    "Juventus": 8,
    "Lazio": 7,
    "Lecce": 7,
    "Milan": 8,
    "Monza": 6,
    "Napoli": 6,
    "Parma": 9,
    "Roma": 10,
    "Sassuolo": 6,
    "Torino": 9,
    "Udinese": 8,
    "Venezia": 12
  },
  "Genoa": {
    "Atalanta": 7,
    "Bologna": 6,
    "Cagliari": 9,
    "Como": 5,
    "Fiorentina": 8,
    "Frosinone": 13,
    "Genoa": 0,
    "Inter": 10,
    "Juventus": 5,
    "Lazio": 8,
    "Lecce": 7,
    "Milan": 7,
    "Monza": 7,
    "Napoli": 9,
    "Parma": 8,
    "Roma": 9,
    "Sassuolo": 6,
    "Torino": 12,
    "Udinese": 6,
    "Venezia": 11
  },
  "Inter": {
    "Atalanta": 7,
    "Bologna": 8,
    "Cagliari": 11,
    "Como": 8,
    "Fiorentina": 10,
    "Frosinone": 9,
    "Genoa": 10,
    "Inter": 0,
    "Juventus": 7,
    "Lazio": 6,
    "Lecce": 7,
    "Milan": 0,
    "Monza": 7,
    "Napoli": 9,
    "Parma": 12,
    "Roma": 11,
    "Sassuolo": 3,
    "Torino": 10,
    "Udinese": 11,
    "Venezia": 7
  },
  "Juventus": {
    "Atalanta": 10,
    "Bologna": 10,
    "Cagliari": 6,
    "Como": 7,
    "Fiorentina": 9,
    "Frosinone": 8,
    "Genoa": 5,
    "Inter": 7,
    "Juventus": 0,
    "Lazio": 12,
    "Lecce": 11,
    "Milan": 10,
    "Monza": 8,
    "Napoli": 11,
    "Parma": 9,
    "Roma": 5,
    "Sassuolo": 9,
    "Torino": 0,
    "Udinese": 8,
    "Venezia": 8
  },
  "Lazio": {
    "Atalanta": 10,
    "Bologna": 7,
    "Cagliari": 9,
    "Como": 7,
    "Fiorentina": 5,
    "Frosinone": 7,
    "Genoa": 8,
    "Inter": 6,
    "Juventus": 12,
    "Lazio": 0,
    "Lecce": 10,
    "Milan": 10,
    "Monza": 5,
    "Napoli": 13,
    "Parma": 7,
    "Roma": 0,
    "Sassuolo": 9,
    "Torino": 4,
    "Udinese": 8,
    "Venezia": 7
  },
  "Lecce": {
    "Atalanta": 11,
    "Bologna": 6,
    "Cagliari": 8,
    "Como": 10,
    "Fiorentina": 5,
    "Frosinone": 7,
    "Genoa": 7,
    "Inter": 7,
    "Juventus": 11,
    "Lazio": 10,
    "Lecce": 0,
    "Milan": 9,
    "Monza": 4,
    "Napoli": 8,
    "Parma": 4,
    "Roma": 6,
    "Sassuolo": 11,
    "Torino": 5,
    "Udinese": 7,
    "Venezia": 8
  },
  "Milan": {
    "Atalanta": 10,
    "Bologna": 9,
    "Cagliari": 5,
    "Como": 7,
    "Fiorentina": 7,
    "Frosinone": 8,
    "Genoa": 7,
    "Inter": 0,
    "Juventus": 10,
    "Lazio": 10,
    "Lecce": 9,
    "Milan": 0,
    "Monza": 9,
    "Napoli": 7,
    "Parma": 5,
    "Roma": 6,
    "Sassuolo": 13,
    "Torino": 6,
    "Udinese": 6,
    "Venezia": 10
  },
  "Monza": {
    "Atalanta": 6,
    "Bologna": 12,
    "Cagliari": 7,
    "Como": 7,
    "Fiorentina": 10,
    "Frosinone": 6,
    "Genoa": 7,
    "Inter": 7,
    "Juventus": 8,
    "Lazio": 5,
    "Lecce": 4,
    "Milan": 9,
    "Monza": 0,
    "Napoli": 8,
    "Parma": 8,
    "Roma": 11,
    "Sassuolo": 8,
    "Torino": 8,
    "Udinese": 8,
    "Venezia": 5
  },
  "Napoli": {
    "Atalanta": 9,
    "Bologna": 6,
    "Cagliari": 10,
    "Como": 4,
    "Fiorentina": 6,
    "Frosinone": 6,
    "Genoa": 9,
    "Inter": 9,
    "Juventus": 11,
    "Lazio": 13,
    "Lecce": 8,
    "Milan": 7,
    "Monza": 8,
    "Napoli": 0,
    "Parma": 8,
    "Roma": 3,
    "Sassuolo": 8,
    "Torino": 5,
    "Udinese": 8,
    "Venezia": 6
  },
  "Parma": {
    "Atalanta": 7,
    "Bologna": 9,
    "Cagliari": 9,
    "Como": 6,
    "Fiorentina": 11,
    "Frosinone": 9,
    "Genoa": 8,
    "Inter": 12,
    "Juventus": 9,
    "Lazio": 7,
    "Lecce": 4,
    "Milan": 5,
    "Monza": 8,
    "Napoli": 8,
    "Parma": 0,
    "Roma": 10,
    "Sassuolo": 4,
    "Torino": 8,
    "Udinese": 9,
    "Venezia": 10
  },
  "Roma": {
    "Atalanta": 7,
    "Bologna": 10,
    "Cagliari": 7,
    "Como": 8,
    "Fiorentina": 12,
    "Frosinone": 10,
    "Genoa": 9,
    "Inter": 11,
    "Juventus": 5,
    "Lazio": 0,
    "Lecce": 6,
    "Milan": 6,
    "Monza": 11,
    "Napoli": 3,
    "Parma": 10,
    "Roma": 0,
    "Sassuolo": 7,
    "Torino": 12,
    "Udinese": 9,
    "Venezia": 10
  },
  "Sassuolo": {
    "Atalanta": 12,
    "Bologna": 6,
    "Cagliari": 6,
    "Como": 8,
    "Fiorentina": 6,
    "Frosinone": 6,
    "Genoa": 6,
    "Inter": 3,
    "Juventus": 9,
    "Lazio": 9,
    "Lecce": 11,
    "Milan": 13,
    "Monza": 8,
    "Napoli": 8,
    "Parma": 4,
    "Roma": 7,
    "Sassuolo": 0,
    "Torino": 7,
    "Udinese": 7,
    "Venezia": 8
  },
  "Torino": {
    "Atalanta": 7,
    "Bologna": 7,
    "Cagliari": 10,
    "Como": 8,
    "Fiorentina": 8,
    "Frosinone": 9,
    "Genoa": 12,
    "Inter": 10,
    "Juventus": 0,
    "Lazio": 4,
    "Lecce": 5,
    "Milan": 6,
    "Monza": 8,
    "Napoli": 5,
    "Parma": 8,
    "Roma": 12,
    "Sassuolo": 7,
    "Torino": 0,
    "Udinese": 9,
    "Venezia": 9
  },
  "Udinese": {
    "Atalanta": 10,
    "Bologna": 8,
    "Cagliari": 8,
    "Como": 7,
    "Fiorentina": 10,
    "Frosinone": 8,
    "Genoa": 6,
    "Inter": 11,
    "Juventus": 8,
    "Lazio": 8,
    "Lecce": 7,
    "Milan": 6,
    "Monza": 8,
    "Napoli": 8,
    "Parma": 9,
    "Roma": 9,
    "Sassuolo": 7,
    "Torino": 9,
    "Udinese": 0,
    "Venezia": 6
  },
  "Venezia": {
    "Atalanta": 8,
    "Bologna": 6,
    "Cagliari": 6,
    "Como": 5,
    "Fiorentina": 11,
    "Frosinone": 12,
    "Genoa": 11,
    "Inter": 7,
    "Juventus": 8,
    "Lazio": 7,
    "Lecce": 8,
    "Milan": 10,
    "Monza": 5,
    "Napoli": 6,
    "Parma": 10,
    "Roma": 10,
    "Sassuolo": 8,
    "Torino": 9,
    "Udinese": 6,
    "Venezia": 0
  }
};

// MATRICE STAGIONE COMPLETA (38 GIORNATE)
export const GOALKEEPER_GRID_MATRIX_FULL: Record<string, Record<string, number>> = {
  "Atalanta": {
    "Atalanta": 0,
    "Bologna": 6,
    "Cagliari": 6,
    "Como": 10,
    "Fiorentina": 8,
    "Frosinone": 5,
    "Genoa": 8,
    "Inter": 8,
    "Juventus": 10,
    "Lazio": 12,
    "Lecce": 13,
    "Milan": 11,
    "Monza": 7,
    "Napoli": 11,
    "Parma": 7,
    "Roma": 7,
    "Sassuolo": 14,
    "Torino": 9,
    "Udinese": 10,
    "Venezia": 9
  },
  "Bologna": {
    "Atalanta": 6,
    "Bologna": 0,
    "Cagliari": 9,
    "Como": 12,
    "Fiorentina": 10,
    "Frosinone": 11,
    "Genoa": 7,
    "Inter": 9,
    "Juventus": 11,
    "Lazio": 7,
    "Lecce": 6,
    "Milan": 10,
    "Monza": 13,
    "Napoli": 6,
    "Parma": 11,
    "Roma": 12,
    "Sassuolo": 6,
    "Torino": 8,
    "Udinese": 10,
    "Venezia": 7
  },
  "Cagliari": {
    "Atalanta": 6,
    "Bologna": 9,
    "Cagliari": 0,
    "Como": 11,
    "Fiorentina": 6,
    "Frosinone": 8,
    "Genoa": 10,
    "Inter": 12,
    "Juventus": 8,
    "Lazio": 11,
    "Lecce": 10,
    "Milan": 7,
    "Monza": 9,
    "Napoli": 12,
    "Parma": 10,
    "Roma": 8,
    "Sassuolo": 8,
    "Torino": 11,
    "Udinese": 9,
    "Venezia": 6
  },
  "Como": {
    "Atalanta": 10,
    "Bologna": 12,
    "Cagliari": 11,
    "Como": 0,
    "Fiorentina": 6,
    "Frosinone": 6,
    "Genoa": 7,
    "Inter": 10,
    "Juventus": 8,
    "Lazio": 10,
    "Lecce": 13,
    "Milan": 9,
    "Monza": 9,
    "Napoli": 7,
    "Parma": 7,
    "Roma": 9,
    "Sassuolo": 11,
    "Torino": 11,
    "Udinese": 8,
    "Venezia": 7
  },
  "Fiorentina": {
    "Atalanta": 8,
    "Bologna": 10,
    "Cagliari": 6,
    "Como": 6,
    "Fiorentina": 0,
    "Frosinone": 10,
    "Genoa": 8,
    "Inter": 10,
    "Juventus": 11,
    "Lazio": 6,
    "Lecce": 6,
    "Milan": 9,
    "Monza": 12,
    "Napoli": 7,
    "Parma": 12,
    "Roma": 13,
    "Sassuolo": 7,
    "Torino": 8,
    "Udinese": 11,
    "Venezia": 11
  },
  "Frosinone": {
    "Atalanta": 5,
    "Bologna": 11,
    "Cagliari": 8,
    "Como": 6,
    "Fiorentina": 10,
    "Frosinone": 0,
    "Genoa": 14,
    "Inter": 10,
    "Juventus": 9,
    "Lazio": 7,
    "Lecce": 7,
    "Milan": 9,
    "Monza": 7,
    "Napoli": 6,
    "Parma": 11,
    "Roma": 12,
    "Sassuolo": 6,
    "Torino": 10,
    "Udinese": 10,
    "Venezia": 13
  },
  "Genoa": {
    "Atalanta": 8,
    "Bologna": 7,
    "Cagliari": 10,
    "Como": 7,
    "Fiorentina": 8,
    "Frosinone": 14,
    "Genoa": 0,
    "Inter": 12,
    "Juventus": 5,
    "Lazio": 9,
    "Lecce": 8,
    "Milan": 7,
    "Monza": 7,
    "Napoli": 10,
    "Parma": 9,
    "Roma": 10,
    "Sassuolo": 7,
    "Torino": 14,
    "Udinese": 7,
    "Venezia": 12
  },
  "Inter": {
    "Atalanta": 8,
    "Bologna": 9,
    "Cagliari": 12,
    "Como": 10,
    "Fiorentina": 10,
    "Frosinone": 10,
    "Genoa": 12,
    "Inter": 0,
    "Juventus": 7,
    "Lazio": 7,
    "Lecce": 8,
    "Milan": 0,
    "Monza": 7,
    "Napoli": 10,
    "Parma": 13,
    "Roma": 12,
    "Sassuolo": 4,
    "Torino": 12,
    "Udinese": 12,
    "Venezia": 8
  },
  "Juventus": {
    "Atalanta": 10,
    "Bologna": 11,
    "Cagliari": 8,
    "Como": 8,
    "Fiorentina": 11,
    "Frosinone": 9,
    "Genoa": 5,
    "Inter": 7,
    "Juventus": 0,
    "Lazio": 13,
    "Lecce": 12,
    "Milan": 12,
    "Monza": 10,
    "Napoli": 12,
    "Parma": 10,
    "Roma": 6,
    "Sassuolo": 10,
    "Torino": 0,
    "Udinese": 9,
    "Venezia": 8
  },
  "Lazio": {
    "Atalanta": 12,
    "Bologna": 7,
    "Cagliari": 11,
    "Como": 10,
    "Fiorentina": 6,
    "Frosinone": 7,
    "Genoa": 9,
    "Inter": 7,
    "Juventus": 13,
    "Lazio": 0,
    "Lecce": 13,
    "Milan": 12,
    "Monza": 7,
    "Napoli": 16,
    "Parma": 7,
    "Roma": 0,
    "Sassuolo": 12,
    "Torino": 6,
    "Udinese": 8,
    "Venezia": 8
  },
  "Lecce": {
    "Atalanta": 13,
    "Bologna": 6,
    "Cagliari": 10,
    "Como": 13,
    "Fiorentina": 6,
    "Frosinone": 7,
    "Genoa": 8,
    "Inter": 8,
    "Juventus": 12,
    "Lazio": 13,
    "Lecce": 0,
    "Milan": 11,
    "Monza": 6,
    "Napoli": 11,
    "Parma": 4,
    "Roma": 6,
    "Sassuolo": 14,
    "Torino": 7,
    "Udinese": 7,
    "Venezia": 9
  },
  "Milan": {
    "Atalanta": 11,
    "Bologna": 10,
    "Cagliari": 7,
    "Como": 9,
    "Fiorentina": 9,
    "Frosinone": 9,
    "Genoa": 7,
    "Inter": 0,
    "Juventus": 12,
    "Lazio": 12,
    "Lecce": 11,
    "Milan": 0,
    "Monza": 12,
    "Napoli": 9,
    "Parma": 6,
    "Roma": 7,
    "Sassuolo": 15,
    "Torino": 7,
    "Udinese": 7,
    "Venezia": 11
  },
  "Monza": {
    "Atalanta": 7,
    "Bologna": 13,
    "Cagliari": 9,
    "Como": 9,
    "Fiorentina": 12,
    "Frosinone": 7,
    "Genoa": 7,
    "Inter": 7,
    "Juventus": 10,
    "Lazio": 7,
    "Lecce": 6,
    "Milan": 12,
    "Monza": 0,
    "Napoli": 10,
    "Parma": 9,
    "Roma": 12,
    "Sassuolo": 10,
    "Torino": 9,
    "Udinese": 9,
    "Venezia": 6
  },
  "Napoli": {
    "Atalanta": 11,
    "Bologna": 6,
    "Cagliari": 12,
    "Como": 7,
    "Fiorentina": 7,
    "Frosinone": 6,
    "Genoa": 10,
    "Inter": 10,
    "Juventus": 12,
    "Lazio": 16,
    "Lecce": 11,
    "Milan": 9,
    "Monza": 10,
    "Napoli": 0,
    "Parma": 8,
    "Roma": 3,
    "Sassuolo": 11,
    "Torino": 7,
    "Udinese": 8,
    "Venezia": 7
  },
  "Parma": {
    "Atalanta": 7,
    "Bologna": 11,
    "Cagliari": 10,
    "Como": 7,
    "Fiorentina": 12,
    "Frosinone": 11,
    "Genoa": 9,
    "Inter": 13,
    "Juventus": 10,
    "Lazio": 7,
    "Lecce": 4,
    "Milan": 6,
    "Monza": 9,
    "Napoli": 8,
    "Parma": 0,
    "Roma": 12,
    "Sassuolo": 4,
    "Torino": 9,
    "Udinese": 11,
    "Venezia": 11
  },
  "Roma": {
    "Atalanta": 7,
    "Bologna": 12,
    "Cagliari": 8,
    "Como": 9,
    "Fiorentina": 13,
    "Frosinone": 12,
    "Genoa": 10,
    "Inter": 12,
    "Juventus": 6,
    "Lazio": 0,
    "Lecce": 6,
    "Milan": 7,
    "Monza": 12,
    "Napoli": 3,
    "Parma": 12,
    "Roma": 0,
    "Sassuolo": 7,
    "Torino": 13,
    "Udinese": 11,
    "Venezia": 11
  },
  "Sassuolo": {
    "Atalanta": 14,
    "Bologna": 6,
    "Cagliari": 8,
    "Como": 11,
    "Fiorentina": 7,
    "Frosinone": 6,
    "Genoa": 7,
    "Inter": 4,
    "Juventus": 10,
    "Lazio": 12,
    "Lecce": 14,
    "Milan": 15,
    "Monza": 10,
    "Napoli": 11,
    "Parma": 4,
    "Roma": 7,
    "Sassuolo": 0,
    "Torino": 9,
    "Udinese": 7,
    "Venezia": 9
  },
  "Torino": {
    "Atalanta": 9,
    "Bologna": 8,
    "Cagliari": 11,
    "Como": 11,
    "Fiorentina": 8,
    "Frosinone": 10,
    "Genoa": 14,
    "Inter": 12,
    "Juventus": 0,
    "Lazio": 6,
    "Lecce": 7,
    "Milan": 7,
    "Monza": 9,
    "Napoli": 7,
    "Parma": 9,
    "Roma": 13,
    "Sassuolo": 9,
    "Torino": 0,
    "Udinese": 10,
    "Venezia": 11
  },
  "Udinese": {
    "Atalanta": 10,
    "Bologna": 10,
    "Cagliari": 9,
    "Como": 8,
    "Fiorentina": 11,
    "Frosinone": 10,
    "Genoa": 7,
    "Inter": 12,
    "Juventus": 9,
    "Lazio": 8,
    "Lecce": 7,
    "Milan": 7,
    "Monza": 9,
    "Napoli": 8,
    "Parma": 11,
    "Roma": 11,
    "Sassuolo": 7,
    "Torino": 10,
    "Udinese": 0,
    "Venezia": 7
  },
  "Venezia": {
    "Atalanta": 9,
    "Bologna": 7,
    "Cagliari": 6,
    "Como": 7,
    "Fiorentina": 11,
    "Frosinone": 13,
    "Genoa": 12,
    "Inter": 8,
    "Juventus": 8,
    "Lazio": 8,
    "Lecce": 9,
    "Milan": 11,
    "Monza": 6,
    "Napoli": 7,
    "Parma": 11,
    "Roma": 11,
    "Sassuolo": 9,
    "Torino": 11,
    "Udinese": 7,
    "Venezia": 0
  }
};

// Default di riferimento: impostato sulla matrice attiva dalla 6ª giornata (33 turni rimanenti)
export const GOALKEEPER_GRID_MATRIX: Record<string, Record<string, number>> = GOALKEEPER_GRID_MATRIX_FROM_MD6;

export function getGoalkeeperGridMatrix(startMatchday: 6 | 1 = 6): Record<string, Record<string, number>> {
  return startMatchday === 6 ? GOALKEEPER_GRID_MATRIX_FROM_MD6 : GOALKEEPER_GRID_MATRIX_FULL;
}

// Ponderazione solidità squadra e facilità calendario nelle giornate sovrapposte
const TEAM_SCHEDULE_STRENGTH: Record<string, number> = {
  'Inter': 10, 'Juventus': 10, 'Napoli': 9, 'Milan': 9, 'Atalanta': 9, 'Roma': 8, 'Lazio': 8,
  'Bologna': 7, 'Fiorentina': 7, 'Torino': 6, 'Como': 6, 'Sassuolo': 5,
  'Udinese': 5, 'Genoa': 5, 'Lecce': 4, 'Cagliari': 4, 'Parma': 4,
  'Monza': 4, 'Venezia': 3, 'Frosinone': 3
};

export interface TeamPairing {
  team: string;
  score: number; // Partite contemporanee fuori casa (0 = perfetto)
  totalMatches: number; // 33 o 38
  homeMatches: number; // Partite coperte in casa con almeno uno dei due (totalMatches - score)
  homePercentage: number; // Copertura percentuale in casa
  rating: 'PERFETTO' | 'OTTIMO' | 'BUONO' | 'MEDIO' | 'SCONSIGLIATO';
  scheduleTier: number;
}

export function getBestPairingsForTeam(teamName: string, startMatchday: 6 | 1 = 6): TeamPairing[] {
  const matrix = getGoalkeeperGridMatrix(startMatchday);
  const row = matrix[teamName];
  if (!row) return [];

  const totalMatches = startMatchday === 6 ? 33 : 38;
  const pairings: TeamPairing[] = [];

  for (const [otherTeam, score] of Object.entries(row)) {
    if (otherTeam.toLowerCase() === teamName.toLowerCase()) continue;
    
    let rating: TeamPairing['rating'] = 'SCONSIGLIATO';
    if (score === 0) {
      rating = 'PERFETTO';
    } else if (startMatchday === 6) {
      // Scala calibrata sui 33 turni rimanenti
      if (score <= 3) rating = 'OTTIMO';
      else if (score <= 5) rating = 'BUONO';
      else if (score <= 7) rating = 'MEDIO';
      else rating = 'SCONSIGLIATO';
    } else {
      // Scala calibrata sui 38 turni totali
      if (score <= 4) rating = 'OTTIMO';
      else if (score <= 7) rating = 'BUONO';
      else if (score <= 9) rating = 'MEDIO';
      else rating = 'SCONSIGLIATO';
    }

    const homeMatches = Math.max(0, totalMatches - score);
    const homePercentage = Math.round((homeMatches / totalMatches) * 100);
    const scheduleTier = TEAM_SCHEDULE_STRENGTH[otherTeam] || 5;

    pairings.push({ 
      team: otherTeam, 
      score, 
      totalMatches, 
      homeMatches, 
      homePercentage,
      rating, 
      scheduleTier 
    });
  }

  // 1) Priorità al minor numero di contemporaneità fuori casa (maggior copertura casalinga)
  // 2) A parità di incastri: precedenza alla squadra con ranking difensivo superiore
  return pairings.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    return b.scheduleTier - a.scheduleTier;
  });
}

export function getTopOverallPairings(startMatchday: 6 | 1 = 6, limit: number = 10): {
  team1: string;
  team2: string;
  score: number;
  totalMatches: number;
  homeMatches: number;
  homePercentage: number;
  rating: TeamPairing['rating'];
}[] {
  const matrix = getGoalkeeperGridMatrix(startMatchday);
  const totalMatches = startMatchday === 6 ? 33 : 38;
  const results = [];
  const teams = Object.keys(matrix);

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const t1 = teams[i];
      const t2 = teams[j];
      const score = matrix[t1][t2];
      const homeMatches = totalMatches - score;
      const homePercentage = Math.round((homeMatches / totalMatches) * 100);
      
      let rating: TeamPairing['rating'] = 'SCONSIGLIATO';
      if (score === 0) rating = 'PERFETTO';
      else if (startMatchday === 6) {
        if (score <= 3) rating = 'OTTIMO';
        else if (score <= 5) rating = 'BUONO';
        else if (score <= 7) rating = 'MEDIO';
      } else {
        if (score <= 4) rating = 'OTTIMO';
        else if (score <= 7) rating = 'BUONO';
        else if (score <= 9) rating = 'MEDIO';
      }

      results.push({
        team1: t1,
        team2: t2,
        score,
        totalMatches,
        homeMatches,
        homePercentage,
        rating
      });
    }
  }

  return results.sort((a, b) => a.score - b.score).slice(0, limit);
}
