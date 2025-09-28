import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const urgencies = [
    {"urgency": "low", "display": "後で"},
    {"urgency": "medium", "display": "なるべく"},
    {"urgency": "high", "display": "今すぐ"}
  ]

  return (
    <>
    <h3>to-do-app</h3>
      <Todomanager todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} urgencies={urgencies} />
      <Todolists todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} urgencies={urgencies} />
    </>
  )
}

function Todomanager ({todos,setTodos,filter,setFilter,urgencies}) {

  const [title,setTitle] = useState("");

  const addhandler = () => {
    if(title === "") return;
    setTodos([...todos, {
      "id": Date.now(),
      "title": title,
      "completed": false,
      "editnow": false, 
      "urgency" : urgencies[urgencyNum].urgency
    }]);
    setTitle("");
  }

  const deleteCompleted = () => {
    const newtodos = todos.filter((todo) => !todo.completed);
    setTodos(newtodos);
  }

  const [urgencyNum, setUrgencynum] = useState(0);

  return(
    <>
    <div>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} placeholder='タスクを追加...' onKeyDown={(e) => {
        if (e.key === "Enter") addhandler();
      }}/>
      <button onClick={() => setUrgencynum((urgencyNum + 1)%3)}>{urgencies[urgencyNum].display}</button>
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

function Todolists ({todos,setTodos,filter,urgencies}) {

  const updateTodos = (id,title,completed,editnow,urgency) => {
     const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "title": title, "completed": completed, "editnow": editnow, "urgency": urgency};
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
         todos={todos} setTodos={setTodos} urgencies={urgencies}/>)}
      </ul>
    </div> 
  )
}

function Todo ({todo,updateTodos,deletehandle,urgencies}) {

  const [newtitle,setNewtitle] = useState(todo.title);
  const [urgencyNum, setUrgencynum] = useState(0);

  let content;
  if (todo.editnow) {
    content =<span>
      <input type="text" value={newtitle} onChange={(e) => setNewtitle(e.target.value)} />
      <button onClick={() => setUrgencynum((urgencyNum + 1)%3)}>{urgencies[urgencyNum].display}</button>
     </span>;
  } else {
    content = <span>
      <span onClick={() => updateTodos(todo.id,todo.title,!todo.completed,todo.editnow,todo.urgency)} 
              style={{textDecoration: todo.completed ? "line-through" : "none"}} className={todo.urgency}>
              {todo.title}
      </span>
      <button onClick={() => deletehandle(todo.id)}>削除</button>
      </span>
  }

  return(
    <>
          <li key={todo.id}>
          {content}
          <button onClick={() => updateTodos(todo.id,todo.title,todo.completed,!todo.editnow,urgencies[urgencyNum].urgency)}>編集</button>
          </li>
    </>
  )
}

export default App
