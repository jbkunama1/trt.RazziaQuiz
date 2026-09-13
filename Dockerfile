FROM nginx:alpine

RUN apk add --no-cache curl

RUN printf '%s\n' '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>RazziaQuiz</title></head><body><h1>RazziaQuiz</h1><p>Container läuft.</p></body></html>' > /usr/share/nginx/html/index.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
