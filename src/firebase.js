
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
  
  const firebaseConfig = {
   /* firebase configuration */ 
  };
  
  firebase.initializeApp(firebaseConfig);

  export const auth=firebase.auth();
  export const firestore=firebase.firestore();

// initialize  google provider
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  export const signInWithGoogle=()=>{
    //ask user to select user account in new popup window
      auth.signInWithPopup(googleProvider);
  };

  export const signOut=()=>{
    auth.signOut();
  }

  export const createOrGetUserProfileDocument = async (user) => {
    if (!user) return;

    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
      const { displayName, email, photoURL } = user;

      try {
        const user = {
          display_name: displayName,
          email,
          photo_url: photoURL,
          created_at: new Date(),
        };
        await userRef.set(user);
      } catch (error) {
        console.log('Error', error);
      }
    }
    return getUserDocument(user.uid);
  };
  
  async function getUserDocument(uid){
    if(!uid) return null;

    try{
        const userDocument = await firestore.collection('user').doc(uid);
        return userDocument;
    }catch(error){
      console.error('Error in getUserDocument',error.message);
    }
  }
