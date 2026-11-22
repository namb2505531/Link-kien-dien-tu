// Khóa lưu trong localStorage
const USERS_KEY = 'electroshopUsers';
const CURRENT_USER_KEY = 'electroshopCurrentUser';

// Tài khoản mẫu để thầy đăng nhập thử
const SAMPLE_USER = {
    customerId: 'KH0001',
    username: 'nguyenvana',
    email: 'nvademo@gmail.com',
    phone: '0123456789',
    password: 'adeptrai808'
};

// Các regex kiểm tra dữ liệu nhập
const REGEX = {
    // 6-30 ký tự: chữ không dấu, số, dấu gạch dưới, dấu chấm
    username: /^[A-Za-z0-9_.]{6,30}$/,
    // Tối thiểu 8 ký tự, không dấu, không khoảng trắng
    password: /^[\x21-\x7E]{8,}$/,
    // 10 số, bắt đầu bằng 0
    phone: /^0\d{9}$/,
    // Đúng cấu trúc email: tên@miền.đuôi
    email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
};

// Lấy danh sách tài khoản, luôn trả về mảng, bỏ phần tử không phải đối tượng
function getUsers() {
    try {
        const data = JSON.parse(localStorage.getItem(USERS_KEY));
        if (!Array.isArray(data)) {
            return [];
        }
        return data.filter(function (user) {
            return user !== null && typeof user === 'object';
        });
    } catch (error) {
        return [];
    }
}

// Lưu danh sách tài khoản (chuyển mảng thành chuỗi JSON)
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Đổi số thứ tự thành mã khách hàng, ví dụ 1 thành KH0001
function formatCustomerId(number) {
    return 'KH' + String(number).padStart(4, '0');
}

// Mã khách hàng cho tài khoản mới: số thứ tự đăng ký tiếp theo
function createCustomerId() {
    return formatCustomerId(getUsers().length + 1);
}

// Chưa có tài khoản nào thì thêm tài khoản mẫu, tài khoản cũ chưa có mã khách hàng thì cấp mã
function initUsers() {
    let users = getUsers();
    if (users.length === 0) {
        users = [SAMPLE_USER];
    }
    users.forEach(function (user, index) {
        if (!user.customerId) {
            user.customerId = formatCustomerId(index + 1);
        }
    });
    saveUsers(users);
}

// Tìm tài khoản theo username (không phân biệt hoa thường), không thấy thì trả về null
function findUser(username) {
    const name = String(username).toLowerCase();
    const found = getUsers().find(function (user) {
        return String(user.username).toLowerCase() === name;
    });
    return found || null;
}

// Kiểm tra username đã có người dùng chưa, bỏ qua username hiện tại khi đang sửa
function isUsernameTaken(username, exceptUsername) {
    const name = String(username).toLowerCase();
    const except = String(exceptUsername || '').toLowerCase();
    return getUsers().some(function (user) {
        const current = String(user.username).toLowerCase();
        return current === name && current !== except;
    });
}

// Kiểm tra email đã có người sử dụng chưa
function isEmailTaken(email, exceptUsername) {
    const value = String(email).toLowerCase();
    const except = String(exceptUsername || '').toLowerCase();

    return getUsers().some(function (user) {
        const current = String(user.email || '').toLowerCase();
        const username = String(user.username || '').toLowerCase();

        return current === value && username !== except;
    });
}

// Kiểm tra số điện thoại đã có người sử dụng chưa
function isPhoneTaken(phone, exceptUsername) {
    const value = String(phone);
    const except = String(exceptUsername || '').toLowerCase();

    return getUsers().some(function (user) {
        const current = String(user.phone || '');
        const username = String(user.username || '').toLowerCase();

        return current === value && username !== except;
    });
}

// Lấy username đang đăng nhập (chuỗi hoặc null)
function getCurrentUsername() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

// Lấy toàn bộ thông tin người đang đăng nhập, chưa đăng nhập thì trả về null
function getCurrentUser() {
    const username = getCurrentUsername();
    return username ? findUser(username) : null;
}

// Ghi nhận đăng nhập
function setCurrentUser(username) {
    localStorage.setItem(CURRENT_USER_KEY, String(username));
}

// Kết thúc phiên đăng nhập
function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

// Chạy khi trang tải xong
initUsers();

// Lấy ô nhập theo id, không có thì trả về null
function getInput(id) {
    return document.getElementById(id);
}

// Các hàm kiểm tra: đúng thì trả về chuỗi rỗng, sai thì trả về nội dung lỗi
function validateUsername(value) {
    if (value === '') {
        return 'Vui lòng nhập tên đăng nhập';
    }
    if (!REGEX.username.test(value)) {
        return 'Tên đăng nhập 6-30 ký tự, chỉ gồm chữ không dấu, số, dấu gạch dưới hoặc dấu chấm';
    }
    return '';
}

// Kiểm tra username khi đăng ký hoặc đổi, không được trùng người khác
function validateNewUsername(value, exceptUsername) {
    const message = validateUsername(value);
    if (message !== '') {
        return message;
    }
    if (isUsernameTaken(value, exceptUsername)) {
        return 'Tên đăng nhập đã có người sử dụng';
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

// Kiểm tra email khi đăng ký hoặc đổi thông tin
function validateNewEmail(value, exceptUsername) {
    const message = validateEmail(value);

    if (message !== '') {
        return message;
    }

    if (isEmailTaken(value, exceptUsername)) {
        return 'Email đã có người sử dụng';
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

// Kiểm tra số điện thoại khi đăng ký hoặc đổi thông tin
function validateNewPhone(value, exceptUsername) {
    const message = validatePhone(value);

    if (message !== '') {
        return message;
    }

    if (isPhoneTaken(value, exceptUsername)) {
        return 'Số điện thoại đã có người sử dụng';
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

// Kiểm tra ô nhập lại mật khẩu có khớp không
function validateConfirm(password, confirm) {
    if (confirm === '') {
        return 'Vui lòng nhập lại mật khẩu';
    }
    if (confirm !== password) {
        return 'Mật khẩu nhập lại không khớp';
    }
    return '';
}

// Lấy giá trị của một ô nhập, không có ô thì trả về chuỗi rỗng
function getValue(id) {
    const input = getInput(id);
    return input ? input.value : '';
}

// Trả về nội dung lỗi của một ô nhập theo id của nó
function getFieldMessage(id) {
    const input = getInput(id);
    if (!input) {
        return '';
    }
    const value = input.value;

    switch (id) {
        case 'login-username':
            return validateUsername(value);
        case 'login-password':
            return validatePassword(value);
        case 'register-username':
            return validateNewUsername(value);
        case 'register-email':
            return validateNewEmail(value);
        case 'register-phone':
            return validateNewPhone(value);
        case 'register-password':
            return validatePassword(value);
        case 'register-confirm':
            return validateConfirm(getValue('register-password'), value);
        case 'register-terms':
            return input.checked ? '' : 'Bạn cần đồng ý với điều khoản và điều kiện';
        case 'edit-username':
            return validateNewUsername(value, getCurrentUsername() || '');
        case 'edit-email':
            return validateNewEmail(value, getCurrentUsername() || '');
        case 'edit-phone':
            return validateNewPhone(value, getCurrentUsername() || '');
        case 'edit-password':
            return validatePassword(value);
        case 'edit-password-confirm':
            return validateConfirm(getValue('edit-password'), value);
        case 'auth-password':
            return value === '' ? 'Vui lòng nhập mật khẩu hiện tại' : '';
        default:
            return '';
    }
}

// Hiện lỗi dưới ô nhập và đổi màu viền (đỏ khi sai, xanh khi đúng)
function setFieldState(id, message) {
    const input = getInput(id);
    const errorBox = document.getElementById(id + '-error');
    if (!input || !errorBox) {
        return;
    }
    errorBox.textContent = message;

    // Ô tick đồng ý không có khung viền nên bỏ qua phần đổi màu
    const control = input.closest('.form-control');
    if (control) {
        control.classList.toggle('form-control--error', message !== '');
        control.classList.toggle('form-control--success', message === '' && input.value !== '');
    }
}

// Kiểm tra cả danh sách ô nhập, trả về true nếu tất cả đều đúng
function validateFields(ids) {
    let firstInvalid = null;

    for (const id of ids) {
        const message = getFieldMessage(id);
        setFieldState(id, message);
        if (message !== '' && firstInvalid === null) {
            firstInvalid = getInput(id);
        }
    }

    // Đưa con trỏ vào ô sai đầu tiên
    if (firstInvalid !== null) {
        firstInvalid.focus();
        return false;
    }
    return true;
}

// Khi mật khẩu đổi thì kiểm tra lại ô nhập lại (chỉ khi ô đó đã có chữ)
function recheckConfirm(confirmId) {
    const confirmInput = getInput(confirmId);
    if (confirmInput && confirmInput.value !== '') {
        setFieldState(confirmId, getFieldMessage(confirmId));
    }
}

// Các ô nhập cần báo lỗi ngay khi người dùng gõ
const LIVE_FIELDS = [
    'login-username', 'login-password',
    'register-username', 'register-email', 'register-phone',
    'register-password', 'register-confirm', 'register-terms',
    'edit-username', 'edit-email', 'edit-phone',
    'edit-password', 'edit-password-confirm',
    'auth-password'
];

LIVE_FIELDS.forEach(function (id) {
    const input = getInput(id);
    if (!input) {
        return;
    }
    // Ô tick dùng sự kiện change, các ô còn lại dùng input
    const eventName = input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(eventName, function () {
        setFieldState(id, getFieldMessage(id));
        if (id === 'register-password') {
            recheckConfirm('register-confirm');
        }
        if (id === 'edit-password') {
            recheckConfirm('edit-password-confirm');
        }
    });
});

// Hiện hoặc ẩn mật khẩu của một ô nhập, đổi icon con mắt theo
function setPasswordVisible(id, visible) {
    const input = getInput(id);
    if (!input) {
        return;
    }
    input.type = visible ? 'text' : 'password';

    const button = document.querySelector('[data-toggle-password="' + id + '"]');
    if (button) {
        // Xóa icon cũ rồi tạo thẻ i mới, Font Awesome sẽ tự vẽ lại icon
        while (button.firstChild) {
            button.removeChild(button.firstChild);
        }
        const icon = document.createElement('i');
        icon.className = visible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        button.appendChild(icon);
    }
}

// Nút hiện/ẩn mật khẩu
document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
    button.addEventListener('click', function () {
        const id = button.getAttribute('data-toggle-password') || '';
        const input = getInput(id);
        if (input) {
            setPasswordVisible(id, input.type === 'password');
        }
    });
});

// Lấy form theo id, không có thì trả về null
function getForm(id) {
    return document.getElementById(id);
}

// Gán chữ cho một phần tử theo id
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = String(text);
    }
}

// Thông báo nhanh (toast), tự ẩn sau 3 giây
let toastTimer = 0;

function showToast(message, isError) {
    const toast = document.getElementById('toast');
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.toggle('toast--error', Boolean(isError));
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
        toast.hidden = true;
    }, 3000);
}

// Hiện thông báo chung dưới form, type là 'error' hoặc 'success'
function showFormMessage(id, text, type) {
    const box = document.getElementById(id);
    if (!box) {
        return;
    }
    box.textContent = text;
    box.classList.remove('form-message--error', 'form-message--success');
    if (text !== '') {
        box.classList.add('form-message--' + type);
    }
}

// Xóa lỗi và màu viền của một danh sách ô nhập
function resetFieldStates(ids) {
    for (const id of ids) {
        setFieldState(id, '');
    }
}

// Chuyển tab: hiện form có id tương ứng, tô sáng tab đang chọn
function switchTab(formId) {
    document.querySelectorAll('.account__form').forEach(function (form) {
        form.classList.toggle('account__form--active', form.id === formId);
    });
    document.querySelectorAll('.account__tab').forEach(function (tab) {
        const isActive = tab.getAttribute('data-target') === formId;
        tab.classList.toggle('account__tab--active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });
}

// Mọi nút có data-target (hai tab và hai nút liên kết) đều chuyển tab
document.querySelectorAll('[data-target]').forEach(function (button) {
    button.addEventListener('click', function () {
        switchTab(button.getAttribute('data-target') || '');
    });
});

// Mở modal theo id
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.hidden = false;
    }
}

// Đóng một modal
function closeModal(modal) {
    if (modal) {
        modal.hidden = true;
    }
}

// Bấm nền tối hoặc nút Đóng/Hủy thì đóng modal chứa nó
document.querySelectorAll('[data-close-modal]').forEach(function (element) {
    element.addEventListener('click', function () {
        closeModal(element.closest('.modal'));
    });
});

// Nhấn phím Esc thì đóng tất cả modal
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(function (modal) {
            closeModal(modal);
        });
    }
});

// Bấm vào chữ điều khoản thì mở modal điều khoản
const openTermsButton = document.getElementById('open-terms');
if (openTermsButton) {
    openTermsButton.addEventListener('click', function (event) {
        event.preventDefault();
        openModal('terms-modal');
    });
}

// Bấm Đồng ý trong modal thì tự tick ô đồng ý rồi đóng modal
const acceptTermsButton = document.getElementById('accept-terms');
if (acceptTermsButton) {
    acceptTermsButton.addEventListener('click', function () {
        const checkbox = getInput('register-terms');
        if (checkbox) {
            checkbox.checked = true;
            setFieldState('register-terms', '');
        }
        closeModal(document.getElementById('terms-modal'));
    });
}

// Hiện khối đăng nhập/đăng ký hoặc khối hồ sơ tùy trạng thái đăng nhập
function renderAccountPage() {
    const guest = document.getElementById('guest-section');
    const profile = document.getElementById('profile-section');
    if (!guest || !profile) {
        return;
    }

    const user = getCurrentUser();

    // Có username lưu nhưng tài khoản không còn tồn tại thì xóa phiên cũ
    if (getCurrentUsername() && !user) {
        clearCurrentUser();
    }

    guest.hidden = user !== null;
    profile.hidden = user === null;

    if (user) {
        setText('profile-name', user.username);
        setText('value-username', user.username);
        setText('value-email', user.email);
        setText('value-phone', user.phone);
    }

    // Hàm này nằm trong base.js, đổi chữ nút tài khoản trên header
    updateHeaderAccount();
}

// Danh sách ô cần kiểm tra khi bấm nút Đăng ký và Đăng nhập
const REGISTER_FIELDS = [
    'register-username', 'register-email', 'register-phone',
    'register-password', 'register-confirm', 'register-terms'
];
const LOGIN_FIELDS = ['login-username', 'login-password'];

// Xử lý đăng ký
const registerForm = getForm('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateFields(REGISTER_FIELDS)) {
            showFormMessage('register-message', 'Vui lòng kiểm tra lại các thông tin đã nhập', 'error');
            return;
        }

        // Tạo tài khoản mới (kèm mã khách hàng) và lưu thêm vào danh sách
        const newUser = {
            customerId: createCustomerId(),
            username: getValue('register-username'),
            email: getValue('register-email'),
            phone: getValue('register-phone'),
            password: getValue('register-password')
        };
        saveUsers(getUsers().concat([newUser]));

        // Xóa form đăng ký, chuyển sang tab đăng nhập và điền sẵn tên đăng nhập
        registerForm.reset();
        setPasswordVisible('register-password', false);
        setPasswordVisible('register-confirm', false);
        resetFieldStates(REGISTER_FIELDS);
        showFormMessage('register-message', '', 'success');
        switchTab('login-form');

        const loginUsername = getInput('login-username');
        if (loginUsername) {
            loginUsername.value = newUser.username;
            setFieldState('login-username', getFieldMessage('login-username'));
        }
        showFormMessage('login-message', 'Đăng ký thành công, hãy đăng nhập', 'success');
        showToast('Đăng ký thành công');
    });
}

// Xử lý đăng nhập
const loginForm = getForm('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateFields(LOGIN_FIELDS)) {
            showFormMessage('login-message', '', 'error');
            return;
        }

        // Kiểm tra tài khoản có tồn tại và đúng mật khẩu không
        const user = findUser(getValue('login-username'));
        if (user === null || user.password !== getValue('login-password')) {
            showFormMessage('login-message', 'Tên đăng nhập hoặc mật khẩu không đúng', 'error');
            return;
        }

        setCurrentUser(user.username);
        loginForm.reset();
        setPasswordVisible('login-password', false);
        resetFieldStates(LOGIN_FIELDS);
        showFormMessage('login-message', '', 'success');
        renderAccountPage();
        showToast('Đăng nhập thành công');
    });
}

// Các ô nhập của từng mục sửa thông tin (tên mục trùng tên thuộc tính của tài khoản)
const EDIT_FIELDS = {
    username: ['edit-username'],
    email: ['edit-email'],
    phone: ['edit-phone'],
    password: ['edit-password', 'edit-password-confirm']
};

// Mục đang chờ xác thực mật khẩu để lưu
let pendingField = '';

// Mở form sửa của một mục
function openEditForm(field) {
    const form = document.querySelector('[data-form="' + field + '"]');
    if (!form || !EDIT_FIELDS[field]) {
        return;
    }
    form.hidden = false;

    // Đưa con trỏ vào ô nhập đầu tiên
    const firstInput = getInput(EDIT_FIELDS[field][0]);
    if (firstInput) {
        firstInput.focus();
    }
}

// Đóng form sửa, xóa chữ đã nhập, lỗi và trạng thái hiện mật khẩu
function closeEditForm(field) {
    const form = document.querySelector('[data-form="' + field + '"]');
    if (!form || !EDIT_FIELDS[field]) {
        return;
    }
    form.hidden = true;

    EDIT_FIELDS[field].forEach(function (id) {
        const input = getInput(id);
        if (input) {
            input.value = '';
        }
        if (id.includes('password')) {
            setPasswordVisible(id, false);
        }
    });
    resetFieldStates(EDIT_FIELDS[field]);
}

// Đóng tất cả form sửa
function closeAllEditForms() {
    for (const field in EDIT_FIELDS) {
        closeEditForm(field);
    }
}

// Bấm nút Sửa: chỉ mở một form tại một thời điểm
document.querySelectorAll('[data-edit]').forEach(function (button) {
    button.addEventListener('click', function () {
        closeAllEditForms();
        openEditForm(button.getAttribute('data-edit') || '');
    });
});

// Bấm nút Hủy: đóng form sửa của mục đó
document.querySelectorAll('[data-cancel]').forEach(function (button) {
    button.addEventListener('click', function () {
        closeEditForm(button.getAttribute('data-cancel') || '');
    });
});

// Mở modal xác thực mật khẩu, xóa chữ cũ trong ô nhập
function openAuthModal() {
    const authInput = getInput('auth-password');
    if (authInput) {
        authInput.value = '';
    }
    setFieldState('auth-password', '');
    setPasswordVisible('auth-password', false);
    openModal('auth-modal');
    if (authInput) {
        authInput.focus();
    }
}

// Bấm Lưu ở form sửa: kiểm tra dữ liệu rồi mở modal xác thực mật khẩu
document.querySelectorAll('.profile__edit').forEach(function (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const field = form.getAttribute('data-form') || '';
        if (!EDIT_FIELDS[field] || !validateFields(EDIT_FIELDS[field])) {
            return;
        }

        // Giá trị mới giống giá trị hiện tại thì không cần lưu
        const user = getCurrentUser();
        const firstId = EDIT_FIELDS[field][0];
        if (user !== null && String(user[field]) === getValue(firstId)) {
            setFieldState(firstId, 'Giá trị mới phải khác giá trị hiện tại');
            return;
        }

        pendingField = field;
        openAuthModal();
    });
});

// Ghi thay đổi vào tài khoản đang đăng nhập
function saveProfileChange(field) {
    const newValue = getValue(EDIT_FIELDS[field][0]);
    const currentName = String(getCurrentUsername()).toLowerCase();

    // Cập nhật đúng tài khoản đang đăng nhập trong danh sách
    const users = getUsers();
    users.forEach(function (user) {
        if (String(user.username).toLowerCase() === currentName) {
            user[field] = newValue;
        }
    });
    saveUsers(users);

    // Đổi username thì cập nhật luôn phiên đăng nhập
    if (field === 'username') {
        setCurrentUser(newValue);
    }

    closeEditForm(field);
    renderAccountPage();
    showToast('Cập nhật thông tin thành công');
}

// Xác nhận mật khẩu hiện tại trong modal
const authForm = getForm('auth-form');
if (authForm) {
    authForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateFields(['auth-password'])) {
            return;
        }

        const user = getCurrentUser();
        if (user === null || !EDIT_FIELDS[pendingField]) {
            return;
        }

        if (getValue('auth-password') !== user.password) {
            setFieldState('auth-password', 'Mật khẩu không đúng');
            return;
        }

        closeModal(document.getElementById('auth-modal'));
        saveProfileChange(pendingField);
        pendingField = '';
    });
}

// Bấm Đăng xuất thì hiện modal hỏi xác nhận
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', function () {
        openModal('logout-modal');
    });
}

// Xác nhận đăng xuất: xóa phiên, về lại khối đăng nhập
const confirmLogoutButton = document.getElementById('confirm-logout');
if (confirmLogoutButton) {
    confirmLogoutButton.addEventListener('click', function () {
        clearCurrentUser();
        closeModal(document.getElementById('logout-modal'));
        closeAllEditForms();
        switchTab('login-form');
        renderAccountPage();
        showToast('Đã đăng xuất');
    });
}

// Chạy khi tải trang: nếu đã đăng nhập từ trước thì hiện hồ sơ luôn
renderAccountPage();