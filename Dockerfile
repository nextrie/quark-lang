FROM rust:1.40-alpine3.11 as builder
WORKDIR /usr/src/quark-lang

# Copying folder to container
COPY . .

# Installing Quark in bin
RUN cargo install --path .

FROM alpine:3.11

# Copying sample folder from builder
COPY --from=builder /usr/src/quark-lang/sample/ ./sample/

# Copying quark executable to bin from builder
COPY --from=builder /usr/local/cargo/bin/quark-lang /usr/local/bin/quark-lang
CMD ["quark-lang"]