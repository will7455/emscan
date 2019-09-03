import * as firebase from "firebase/app";
import "firebase/auth";
import FirebaseConfig from '../firebase.config.json'

const FirebaseService = {
    config: FirebaseConfig,
    ready: false,
    user: null,

    init (loginCallback) {
        firebase.initializeApp(this.config);

        firebase.auth().onAuthStateChanged(function(user) {
            loginCallback(user)
        });
    },

    register (email, password, callback) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((res) => {
            callback(null);
        })
        .catch((error) => {
            callback(error.message)
        });
    },

    login(email, password, callback) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {
            callback(null);
        })
        .catch((error) => {
            callback(error.message)
        });
    },

    logout(callback = null) {
        firebase.auth().signOut().then(function() {
            if(callback) callback(null, true)
        }).catch(function(error) {
            if(callback) callback(error)
        });
    },

    forgot (email, callback) {
        firebase.auth().sendPasswordResetEmail(email)
        .then((res) => {
            callback(null);
        })
        .catch((error) => {
            callback(error.message)
        });
    },

    signedIn () {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                return true;
            }

            return false;
        });
    },

    async verify() {
        if (!firebase.auth().currentUser) {
            return false;
        }
        return await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
    }
}

export default FirebaseService