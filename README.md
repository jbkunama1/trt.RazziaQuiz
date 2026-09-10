# trt.RazziaQuiz

Razzia Quiz Game - Containerized mit GitHub Actions CI/CD zu GHCR

## 🚀 Quick Start

### Pull von GHCR

```bash
docker pull ghcr.io/jbkunama1/trt.RazziaQuiz:latest
```

### Docker Compose

```bash
docker compose up -d
```

### Manuell mit existierendem Network

```bash
docker run -d \
  --name razzia-quiz \
  --restart unless-stopped \
  -p 8033:8033 \
  --network highfishNetwork \
  -e NODE_ENV=production \
  -e PORT=8033 \
  -v razzia_quiz_data:/app/data \
  ghcr.io/jbkunama1/trt.RazziaQuiz:latest
```

## 🏗️ Architektur

- **Port**: 8033
- **Network**: highfishNetwork (extern)
- **Registry**: GHCR (ghcr.io/jbkunama1/trt.RazziaQuiz)
- **CI/CD**: GitHub Actions (auto-build on push to main)

## 📦 Deployment mit Portainer

1. **Stack erstellen** in Portainer
2. **Web Editor** verwenden
3. Folgendes eintragen:

```yaml
version: '3.8'

services:
  razzia-quiz:
    image: ghcr.io/jbkunama1/trt.RazziaQuiz:latest
    container_name: razzia-quiz
    restart: unless-stopped
    ports:
      - "8033:8033"
    environment:
      - NODE_ENV=production
      - PORT=8033
    volumes:
      - razzia_quiz_data:/app/data
    networks:
      - highfishNetwork
    healthcheck:
      test: ["CMD", "curl", "f", "http://localhost:8033/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  razzia_quiz_data:
    driver: local

networks:
  highfishNetwork:
    external: true
```

4. **Deploy the stack**

## 🔧 Umgebungsvariablen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| NODE_ENV | production | Umgebung |
| PORT | 8033 | Exponierter Port |

## 📝 License

Private
