document.addEventListener("DOMContentLoaded", () => {
    const authDiv = document.getElementById("auth");
    const notesAppDiv = document.getElementById("notesApp");
    const usernameInput = document.getElementById("username");
    const noteInput = document.getElementById("noteInput");
    const notesList = document.getElementById("notesList");

    const registerButton = document.getElementById("register");
    const addNoteButton = document.getElementById("addNote");
    const logoutButton = document.getElementById("logout");

    let editingIndex = null; // Индекс редактируемой заметки

    // Проверяем текущего пользователя
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        showNotesApp(currentUser);
    } else {
        showAuth();
    }

    // Авторизация пользователя
    registerButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem("currentUser", username);
            if (!localStorage.getItem(username)) {
                localStorage.setItem(username, JSON.stringify([]));
            }
            showNotesApp(username);
        } else {
            alert("Введите имя пользователя!");
        }
    });

    // Добавление или обновление заметки
    addNoteButton.addEventListener("click", () => {
        const note = noteInput.value.trim();
        if (!note) {
            alert("Заметка не может быть пустой!");
            return;
        }

        const username = localStorage.getItem("currentUser");
        const notes = JSON.parse(localStorage.getItem(username)) || [];

        if (editingIndex !== null) {
            notes[editingIndex] = note;
            editingIndex = null;
            addNoteButton.textContent = "Добавить";
        } else {
            notes.push(note);
        }

        localStorage.setItem(username, JSON.stringify(notes));
        noteInput.value = "";
        renderNotes(notes);
    });

    // Выход пользователя
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        showAuth();
    });

    // Показываем приложение заметок
    function showNotesApp(username) {
        authDiv.classList.add("hidden");
        notesAppDiv.classList.remove("hidden");
        const notes = JSON.parse(localStorage.getItem(username)) || [];
        renderNotes(notes);
    }

    // Показываем блок авторизации
    function showAuth() {
        authDiv.classList.remove("hidden");
        notesAppDiv.classList.add("hidden");
    }

    // Отрисовка заметок
    function renderNotes(notes) {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            const li = document.createElement("li");
            const noteText = document.createElement("span");
            noteText.textContent = note;

            const actions = document.createElement("div");
            actions.classList.add("actions");

            const editButton = createButton("✏️", "edit", () => editNote(index, note));
            const deleteButton = createButton("🗑️", "delete", () => deleteNote(index));

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            li.appendChild(noteText);
            li.appendChild(actions);
            notesList.appendChild(li);
        });
    }

    // Создание кнопки
    function createButton(text, className, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener("click", onClick);
        return button;
    }

    // Редактирование заметки
    function editNote(index, note) {
        noteInput.value = note;
        editingIndex = index;
        addNoteButton.textContent = "Сохранить";
    }

    // Удаление заметки
    function deleteNote(index) {
        const username = localStorage.getItem("currentUser");
        const notes = JSON.parse(localStorage.getItem(username)) || [];
        notes.splice(index, 1);
        localStorage.setItem(username, JSON.stringify(notes));
        renderNotes(notes);
    }
});
