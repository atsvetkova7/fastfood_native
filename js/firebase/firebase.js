define([ 'firebase' ],function( Firebase ){

    var config = {
        apiKey: "AIzaSyB4a6AMn5Ax9rMwdnJJBfC4AuIhHdYzcq0",
        authDomain: "fastfood-79f8c.firebaseapp.com",
        databaseURL: "https://fastfood-79f8c.firebaseio.com",
        projectId: "fastfood-79f8c",
        storageBucket: "fastfood-79f8c.appspot.com",
        messagingSenderId: "914396592947"
    };
    
    var fb = firebase.initializeApp(config);
    return fb;
})

