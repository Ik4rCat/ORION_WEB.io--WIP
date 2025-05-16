// Глобальные переменные состояния
let currentUser = null;
let currentTeam = null;
let projects = [];
let tasks = [];
let notes = [];
let repositories = [];
let teams = []; // Добавим массив для команд

// Вспомогательные функции
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initForms();
    initDragAndDrop();
    
    // Проверяем авторизацию
    checkAuth();
    
    // Проверяем, вернулись ли мы после GitHub авторизации
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth') && urlParams.get('auth') === 'github_success') {
        // Очистим URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Для демо-версии показываем сообщение об успешной авторизации
        alert('Вы успешно авторизовались через GitHub!');
        
        // В реальном приложении здесь бы мы получили данные пользователя
        // и обновили интерфейс
    }
});

// Навигация
function initNavigation() {
    const navLinks = $$('.main-nav a');
    const sections = $$('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Удаляем активный класс у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Добавляем активный класс к текущей ссылке
            link.classList.add('active');
            
            // Скрываем все секции
            sections.forEach(section => section.classList.remove('active'));
            
            // Показываем соответствующую секцию
            const targetId = link.id.replace('Link', '');
            $(`#${targetId}`).classList.add('active');
        });
    });
}

// Модальные окна
function initModals() {
    // Кнопки для открытия модальных окон
    $('#loginBtn').addEventListener('click', () => openModal('loginModal'));
    $('#registerBtn').addEventListener('click', () => openModal('registerModal'));
    $('#newProjectBtn').addEventListener('click', () => openModal('newProjectModal'));
    $('#newTaskBtn').addEventListener('click', () => openModal('newTaskModal'));
    $('#newNoteBtn').addEventListener('click', () => {
        createNewNote();
    });
    
    // Кнопка выхода
    $('#logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // GitHub авторизация
    if ($('#githubLoginBtn')) {
        $('#githubLoginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            loginWithGitHub();
        });
    }
    
    if ($('#githubRegisterBtn')) {
        $('#githubRegisterBtn').addEventListener('click', (e) => {
            e.preventDefault();
            registerWithGitHub();
        });
    }
    
    // Закрытие модальных окон
    $$('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', (e) => {
        $$('.modal').forEach(modal => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    $(`#${modalId}`).style.display = 'block';
}

function closeModal(modalId) {
    $(`#${modalId}`).style.display = 'none';
}

// Обработчики форм
function initForms() {
    // Форма входа
    $('#loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = $('#loginEmail').value;
        const password = $('#loginPassword').value;
        
        // Здесь должна быть проверка авторизации через серверный API
        // Пример:
        login(email, password);
    });
    
    // Форма регистрации
    $('#registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = $('#registerName').value;
        const email = $('#registerEmail').value;
        const password = $('#registerPassword').value;
        const confirmPassword = $('#confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        // Здесь должна быть регистрация через серверный API
        // Пример:
        register(name, email, password);
    });
    
    // Форма создания проекта
    $('#newProjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = $('#projectName').value;
        const description = $('#projectDescription').value;
        const teamId = $('#projectTeam').value;
        
        createProject(name, description, teamId);
    });
    
    // Форма создания задачи
    $('#newTaskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = $('#taskTitle').value;
        const description = $('#taskDescription').value;
        const projectId = $('#taskProject').value;
        const assigneeId = $('#taskAssignee').value;
        const dueDate = $('#taskDueDate').value;
        const priority = $('#taskPriority').value;
        
        createTask(title, description, projectId, assigneeId, dueDate, priority);
    });
    
    // Форма создания команды
    $('#newTeamForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = $('#teamName').value;
        const description = $('#teamDescription').value;
        
        createTeam(name, description);
    });
}

// Drag and Drop для задач
function initDragAndDrop() {
    // Будет реализовано позже
}

// Функции авторизации
function checkAuth() {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        // Если токен есть, получаем информацию о пользователе
        fetchCurrentUser(token);
    } else {
        // Если токена нет, показываем кнопки авторизации
        showAuthButtons();
    }
}

function showAuthButtons() {
    $('#loginBtn').style.display = 'inline-block';
    $('#registerBtn').style.display = 'inline-block';
    $('.user-profile').style.display = 'none';
}

function showUserProfile(user) {
    $('#loginBtn').style.display = 'none';
    $('#registerBtn').style.display = 'none';
    $('.user-profile').style.display = 'flex';
    $('.username').textContent = user.name;
    
    // Обновляем аватар, если есть
    if (user.avatar) {
        $('.avatar').src = user.avatar;
    }
    
    // Загружаем проекты, задачи и заметки пользователя
    fetchUserData(user.id);
}

function login(email, password) {
    // Эмуляция запроса к серверу
    // В реальном приложении здесь должен быть запрос к серверному API
    
    setTimeout(() => {
        // Эмуляция успешной авторизации
        const fakeUser = {
            id: 1,
            name: 'Тестовый пользователь',
            email: email
        };
        
        // Сохраняем токен в localStorage
        localStorage.setItem('token', 'fake-token-123');
        currentUser = fakeUser;
        
        // Показываем профиль пользователя
        showUserProfile(fakeUser);
        
        // Закрываем модальное окно
        closeModal('loginModal');
        
        // Загружаем демо-данные
        loadDemoData();
    }, 1000);
}

function register(name, email, password) {
    // Эмуляция запроса к серверу
    // В реальном приложении здесь должен быть запрос к серверному API
    
    setTimeout(() => {
        // Эмуляция успешной регистрации
        const fakeUser = {
            id: 1,
            name: name,
            email: email
        };
        
        // Сохраняем токен в localStorage
        localStorage.setItem('token', 'fake-token-123');
        currentUser = fakeUser;
        
        // Показываем профиль пользователя
        showUserProfile(fakeUser);
        
        // Закрываем модальное окно
        closeModal('registerModal');
        
        // Загружаем демо-данные
        loadDemoData();
    }, 1000);
}

function logout() {
    // Удаляем токен из localStorage
    localStorage.removeItem('token');
    currentUser = null;
    
    // Показываем кнопки авторизации
    showAuthButtons();
    
    // Очищаем данные
    projects = [];
    tasks = [];
    notes = [];
    repositories = [];
    
    // Обновляем UI
    updateUI();
}

function fetchCurrentUser(token) {
    // Эмуляция запроса к серверу
    // В реальном приложении здесь должен быть запрос к серверному API
    
    setTimeout(() => {
        // Эмуляция успешного получения информации о пользователе
        const fakeUser = {
            id: 1,
            name: 'Тестовый пользователь',
            email: 'test@example.com'
        };
        
        currentUser = fakeUser;
        
        // Показываем профиль пользователя
        showUserProfile(fakeUser);
        
        // Загружаем демо-данные
        loadDemoData();
    }, 500);
}

function fetchUserData(userId) {
    // Здесь должны быть запросы к серверному API для получения проектов, задач и заметок пользователя
    // Для демонстрации используем эмуляцию
}

// GitHub OAuth функции
function loginWithGitHub() {
    // Параметры для GitHub OAuth
    const clientId = 'YOUR_GITHUB_CLIENT_ID'; // Замените на ваш Client ID
    const redirectUri = encodeURIComponent(window.location.origin + '/github-callback.html');
    const scope = 'user:email';
    
    // Сохраняем состояние для безопасности
    const state = generateRandomString(16);
    localStorage.setItem('github_oauth_state', state);
    
    // Создаем URL для авторизации
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    // Для демо-версии вместо реального перехода покажем сообщение
    if (confirm('В рабочей версии здесь произойдет перенаправление на GitHub для авторизации. Продолжить с эмуляцией?')) {
        // Эмуляция успешной авторизации через GitHub
        simulateGitHubAuth('login');
    }
    
    // В реальном приложении:
    // window.location.href = authUrl;
}

function registerWithGitHub() {
    // Используем тот же процесс, что и для логина
    loginWithGitHub();
}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function simulateGitHubAuth(type) {
    // Эмуляция задержки сетевого запроса
    setTimeout(() => {
        // Эмуляция данных пользователя GitHub
        const githubUser = {
            id: 'github_123456',
            name: 'GitHub Пользователь',
            login: 'github_user',
            email: 'github@example.com',
            avatar_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
        };
        
        // Создаем пользователя на основе данных GitHub
        const user = {
            id: githubUser.id,
            name: githubUser.name || githubUser.login,
            email: githubUser.email,
            avatar: githubUser.avatar_url,
            provider: 'github'
        };
        
        // Сохраняем информацию о пользователе
        localStorage.setItem('token', 'github-fake-token-123');
        currentUser = user;
        
        // Показываем профиль пользователя
        showUserProfile(user);
        
        // Закрываем модальные окна
        closeModal('loginModal');
        closeModal('registerModal');
        
        // Загружаем демо-данные
        loadDemoData();
        
        // Обновляем аватар, если есть
        if (user.avatar) {
            $('.avatar').src = user.avatar;
        }
        
        alert(`Успешная ${type === 'login' ? 'авторизация' : 'регистрация'} через GitHub!`);
    }, 1500);
}

// Функции для работы с проектами
function createProject(name, description, teamId) {
    // Эмуляция создания проекта
    const newProject = {
        id: projects.length + 1,
        name: name,
        description: description,
        teamId: teamId || null,
        createdAt: new Date(),
        members: [currentUser.id]
    };
    
    projects.push(newProject);
    
    // Обновляем UI
    updateProjectsUI();
    
    // Закрываем модальное окно
    closeModal('newProjectModal');
    
    // Очищаем форму
    $('#newProjectForm').reset();
}

function updateProjectsUI() {
    const projectsGrid = $('#projectsGrid');
    
    // Очищаем список проектов
    projectsGrid.innerHTML = '';
    
    if (projects.length === 0) {
        // Показываем пустое состояние
        projectsGrid.innerHTML = `
            <div class="project-card empty-state">
                <i class="fas fa-folder-open"></i>
                <p>У вас пока нет проектов</p>
                <button class="btn btn-primary" onclick="openModal('newProjectModal')">Создать первый проект</button>
            </div>
        `;
    } else {
        // Показываем список проектов
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description || 'Без описания'}</p>
                <div class="project-meta">
                    <span>Создан: ${formatDate(project.createdAt)}</span>
                </div>
                <div class="project-actions">
                    <button class="btn btn-sm" onclick="openProject(${project.id})">Открыть</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${project.id})">Удалить</button>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
    
    // Обновляем счетчик проектов на панели управления
    $('#activeProjectsCount').textContent = projects.length;
    
    // Обновляем список проектов в форме создания задачи
    const projectSelect = $('#taskProject');
    projectSelect.innerHTML = '<option value="">Выберите проект</option>';
    
    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
}

// Функции для работы с задачами
function createTask(title, description, projectId, assigneeId, dueDate, priority) {
    // Эмуляция создания задачи
    const newTask = {
        id: tasks.length + 1,
        title: title,
        description: description,
        projectId: projectId || null,
        assigneeId: assigneeId || null,
        dueDate: dueDate || null,
        priority: priority || 'medium',
        status: 'planned', // planned, in-progress, testing, completed
        createdAt: new Date(),
        createdBy: currentUser.id
    };
    
    tasks.push(newTask);
    
    // Обновляем UI
    updateTasksUI();
    
    // Закрываем модальное окно
    closeModal('newTaskModal');
    
    // Очищаем форму
    $('#newTaskForm').reset();
}

function updateTasksUI() {
    // Обновляем канбан-доску
    const plannedTasks = $('#plannedTasks');
    const inProgressTasks = $('#inProgressTasks');
    const testingTasks = $('#testingTasks');
    const completedTasks = $('#completedTasks');
    
    // Очищаем списки задач
    plannedTasks.innerHTML = '';
    inProgressTasks.innerHTML = '';
    testingTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    
    // Фильтруем задачи по статусу
    const plannedTasksList = tasks.filter(task => task.status === 'planned');
    const inProgressTasksList = tasks.filter(task => task.status === 'in-progress');
    const testingTasksList = tasks.filter(task => task.status === 'testing');
    const completedTasksList = tasks.filter(task => task.status === 'completed');
    
    // Обновляем счетчик активных задач на панели управления
    const activeTasks = plannedTasksList.length + inProgressTasksList.length + testingTasksList.length;
    $('#activeTasksCount').textContent = activeTasks;
    
    // Функция для создания карточки задачи
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('draggable', true);
        taskCard.setAttribute('data-task-id', task.id);
        
        // Находим проект, к которому относится задача
        const project = projects.find(p => p.id === task.projectId);
        
        taskCard.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description || 'Без описания'}</p>
            <div class="task-meta">
                <span class="project-badge">${project ? project.name : 'Без проекта'}</span>
                <span class="priority-badge priority-${task.priority}">${getPriorityText(task.priority)}</span>
            </div>
            <div class="task-actions">
                <button class="btn btn-sm" onclick="editTask(${task.id})">Изменить</button>
            </div>
        `;
        
        return taskCard;
    }
    
    // Показываем задачи или пустое состояние
    if (plannedTasksList.length === 0) {
        plannedTasks.innerHTML = '<div class="empty-state"><p>Нет запланированных задач</p></div>';
    } else {
        plannedTasksList.forEach(task => {
            plannedTasks.appendChild(createTaskCard(task));
        });
    }
    
    if (inProgressTasksList.length === 0) {
        inProgressTasks.innerHTML = '<div class="empty-state"><p>Нет задач в работе</p></div>';
    } else {
        inProgressTasksList.forEach(task => {
            inProgressTasks.appendChild(createTaskCard(task));
        });
    }
    
    if (testingTasksList.length === 0) {
        testingTasks.innerHTML = '<div class="empty-state"><p>Нет задач на тестировании</p></div>';
    } else {
        testingTasksList.forEach(task => {
            testingTasks.appendChild(createTaskCard(task));
        });
    }
    
    if (completedTasksList.length === 0) {
        completedTasks.innerHTML = '<div class="empty-state"><p>Нет завершенных задач</p></div>';
    } else {
        completedTasksList.forEach(task => {
            completedTasks.appendChild(createTaskCard(task));
        });
    }
}

// Функции для работы с заметками
function createNewNote() {
    // Эмуляция создания заметки
    const newNote = {
        id: notes.length + 1,
        title: 'Новая заметка',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: currentUser.id
    };
    
    notes.push(newNote);
    
    // Обновляем UI
    updateNotesUI();
    
    // Открываем редактор для новой заметки
    openNoteEditor(newNote.id);
}

function updateNotesUI() {
    const notesList = $('#notesList');
    const recentNotes = $('#recentNotes');
    
    // Очищаем список заметок
    notesList.innerHTML = '';
    recentNotes.innerHTML = '';
    
    if (notes.length === 0) {
        // Показываем пустое состояние
        notesList.innerHTML = '<div class="empty-state"><p>У вас пока нет заметок</p></div>';
        recentNotes.innerHTML = '<li>Нет недавних заметок</li>';
    } else {
        // Сортируем заметки по дате обновления
        const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        // Показываем список заметок
        sortedNotes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';
            noteItem.setAttribute('data-note-id', note.id);
            noteItem.innerHTML = `
                <div class="note-title">${note.title}</div>
                <div class="note-meta">${formatDate(note.updatedAt)}</div>
            `;
            
            noteItem.addEventListener('click', () => openNoteEditor(note.id));
            
            notesList.appendChild(noteItem);
        });
        
        // Показываем недавние заметки на панели управления
        sortedNotes.slice(0, 3).forEach(note => {
            const noteItem = document.createElement('li');
            noteItem.textContent = note.title;
            recentNotes.appendChild(noteItem);
        });
    }
}

function openNoteEditor(noteId) {
    // Находим заметку
    const note = notes.find(n => n.id === noteId);
    
    if (!note) return;
    
    // Отмечаем заметку как активную
    $$('.note-item').forEach(item => item.classList.remove('active'));
    $(`.note-item[data-note-id="${noteId}"]`).classList.add('active');
    
    // Заполняем редактор
    $('#noteEditor').innerHTML = note.content || '<p>Начните писать здесь...</p>';
    
    // Добавляем обработчик изменений в редакторе
    const editor = $('#noteEditor');
    
    // Удаляем предыдущий обработчик, если он был
    editor.removeEventListener('input', editor._saveHandler);
    
    // Создаем новый обработчик для сохранения изменений
    editor._saveHandler = function() {
        note.content = editor.innerHTML;
        note.updatedAt = new Date();
        
        // Обновляем список заметок
        updateNotesUI();
    };
    
    editor.addEventListener('input', editor._saveHandler);
}

// Функции для работы с командами
function createTeam(name, description) {
    // Эмуляция создания команды
    const newTeam = {
        id: teams.length + 1,
        name: name,
        description: description,
        members: [currentUser.id],
        createdAt: new Date(),
        createdBy: currentUser.id
    };
    
    teams.push(newTeam);
    
    // Обновляем UI
    updateTeamsUI();
    
    // Закрываем модальное окно
    closeModal('newTeamModal');
    
    // Очищаем форму
    $('#newTeamForm').reset();
}

function updateTeamsUI() {
    // Обновляем выпадающий список команд в форме создания проекта
    const teamSelect = $('#projectTeam');
    teamSelect.innerHTML = '<option value="">Выберите команду</option>';
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}

// Git функции
function initGitIntegration() {
    // Здесь должна быть реализация интеграции с Git
    // Для демонстрации используем эмуляцию
    
    $('#addRepoBtn').addEventListener('click', () => {
        // В реальном приложении здесь должно быть диалоговое окно для выбора директории
        // или ввода URL репозитория
        
        const repoName = prompt('Введите URL репозитория или путь к локальному репозиторию:');
        
        if (repoName) {
            addRepository(repoName);
        }
    });
    
    $('#pullBtn').addEventListener('click', () => {
        // Эмуляция pull
        alert('Pull выполнен успешно!');
    });
    
    $('#pushBtn').addEventListener('click', () => {
        // Эмуляция push
        alert('Push выполнен успешно!');
    });
    
    $('#commitBtn').addEventListener('click', () => {
        // Эмуляция commit
        const message = prompt('Введите сообщение коммита:');
        
        if (message) {
            // Эмуляция создания коммита
            alert(`Коммит "${message}" создан успешно!`);
        }
    });
}

function addRepository(repoUrl) {
    // Эмуляция добавления репозитория
    const newRepo = {
        id: repositories.length + 1,
        url: repoUrl,
        name: repoUrl.split('/').pop().replace('.git', '')
    };
    
    repositories.push(newRepo);
    
    // Обновляем UI
    updateGitUI();
}

function updateGitUI() {
    const repoSelect = $('#repoSelect');
    
    // Очищаем список репозиториев
    repoSelect.innerHTML = '<option value="">Выберите репозиторий</option>';
    
    repositories.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.id;
        option.textContent = repo.name;
        repoSelect.appendChild(option);
    });
}

// Демо-данные для тестирования
function loadDemoData() {
    // Эмуляция загрузки демо-данных
    
    // Проекты
    projects = [
        {
            id: 1,
            name: 'Мой первый проект',
            description: 'Демонстрационный проект для тестирования функционала',
            teamId: null,
            createdAt: new Date(Date.now() - 86400000 * 5), // 5 дней назад
            members: [1]
        },
        {
            id: 2,
            name: 'Разработка игры',
            description: 'Разработка игры на Unity для мобильных устройств',
            teamId: null,
            createdAt: new Date(Date.now() - 86400000 * 2), // 2 дня назад
            members: [1]
        }
    ];
    
    // Задачи
    tasks = [
        {
            id: 1,
            title: 'Создать прототип',
            description: 'Разработать прототип основной механики игры',
            projectId: 2,
            assigneeId: 1,
            dueDate: new Date(Date.now() + 86400000 * 3), // через 3 дня
            priority: 'high',
            status: 'in-progress',
            createdAt: new Date(Date.now() - 86400000),
            createdBy: 1
        },
        {
            id: 2,
            title: 'Дизайн персонажа',
            description: 'Создать концепт-арт главного персонажа',
            projectId: 2,
            assigneeId: null,
            dueDate: new Date(Date.now() + 86400000 * 5),
            priority: 'medium',
            status: 'planned',
            createdAt: new Date(Date.now() - 86400000 * 0.5),
            createdBy: 1
        },
        {
            id: 3,
            title: 'Написать документацию',
            description: 'Создать документ с описанием проекта',
            projectId: 1,
            assigneeId: 1,
            dueDate: new Date(Date.now() + 86400000),
            priority: 'low',
            status: 'completed',
            createdAt: new Date(Date.now() - 86400000 * 4),
            createdBy: 1
        }
    ];
    
    // Заметки
    notes = [
        {
            id: 1,
            title: 'Идеи для игры',
            content: '<h2>Идеи для игры</h2><p>Основная механика:</p><ul><li>Головоломки с перемещением объектов</li><li>Сбор ресурсов для создания инструментов</li><li>Система прокачки персонажа</li></ul>',
            createdAt: new Date(Date.now() - 86400000 * 3),
            updatedAt: new Date(Date.now() - 86400000),
            userId: 1
        },
        {
            id: 2,
            title: 'Встреча команды',
            content: '<h2>Повестка встречи</h2><p>1. Обсуждение прогресса</p><p>2. Распределение задач</p><p>3. Планирование спринта</p>',
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date(Date.now() - 86400000 * 2),
            userId: 1
        }
    ];
    
    // Команды
    teams = [
        {
            id: 1,
            name: 'Моя команда',
            description: 'Команда разработчиков для демонстрации',
            members: [1],
            createdAt: new Date(Date.now() - 86400000 * 10),
            createdBy: 1
        }
    ];
    
    // Репозитории
    repositories = [
        {
            id: 1,
            url: 'https://github.com/user/demo-project.git',
            name: 'demo-project'
        }
    ];
    
    // Обновляем UI
    updateUI();
}

// Обновление всего UI
function updateUI() {
    updateProjectsUI();
    updateTasksUI();
    updateNotesUI();
    updateGitUI();
    updateTeamsUI();
    
    // Инициализация Git-интеграции
    initGitIntegration();
}

// Вспомогательные функции
function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU');
}

function getPriorityText(priority) {
    const priorities = {
        'low': 'Низкий',
        'medium': 'Средний',
        'high': 'Высокий'
    };
    
    return priorities[priority] || 'Средний';
} 