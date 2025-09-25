import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  return (
    <>
    <h3>to-do-app</h3>
      <Todomanager todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} />
      <Todolists todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} />
    </>
  )
}

function Todomanager ({todos,setTodos,filter,setFilter}) {

  const [title,setTitle] = useState("");

  const btnhandler = () => {
    setTodos([...todos, {
      "id": Date.now(),
      "title": title,
      "completed": false
    }]);
    setTitle("");
  }

  return(
    <>
    <div>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder='タスクを追加...'/>
      <button onClick={() => btnhandler()}>追加</button>
    </div>
    <div>
      <input type="radio" value="all" name="filter" checked={filter === "all"} onChange={() => setFilter("all")}/> 全て
      <input type="radio" value="uncompleted" name="filter" checked={filter === "uncompleted"} onChange={() => setFilter("uncompleted")}/> 未達成
      <input type="radio" value="completed" name="filter" checked={filter === "completed"} onChange={() => setFilter("completed")}/> 達成済
    </div>
    </>
  )
}

function Todolists ({todos,setTodos,filter,setFilter}) {

  const filteredTodos = todos.filter((todo) => {
    if(filter === "all") return true;
    else if(filter === "uncompleted") return !todo.completed;
    else if(filter === "completed") return todo.completed;
    else false;
  })

  const togglecompleted = (id) => {
    const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "completed": !todo.completed};
      else return todo;
    });
    setTodos(newtodos);
  }

  const deletehandle = (id) => {
    const newtodos = todos.filter(todo => id !== todo.id);
    setTodos(newtodos);
  }

  return(
    <div>
      <ul>
        {filteredTodos.map((todo) => <Todo todo={todo} togglecompleted={togglecompleted} deletehandle={deletehandle} />)}
      </ul>
    </div>
  )
}

function Todo ({todo,togglecompleted,deletehandle}) {

  return(
    <>
          <li key={todo.id}>
          <span onClick={() => togglecompleted(todo.id)} 
          style={{textDecoration: todo.completed ? "line-through" : "none"}}>{todo.title}</span>
          <button onClick={() => deletehandle(todo.id)}>削除</button>
          </li>
    </>
  )
}

export default App
