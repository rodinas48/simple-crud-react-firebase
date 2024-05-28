import { useEffect, useRef, useState } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState(0);
  const nameInput = useRef(null);
  const ageInput = useRef(null);
  const usersCollectionRef = collection(db, "users");

  const createUser = async (e) => {
    e.preventDefault();
    nameInput.current.value = "";
    ageInput.current.value = "";
    try {
      await addDoc(usersCollectionRef, {
        name: userName,
        age: Number(userAge),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateAge = async (userId, age) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { age: age + 1 });
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionRef);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error.message);
      }
    };
    getUsers();
  }, [users]);

  return (
    <div className="App">
      <form>
        <input
          type="text"
          ref={nameInput}
          placeholder="Enter user name"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="number"
          ref={ageInput}
          placeholder="Enter user age"
          onChange={(e) => setUserAge(e.target.value)}
        />

        <button style={{ cursor: "pointer" }} onClick={(e) => createUser(e)}>
          Add
        </button>
      </form>
      <h1>Users</h1>
      {users.map((user) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              border: "1px solid grey",
              width: "30%",
              padding: "0 20px",
              margin: "10px auto",
            }}
            key={user.id}
          >
            <h2>
              {user.name} - {user.age}
            </h2>
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => updateAge(user.id, user.age)}
              >
                +
              </button>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => deleteUser(user.id)}
              >
                X
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
