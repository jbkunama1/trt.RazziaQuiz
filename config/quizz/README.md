# Razzia Quizdateien

Lege hier Razzia-kompatible `*.json`-Quizdateien ab. Der Stack mountet `./config` nach `/app/config`.

## Frageformat

```json
{
  "type": "single",
  "question": "Frage",
  "answers": ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
  "solutions": [0],
  "cooldown": 5,
  "time": 15
}
```

Bildfragen verwenden zusätzlich:

```json
"media": {
  "type": "image",
  "url": "https://example.org/bild.jpg"
}
```
