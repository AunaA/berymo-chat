
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//URL den username ve oda ismini al-yazdır
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true // url de çıkan sama username= olaylarını görmezden geliyor gnore ediyor.
});

const socket = io();

//Berymochat katıl
socket.emit('joinRoom', {username, room});

//Get room and users
 socket.on('roomUsers', ({ room, users}) => {
   outputRoomName(room);
   outputUsers(users);
 });

//Aunaserdan gelen message
socket.on('message', message =>{      //aunaserverda yazdığımız socket deki mesajı buraya tanımladık ki consol.log da yazsın.*(˙꒳​˙ )
  console.log(message);
  outputMessage(message);

// Scroll down  kaydırma --->> Bu sayeda mesajlaşırken aşağı yukarı kaydırma işlemi gerçekleşiyor.
chatMessage.scrollTop = chatMessage.scrollHeight;

});



//Message gönderildi °˖✧◝(⁰▿⁰)◜✧˖° /// (e)-> Açılımı event dir. form elementinin/tag’ının bilgileri, fonksiyonları... gibi bilgileri içinde barındırır. ve bu 
chatForm.addEventListener('submit', (e) =>{
  e.preventDefault(); // bu preventDefult sayfanın değişmesini kapanmasını engeller.

  //Get message text
  const msg = e.target.elements.msg.value;        //chat.html deki id msg olduğu için koyulur.Id ne ise o yazılmalı

  //Emit->yayınla message to aunaserver
  socket.emit('chatMessage', msg);

  // Clear input // input-->giriş // girişi temizleme
  e.target.elements.msg.value = '';  //value değer kısaca istediğin text alanını boşaltıp kısaltıyor.
  e.target.elements.msg.focus();   // focus odak // focus metodu, elemente odaklanarak doküman üzerinde aktif kontrol olmasını sağlar.
});

//Output message to DOM  // ---> Output Elementi bir hesaplama sonucu yada kullanıcının işleminden çıkan çıktıyı göstermek için kullanılır.
function outputMessage(message) {
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p> 
   <p class="text">
            ${message.text}
   </p>`; //berymo-bot  user ve time ekleyince bot zaman ve gelen kullanıcıya göre yazdı.
   document.querySelector('.chat-messages').appendChild(div); // HTML DOM appendChild () Yöntemi appendChild() methodu, 
                                                              //belirtilen bir üst düğümün alt öğelerinin sonuna bir düğüm ekler. Bu methodu bir öğeyi diğer öğeye taşımak için kullana biliriz.
  
                                           //DOM ağacında yapılan getelement(tag,target vb)                                                           ──────▄▀▄─────▄▀▄
                                            // fonsiyonlarına benziyor ancak ,get querySelector(),belgese Bellirtilen bir CSS seçiciyle eşeleşen      ─────▄█░░▀▀▀▀▀░░█▄
                                              //ilk öğeyi döndürüyor.Bu döndürülen ağaçsal bağlamında her bir dosyaya da DOM deniliyor.               ─▄▄──█░░░░░░░░░░░█──▄▄
                                                //Bütn hepsini döndürmesi için de querySelectorAll()yöntemi kullanılr.                                █▄▄█─█░░▀░░┬░░▀░░█─█▄▄█


}


// DOM için oda ismi ekleme
function outputRoomName(room){
 roomName.innerText = room;
}

// DOM için users ekleme
function outputUsers(users){
 userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;

}