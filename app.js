// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCw0QTNklP9aXL1ApVHf-jOWaoGgotek8",
    authDomain: "data-store-2d735.firebaseapp.com",
    projectId: "data-store-2d735",
    storageBucket: "data-store-2d735.appspot.com",
    messagingSenderId: "478810021569",
    appId: "1:478810021569:web:5c310ecf16e89bb0317e40"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login Function
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            showContent();
        })
        .catch(error => {
            alert(error.message);
        });
}

// Register Function
function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
            showContent();
        })
        .catch(error => {
            alert(error.message);
        });
}

// Show Login Form
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Show Register Form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Show Content
function showContent() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.getElementById('messages-page').style.display = 'none';
}

// Show Messages Page
function showMessagesPage() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('messages-page').style.display = 'block';
    loadMessages();
}

// Add Message
function addMessage() {
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    if (title.trim() && body.trim()) {
        db.collection('messages').add({
            title: title,
            body: body,
            uid: auth.currentUser.uid
        }).then(() => {
            document.getElementById('title').value = '';
            document.getElementById('body').value = '';
            showPopup();
        }).catch(error => {
            alert(error.message);
        });
    } else {
        alert("Please fill in all fields.");
    }
}

// Load Messages
function loadMessages() {
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.innerHTML = '';
    db.collection('messages').where('uid', '==', auth.currentUser.uid).get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const messageBox = document.createElement('div');
                messageBox.className = 'message-box';
                messageBox.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.body}</p>
                    <button onclick="deleteMessage('${doc.id}')">Delete</button>
                `;
                messagesContainer.appendChild(messageBox);
            });
        });
}

// Delete Message
function deleteMessage(id) {
    db.collection('messages').doc(id).delete()
        .then(() => {
            loadMessages();
        }).catch(error => {
            alert(error.message);
        });
}

// Logout
function logout() {
    auth.signOut().then(() => {
        document.getElementById('content').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }).catch(error => {
        alert(error.message);
    });
}

// Show Popup
function showPopup() {
    const popup = document.getElementById('success-popup');
    popup.style.display = 'block';
    setTimeout(closePopup, 2000); // Automatically close after 2 seconds
}

// Close Popup
function closePopup() {
    const popup = document.getElementById('success-popup');
    popup.style.display = 'none';
}

// Auth State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        showContent();
    } else {
        showLogin();
    }
});
