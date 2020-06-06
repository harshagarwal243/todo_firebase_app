import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

var firebaseConfig = {
   YOUR_FIREBASE_CONFIGURATION_HERE
   };
  


class Firebase {
   constructor() {
         app.initializeApp(firebaseConfig);
         this.auth = app.auth();
         this.db = app.database();
         this.googleProvider = new app.auth.GoogleAuthProvider();
         this.facebookProvider = new app.auth.FacebookAuthProvider();
         this.twitterProvider = new app.auth.TwitterAuthProvider();
   }

   doSignUpWithEmailAndPassword = (email , password) => 
     this.auth.createUserWithEmailAndPassword(email,password)

   doSignInWithEmailAndPassword = (email , password) => 
    this.auth.signInWithEmailAndPassword(email,password)

   doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider)

   doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider)

   doSignInWithTwitter = () =>
                   this.auth.signInWithPopup(this.twitterProvider);


   doSignOut = () => this.auth.signOut()

   doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

   doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

   doVerifyEmail = () => this.auth.currentUser.sendEmailVerification()

   /*USER API */

   user = uid => this.db.ref(`users/${uid}`);

   users = () => this.db.ref('users');

   setTodos = (uid , todo) =>{
     return this.db.ref(`todos/${uid}`).push(todo)
   } 

   getTodos = (uid) => {
     return this.db.ref(`todos/${uid}`)
   }

   updateTodos = (uid , key) => {
     return this.db.ref(`todos/${uid}/${key}`).update({ state : 1})
   }

   deleteTodo = (uid , key) => {
    return this.db.ref(`todos/${uid}/${key}`).remove()
   }
   
}

 
 

  export default Firebase;