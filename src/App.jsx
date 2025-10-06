import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("time");

  const urgencies = [
    {"urgency": "low", "display": "後で"},
    {"urgency": "medium", "display": "なるべく"},
    {"urgency": "high", "display": "今すぐ"}
  ]

  return (
    <>
    <h3>to-do-app</h3>
      <Todomanager todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} urgencies={urgencies} sort={sort} setSort={setSort} />
      <Todolists todos={todos} setTodos={setTodos} filter={filter} setFilter={setFilter} urgencies={urgencies} sort={sort} />
    </>
  )
}

function Todomanager ({todos,setTodos,filter,setFilter,urgencies,sort,setSort}) {

  const [title,setTitle] = useState("");

  const addhandler = () => {
    if(title === "") return;
    setTodos([...todos, {
      "id": Date.now(),
      "title": title,
      "completed": false,
      "editnow": false,
      "urgency": urgencies[urgencyNum].urgency,
      "createdat": new Date()
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
      <input type="text" className='input' onChange={(e) => setTitle(e.target.value)} value={title} placeholder='タスクを追加...' onKeyDown={(e) => {
        if (e.key === "Enter") addhandler();
      }}/>
      <button onClick={() => setUrgencynum((urgencyNum + 1)%3)} className={`urgency ${urgencies[urgencyNum].urgency}`}>{urgencies[urgencyNum].display}</button>
      <button onClick={() => addhandler()}>追加</button>
    </div>
    <div>
      <label><input type="radio" value="all" name="filter" checked={filter === "all"} onChange={() => setFilter("all")}/> 全て</label>
      <label><input type="radio" value="uncompleted" name="filter" checked={filter === "uncompleted"} onChange={() => setFilter("uncompleted")}/> 未達成</label>
      <label><input type="radio" value="completed" name="filter" checked={filter === "completed"} onChange={() => setFilter("completed")}/> 達成済</label>
    </div>
    <div>
      <label><input type="radio" name="sort" value="time" checked={sort === "time"} onChange={() => setSort("time")} />時間順</label>
      <label><input type="radio" name="sort" value="urgency" checked={sort === "urgency"} onChange={() => setSort("urgency")} />緊急度順</label>
    </div>
    <div>
      <button onClick={() => deleteCompleted()}>達成済を削除</button>
      <button onClick={() => setTodos([])}>全て削除</button>
    </div>
    </>
  )
}

function Todolists ({todos,setTodos,filter,urgencies,sort}) {

  const updateTodos = (id,title,completed,editnow,urgency) => {
     const newtodos = todos.map((todo) => {
      if(todo.id === id) return {...todo, "title": title, "completed": completed, "editnow": editnow, "urgency": urgency};
      else return todo;
    });
    setTodos(newtodos);
  }

  const getUrgencyValue = (urgency) => {
    if (urgency === "high") return 3;
    if (urgency === "medium") return 2;
    if (urgency === "low") return 1;
    return 0;
  }

  const sortedTodos = [...todos].sort((a,b) => {
    if(sort === "time") return a.createdat-b.createdat;
    else return getUrgencyValue(b.urgency)-getUrgencyValue(a.urgency);
  })

  const filteredTodos = sortedTodos.filter((todo) => {
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
        {filteredTodos.map((todo) => <Todo key={todo.id} todo={todo} updateTodos={updateTodos} deletehandle={deletehandle}
         todos={todos} setTodos={setTodos} urgencies={urgencies}/>)}
      </ul>
    </div>
  )
}

function Todo ({todo,updateTodos,deletehandle,urgencies}) {

  const [newtitle,setNewtitle] = useState(todo.title);
  const [urgencyNum, setUrgencynum] = useState(() => {
    if(todo.urgency === "high") return 2;
    else if (todo.urgency === "medium") return 1;
    else return 0;
  });

  let content;
  if (todo.editnow) {
    content =<span>
      <input type="text" value={newtitle} onChange={(e) => setNewtitle(e.target.value)} />
      <button onClick={() => setUrgencynum((urgencyNum + 1)%3)} className={`urgency ${urgencies[urgencyNum].urgency}`}>{urgencies[urgencyNum].display}</button>
      <button onClick={() => updateTodos(todo.id,newtitle,todo.completed,!todo.editnow,urgencies[urgencyNum].urgency)}>修正</button>
     </span>;
  } else {
    content = <span>
      <span onClick={() => updateTodos(todo.id,todo.title,!todo.completed,todo.editnow,todo.urgency)}
              style={{textDecoration: todo.completed ? "line-through" : "none"}} className={todo.urgency}>
              {todo.title}
      </span>
      <span>{new Date(todo.createdat).toLocaleDateString()}</span>
      <button onClick={() => updateTodos(todo.id,newtitle,todo.completed,!todo.editnow,urgencies[urgencyNum].urgency)}>編集</button>
      <button onClick={() => deletehandle(todo.id)}>削除</button>
      </span>
  }

  return(
    <>
      <li>
        {content}
      </li>
    </>
  )
}

export default App
