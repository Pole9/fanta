import { Team } from '../types';

export const INITIAL_EMPTY_TEAMS: Team[] = [
  {
    "id": "team-1",
    "name": "Scarsenal",
    "color": "#ef4444",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-2",
    "name": "Abjan",
    "color": "#3b82f6",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-3",
    "name": "Gallosballo",
    "color": "#eab308",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-4",
    "name": "Branca",
    "color": "#f59e0b",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-5",
    "name": "Longobarda",
    "color": "#06b6d4",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-6",
    "name": "Sc Arbora",
    "color": "#ec4899",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-7",
    "name": "San Zeno",
    "color": "#8b5cf6",
    "currentBudget": 300,
    "players": []
  },
  {
    "id": "team-8",
    "name": "Al-Meja",
    "color": "#84cc16",
    "currentBudget": 300,
    "players": []
  }
];

export const SIMULATED_TEAMS: Team[] = [
  {
    "id": "team-1",
    "name": "Scarsenal",
    "color": "#ef4444",
    "currentBudget": 0,
    "players": [
      {
        "playerId": 6482,
        "nome": "MANDAS",
        "ruolo": "P",
        "squadra": "Lazio",
        "price": 15,
        "fvm": 36,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 5841,
        "nome": "SVILAR",
        "ruolo": "P",
        "squadra": "Roma",
        "price": 22,
        "fvm": 85,
        "mv": 6.26,
        "fm": 5.45
      },
      {
        "playerId": 6248,
        "nome": "STANKOVIC F.",
        "ruolo": "P",
        "squadra": "Venezia",
        "price": 1,
        "fvm": 11,
        "mv": 6.6,
        "fm": 5.23
      },
      {
        "playerId": 4657,
        "nome": "CELIK",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 7,
        "fvm": 16,
        "mv": 6.17,
        "fm": 6.27
      },
      {
        "playerId": 5365,
        "nome": "DRAGUSIN",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 2,
        "fvm": 20,
        "mv": 6.11,
        "fm": 6.45
      },
      {
        "playerId": 5833,
        "nome": "GILA",
        "ruolo": "D",
        "squadra": "Milan",
        "price": 4,
        "fvm": 31,
        "mv": 6.03,
        "fm": 5.95
      },
      {
        "playerId": 6531,
        "nome": "JIMENEZ A.",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 18,
        "mv": 5.5,
        "fm": 5
      },
      {
        "playerId": 5750,
        "nome": "OSTIGARD",
        "ruolo": "D",
        "squadra": "Genoa",
        "price": 4,
        "fvm": 41,
        "mv": 6.13,
        "fm": 6.52
      },
      {
        "playerId": 5620,
        "nome": "TAVARES N.",
        "ruolo": "D",
        "squadra": "Lazio",
        "price": 3,
        "fvm": 25,
        "mv": 5.91,
        "fm": 5.8
      },
      {
        "playerId": 554,
        "nome": "ZAPPACOSTA",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 2,
        "fvm": 19,
        "mv": 6.06,
        "fm": 6.3
      },
      {
        "playerId": 4263,
        "nome": "KABASELE",
        "ruolo": "D",
        "squadra": "Udinese",
        "price": 1,
        "fvm": 12,
        "mv": 5.98,
        "fm": 6.18
      },
      {
        "playerId": 6908,
        "nome": "ATTA",
        "ruolo": "C",
        "squadra": "Fiorentina",
        "price": 4,
        "fvm": 78,
        "mv": 6.36,
        "fm": 6.88
      },
      {
        "playerId": 5823,
        "nome": "BALDANZI",
        "ruolo": "C",
        "squadra": "Genoa",
        "price": 1,
        "fvm": 28,
        "mv": 6.15,
        "fm": 6.38
      },
      {
        "playerId": 7472,
        "nome": "CALÒ",
        "ruolo": "C",
        "squadra": "Frosinone",
        "price": 2,
        "fvm": 27
      },
      {
        "playerId": 5500,
        "nome": "CANCELLIERI",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 1,
        "fvm": 25,
        "mv": 5.93,
        "fm": 6.29
      },
      {
        "playerId": 5559,
        "nome": "DA CUNHA",
        "ruolo": "C",
        "squadra": "Como",
        "price": 23,
        "fvm": 87,
        "mv": 6.34,
        "fm": 6.91
      },
      {
        "playerId": 6010,
        "nome": "FAZZINI",
        "ruolo": "C",
        "squadra": "Cagliari",
        "price": 3,
        "fvm": 23,
        "mv": 5.88,
        "fm": 5.83
      },
      {
        "playerId": 6398,
        "nome": "ISAKSEN",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 1,
        "fvm": 22,
        "mv": 6.04,
        "fm": 6.63
      },
      {
        "playerId": 4973,
        "nome": "MCKENNIE",
        "ruolo": "C",
        "squadra": "Juventus",
        "price": 6,
        "fvm": 70,
        "mv": 6.13,
        "fm": 6.68
      },
      {
        "playerId": 4923,
        "nome": "COLOMBO",
        "ruolo": "A",
        "squadra": "Genoa",
        "price": 2,
        "fvm": 52,
        "mv": 5.92,
        "fm": 6.41
      },
      {
        "playerId": 6052,
        "nome": "HOJLUND",
        "ruolo": "A",
        "squadra": "Napoli",
        "price": 59,
        "fvm": 260,
        "mv": 6.21,
        "fm": 7.44
      },
      {
        "playerId": 4871,
        "nome": "THURAM",
        "ruolo": "A",
        "squadra": "Inter",
        "price": 133,
        "fvm": 249,
        "mv": 6.43,
        "fm": 7.95
      },
      {
        "playerId": 7351,
        "nome": "SANTOS A.",
        "ruolo": "A",
        "squadra": "Napoli",
        "price": 1,
        "fvm": 61,
        "mv": 6.35,
        "fm": 7.23
      },
      {
        "playerId": 7484,
        "nome": "ADAMS A.",
        "ruolo": "A",
        "squadra": "Venezia",
        "price": 1,
        "fvm": 35
      },
      {
        "playerId": 7272,
        "nome": "GUEYE",
        "ruolo": "A",
        "squadra": "Udinese",
        "price": 1,
        "fvm": 7,
        "mv": 5.77,
        "fm": 5.92
      }
    ]
  },
  {
    "id": "team-2",
    "name": "Abjan",
    "color": "#3b82f6",
    "currentBudget": 15,
    "players": [
      {
        "playerId": 7332,
        "nome": "BIJLOW",
        "ruolo": "P",
        "squadra": "Genoa",
        "price": 1,
        "fvm": 15,
        "mv": 6.06,
        "fm": 4.78
      },
      {
        "playerId": 6966,
        "nome": "BUTEZ",
        "ruolo": "P",
        "squadra": "Como",
        "price": 16,
        "fvm": 50,
        "mv": 6.07,
        "fm": 5.37
      },
      {
        "playerId": 4236,
        "nome": "MURIC",
        "ruolo": "P",
        "squadra": "Sassuolo",
        "price": 1,
        "fvm": 15,
        "mv": 6.08,
        "fm": 4.77
      },
      {
        "playerId": 5877,
        "nome": "CARLOS AUGUSTO",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 9,
        "fvm": 20,
        "mv": 6.12,
        "fm": 6.16
      },
      {
        "playerId": 5641,
        "nome": "CHALOBAH T.",
        "ruolo": "D",
        "squadra": "Como",
        "price": 10,
        "fvm": 32
      },
      {
        "playerId": 6727,
        "nome": "COUTO",
        "ruolo": "D",
        "squadra": "Como",
        "price": 7,
        "fvm": 25
      },
      {
        "playerId": 5739,
        "nome": "DE WINTER",
        "ruolo": "D",
        "squadra": "Milan",
        "price": 1,
        "fvm": 20,
        "mv": 5.75,
        "fm": 5.9
      },
      {
        "playerId": 254,
        "nome": "DIMARCO",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 30,
        "fvm": 240,
        "mv": 6.6,
        "fm": 7.64
      },
      {
        "playerId": 7175,
        "nome": "JOAO MARIO",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 12,
        "mv": 5.79,
        "fm": 6
      },
      {
        "playerId": 4210,
        "nome": "MINA",
        "ruolo": "D",
        "squadra": "Cagliari",
        "price": 1,
        "fvm": 20,
        "mv": 6,
        "fm": 6.17
      },
      {
        "playerId": 4998,
        "nome": "MOLINA N.",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 14,
        "fvm": 78
      },
      {
        "playerId": 1870,
        "nome": "BARELLA",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 16,
        "fvm": 81,
        "mv": 6.28,
        "fm": 6.71
      },
      {
        "playerId": 4856,
        "nome": "CHUKWUEZE",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 1,
        "fvm": 22,
        "mv": 5.5,
        "fm": 5.5
      },
      {
        "playerId": 6618,
        "nome": "CISSÈ A.",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 6,
        "fvm": 24,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 2517,
        "nome": "DE BRUYNE",
        "ruolo": "C",
        "squadra": "Napoli",
        "price": 26,
        "fvm": 108,
        "mv": 6.26,
        "fm": 7.24
      },
      {
        "playerId": 795,
        "nome": "EL SHAARAWY",
        "ruolo": "C",
        "squadra": "Genoa",
        "price": 1,
        "fvm": 25,
        "mv": 6.14,
        "fm": 6.33
      },
      {
        "playerId": 7535,
        "nome": "FITZ-JIM",
        "ruolo": "C",
        "squadra": "Torino",
        "price": 1,
        "fvm": 18
      },
      {
        "playerId": 2848,
        "nome": "FRATTESI",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 40,
        "fvm": 75,
        "mv": 5.89,
        "fm": 5.89
      },
      {
        "playerId": 7078,
        "nome": "MASTANTUONO",
        "ruolo": "C",
        "squadra": "Fiorentina",
        "price": 20,
        "fvm": 50
      },
      {
        "playerId": 309,
        "nome": "DYBALA",
        "ruolo": "A",
        "squadra": "Roma",
        "price": 40,
        "fvm": 100,
        "mv": 6.26,
        "fm": 6.74
      },
      {
        "playerId": 7071,
        "nome": "ESPOSITO F.P.",
        "ruolo": "A",
        "squadra": "Inter",
        "price": 30,
        "fvm": 105,
        "mv": 6.26,
        "fm": 7.02
      },
      {
        "playerId": 6204,
        "nome": "KVERNADZE",
        "ruolo": "A",
        "squadra": "Frosinone",
        "price": 1,
        "fvm": 24,
        "mv": 5.75,
        "fm": 5.75
      },
      {
        "playerId": 4359,
        "nome": "PICCOLI",
        "ruolo": "A",
        "squadra": "Bologna",
        "price": 6,
        "fvm": 29,
        "mv": 5.78,
        "fm": 6.24
      },
      {
        "playerId": 5436,
        "nome": "RAIMONDO",
        "ruolo": "A",
        "squadra": "Frosinone",
        "price": 5,
        "fvm": 27,
        "mv": 6,
        "fm": 6
      },
      {
        "playerId": 6519,
        "nome": "CAMARDA",
        "ruolo": "A",
        "squadra": "Milan",
        "price": 1,
        "fvm": 20,
        "mv": 5.67,
        "fm": 5.64
      }
    ]
  },
  {
    "id": "team-3",
    "name": "Gallosballo",
    "color": "#eab308",
    "currentBudget": 66,
    "players": [
      {
        "playerId": 2521,
        "nome": "DE GEA",
        "ruolo": "P",
        "squadra": "Fiorentina",
        "price": 6,
        "fvm": 30,
        "mv": 6.24,
        "fm": 5
      },
      {
        "playerId": 6403,
        "nome": "CHRISTENSEN O.",
        "ruolo": "P",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 1,
        "mv": 7.5,
        "fm": 6.5
      },
      {
        "playerId": 158,
        "nome": "LEZZERINI",
        "ruolo": "P",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 1,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 6021,
        "nome": "ABANKWAH",
        "ruolo": "D",
        "squadra": "Udinese",
        "price": 1,
        "fvm": 10,
        "mv": 6.25,
        "fm": 6
      },
      {
        "playerId": 2120,
        "nome": "BASTONI",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 7,
        "fvm": 43,
        "mv": 6.2,
        "fm": 6.34
      },
      {
        "playerId": 5555,
        "nome": "KAMARA H.",
        "ruolo": "D",
        "squadra": "Udinese",
        "price": 1,
        "fvm": 12,
        "mv": 5.88,
        "fm": 5.87
      },
      {
        "playerId": 5526,
        "nome": "SCALVINI",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 3,
        "fvm": 28,
        "mv": 6.06,
        "fm": 6.44
      },
      {
        "playerId": 6989,
        "nome": "TIAGO GABRIEL",
        "ruolo": "D",
        "squadra": "Lecce",
        "price": 5,
        "fvm": 20,
        "mv": 6,
        "fm": 6.01
      },
      {
        "playerId": 6867,
        "nome": "VALLE",
        "ruolo": "D",
        "squadra": "Como",
        "price": 8,
        "fvm": 21,
        "mv": 6.06,
        "fm": 6.23
      },
      {
        "playerId": 7274,
        "nome": "ZÈ PEDRO",
        "ruolo": "D",
        "squadra": "Cagliari",
        "price": 1,
        "fvm": 13,
        "mv": 5.77,
        "fm": 5.68
      },
      {
        "playerId": 2640,
        "nome": "KOLASINAC",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 8,
        "mv": 6.03,
        "fm": 5.94
      },
      {
        "playerId": 6677,
        "nome": "ADZIC",
        "ruolo": "C",
        "squadra": "Sassuolo",
        "price": 8,
        "fvm": 16,
        "mv": 6.12,
        "fm": 6.88
      },
      {
        "playerId": 6274,
        "nome": "DIOUF",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 5,
        "fvm": 43,
        "mv": 6.15,
        "fm": 6.45
      },
      {
        "playerId": 5800,
        "nome": "GUDMUNDSSON A.",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 7,
        "fvm": 40,
        "mv": 5.88,
        "fm": 6.34
      },
      {
        "playerId": 5172,
        "nome": "JONES C.",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 4,
        "fvm": 47
      },
      {
        "playerId": 1933,
        "nome": "MANDRAGORA",
        "ruolo": "C",
        "squadra": "Torino",
        "price": 2,
        "fvm": 23,
        "mv": 6.04,
        "fm": 6.62
      },
      {
        "playerId": 7412,
        "nome": "MILLA",
        "ruolo": "C",
        "squadra": "Como",
        "price": 1,
        "fvm": 30
      },
      {
        "playerId": 2379,
        "nome": "RABIOT",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 18,
        "fvm": 145,
        "mv": 6.33,
        "fm": 6.98
      },
      {
        "playerId": 5687,
        "nome": "VLASIC",
        "ruolo": "C",
        "squadra": "Torino",
        "price": 16,
        "fvm": 73,
        "mv": 6.03,
        "fm": 6.66
      },
      {
        "playerId": 6646,
        "nome": "ADAMS C.",
        "ruolo": "A",
        "squadra": "Torino",
        "price": 3,
        "fvm": 33,
        "mv": 5.98,
        "fm": 6.64
      },
      {
        "playerId": 5637,
        "nome": "DAVIS K.",
        "ruolo": "A",
        "squadra": "Udinese",
        "price": 24,
        "fvm": 108,
        "mv": 6.32,
        "fm": 7.37
      },
      {
        "playerId": 7017,
        "nome": "DOUVIKAS",
        "ruolo": "A",
        "squadra": "Como",
        "price": 50,
        "fvm": 185,
        "mv": 6.18,
        "fm": 7.38
      },
      {
        "playerId": 4463,
        "nome": "ESPOSITO SE.",
        "ruolo": "A",
        "squadra": "Sassuolo",
        "price": 10,
        "fvm": 40,
        "mv": 6.26,
        "fm": 6.88
      },
      {
        "playerId": 2061,
        "nome": "SIMEONE",
        "ruolo": "A",
        "squadra": "Torino",
        "price": 6,
        "fvm": 80,
        "mv": 6.08,
        "fm": 7.09
      },
      {
        "playerId": 6434,
        "nome": "YILDIZ",
        "ruolo": "A",
        "squadra": "Juventus",
        "price": 45,
        "fvm": 100,
        "mv": 6.39,
        "fm": 7.3
      }
    ]
  },
  {
    "id": "team-4",
    "name": "Branca",
    "color": "#f59e0b",
    "currentBudget": 0,
    "players": [
      {
        "playerId": 6662,
        "nome": "CORVI",
        "ruolo": "P",
        "squadra": "Parma",
        "price": 2,
        "fvm": 10,
        "mv": 6.18,
        "fm": 5.09
      },
      {
        "playerId": 572,
        "nome": "MERET",
        "ruolo": "P",
        "squadra": "Napoli",
        "price": 19,
        "fvm": 48,
        "mv": 6.23,
        "fm": 5.18
      },
      {
        "playerId": 6534,
        "nome": "PERRI",
        "ruolo": "P",
        "squadra": "Torino",
        "price": 1,
        "fvm": 26
      },
      {
        "playerId": 6496,
        "nome": "BARTESAGHI",
        "ruolo": "D",
        "squadra": "Milan",
        "price": 1,
        "fvm": 22,
        "mv": 5.97,
        "fm": 6.05
      },
      {
        "playerId": 6202,
        "nome": "BEUKEMA",
        "ruolo": "D",
        "squadra": "Napoli",
        "price": 1,
        "fvm": 12,
        "mv": 5.93,
        "fm": 6.16
      },
      {
        "playerId": 6495,
        "nome": "COMUZZO",
        "ruolo": "D",
        "squadra": "Torino",
        "price": 3,
        "fvm": 13,
        "mv": 5.75,
        "fm": 5.75
      },
      {
        "playerId": 6485,
        "nome": "KRISTENSEN T.",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 4,
        "fvm": 20,
        "mv": 5.98,
        "fm": 6.23
      },
      {
        "playerId": 2188,
        "nome": "MARUSIC",
        "ruolo": "D",
        "squadra": "Lazio",
        "price": 2,
        "fvm": 20,
        "mv": 5.86,
        "fm": 5.97
      },
      {
        "playerId": 4317,
        "nome": "N'DICKA",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 5,
        "fvm": 42,
        "mv": 6.08,
        "fm": 6.32
      },
      {
        "playerId": 4409,
        "nome": "RRAHMANI",
        "ruolo": "D",
        "squadra": "Napoli",
        "price": 5,
        "fvm": 51,
        "mv": 6.24,
        "fm": 6.45
      },
      {
        "playerId": 4433,
        "nome": "ZORTEA",
        "ruolo": "D",
        "squadra": "Bologna",
        "price": 3,
        "fvm": 19,
        "mv": 5.86,
        "fm": 5.89
      },
      {
        "playerId": 7126,
        "nome": "BATURINA",
        "ruolo": "C",
        "squadra": "Como",
        "price": 27,
        "fvm": 105,
        "mv": 6.3,
        "fm": 7.14
      },
      {
        "playerId": 184,
        "nome": "BERNARDESCHI",
        "ruolo": "C",
        "squadra": "Bologna",
        "price": 3,
        "fvm": 27,
        "mv": 6.04,
        "fm": 6.56
      },
      {
        "playerId": 7060,
        "nome": "CACCIAMANI",
        "ruolo": "C",
        "squadra": "Torino",
        "price": 1,
        "fvm": 24,
        "mv": 6,
        "fm": 6
      },
      {
        "playerId": 4465,
        "nome": "FAGIOLI",
        "ruolo": "C",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 20,
        "mv": 6.03,
        "fm": 6.23
      },
      {
        "playerId": 2167,
        "nome": "ORSOLINI",
        "ruolo": "C",
        "squadra": "Bologna",
        "price": 18,
        "fvm": 177,
        "mv": 6.06,
        "fm": 6.76
      },
      {
        "playerId": 632,
        "nome": "ZACCAGNI",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 25,
        "fvm": 87,
        "mv": 5.88,
        "fm": 5.96
      },
      {
        "playerId": 2766,
        "nome": "ZANIOLO",
        "ruolo": "C",
        "squadra": "Udinese",
        "price": 7,
        "fvm": 80,
        "mv": 6.26,
        "fm": 6.77
      },
      {
        "playerId": 2606,
        "nome": "MODRIC",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 1,
        "fvm": 45,
        "mv": 6.45,
        "fm": 6.67
      },
      {
        "playerId": 531,
        "nome": "BERARDI",
        "ruolo": "A",
        "squadra": "Sassuolo",
        "price": 23,
        "fvm": 106,
        "mv": 6.31,
        "fm": 7.19
      },
      {
        "playerId": 2764,
        "nome": "MARTINEZ L.",
        "ruolo": "A",
        "squadra": "Inter",
        "price": 140,
        "fvm": 361,
        "mv": 6.42,
        "fm": 8.25
      },
      {
        "playerId": 6229,
        "nome": "TOURÈ E.",
        "ruolo": "A",
        "squadra": "Parma",
        "price": 3,
        "fvm": 37,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 6164,
        "nome": "VITINHA O.",
        "ruolo": "A",
        "squadra": "Genoa",
        "price": 3,
        "fvm": 13,
        "mv": 5.95,
        "fm": 6.39
      },
      {
        "playerId": 6904,
        "nome": "YEBOAH J.",
        "ruolo": "A",
        "squadra": "Venezia",
        "price": 1,
        "fvm": 27,
        "mv": 5.91,
        "fm": 5.98
      },
      {
        "playerId": 608,
        "nome": "ZAPATA D.",
        "ruolo": "A",
        "squadra": "Torino",
        "price": 1,
        "fvm": 12,
        "mv": 5.83,
        "fm": 6.13
      }
    ]
  },
  {
    "id": "team-5",
    "name": "Longobarda",
    "color": "#06b6d4",
    "currentBudget": 1,
    "players": [
      {
        "playerId": 4431,
        "nome": "CARNESECCHI",
        "ruolo": "P",
        "squadra": "Atalanta",
        "price": 15,
        "fvm": 55,
        "mv": 6.36,
        "fm": 5.58
      },
      {
        "playerId": 2134,
        "nome": "FALCONE",
        "ruolo": "P",
        "squadra": "Lecce",
        "price": 5,
        "fvm": 26,
        "mv": 6.41,
        "fm": 5.22
      },
      {
        "playerId": 4,
        "nome": "SPORTIELLO",
        "ruolo": "P",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 1,
        "mv": 5.5,
        "fm": 4.5
      },
      {
        "playerId": 7219,
        "nome": "BERNASCONI",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 18,
        "mv": 6.09,
        "fm": 6.16
      },
      {
        "playerId": 6664,
        "nome": "DELPRATO",
        "ruolo": "D",
        "squadra": "Parma",
        "price": 3,
        "fvm": 21,
        "mv": 5.91,
        "fm": 6.01
      },
      {
        "playerId": 2816,
        "nome": "DI LORENZO",
        "ruolo": "D",
        "squadra": "Napoli",
        "price": 5,
        "fvm": 39,
        "mv": 6.08,
        "fm": 6.33
      },
      {
        "playerId": 5831,
        "nome": "GATTI",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 2,
        "fvm": 10,
        "mv": 5.94,
        "fm": 6.22
      },
      {
        "playerId": 4976,
        "nome": "KALULU",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 10,
        "fvm": 47,
        "mv": 6.14,
        "fm": 6.35
      },
      {
        "playerId": 5022,
        "nome": "PAVLOVIC",
        "ruolo": "D",
        "squadra": "Milan",
        "price": 5,
        "fvm": 49,
        "mv": 6.24,
        "fm": 6.62
      },
      {
        "playerId": 4378,
        "nome": "RANIERI L.",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 10,
        "mv": 5.85,
        "fm": 5.79
      },
      {
        "playerId": 5514,
        "nome": "VASQUEZ",
        "ruolo": "D",
        "squadra": "Genoa",
        "price": 3,
        "fvm": 30,
        "mv": 6.08,
        "fm": 6.14
      },
      {
        "playerId": 779,
        "nome": "CRISTANTE",
        "ruolo": "C",
        "squadra": "Roma",
        "price": 2,
        "fvm": 29,
        "mv": 6.11,
        "fm": 6.22
      },
      {
        "playerId": 5792,
        "nome": "EDERSON D.S.",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 10,
        "fvm": 46,
        "mv": 6.25,
        "fm": 6.43
      },
      {
        "playerId": 1850,
        "nome": "KESSIÈ",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 6,
        "fvm": 47
      },
      {
        "playerId": 5685,
        "nome": "KOOPMEINERS",
        "ruolo": "C",
        "squadra": "Juventus",
        "price": 1,
        "fvm": 15,
        "mv": 5.64,
        "fm": 5.55
      },
      {
        "playerId": 2529,
        "nome": "MKHITARYAN",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 1,
        "fvm": 9,
        "mv": 6.21,
        "fm": 6.59
      },
      {
        "playerId": 6151,
        "nome": "PERRONE",
        "ruolo": "C",
        "squadra": "Como",
        "price": 1,
        "fvm": 34,
        "mv": 6.22,
        "fm": 6.47
      },
      {
        "playerId": 536,
        "nome": "POLITANO",
        "ruolo": "C",
        "squadra": "Napoli",
        "price": 3,
        "fvm": 37,
        "mv": 6.09,
        "fm": 6.36
      },
      {
        "playerId": 4287,
        "nome": "LOBOTKA",
        "ruolo": "C",
        "squadra": "Napoli",
        "price": 1,
        "fvm": 23,
        "mv": 6.05,
        "fm": 6.1
      },
      {
        "playerId": 2097,
        "nome": "KEAN",
        "ruolo": "A",
        "squadra": "Como",
        "price": 45,
        "fvm": 183,
        "mv": 5.88,
        "fm": 6.77
      },
      {
        "playerId": 6435,
        "nome": "KRSTOVIC",
        "ruolo": "A",
        "squadra": "Atalanta",
        "price": 30,
        "fvm": 98,
        "mv": 6.16,
        "fm": 7.19
      },
      {
        "playerId": 5585,
        "nome": "MALEN",
        "ruolo": "A",
        "squadra": "Roma",
        "price": 133,
        "fvm": 450,
        "mv": 6.72,
        "fm": 8.97
      },
      {
        "playerId": 4371,
        "nome": "RASPADORI",
        "ruolo": "A",
        "squadra": "Atalanta",
        "price": 5,
        "fvm": 73,
        "mv": 6.12,
        "fm": 6.88
      },
      {
        "playerId": 5694,
        "nome": "BETO",
        "ruolo": "A",
        "squadra": "Fiorentina",
        "price": 9,
        "fvm": 50,
        "mv": 5.5,
        "fm": 5.5
      },
      {
        "playerId": 2155,
        "nome": "CUTRONE",
        "ruolo": "A",
        "squadra": "Monza",
        "price": 1,
        "fvm": 23,
        "mv": 5.71,
        "fm": 5.93
      }
    ]
  },
  {
    "id": "team-6",
    "name": "Sc Arbora",
    "color": "#ec4899",
    "currentBudget": 38,
    "players": [
      {
        "playerId": 4360,
        "nome": "CAPRILE",
        "ruolo": "P",
        "squadra": "Cagliari",
        "price": 8,
        "fvm": 25,
        "mv": 6.29,
        "fm": 4.87
      },
      {
        "playerId": 133,
        "nome": "SKORUPSKI",
        "ruolo": "P",
        "squadra": "Bologna",
        "price": 1,
        "fvm": 32,
        "mv": 6.19,
        "fm": 5.28
      },
      {
        "playerId": 4964,
        "nome": "VICARIO",
        "ruolo": "P",
        "squadra": "Juventus",
        "price": 19,
        "fvm": 70
      },
      {
        "playerId": 2788,
        "nome": "BREMER",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 23,
        "fvm": 60,
        "mv": 6.33,
        "fm": 6.81
      },
      {
        "playerId": 4807,
        "nome": "HERMOSO",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 6,
        "fvm": 26,
        "mv": 6.17,
        "fm": 6.41
      },
      {
        "playerId": 2296,
        "nome": "MANCINI",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 6,
        "fvm": 50,
        "mv": 6.25,
        "fm": 6.51
      },
      {
        "playerId": 4734,
        "nome": "MIRANDA J.",
        "ruolo": "D",
        "squadra": "Bologna",
        "price": 3,
        "fvm": 23,
        "mv": 6,
        "fm": 6.1
      },
      {
        "playerId": 6869,
        "nome": "RAMON",
        "ruolo": "D",
        "squadra": "Como",
        "price": 8,
        "fvm": 31,
        "mv": 6.16,
        "fm": 6.14
      },
      {
        "playerId": 5862,
        "nome": "VALERI",
        "ruolo": "D",
        "squadra": "Parma",
        "price": 1,
        "fvm": 22,
        "mv": 6.06,
        "fm": 6.09
      },
      {
        "playerId": 7181,
        "nome": "WESLEY",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 19,
        "fvm": 87,
        "mv": 6.12,
        "fm": 6.47
      },
      {
        "playerId": 5982,
        "nome": "SPENCE",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 1,
        "fvm": 37,
        "mv": 6,
        "fm": 5.97
      },
      {
        "playerId": 7436,
        "nome": "ALAJBEGOVIC",
        "ruolo": "C",
        "squadra": "Juventus",
        "price": 4,
        "fvm": 42
      },
      {
        "playerId": 6884,
        "nome": "CONCEICAO",
        "ruolo": "C",
        "squadra": "Juventus",
        "price": 11,
        "fvm": 68,
        "mv": 6.28,
        "fm": 6.7
      },
      {
        "playerId": 5725,
        "nome": "KONE B.",
        "ruolo": "C",
        "squadra": "Frosinone",
        "price": 7,
        "fvm": 3,
        "mv": 6,
        "fm": 6
      },
      {
        "playerId": 7625,
        "nome": "GONCALVES P.",
        "ruolo": "C",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 50
      },
      {
        "playerId": 7556,
        "nome": "MORA",
        "ruolo": "C",
        "squadra": "Roma",
        "price": 1,
        "fvm": 100
      },
      {
        "playerId": 7311,
        "nome": "ROMANO",
        "ruolo": "C",
        "squadra": "Cagliari",
        "price": 1,
        "fvm": 21
      },
      {
        "playerId": 5119,
        "nome": "SAMARDZIC",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 44,
        "mv": 5.93,
        "fm": 6.29
      },
      {
        "playerId": 7223,
        "nome": "VERGARA",
        "ruolo": "C",
        "squadra": "Napoli",
        "price": 1,
        "fvm": 35,
        "mv": 6.25,
        "fm": 6.5
      },
      {
        "playerId": 6967,
        "nome": "DIAO",
        "ruolo": "A",
        "squadra": "Como",
        "price": 8,
        "fvm": 50,
        "mv": 6,
        "fm": 6.38
      },
      {
        "playerId": 7023,
        "nome": "PELLEGRINO M.",
        "ruolo": "A",
        "squadra": "Fiorentina",
        "price": 12,
        "fvm": 40,
        "mv": 5.99,
        "fm": 6.65
      },
      {
        "playerId": 2137,
        "nome": "SCAMACCA",
        "ruolo": "A",
        "squadra": "Atalanta",
        "price": 24,
        "fvm": 110,
        "mv": 6.18,
        "fm": 7.55
      },
      {
        "playerId": 6752,
        "nome": "WOLTEMADE",
        "ruolo": "A",
        "squadra": "Juventus",
        "price": 11,
        "fvm": 160
      },
      {
        "playerId": 5995,
        "nome": "DE KETELAERE",
        "ruolo": "A",
        "squadra": "Atalanta",
        "price": 80,
        "fvm": 95,
        "mv": 6.21,
        "fm": 6.6
      },
      {
        "playerId": 2832,
        "nome": "BOGA",
        "ruolo": "A",
        "squadra": "Juventus",
        "price": 5,
        "fvm": 27,
        "mv": 6.19,
        "fm": 7.15
      }
    ]
  },
  {
    "id": "team-7",
    "name": "San Zeno",
    "color": "#8b5cf6",
    "currentBudget": 26,
    "players": [
      {
        "playerId": 5116,
        "nome": "MARTINEZ JO.",
        "ruolo": "P",
        "squadra": "Inter",
        "price": 25,
        "fvm": 68,
        "mv": 6,
        "fm": 5.2
      },
      {
        "playerId": 6462,
        "nome": "OKOYE",
        "ruolo": "P",
        "squadra": "Udinese",
        "price": 9,
        "fvm": 28,
        "mv": 6.07,
        "fm": 5.08
      },
      {
        "playerId": 6415,
        "nome": "PALMISANI",
        "ruolo": "P",
        "squadra": "Frosinone",
        "price": 2,
        "fvm": 12,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 4159,
        "nome": "AKANJI",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 8,
        "fvm": 47,
        "mv": 6.28,
        "fm": 6.41
      },
      {
        "playerId": 4705,
        "nome": "BALERDI",
        "ruolo": "D",
        "squadra": "Roma",
        "price": 1,
        "fvm": 11
      },
      {
        "playerId": 6217,
        "nome": "BISSECK",
        "ruolo": "D",
        "squadra": "Inter",
        "price": 11,
        "fvm": 36,
        "mv": 6.22,
        "fm": 6.65
      },
      {
        "playerId": 5520,
        "nome": "CAMBIASO",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 6,
        "fvm": 18,
        "mv": 5.81,
        "fm": 5.99
      },
      {
        "playerId": 6893,
        "nome": "KEMPF",
        "ruolo": "D",
        "squadra": "Como",
        "price": 7,
        "fvm": 13,
        "mv": 6.12,
        "fm": 6.52
      },
      {
        "playerId": 5885,
        "nome": "DODÒ",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 20,
        "mv": 5.99,
        "fm": 6.03
      },
      {
        "playerId": 6320,
        "nome": "DOEKHI",
        "ruolo": "D",
        "squadra": "Lazio",
        "price": 1,
        "fvm": 16
      },
      {
        "playerId": 6042,
        "nome": "LUCUMÌ",
        "ruolo": "D",
        "squadra": "Juventus",
        "price": 1,
        "fvm": 17,
        "mv": 5.88,
        "fm": 5.89
      },
      {
        "playerId": 2194,
        "nome": "CALHANOGLU",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 35,
        "fvm": 243,
        "mv": 6.52,
        "fm": 7.64
      },
      {
        "playerId": 4436,
        "nome": "CAMBIAGHI",
        "ruolo": "C",
        "squadra": "Bologna",
        "price": 5,
        "fvm": 25,
        "mv": 5.98,
        "fm": 6.42
      },
      {
        "playerId": 5888,
        "nome": "CASADEI",
        "ruolo": "C",
        "squadra": "Torino",
        "price": 1,
        "fvm": 27,
        "mv": 5.97,
        "fm": 6.45
      },
      {
        "playerId": 6684,
        "nome": "EKKELENKAMP",
        "ruolo": "C",
        "squadra": "Udinese",
        "price": 1,
        "fvm": 57,
        "mv": 6.05,
        "fm": 6.61
      },
      {
        "playerId": 4479,
        "nome": "ELMAS",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 22,
        "mv": 5.8,
        "fm": 5.96
      },
      {
        "playerId": 5858,
        "nome": "FERGUSON",
        "ruolo": "C",
        "squadra": "Bologna",
        "price": 1,
        "fvm": 23,
        "mv": 5.8,
        "fm": 5.78
      },
      {
        "playerId": 4364,
        "nome": "GAETANO",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 30,
        "mv": 6.06,
        "fm": 6.31
      },
      {
        "playerId": 4777,
        "nome": "MCTOMINAY",
        "ruolo": "C",
        "squadra": "Napoli",
        "price": 34,
        "fvm": 220,
        "mv": 6.39,
        "fm": 7.26
      },
      {
        "playerId": 6669,
        "nome": "BONNY",
        "ruolo": "A",
        "squadra": "Inter",
        "price": 1,
        "fvm": 15,
        "mv": 6.15,
        "fm": 6.83
      },
      {
        "playerId": 6572,
        "nome": "CASTRO S.",
        "ruolo": "A",
        "squadra": "Roma",
        "price": 9,
        "fvm": 70,
        "mv": 5.93,
        "fm": 6.51
      },
      {
        "playerId": 6060,
        "nome": "LAURIENTÈ",
        "ruolo": "A",
        "squadra": "Sassuolo",
        "price": 15,
        "fvm": 83,
        "mv": 6.23,
        "fm": 6.99
      },
      {
        "playerId": 6831,
        "nome": "NERES",
        "ruolo": "A",
        "squadra": "Napoli",
        "price": 1,
        "fvm": 20,
        "mv": 6.19,
        "fm": 6.84
      },
      {
        "playerId": 2038,
        "nome": "PINAMONTI",
        "ruolo": "A",
        "squadra": "Lazio",
        "price": 9,
        "fvm": 53,
        "mv": 5.88,
        "fm": 6.62
      },
      {
        "playerId": 6397,
        "nome": "RAMOS G.",
        "ruolo": "A",
        "squadra": "Milan",
        "price": 88,
        "fvm": 237
      }
    ]
  },
  {
    "id": "team-8",
    "name": "Al-Meja",
    "color": "#84cc16",
    "currentBudget": 79,
    "players": [
      {
        "playerId": 4312,
        "nome": "MAIGNAN",
        "ruolo": "P",
        "squadra": "Milan",
        "price": 18,
        "fvm": 52,
        "mv": 6.26,
        "fm": 5.42
      },
      {
        "playerId": 2815,
        "nome": "TERRACCIANO",
        "ruolo": "P",
        "squadra": "Milan",
        "price": 1,
        "fvm": 1,
        "mv": 6,
        "fm": 6
      },
      {
        "playerId": 6813,
        "nome": "TORRIANI",
        "ruolo": "P",
        "squadra": "Milan",
        "price": 1,
        "fvm": 1,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 4887,
        "nome": "BELLANOVA",
        "ruolo": "D",
        "squadra": "Atalanta",
        "price": 4,
        "fvm": 17,
        "mv": 5.82,
        "fm": 5.82
      },
      {
        "playerId": 4137,
        "nome": "DIEGO CARLOS",
        "ruolo": "D",
        "squadra": "Parma",
        "price": 2,
        "fvm": 26,
        "mv": 6.14,
        "fm": 6.1
      },
      {
        "playerId": 1852,
        "nome": "SPINAZZOLA",
        "ruolo": "D",
        "squadra": "Napoli",
        "price": 2,
        "fvm": 25,
        "mv": 6.17,
        "fm": 6.55
      },
      {
        "playerId": 5838,
        "nome": "BIRINDELLI",
        "ruolo": "D",
        "squadra": "Monza",
        "price": 1,
        "fvm": 12,
        "mv": 5.95,
        "fm": 6.35
      },
      {
        "playerId": 7580,
        "nome": "SUTALO J.",
        "ruolo": "D",
        "squadra": "Lazio",
        "price": 1,
        "fvm": 19
      },
      {
        "playerId": 6660,
        "nome": "MARCANDALLI",
        "ruolo": "D",
        "squadra": "Genoa",
        "price": 1,
        "fvm": 14,
        "mv": 5.87,
        "fm": 5.84
      },
      {
        "playerId": 5851,
        "nome": "DOIG",
        "ruolo": "D",
        "squadra": "Sassuolo",
        "price": 1,
        "fvm": 10,
        "mv": 5.85,
        "fm": 5.76
      },
      {
        "playerId": 7410,
        "nome": "VIERY",
        "ruolo": "D",
        "squadra": "Fiorentina",
        "price": 1,
        "fvm": 12
      },
      {
        "playerId": 4179,
        "nome": "GONZALEZ N.",
        "ruolo": "C",
        "squadra": "Juventus",
        "price": 12,
        "fvm": 45,
        "mv": 0,
        "fm": 0
      },
      {
        "playerId": 6875,
        "nome": "PAZ N.",
        "ruolo": "C",
        "squadra": "Como",
        "price": 43,
        "fvm": 245,
        "mv": 6.37,
        "fm": 7.3
      },
      {
        "playerId": 2423,
        "nome": "PULISIC",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 36,
        "fvm": 150,
        "mv": 6.15,
        "fm": 7.07
      },
      {
        "playerId": 152,
        "nome": "ZIELINSKI",
        "ruolo": "C",
        "squadra": "Inter",
        "price": 7,
        "fvm": 45,
        "mv": 6.25,
        "fm": 6.8
      },
      {
        "playerId": 6844,
        "nome": "ROWE",
        "ruolo": "C",
        "squadra": "Atalanta",
        "price": 1,
        "fvm": 40,
        "mv": 6.2,
        "fm": 6.59
      },
      {
        "playerId": 7314,
        "nome": "TAYLOR K.",
        "ruolo": "C",
        "squadra": "Lazio",
        "price": 1,
        "fvm": 53,
        "mv": 6.06,
        "fm": 6.56
      },
      {
        "playerId": 6898,
        "nome": "KEITA M.",
        "ruolo": "C",
        "squadra": "Parma",
        "price": 1,
        "fvm": 15,
        "mv": 6.01,
        "fm": 6.06
      },
      {
        "playerId": 6372,
        "nome": "MOREIRA",
        "ruolo": "C",
        "squadra": "Milan",
        "price": 1,
        "fvm": 45
      },
      {
        "playerId": 5951,
        "nome": "KOLO MUANI",
        "ruolo": "A",
        "squadra": "Juventus",
        "price": 41,
        "fvm": 165,
        "mv": 6.22,
        "fm": 7.78
      },
      {
        "playerId": 4896,
        "nome": "MALDINI",
        "ruolo": "A",
        "squadra": "Cagliari",
        "price": 18,
        "fvm": 21,
        "mv": 5.94,
        "fm": 6.31
      },
      {
        "playerId": 7600,
        "nome": "OSMAJIC",
        "ruolo": "A",
        "squadra": "Genoa",
        "price": 2,
        "fvm": 28
      },
      {
        "playerId": 5734,
        "nome": "SOULÈ",
        "ruolo": "A",
        "squadra": "Roma",
        "price": 20,
        "fvm": 48,
        "mv": 6.12,
        "fm": 6.83
      },
      {
        "playerId": 7523,
        "nome": "VARELA G.",
        "ruolo": "A",
        "squadra": "Monza",
        "price": 4,
        "fvm": 40
      },
      {
        "playerId": 7554,
        "nome": "ROMERO D.",
        "ruolo": "A",
        "squadra": "Parma",
        "price": 1,
        "fvm": 37
      }
    ]
  }
];

export const DEFAULT_TEAMS: Team[] = SIMULATED_TEAMS;
