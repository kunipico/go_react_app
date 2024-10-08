# 実行ファイル作成用のビルドステージ
# FROM golang:1.20-alpine3.17 AS builder
FROM golang:1.22 AS builder

WORKDIR /api

COPY go.mod main.go ./

RUN go mod tidy
# ルートディレクトリの中身を app フォルダにコピーする
COPY . .
# 実行ファイルの作成
# -o はアウトプットの名前を指定。
# ビルドするファイル名を指定（今回は main.go）。
# 今回のMulti Stage Buildのようなビルド環境と実行環境が違うクロスコンパイル時には CGO_ENABLE=0 にする必要がある
RUN CGO_ENABLED=0 go build -o main /api/main.go
# RUN GOOS=linux go build -o ./main

# 最終的な image のビルドステージ
FROM alpine:3.17

WORKDIR /api

# ビルド用の image から実行ファイルをコピー
COPY --from=builder /api/main .

EXPOSE 8080

CMD [ "./main" ]