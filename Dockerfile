FROM hayd/deno:1.5.2 as builder
WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (this is re-run only when deps.ts is modified).
# Ideally this will download and compile _all_ external files used in main.ts.

# These steps will be re-run upon each file change in your working directory:
ADD . /app
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache src/main.ts
RUN deno compile --unstable src/main.ts -o quark-lang
# These are passed as deno arguments when run with docker:

FROM alpine:3.7
# Copy quark lang executable from builder to current folder
COPY --from=builder /app/src/quark-lang ./quark-lang
# Execute quark lang executable
CMD ["./quark-lang"]