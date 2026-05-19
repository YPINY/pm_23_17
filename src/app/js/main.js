/**
 * Resume JavaScript Functions with AJAX Data Loading
 * ===================================================
 * 1. Завантаження даних з data.json через Fetch API
 * 2. Підстановка імені користувача (firstName + lastName)
 * 3. Toggle видимості блоків зі стрілками
 * 4. Генерація розмітки з масиву даних
 */

// ============================================
// ГЛОБАЛЬНІ ЗМІННІ
// ============================================

let appData = null; // Глобальне сховище для завантажених даних

// ============================================
// ЗАВДАННЯ 1: AJAX Завантаження даних з JSON
// ============================================

/**
 * Завантаження даних з data.json через Fetch API
 * @returns {Promise<Object>} - Promise з даними або помилкою
 */
async function loadDataFromJSON() {
    const dataUrl = 'data.json'; // Шлях до JSON файлу
    
    try {
        console.log('🔄 Завантаження даних з data.json...');
        
        // Виконуємо запит через Fetch API
        const response = await fetch(dataUrl);
        
        // Перевіряємо статус відповіді
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        // Перетворюємо відповідь на JSON об'єкт
        const data = await response.json();
        
        console.log('✅ Дані успішно завантажено:', data);
        return data;
        
    } catch (error) {
        // Обробка помилок
        console.error('❌ Помилка завантаження даних:', error);
        
        // Відображення службового повідомлення користувачу
        displayErrorMessage(`Помилка завантаження даних: ${error.message}`);
        
        throw error; // Пробрасуємо помилку далі
    }
}

/**
 * Альтернативна реалізація через XMLHttpRequest (для порівняння)
 * @returns {Promise<Object>}
 */
function loadDataWithXHR() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', 'data.json', true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('✅ Дані завантажено через XHR:', data);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Помилка парсингу JSON'));
                }
            } else {
                reject(new Error(`HTTP помилка! Статус: ${xhr.status}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Помилка мережі'));
        };
        
        xhr.send();
    });
}

/**
 * Відображення повідомлення про помилку
 * @param {string} message - Текст повідомлення
 */
function displayErrorMessage(message) {
    // Створюємо елемент повідомлення
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.innerHTML = `
        <strong>⚠️ Помилка:</strong> ${escapeHTML(message)}
        <br><small>Перевірте консоль для деталей</small>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Автоматично видаляємо через 5 секунд
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}


// ============================================
// ЗАВДАННЯ 2: Підстановка імені користувача
// ============================================

/**
 * Функція для підстановки повного імені (firstName + lastName)
 * @param {string} elementId - ID елемента для вставки
 * @param {Object} personalData - Об'єкт з персональними даними
 */
function setUserFullName(elementId, personalData) {
    const element = document.getElementById(elementId);
    
    if (element && personalData) {
        // Формуємо повне ім'я з firstName та lastName
        const fullName = `${personalData.firstName} ${personalData.lastName}`;
        
        // Використовуємо textContent (без HTML) для безпеки
        element.textContent = fullName;
        console.log(`✅ Повне ім'я "${fullName}" встановлено в елемент #${elementId}`);
    } else {
        console.warn(`⚠️ Елемент з id="${elementId}" не знайдено або дані відсутні`);
    }
}

/**
 * Функція для підстановки професії користувача
 * @param {string} elementId - ID елемента для вставки
 * @param {Object} personalData - Об'єкт з персональними даними
 */
function setUserProfession(elementId, personalData) {
    const element = document.getElementById(elementId);
    
    if (element && personalData && personalData.profession) {
        element.textContent = personalData.profession;
        console.log(`✅ Професія "${personalData.profession}" встановлена в елемент #${elementId}`);
    }
}


// ============================================
// ЗАВДАННЯ 3: Toggle видимості блоків зі стрілками
// ============================================

/**
 * CSS класи для toggle функціоналу
 */
const TOGGLE_CLASSES = {
    hidden: 'content-hidden',
    rotated: 'arrow-rotated',
    arrow: 'toggle-arrow'
};

/**
 * Ініціалізація toggle стрілок для всіх секцій
 */
function initToggleArrows() {
    const sectionHeaders = document.querySelectorAll('.column .section-header');
    
    sectionHeaders.forEach((header, index) => {
        if (header.querySelector(`.${TOGGLE_CLASSES.arrow}`)) {
            return;
        }
        
        const arrow = document.createElement('i');
        arrow.className = `fas fa-chevron-down ${TOGGLE_CLASSES.arrow}`;
        arrow.setAttribute('role', 'button');
        arrow.setAttribute('aria-expanded', 'true');
        arrow.setAttribute('aria-label', 'Згорнути/розгорнути секцію');
        arrow.setAttribute('tabindex', '0');
        
        header.appendChild(arrow);
        
        const content = getNextSiblingContent(header);
        
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSection(arrow, content);
        });
        
        arrow.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection(arrow, content);
            }
        });
        
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            toggleSection(arrow, content);
        });
        
        console.log(`✅ Toggle стрілка додана до секції ${index + 1}`);
    });
}

/**
 * Отримує контент секції
 */
function getNextSiblingContent(header) {
    const content = [];
    let sibling = header.nextElementSibling;
    
    while (sibling && !sibling.classList.contains('section-header')) {
        content.push(sibling);
        sibling = sibling.nextElementSibling;
    }
    
    return content;
}

/**
 * Перемикає видимість секції
 */
function toggleSection(arrow, content) {
    const isHidden = arrow.classList.contains(TOGGLE_CLASSES.rotated);
    
    arrow.classList.toggle(TOGGLE_CLASSES.rotated);
    arrow.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    
    content.forEach(element => {
        element.classList.toggle(TOGGLE_CLASSES.hidden);
    });
    
    console.log(`🔄 Секція ${isHidden ? 'розгорнута' : 'згорнута'}`);
}


// ============================================
// ЗАВДАННЯ 4: Генерація розмітки з даних JSON
// ============================================

/**
 * Генерує HTML для досвіду роботи
 */
function generateWorkItemHTML(item) {
    const activeClass = item.isActive ? 'active' : '';
    
    return `
        <div class="card experience-item ${activeClass}" data-id="${item.id}">
            <div class="card-body">
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                <span class="badge date">${escapeHTML(item.date)}</span>
                <p class="company card-subtitle">${escapeHTML(item.company)}</p>
                <p class="description card-text">${escapeHTML(item.description)}</p>
            </div>
        </div>
    `;
}

/**
 * Генерує HTML для навичок
 */
function generateSkillItemHTML(skill) {
    return `
        <div class="skill-item">
            <span class="skill-name">${escapeHTML(skill.name)}</span>
            <div class="progress progress-bar-custom" 
                 role="progressbar" 
                 aria-valuenow="${skill.level}" 
                 aria-valuemin="0" 
                 aria-valuemax="100"
                 aria-label="${escapeHTML(skill.name)} - ${skill.level}%">
                <div class="progress-bar progress-fill" style="width: ${skill.level}%"></div>
            </div>
        </div>
    `;
}

/**
 * Генерує HTML для освіти
 */
function generateEducationItemHTML(item) {
    const activeClass = item.isActive ? 'active' : '';
    
    return `
        <div class="card education-item ${activeClass}" data-id="${item.id}">
            <div class="card-body">
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                <p class="university card-subtitle">
                    ${escapeHTML(item.university)}
                    <span class="badge date">${escapeHTML(item.date)}</span>
                </p>
                <p class="description card-text">${escapeHTML(item.description)}</p>
            </div>
        </div>
    `;
}

/**
 * Головна функція для рендерингу даних
 */
function renderDataToContainer(containerId, dataArray, generateItemFn) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`⚠️ Контейнер з id="${containerId}" не знайдено`);
        return;
    }
    
    // Очищаємо вміст контейнера перед вставкою
    container.innerHTML = '';
    
    if (!dataArray || dataArray.length === 0) {
        container.innerHTML = '<p class="no-data">Дані відсутні</p>';
        return;
    }
    
    // Генеруємо розмітку для кожного елемента
    const html = dataArray.map(item => generateItemFn(item)).join('');
    
    // Вставляємо розмітку
    container.innerHTML = html;
    
    console.log(`✅ Згенеровано ${dataArray.length} елементів у контейнер #${containerId}`);
}

/**
 * Рендеринг всіх секцій з даних JSON
 */
function renderAllSections(data) {
    if (!data) {
        console.error('❌ Дані відсутні для рендерингу');
        return;
    }
    
    // Підстановка імені (firstName + lastName)
    if (data.personalData) {
        setUserFullName('personName', data.personalData);
        setUserProfession('personProfession', data.personalData);
    }
    
    // Генерація секцій з масивів
    if (data.jobs) {
        renderDataToContainer('work-experience-container', data.jobs, generateWorkItemHTML);
    }
    
    if (data.skills) {
        renderDataToContainer('skills-container', data.skills, generateSkillItemHTML);
    }
    
    if (data.education) {
        renderDataToContainer('education-container', data.education, generateEducationItemHTML);
    }
}

/**
 * Утиліта для екранування HTML (захист від XSS)
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ============================================
// ІНІЦІАЛІЗАЦІЯ після завантаження DOM
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Resume JS завантажено');
    
    try {
        // ЗАВДАННЯ 1: Завантаження даних з JSON через AJAX
        appData = await loadDataFromJSON();
        
        // ЗАВДАННЯ 2 і 3: Рендеринг даних з JSON (замість захардкоджених)
        renderAllSections(appData);
        
        // Toggle стрілок (після рендерингу контенту)
        initToggleArrows();
        
        console.log('✅ Всі функції ініціалізовано');
        
    } catch (error) {
        console.error('❌ Критична помилка ініціалізації:', error);
        
        // Fallback: показуємо повідомлення користувачу
        displayErrorMessage('Не вдалося завантажити дані. Перезавантажте сторінку.');
    }
});

