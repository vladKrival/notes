
// MODEL — управление данными
const model = {
  notes: [],

  getNotes() {
    return this.notes;
  },
//добовляем новую заметку в начало массива
  addNote(title, content, color) {
    const newNote = {
      id: new Date().getTime(),
      title,
      content,
      color,
      isFavorite: false,
    };
    this.notes.unshift(newNote); // новые заметки — в начало
  },
// удаление заметки
  deleteNote(id) {
    this.notes = this.notes.filter((n) => n.id !== id);
  },
// добовляем и отображаем избранные заметки
  toggleFavorite(id) {
    const note = this.notes.find((n) => n.id === id);
    if (note) {
      note.isFavorite === !note.isFavorite;
    }
  },
};


// VIEW — отображение интерфейса

const view = {
  init() {

      // DOM элементы
    const form = document.querySelector('.note-form');
    const titleInput = document.querySelector('.text');
    const textarea = document.querySelector('.textarea');
    const colorInputs = document.querySelectorAll('input[name="color"]');
    const notesList = document.querySelector('.notes-list');
    const favoriteFilter = document.querySelector('.checkbox-img');
    const countNotes = document.querySelector('.countNotes');
    const messagesBox = document.querySelector('.messege-container');
    const emptyText = document.querySelector('.empty-list');

    // --- функция рендера ---
    const renderNotes = (notes) => {
      notesList.innerHTML = '';

      if (notes.length === 0) {
        emptyText.textContent =
          'У вас ещё нет ни одной заметки. Заполните поля выше и создайте свою первую заметку!';
        countNotes.textContent = 'Всего заметок: 0';
        return;
      }

      emptyText.textContent = '';
      countNotes.textContent = `Всего заметок: ${notes.length}`;

      notes.forEach((note) => {
        const li = document.createElement('li');
        li.classList.add('note');
        li.dataset.id = note.id;
        // li.style.backgroundColor = note.color;
        li.style.padding = '16px';
        li.style.borderRadius = '8px';
        li.style.width = '370px';
        li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        li.style.display = 'flex';
        li.style.flexDirection = 'column';
        li.style.justifyContent = 'space-between';
        li.style.marginBottom = '16px';

        li.innerHTML = `
          <div class="note-header" style="display:flex; justify-content:space-between; align-items:center;">
            <h3 style="margin:0; font-size:16px;  backgroundColor = ${note.color}">${note.title}</h3>
            <div class="note-actions" style="display:flex; gap:8px;">
              <button class="favorite-note" title="Избранное" style="background:none; border:none; cursor:pointer; font-size:18px;">
                ${note.isFavorite ? '⭐' : '☆'}
              </button>
              <button class="delete-note" title="Удалить" style="background:none; border:none; cursor:pointer; font-size:18px;">🗑</button>
            </div>
          </div>
          <p style="font-size:14px; color:#444; margin-top:8px;">${note.content}</p>
        `;

        notesList.appendChild(li);
      });
    };

    // --- очистка формы ---
    const clearForm = () => {
      titleInput.value = '';
      textarea.value = '';
      colorInputs[0].checked = true;
    };

    // --- показ сообщений ---
    const showMessage = (text, type = 'info') => {
      const msg = document.createElement('div');
      msg.className = `message ${type}`;
      msg.textContent = text;
      messagesBox.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    };

    // --- обработка событий ---

    // добавление заметки
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = textarea.value.trim();
      const color = document.querySelector('input[name="color"]:checked').value;

      if (!title || !content) {
        showMessage('Заполните все поля', 'error');
        return;
      }

      if (title.length > 50) {
        showMessage('Максимальная длина заголовка — 50 символов', 'error');
return;
      }

      model.addNote(title, content, color);
      renderNotes(model.getNotes());
      clearForm();
      showMessage('Заметка добавлена', 'info');
    });

        // фильтр избранных
    favoriteFilter.addEventListener('click', () => {
      const isFiltered = favoriteFilter.classList.toggleFavorite('active');
      const notes = isFiltered ? model.getNotes().filter((n) => n.isFavorite) : model.getNotes();
      renderNotes(notes);
    });

    // удаление и избранное
    notesList.addEventListener('click', (e) => {
      const noteEl = e.target.closest('.note');
      if (!noteEl) return;
      const id = +noteEl.dataset.id;

      if (e.target.classList.contains('delete-note')) {
        model.deleteNote(id);
        renderNotes(model.getNotes());
        showMessage('Заметка удалена', 'info');
      }

      if (e.target.classList.contains('favorite-note')) {
        model.toggleFavorite(id);
        const isFiltered = favoriteFilter.classList.contains('active');
        const notes = isFiltered
          ? model.getNotes().filter((n) => n.isFavorite)
          : model.getNotes();
        renderNotes(notes);
      }
    });



    // --- экспорт функций ---
    this.renderNotes = renderNotes;
    this.showMessage = showMessage;
    this.clearForm = clearForm;
  },
};

// =========================
// CONTROLLER — логика взаимодействия

const controller = {
  init() {
    view.init();
    view.renderNotes(model.getNotes());
  },
};

controller.init();