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

  const deleteCompleted = () => {
    const newtodos = todos.filter((todo) => !todo.completed);
    setTodos(newtodos);
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
    <div>
      <button onClick={() => deleteCompleted()}>達成済を削除</button>
      <button onClick={() => setTodos([])}>全て削除</button>
    </div>
    </>
  )
}

function Todolists ({todos,setTodos,filter}) {

  const updateTodos = (id,title,completed,editnow) => {
     const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "title": title, "completed": completed, "editnow": editnow};
      else return todo;
    });
    setTodos(newtodos);
  }

  const filteredTodos = todos.filter((todo) => {
    if(filter === "all") return true;
    else if(filter === "uncompleted") return !todo.completed;
    else if(filter === "completed") return todo.completed;
    else false;
  })

  const deletehandle = (id) => {
    const newtodos = todos.filter(todo => id !== todo.id);
    setTodos(newtodos);
  }

  return(
    <div>
      <ul>
        {filteredTodos.map((todo) => <Todo todo={todo} updateTodos={updateTodos} deletehandle={deletehandle} 
         todos={todos} setTodos={setTodos}/>)}
      </ul>
    </div> 
  )
}

function Todo ({todo,updateTodos,deletehandle,edithandler,todos,setTodos}) {

  const [newtitle,setNewtitle] = useState(todo.title);

  let content;
  if (todo.editnow) {
    content = <input type="text" value={newtitle}
     onChange={(e) => setNewtitle(e.target.value)} onKeyDown={(e) => {
      if(e.key === "Enter") updateTodos(todo.id,newtitle,todo.completed,false);
     }}
     />;
  } else {
    content = <span onClick={() => updateTodos(todo.id,todo.title,!todo.completed,todo.editnow)} 
              style={{textDecoration: todo.completed ? "line-through" : "none"}}>
              {todo.title}
            </span>;
  }

  return(
    <>
          <li key={todo.id}>
          {content}
          <button onClick={() => deletehandle(todo.id)}>削除</button>
          <button onClick={() => updateTodos(todo.id,todo.title,todo.completed,true)}>編集</button>
          </li>
    </>
  )
}

export default App
