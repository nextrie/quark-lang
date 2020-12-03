FROM rust:1.40-alpine3.11 as builder
WORKDIR /usr/src/quark-lang
COPY . .
RUN cargo install --path .

FROM alpine:3.11
COPY --from=builder /usr/local/cargo/bin/quark-lang /usr/local/bin/quark-lang
CMD ["quark-lang"]