import TodoList from "./app/common/components/ToDoList.tsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <ToastContainer />
      <h1 style={{ fontFamily: "monospace" }}>ToDo List</h1>
      <TodoList />
    </div>
  );
}

export default App;
