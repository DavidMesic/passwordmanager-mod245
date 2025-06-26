const usersKey = 'pmUsers';
const currentUserKey = 'pmCurrentUser';

function loadUsers() { return JSON.parse(sessionStorage.getItem(usersKey) || '[]'); }
function saveUsers(u) { sessionStorage.setItem(usersKey, JSON.stringify(u)); }
function getCurrentUser() { return sessionStorage.getItem(currentUserKey); }
function setCurrentUser(e) { sessionStorage.setItem(currentUserKey, e); }
function logoutUser() { sessionStorage.removeItem(currentUserKey); showAuth(); }

function keyEntries(u) { return 'pmEntries_' + u; }
function loadEntries() { const u = getCurrentUser(); return JSON.parse(sessionStorage.getItem(keyEntries(u)) || '[]'); }
function saveEntries(e) { sessionStorage.setItem(keyEntries(getCurrentUser()), JSON.stringify(e)); }

function renderEntries() {
    const cont = document.getElementById('entries'); cont.innerHTML = '';
    loadEntries().forEach((e,i) => {
        const card = document.createElement('div'); card.className = 'entry-card';
        const del = document.createElement('button'); del.className = 'delete-btn'; del.innerHTML='×'; del.onclick=()=>deleteEntry(i);
        const h3 = document.createElement('h3'); h3.textContent = e.website;
        const u = document.createElement('p'); u.textContent = 'Benutzer: '+e.username;
        const p = document.createElement('p'); p.textContent = 'Passwort: '+e.password;
        card.append(del,h3,u,p); cont.appendChild(card);
    });
}
function addEntry(e) { const arr=loadEntries(); arr.push(e); saveEntries(arr); renderEntries(); }
function deleteEntry(i) { const arr=loadEntries(); arr.splice(i,1); saveEntries(arr); renderEntries(); }

// Tabs
document.getElementById('tab-login').onclick = () => { toggleTab('login'); };
document.getElementById('tab-register').onclick = () => { toggleTab('register'); };
function toggleTab(t) {
    document.getElementById('tab-login').classList.toggle('active', t==='login');
    document.getElementById('tab-register').classList.toggle('active', t==='register');
    document.getElementById('form-login').classList.toggle('active', t==='login');
    document.getElementById('form-register').classList.toggle('active', t==='register');
}

// Events
document.getElementById('form-register').addEventListener('submit', e=>{
    e.preventDefault(); const mail=document.getElementById('reg-email').value, pwd=document.getElementById('reg-password').value;
    const us=loadUsers(); if(us.find(x=>x.email===mail)){alert('Nutzer existiert');return;} us.push({email:mail,password:pwd}); saveUsers(us); setCurrentUser(mail); showManager();
});
document.getElementById('form-login').addEventListener('submit', e=>{
    e.preventDefault(); const mail=document.getElementById('login-email').value, pwd=document.getElementById('login-password').value;
    const u=loadUsers().find(x=>x.email===mail&&x.password===pwd); if(!u){alert('Ungültig');return;} setCurrentUser(mail); showManager();
});
document.getElementById('logout-btn').onclick = logoutUser;
document.getElementById('entry-form').addEventListener('submit', e=>{ e.preventDefault(); addEntry({website:document.getElementById('website').value,username:document.getElementById('username').value,password:document.getElementById('password').value}); e.target.reset(); });

function showAuth(){document.getElementById('auth-container').style.display='block';document.getElementById('manager-container').style.display='none';}
function showManager(){document.getElementById('auth-container').style.display='none';document.getElementById('manager-container').style.display='block'; renderEntries();}

document.addEventListener('DOMContentLoaded',()=>{ getCurrentUser()?showManager():showAuth(); });