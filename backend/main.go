package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/rs/cors"
)

// タスク構造体
type Task struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Done bool   `json:"done"`
}

var (
	tasks  []Task
	nextID int
)

func init() {
	tasks = []Task{
		{ID: 1, Name: "インターン研修", Done: false},
		{ID: 2, Name: "筋トレ", Done: false},
		{ID: 3, Name: "休息", Done: false},
	}
	nextID = 4
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/tasks", tasksHandler)
	mux.HandleFunc("/tasks/", tasksHandler)

	// CORSミドルウェアを設定
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://127.0.0.1:80","http://127.0.0.1:3000","http://localhost:3000", "http://react-app:3000", "http://react-app.go-react-app:3000","http://localhost:80", "http://react-app:80", "http://react-app.go-react-app:80"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type"},
		// AllowCredentials: true,
	})

	// CORSミドルウェアをHTTPサーバーに適用
	handler := c.Handler(mux)
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func tasksHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		getTasks(w, r) // 全てのtaskの取得
	case "POST":
		addTask(w, r) // 新しいtaskの追加
	case "PUT":
		toggleTaskDone(w, r) // task状態の変更
	case "DELETE":
		deleteTask(w, r) // 指定のtaskを削除
	default:
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func addTask(w http.ResponseWriter, r *http.Request) {
	var task Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	task.ID = nextID
	nextID++
	tasks = append(tasks, task)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func toggleTaskDone(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なIDです", http.StatusBadRequest)
		return
	}

	var updatedTask Task
	err = json.NewDecoder(r.Body).Decode(&updatedTask)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Done = updatedTask.Done
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(tasks[i])
			return
		}
	}

	http.Error(w, "指定されたIDのタスクが見つかりません", http.StatusNotFound)

}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "無効なIDです", http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}
	http.Error(w, "指定されたIDのタスクが見つかりません", http.StatusNotFound)
}
