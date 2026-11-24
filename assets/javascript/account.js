// Nguyễn Hoàng Gia Thịnh - B2405055
// Phần 1: Hằng số và biến dùng chung

// Khóa localStorage
const USER_KEY_PREFIX = 'electroshopUser';
const CURRENT_USER_KEY = 'electroshopCurrentUser';

// Ô lưu tài khoản và thông tin của tài khoản
const SLOTS = [1, 2, 3];
const USER_FIELDS = ['customerId', 'username', 'email', 'phone', 'password'];

// Regex kiểm tra dữ liệu nhập
const REGEX = {
    username: /^[A-Za-z0-9_.]{6,30}$/,
    password: /^[\x21-\x7E]{8,}$/,
    phone: /^0\d{9}$/,
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
};

// Ô nhập báo lỗi khi gõ
const LIVE_FIELDS = [
    'login-username', 'login-password',
    'register-username', 'register-email', 'register-phone',
    'register-password', 'register-confirm', 'register-terms',
    'edit-username', 'edit-email', 'edit-phone',
    'edit-password', 'edit-password-confirm',
    'auth-password'
];

// Ô nhập lại mật khẩu của từng ô mật khẩu
const CONFIRM_OF = {
    'register-password': 'register-confirm',
    'edit-password': 'edit-password-confirm'
};

// Ô nhập của form đăng ký và đăng nhập
const REGISTER_FIELDS = [
    'register-username', 'register-email', 'register-phone',
    'register-password', 'register-confirm', 'register-terms'
];
const LOGIN_FIELDS = ['login-username', 'login-password'];

// Ô nhập của từng mục sửa
const EDIT_FIELDS = {
    username: ['edit-username'],
    email: ['edit-email'],
    phone: ['edit-phone'],
    password: ['edit-password', 'edit-password-confirm']
};

// Mục đang chờ xác thực mật khẩu
let pendingField = '';

// Bộ đếm giờ của thông báo nhanh
let toastTimer = 0;


// Phần 2: Hàm tiện ích dùng chung

// Lấy phần tử theo id
function getElement(id) {
    return document.getElementById(id);
}

// Lấy giá trị của ô nhập
function getValue(id) {
    return getElement(id).value;
}

// Gán chữ cho phần tử
function setText(id, text) {
    getElement(id).textContent = text;
}

// Đổi về chữ thường để so sánh
function normalize(value) {
    return value.toLowerCase();
}


// Phần 3: Dữ liệu tài khoản

// Tạo khóa lưu của một thông tin trong một ô
function userKey(slot, field) {
    return USER_KEY_PREFIX + slot + '.' + field;
}

// Đọc một ô thành object tài khoản
function readUser(slot) {
    const user = { slot: slot };
    USER_FIELDS.forEach(function (field) {
        user[field] = localStorage.getItem(userKey(slot, field));
    });
    return user;
}

// Ghi tài khoản vào ô của nó
function writeUser(user) {
    USER_FIELDS.forEach(function (field) {
        localStorage.setItem(userKey(user.slot, field), user[field]);
    });
}

// Đọc cả 3 tài khoản
function getUsers() {
    return SLOTS.map(readUser);
}

// Tìm tài khoản theo mã khách hàng
function findUserById(customerId) {
    const found = getUsers().find(function (user) {
        return user.customerId === customerId;
    });
    return found || null;
}

// Tìm tài khoản theo username
function findUserByUsername(username) {
    const name = normalize(username);
    const found = getUsers().find(function (user) {
        return normalize(user.username) === name;
    });
    return found || null;
}

// Kiểm tra thông tin đã có người dùng chưa
function isFieldTaken(field, value, exceptId) {
    const target = normalize(value);
    return getUsers().some(function (user) {
        return user.customerId !== exceptId && normalize(user[field]) === target;
    });
}

// Tạo mã khách hàng từ số thứ tự
function formatCustomerId(number) {
    return 'KH' + String(number).padStart(4, '0');
}

// Lấy số thứ tự lớn nhất của mã khách hàng
function getLastCustomerNumber() {
    const numbers = getUsers().map(function (user) {
        return Number(user.customerId.slice(2));
    });
    return Math.max(...numbers);
}

// Chọn ô nhận tài khoản mới (ô 2 và ô 3 luân phiên)
function getSlotForNumber(number) {
    return number % 2 === 0 ? 2 : 3;
}

// Thêm tài khoản mới
function addUser(info) {
    const number = getLastCustomerNumber() + 1;
    const newUser = {
        slot: getSlotForNumber(number),
        customerId: formatCustomerId(number),
        ...info
    };
    writeUser(newUser);
    return newUser;
}

// Cập nhật một thông tin của tài khoản
function updateUser(customerId, field, value) {
    const user = findUserById(customerId);
    localStorage.setItem(userKey(user.slot, field), value);
}

// Ghi tài khoản ban đầu nếu ô còn trống
function seedUser(info) {
    if (localStorage.getItem(userKey(info.slot, 'customerId')) === null) {
        writeUser(info);
    }
}

// Tạo 3 tài khoản ban đầu
function seedDemoUsers() {
    seedUser({
        slot: 1,
        customerId: 'KH0001',
        username: 'thayLinhdeptrai',
        email: 'khachdemo01@electroshop.vn',
        phone: '0900000001',
        password: 'thayLinhcho10diem'
    });
    seedUser({
        slot: 2,
        customerId: 'KH0002',
        username: 'khachdemo02',
        email: 'khachdemo02@electroshop.vn',
        phone: '0900000002',
        password: 'Demo2@2026'
    });
    seedUser({
        slot: 3,
        customerId: 'KH0003',
        username: 'khachdemo03',
        email: 'khachdemo03@electroshop.vn',
        phone: '0900000003',
        password: 'Demo3@2026'
    });
}


// Phần 4: Phiên đăng nhập

// Lấy mã khách hàng đang đăng nhập
function getCurrentCustomerId() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

// Lấy tài khoản đang đăng nhập
function getCurrentUser() {
    return findUserById(getCurrentCustomerId());
}

// Lưu phiên đăng nhập
function setCurrentCustomerId(customerId) {
    localStorage.setItem(CURRENT_USER_KEY, customerId);
}

// Xóa phiên đăng nhập
function clearCurrentCustomerId() {
    localStorage.removeItem(CURRENT_USER_KEY);
}


// Phần 5: Kiểm tra dữ liệu nhập

function validateUsername(value) {
    if (value === '') {
        return 'Vui lòng nhập tên đăng nhập';
    }
    if (!REGEX.username.test(value)) {
        return 'Tên đăng nhập 6-30 ký tự, chỉ gồm chữ không dấu, số, dấu gạch dưới hoặc dấu chấm';
    }
    return '';
}

function validateEmail(value) {
    if (value === '') {
        return 'Vui lòng nhập email';
    }
    if (!REGEX.email.test(value)) {
        return 'Email chưa đúng định dạng, ví dụ: vidu@gmail.com';
    }
    return '';
}

function validatePhone(value) {
    if (value === '') {
        return 'Vui lòng nhập số điện thoại';
    }
    if (!REGEX.phone.test(value)) {
        return 'Số điện thoại gồm 10 số và bắt đầu bằng 0';
    }
    return '';
}

function validatePassword(value) {
    if (value === '') {
        return 'Vui lòng nhập mật khẩu';
    }
    if (!REGEX.password.test(value)) {
        return 'Mật khẩu tối thiểu 8 ký tự, không dấu, không khoảng trắng';
    }
    return '';
}

// Kiểm tra ô nhập lại mật khẩu
function validateConfirm(password, confirm) {
    if (confirm === '') {
        return 'Vui lòng nhập lại mật khẩu';
    }
    if (confirm !== password) {
        return 'Mật khẩu nhập lại không khớp';
    }
    return '';
}

// Kiểm tra ô đồng ý điều khoản
function validateTerms(checked) {
    return checked ? '' : 'Bạn cần đồng ý với điều khoản và điều kiện';
}

// Kiểm tra ô mật khẩu hiện tại
function validateCurrentPassword(value) {
    return value === '' ? 'Vui lòng nhập mật khẩu hiện tại' : '';
}

// Lấy mã khách hàng được bỏ qua khi kiểm tra trùng
function getExceptId() {
    const user = getCurrentUser();
    return user === null ? '' : user.customerId;
}

// Kiểm tra trùng thông tin
function checkUnique(field, value, message) {
    return isFieldTaken(field, value, getExceptId()) ? message : '';
}

// Kiểm tra username khi đăng ký, sửa
function validateNewUsername(value) {
    return validateUsername(value) ||
        checkUnique('username', value, 'Tên đăng nhập đã có người sử dụng');
}

// Kiểm tra email khi đăng ký, sửa
function validateNewEmail(value) {
    return validateEmail(value) ||
        checkUnique('email', value, 'Email đã có người sử dụng');
}

// Kiểm tra số điện thoại khi đăng ký, sửa
function validateNewPhone(value) {
    return validatePhone(value) ||
        checkUnique('phone', value, 'Số điện thoại đã có người sử dụng');
}

// Bảng tra: id ô nhập -> hàm kiểm tra
const FIELD_VALIDATORS = {
    'login-username': validateUsername,
    'login-password': validatePassword,
    'register-username': validateNewUsername,
    'register-email': validateNewEmail,
    'register-phone': validateNewPhone,
    'register-password': validatePassword,
    'register-confirm': function (value) {
        return validateConfirm(getValue('register-password'), value);
    },
    'register-terms': validateTerms,
    'edit-username': validateNewUsername,
    'edit-email': validateNewEmail,
    'edit-phone': validateNewPhone,
    'edit-password': validatePassword,
    'edit-password-confirm': function (value) {
        return validateConfirm(getValue('edit-password'), value);
    },
    'auth-password': validateCurrentPassword
};

// Lấy nội dung lỗi của một ô nhập
function getFieldMessage(id) {
    const input = getElement(id);
    const value = input.type === 'checkbox' ? input.checked : input.value;
    return FIELD_VALIDATORS[id](value);
}

// Hiện lỗi và đổi màu viền của ô nhập
function setFieldState(id, message) {
    const input = getElement(id);
    setText(id + '-error', message);

    const control = input.closest('.form-control');
    if (control !== null) {
        control.classList.toggle('form-control--error', message !== '');
        control.classList.toggle('form-control--success', message === '' && input.value !== '');
    }
}

// Kiểm tra một danh sách ô nhập
function validateFields(ids) {
    let firstInvalid = null;

    for (const id of ids) {
        const message = getFieldMessage(id);
        setFieldState(id, message);
        if (message !== '' && firstInvalid === null) {
            firstInvalid = getElement(id);
        }
    }

    if (firstInvalid !== null) {
        firstInvalid.focus();
        return false;
    }
    return true;
}

// Kiểm tra lại ô nhập lại mật khẩu
function recheckConfirm(confirmId) {
    if (getValue(confirmId) !== '') {
        setFieldState(confirmId, getFieldMessage(confirmId));
    }
}

// Xóa lỗi và màu viền của một danh sách ô nhập
function resetFieldStates(ids) {
    for (const id of ids) {
        setFieldState(id, '');
    }
}


// Phần 6: Giao diện dùng chung

// Hiện hoặc ẩn mật khẩu của một ô nhập
function setPasswordVisible(id, visible) {
    getElement(id).type = visible ? 'text' : 'password';

    const icon = document.createElement('i');
    icon.className = visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    document.querySelector('[data-toggle-password="' + id + '"]').replaceChildren(icon);
}

// Hiện thông báo nhanh
function showToast(message) {
    const toast = getElement('toast');
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
        toast.hidden = true;
    }, 3000);
}

// Hiện thông báo chung của form
function showFormMessage(id, text, type) {
    const box = getElement(id);
    box.textContent = text;
    box.classList.remove('form-message--error', 'form-message--success');
    if (text !== '') {
        box.classList.add('form-message--' + type);
    }
}

// Chuyển tab đăng nhập, đăng ký
function switchTab(formId) {
    document.querySelectorAll('.account__form').forEach(function (form) {
        form.hidden = form.id !== formId;
    });
    document.querySelectorAll('.account__tab').forEach(function (tab) {
        const isActive = tab.dataset.target === formId;
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });
}

// Mở hộp thoại
function openModal(id) {
    getElement(id).showModal();
}

// Đóng hộp thoại
function closeModal(modal) {
    modal.close();
}

// Kiểm tra bấm ngoài khung hộp thoại
function isClickOutside(event, modal) {
    const box = modal.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom;
}


// Phần 7: Hiển thị trang theo trạng thái đăng nhập

// Điền thông tin vào hồ sơ
function fillProfile(user) {
    setText('profile-name', user.username);
    setText('value-username', user.username);
    setText('value-email', user.email);
    setText('value-phone', user.phone);
}

// Hiện khối khách hoặc khối hồ sơ
function renderAccountPage() {
    const user = getCurrentUser();

    if (user === null) {
        clearCurrentCustomerId();
    }

    getElement('guest-section').hidden = user !== null;
    getElement('profile-section').hidden = user === null;
    if (user !== null) {
        fillProfile(user);
    }

    // Hàm của base.js
    updateHeaderAccount();
}


// Phần 8: Đăng ký

// Đưa form đăng ký về ban đầu
function resetRegisterForm() {
    getElement('register-form').reset();
    setPasswordVisible('register-password', false);
    setPasswordVisible('register-confirm', false);
    resetFieldStates(REGISTER_FIELDS);
    showFormMessage('register-message', '', 'success');
}

// Chuyển sang tab đăng nhập sau khi đăng ký
function goToLoginAfterRegister(username) {
    switchTab('login-form');
    getElement('login-username').value = username;
    setFieldState('login-username', getFieldMessage('login-username'));
    showFormMessage('login-message', 'Đăng ký thành công, hãy đăng nhập', 'success');
    showToast('Đăng ký thành công');
}

// Xử lý đăng ký
function handleRegister(event) {
    event.preventDefault();

    if (!validateFields(REGISTER_FIELDS)) {
        showFormMessage('register-message', 'Vui lòng kiểm tra lại các thông tin đã nhập', 'error');
        return;
    }

    const newUser = addUser({
        username: getValue('register-username'),
        email: getValue('register-email'),
        phone: getValue('register-phone'),
        password: getValue('register-password')
    });

    resetRegisterForm();
    goToLoginAfterRegister(newUser.username);
}


// Phần 9: Đăng nhập và đăng xuất

// Hoàn tất đăng nhập
function completeLogin(user) {
    setCurrentCustomerId(user.customerId);
    getElement('login-form').reset();
    setPasswordVisible('login-password', false);
    resetFieldStates(LOGIN_FIELDS);
    showFormMessage('login-message', '', 'success');
    renderAccountPage();
    showToast('Đăng nhập thành công');
}

// Xử lý đăng nhập
function handleLogin(event) {
    event.preventDefault();

    if (!validateFields(LOGIN_FIELDS)) {
        showFormMessage('login-message', '', 'error');
        return;
    }

    const user = findUserByUsername(getValue('login-username'));
    if (user === null || user.password !== getValue('login-password')) {
        showFormMessage('login-message', 'Tên đăng nhập hoặc mật khẩu không đúng', 'error');
        return;
    }

    completeLogin(user);
}

// Xử lý đăng xuất
function handleConfirmLogout() {
    clearCurrentCustomerId();
    closeModal(getElement('logout-modal'));
    closeAllEditForms();
    switchTab('login-form');
    renderAccountPage();
    showToast('Đã đăng xuất');
}


// Phần 10: Sửa thông tin tài khoản

// Lấy form sửa của một mục
function getEditForm(field) {
    return document.querySelector('[data-form="' + field + '"]');
}

// Mở form sửa
function openEditForm(field) {
    getEditForm(field).hidden = false;
    getElement(EDIT_FIELDS[field][0]).focus();
}

// Đóng form sửa
function closeEditForm(field) {
    getEditForm(field).hidden = true;

    EDIT_FIELDS[field].forEach(function (id) {
        getElement(id).value = '';
        if (field === 'password') {
            setPasswordVisible(id, false);
        }
    });
    resetFieldStates(EDIT_FIELDS[field]);
}

// Đóng tất cả form sửa
function closeAllEditForms() {
    Object.keys(EDIT_FIELDS).forEach(closeEditForm);
}

// Kiểm tra giá trị mới có trùng giá trị hiện tại
function isSameAsCurrent(field) {
    return getCurrentUser()[field] === getValue(EDIT_FIELDS[field][0]);
}

// Xử lý nút Lưu ở form sửa
function handleEditSubmit(event) {
    event.preventDefault();

    const field = event.currentTarget.dataset.form;
    if (!validateFields(EDIT_FIELDS[field])) {
        return;
    }

    if (isSameAsCurrent(field)) {
        setFieldState(EDIT_FIELDS[field][0], 'Giá trị mới phải khác giá trị hiện tại');
        return;
    }

    pendingField = field;
    openModal('auth-modal');
}

// Ghi thay đổi vào tài khoản
function saveProfileChange(field) {
    const newValue = getValue(EDIT_FIELDS[field][0]);
    updateUser(getCurrentCustomerId(), field, newValue);

    closeEditForm(field);
    renderAccountPage();
    showToast('Cập nhật thông tin thành công');
}

// Xử lý xác thực mật khẩu
function handleAuthSubmit(event) {
    event.preventDefault();

    if (!validateFields(['auth-password'])) {
        return;
    }
    if (getValue('auth-password') !== getCurrentUser().password) {
        setFieldState('auth-password', 'Mật khẩu không đúng');
        return;
    }

    const field = pendingField;
    closeModal(getElement('auth-modal'));
    saveProfileChange(field);
}

// Dọn hộp xác thực khi đóng
function resetAuthModal() {
    getElement('auth-form').reset();
    setPasswordVisible('auth-password', false);
    setFieldState('auth-password', '');
    pendingField = '';
}


// Phần 11: Gắn sự kiện

// Báo lỗi khi gõ
function bindLiveValidation() {
    LIVE_FIELDS.forEach(function (id) {
        const input = getElement(id);
        const eventName = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(eventName, function () {
            setFieldState(id, getFieldMessage(id));
            if (CONFIRM_OF[id]) {
                recheckConfirm(CONFIRM_OF[id]);
            }
        });
    });
}

// Nút hiện, ẩn mật khẩu
function bindPasswordToggles() {
    document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
        button.addEventListener('click', function () {
            const id = button.dataset.togglePassword;
            setPasswordVisible(id, getElement(id).type === 'password');
        });
    });
}

// Chuyển tab bằng chuột và phím mũi tên
function bindTabs() {
    document.querySelectorAll('[data-target]').forEach(function (button) {
        button.addEventListener('click', function () {
            switchTab(button.dataset.target);
        });
    });

    document.querySelectorAll('.account__tab').forEach(function (tab, index, tabs) {
        tab.addEventListener('keydown', function (event) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                return;
            }
            const step = event.key === 'ArrowRight' ? 1 : -1;
            const nextTab = tabs[(index + step + tabs.length) % tabs.length];
            switchTab(nextTab.dataset.target);
            nextTab.focus();
        });
    });
}

// Đóng hộp thoại
function bindModals() {
    document.querySelectorAll('[data-close-modal]').forEach(function (button) {
        button.addEventListener('click', function () {
            closeModal(button.closest('.modal'));
        });
    });

    document.querySelectorAll('.modal').forEach(function (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal && isClickOutside(event, modal)) {
                closeModal(modal);
            }
        });
    });

    getElement('auth-modal').addEventListener('close', resetAuthModal);
}

// Hộp thoại điều khoản
function bindTerms() {
    getElement('open-terms').addEventListener('click', function () {
        openModal('terms-modal');
    });

    getElement('accept-terms').addEventListener('click', function () {
        getElement('register-terms').checked = true;
        setFieldState('register-terms', '');
        closeModal(getElement('terms-modal'));
    });
}

// Gắn xử lý submit cho form
function bindSubmit(formId, handler) {
    getElement(formId).addEventListener('submit', handler);
}

// Nút Sửa, nút Hủy và form sửa
function bindEditForms() {
    document.querySelectorAll('[data-edit]').forEach(function (button) {
        button.addEventListener('click', function () {
            closeAllEditForms();
            openEditForm(button.dataset.edit);
        });
    });

    document.querySelectorAll('[data-cancel]').forEach(function (button) {
        button.addEventListener('click', function () {
            closeEditForm(button.dataset.cancel);
        });
    });

    document.querySelectorAll('.profile__edit').forEach(function (form) {
        form.addEventListener('submit', handleEditSubmit);
    });
}

// Nút đăng xuất
function bindLogout() {
    getElement('logout-btn').addEventListener('click', function () {
        openModal('logout-modal');
    });
    getElement('confirm-logout').addEventListener('click', handleConfirmLogout);
}

// Gắn tất cả sự kiện
function bindAllEvents() {
    bindLiveValidation();
    bindPasswordToggles();
    bindTabs();
    bindModals();
    bindTerms();
    bindSubmit('register-form', handleRegister);
    bindSubmit('login-form', handleLogin);
    bindSubmit('auth-form', handleAuthSubmit);
    bindEditForms();
    bindLogout();
}


// Phần 12: Khởi tạo trang

// Khởi tạo trang
function init() {
    seedDemoUsers();
    bindAllEvents();
    renderAccountPage();
}

init();
// Nguyễn Hoàng Gia Thịnh - B2405055