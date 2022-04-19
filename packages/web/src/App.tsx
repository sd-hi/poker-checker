import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { PostPayload } from "@poker-checker/server";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button
          onClick={() => {

            let myMessage: PostPayload = {
              title: "exp test title",
              body: "exp test",
            };

            fetch("http://localhost:3001/api/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(myMessage),
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => console.log(data))
              .catch((error) => console.log("ERROR"));

          }}
        >
          Test me
        </button>
      </header>
    </div>
  );
}

export default App;
