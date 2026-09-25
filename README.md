# 🎯 trt.RazziaQuiz

[![Docker Build and Push](https://img.shields.io/github/actions/workflow/status/jbkunama1/trt.RazziaQuiz/docker-publish.yml?branch=main&label=docker%20build&logo=github)](https://github.com/jbkunama1/trt.RazziaQuiz/actions/workflows/docker-publish.yml)
[![GHCR](https://img.shields.io/badge/ghcr.io-jbkunama1%2Ftrt.razziaquiz-2496ED?logo=docker&logoColor=white)](https://github.com/jbkunama1/trt.RazziaQuiz/pkgs/container/trt.razziaquiz)
[![License](https://img.shields.io/github/license/jbkunama1/trt.RazziaQuiz)](./LICENSE)
[![Upstream](https://img.shields.io/badge/basiert%20auf-Ralex91%2FRazzia-orange?logo=github)](https://github.com/Ralex91/Razzia)
[![Portainer Ready](https://img.shields.io/badge/Portainer-ready-13BEF9?logo=portainer&logoColor=white)](#-deployment-mit-portainer)

**Razzia Quiz Game** &mdash; ein selbst gehostetes Live-Quiz im Stil von Kahoot!, containerisiert und automatisch via GitHub Actions nach GHCR gebaut.

---

## 🧩 Was ist das?

`trt.RazziaQuiz` ist die Deployment-Infrastruktur für [Razzia](https://github.com/Ralex91/Razzia) &mdash; ein Open-Source Multiplayer-Quiz mit Echtzeit-Buzzer-System (Socket.io), Manager-Dashboard zur Spielsteuerung und eigenen, frei konfigurierbaren Fragenkatalogen.

Dieses Repository **enthält den Spielcode nicht dauerhaft**. Stattdessen baut die GitHub-Actions-Pipeline bei jedem Push den aktuellen Quellcode von `Ralex91/Razzia` frisch, verpackt ihn in ein Docker-Image nach den hier definierten Konventionen (Port, Healthcheck, Netzwerk) und veröffentlicht es nach GHCR. So bleibt das Deployment immer nah am Original, ohne Fremdcode zu duplizieren oder zu forken.

## 🚀 Quick Start

### Pull von GHCR

```bash
docker pull ghcr.io/jbkunama1/trt.razziaquiz:latest
```

### Docker Compose

```bash
docker compose up -d
```

Danach erreichbar unter `http://localhost:8093`.

## 🏗️ Architektur

| Eigenschaft | Wert |
|---|---|
| **Port** | `8093` extern &rarr; `3000` intern (Nginx im Container) |
| **WebSocket** | Läuft intern nur auf Port `3001`, wird von Nginx unter dem Pfad `/ws` durchgereicht &mdash; kein separater externer Port nötig |
| **Netzwerk** | `highfishNetwork` (extern) |
| **Registry** | GHCR (`ghcr.io/jbkunama1/trt.razziaquiz`) |
| **CI/CD** | GitHub Actions &mdash; Build bei jedem Push auf `main`, Multi-Platform (`linux/amd64`, `linux/arm64`) |
| **Healthcheck** | `curl -f http://localhost:3000/` (containerintern) |
| **Basis-Image** | `alpine` mit `nginx`, `nodejs`, `supervisor` (Runtime) |

```
            ┌────────────────────────────┐
            │     Port 8093 (extern)     │
            │   Host -> Container:3000   │
            └─────────────┬──────────────┘
                           │
                  ┌────────▼─────────┐
                  │  nginx :3000     │  Web-Root + /ws-Proxy
                  │  (supervisor)    │
                  └────────┬─────────┘
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼───────┐      ┌────────▼────────┐
        │ Static Web    │      │ Socket :3001    │
        │ (React build) │      │ (nur intern,    │
        │               │◄────►│  via /ws-Proxy) │
        └───────────────┘      └─────────────────┘
```

## 📦 Deployment mit Portainer

1. **Stack erstellen** in Portainer
2. **Web Editor** verwenden
3. Folgendes eintragen:

```yaml
version: '3.8'

services:
  razzia-quiz:
    image: ghcr.io/jbkunama1/trt.razziaquiz:latest
    container_name: razzia-quiz
    restart: unless-stopped
    ports:
      - "8093:3000"
    environment:
      - WEB_ORIGIN=http://DEINE-DOMAIN:8093
      - SOCKET_URL=http://DEINE-DOMAIN:8093
    volumes:
      - razzia_quiz_config:/app/config
    networks:
      - highfishNetwork
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  razzia_quiz_config:
    driver: local

networks:
  highfishNetwork:
    external: true
```

4. **Deploy the stack**

> ⚠️ Passe `WEB_ORIGIN` und `SOCKET_URL` unbedingt auf deine tatsächliche Domain bzw. IP an (jeweils mit Port `8093`), sonst funktioniert die WebSocket-Verbindung im Browser nicht. Der Socket-Server ist NICHT separat erreichbar &mdash; die Verbindung läuft über Nginx unter `/ws`.

## 🔧 Umgebungsvariablen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `WEB_ORIGIN` | `http://localhost:8093` | Öffentliche URL, unter der das Web-Interface erreichbar ist (externer Port) |
| `SOCKET_URL` | `http://localhost:8093` | Öffentliche URL für die WebSocket-Verbindung (läuft über den Nginx-Proxy-Pfad `/ws`, kein eigener Port) |

## 🎮 Spielkonfiguration

Die Konfiguration liegt im gemounteten Volume unter `/app/config` und besteht aus zwei Teilen:

### 1. Spiel-Grundeinstellungen &mdash; `config/game.json`

```json
{
  "managerPassword": "DEIN-PASSWORT"
}
```

| Feld | Beschreibung |
|---|---|
| `managerPassword` | Master-Passwort für den Zugriff auf das Manager-Dashboard |

### 2. Fragenkataloge &mdash; `config/quizz/*.json`

Beliebig viele Quiz-Dateien, auswählbar beim Spielstart:

```json
{
  "subject": "Technik-Quiz Klasse 9",
  "questions": [
    {
      "question": "Welcher Mikrocontroller wird häufig für IoT-Projekte im Unterricht verwendet?",
      "answers": ["ESP32", "Pentium", "Z80", "6502"],
      "image": "https://example.com/esp32.jpg",
      "solution": 0,
      "cooldown": 5,
      "time": 15
    }
  ]
}
```

| Feld | Beschreibung |
|---|---|
| `subject` | Titel/Thema des Quiz |
| `questions[].question` | Fragetext |
| `questions[].answers` | 2&ndash;4 Antwortmöglichkeiten |
| `questions[].image` | Optionale Bild-URL zur Frage |
| `questions[].solution` | Index der richtigen Antwort (beginnend bei 0) |
| `questions[].cooldown` | Anzeigedauer der Frage vor Start des Timers (Sekunden) |
| `questions[].time` | Zeit zum Antworten (Sekunden) |

## 🕹️ Spielablauf

1. Manager-Dashboard öffnen: `http://<host>:8093/manager`
2. Mit `managerPassword` anmelden
3. Spielraum-Link und Code mit den Spieler:innen teilen: `http://<host>:8093/`
4. Warten, bis alle beigetreten sind
5. Spiel über den Start-Button oben links im Manager starten

## 🩺 Troubleshooting

| Problem | Lösung |
|---|---|
| Container startet, aber Healthcheck bleibt `unhealthy` | Logs prüfen: `docker logs razzia-quiz`. Startperiode ist 40s &mdash; bei langsamen Hosts ggf. erhöhen. |
| Spieler können nicht beitreten / WebSocket-Fehler im Browser | `SOCKET_URL` stimmt nicht mit der tatsächlich aufgerufenen Domain/Port (`8093`) überein &mdash; unbedingt anpassen. Der Socket ist NICHT direkt erreichbar, nur über `/ws` per Nginx. |
| Änderungen an `config/quizz/*.json` werden nicht übernommen | Container neu starten (`docker compose restart razzia-quiz`), Config wird beim Start geladen. |
| Build schlägt in GitHub Actions fehl | Prüfen, ob sich am Upstream-Dockerfile (`Ralex91/Razzia`) strukturelle Dinge geändert haben &mdash; der Workflow zieht immer den aktuellen `main`-Stand. |

## 🙏 Credits

Das eigentliche Spiel ist [Razzia](https://github.com/Ralex91/Razzia) von [@Ralex91](https://github.com/Ralex91) (ehemals *Rahoot*), lizenziert unter der im Original-Repository angegebenen Lizenz. Dieses Repository stellt ausschließlich die Build- und Deployment-Infrastruktur (GitHub Actions → GHCR → Portainer) bereit und dupliziert den Spielcode nicht dauerhaft.

## 📝 License

Infrastruktur-Dateien in diesem Repository: privat. Der gebaute Anwendungscode unterliegt der Lizenz von [Ralex91/Razzia](https://github.com/Ralex91/Razzia/blob/main/LICENSE).
