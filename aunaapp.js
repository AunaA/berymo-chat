const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const expressLayouts = require('express-ejs-layouts');
const cors= require('cors')
require('dotenv').config();


const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const app = express();
const aunaapp = http.createServer(app);
const io = socketio(aunaapp);
 


// Passport Config
require('./config/passport')(passport);

// DB Config--yapılandırma
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

/// login sistem burada////

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session 
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware --- ara yazılım
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables Global değişkenler
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes Dosyası burayı servera ekle 
app.use('/', require('./routers/index'));
app.use('/users', require('./routers/users'));
app.use('/chatpage', require('./routers/chatpage'));




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// BERYMOchat port kısmı burada

//  (╯✧▽✧)╯ Static folder bölümü °˖✧ °                                        
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'BerymoChat Bot'

// Client bağlandığında connectsle-bağlan bölümü 。.:☆*:･'(*⌒―⌒*))) Client--> İstemci, Bir ağ üzerinde, sunucu bilgisayarlardan hizmet alan kullanıcı bilgisayarlarıdır. Bilgiye erişim yetkileri sunucu tarafından belirlenir.(◕‿-) 
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    ////////////////////HOŞGELDİN ONLİNE KULLANICI °˖✧◝(⁰▿⁰)◜✧˖° /////////////   
    socket.emit('message', formatMessage(botName, 'Welcome to BerymoChat!'));
    // Broadcast bir kullanıcı bağlandığınca canlı yayın yapma bölümü ----> Broadcast bir network üzerindeki tüm kullanıcılara gönderilen paketlere verilen isimdir.(◕‿-) 
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the Berymo-chat! :)`));  //user ismi verdik

    // Send user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });


  });



  //chatMesage için dinle *-*
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  //RUN Client bağlanmadığında-disconnects da çalış bölümü (¯▿¯  )
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the Berymo-chat! :(`));

      // Send user and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

    }

  });
});



const PORT = process.env.PORT || 5000; // (◕‿-) Özelliği, kullanıcının ortamı içeren bir nesne döndürür. bu yada şu mantığı (◕‿-)

aunaapp.listen(PORT, console.log(`This auna-server running on port ${PORT}`));









