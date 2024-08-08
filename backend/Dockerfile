# 実行ファイル作成用のビルドステージ
FROM golang:1.20-alpine3.17 AS builder

WORKDIR /app

COPY go.mod main.go ./

RUN GOOS=linux go build -o ./main

# 最終的な image のビルドステージ
FROM alpine:3.17

WORKDIR /app

# ビルド用の image から実行ファイルをコピー
COPY --from=builder /app/main .

EXPOSE 8080

CMD [ "./main" ]