const users = [];

// Kullanıcı chate katılma bölümü ^_^
function userJoin(id, username, room) { //fonsiyon oluşturarak id, kullanıcı adı ve 
    const user = { id, username, room }; //hangi odayı seçtiğini göstermek için oluşturduk. 
    
    users.push(user);  //user tanımladık. ve pushlayyıp,bunu tekrarlaması için return oluşturduk.
    
    return user;
}

// Şuan ki userı tanımlama-alma( Get current user)
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }

}
 //Get room users
 function getRoomUsers(room) {
     return users.filter(user => user.room === room);
 }

module.exports = { //module.exports , aslında require çağrısının sonucu olarak döndürülen nesnedir.
     userJoin,      //Basit bir ifadeyle, gerekli dosyaları tek bir nesneyi döndüren işlevler olarak düşünebilir 
     getCurrentUser,   //ve bunları döndürülen nesneye exports değerini ayarlayarak özellikler (dizeler, sayılar, diziler, işlevler, 
    userLeave,        //herhangi bir şey) ekleyebilirsiniz. 
   getRoomUsers  //Bazen bir require() çağrısından döndürülen nesnenin sadece özelliklere sahip bir 
};                      //nesne yerine çağırabileceğiniz bir işlev olmasını isteyebilirsiniz.     
                                 