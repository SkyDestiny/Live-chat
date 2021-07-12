import React from 'react';
import './MyApp.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const firebase = firebase.firestore();

//Firebase con credentials
var firebaseConfig = {
  apiKey: "AIzaSyDwgq9w6biUexrqgY3lpokj8SrKDkrvuBs",
  authDomain: "livechat-9f401.firebaseapp.com",
  projectId: "livechat-9f401",
  storageBucket: "livechat-9f401.appspot.com",
  messagingSenderId: "678675755407",
  appId: "1:678675755407:web:2050073f6dcf90237edbfa",
  measurementId: "G-QL1T1F5Z0B"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const analytics = firebase.analytics();

function MyApp() {
  const [user] = useAuthState(auth);
    return (
      <div className="App">
        <header>
          <h1>Chat room</h1>
          <SignOut />
        </header>

        <section>
          {user ? <ChatRoom /> : <SignIn />};
        </section>
      </div>
    );
}



function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.isgnOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(100);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [ formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefualt();
    const { uid, photoUrl } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>

      <form>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoUrl} />
      <p>{text}</p>
    </div>
  )
}

export default MyApp;
