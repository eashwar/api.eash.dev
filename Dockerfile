FROM denoland/deno:latest

EXPOSE 30081

WORKDIR /app

USER deno

COPY . .
RUN deno cache main.ts

CMD ["run", "--allow-net", "main.ts"]
