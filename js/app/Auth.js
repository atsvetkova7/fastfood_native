    class Auth {
        constructor(){
            this.user = firebase.auth().currentUser;
        }

        onAuthChange( callback ) {
            firebase.auth().onAuthStateChanged( callback );
        }

        logInAuthorization ( email, password ) {
            return firebase.auth().signInWithEmailAndPassword( email, password );
        }
    
        signUpAuthorization ( email, password ) {
            return firebase.auth().createUserWithEmailAndPassword( email, password );
        }
    
        logOutAuthorization () {
            firebase.auth().signOut();
        }

    }
