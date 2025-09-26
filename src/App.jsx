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

  const addhandler = () => {
    if(title === "") return;
    setTodos([...todos, {
      "id": Date.now(),
      "title": title,
      "completed": false,
      "editnow": false
    }]);
    setTitle("");
  }

  return(
    <>
    <div>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder='タスクを追加...' onKeyDown={(e) => {
        if (e.key === "Enter") addhandler();
      }}/>
      <button onClick={() => addhandler()}>追加</button>
    </div>
    <div>
      <input type="radio" value="all" name="filter" checked={filter === "all"} onChange={() => setFilter("all")}/> 全て
      <input type="radio" value="uncompleted" name="filter" checked={filter === "uncompleted"} onChange={() => setFilter("uncompleted")}/> 未達成
      <input type="radio" value="completed" name="filter" checked={filter === "completed"} onChange={() => setFilter("completed")}/> 達成済
    </div>
    </>
  )
}

function Todolists ({todos,setTodos,filter}) {

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

  const edithandler = (id) => {
    const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "editnow": true};
      else return todo;
    });
    setTodos(newtodos);
  }

  return(
    <div>
      <ul>
        {filteredTodos.map((todo) => <Todo todo={todo} togglecompleted={togglecompleted} deletehandle={deletehandle} 
        edithandler={edithandler} todos={todos} setTodos={setTodos}/>)}
      </ul>
    </div>
  )
}

function Todo ({todo,togglecompleted,deletehandle,edithandler,todos,setTodos}) {

  const [newtitle,setNewtitle] = useState(todo.title);

  const confirmEdit = (id) => {
    const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "editnow": false, "title": newtitle};
      else return todo;
    });
    setTodos(newtodos);
  }

  let content;
  if (todo.editnow) {
    content = <input type="text" value={newtitle}
     onChange={(e) => setNewtitle(e.target.value)} onKeyDown={(e) => {
      if(e.key === "Enter") confirmEdit(todo.id);
     }}
     />;
  } else {
    content = <span onClick={() => togglecompleted(todo.id)} 
              style={{textDecoration: todo.completed ? "line-through" : "none"}}>
              {todo.title}
            </span>;
  }

  return(
    <>
          <li key={todo.id}>
          {content}
          <button onClick={() => deletehandle(todo.id)}>削除</button>
          <button onClick={() => edithandler(todo.id)}>編集</button>
          </li>
    </>
  )
}

export default App
