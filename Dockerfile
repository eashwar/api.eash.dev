FROM denoland/deno:latest

EXPOSE 30081

WORKDIR /app

USER deno

COPY . .
RUN deno cache main.ts

CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--env-file", "main.ts"]