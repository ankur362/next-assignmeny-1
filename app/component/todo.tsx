"use client"
   import { useState, useEffect } from 'react';
   import Link from 'next/link';

//    interface ITodo {
//     message: string
//     id: number
//     isComplete: boolean
//    }

   export default function TodoApp() {
    //    const [todos, setTodos] = useState<ITodo[]>([]);
    const [todos, setTodos] = useState([]);
       const [newTodo, setNewTodo] = useState('');
       const [filter, setFilter] = useState('all');
       const [darkMode, setDarkMode] = useState(false);

       useEffect(() => {
           const fetchTodos = async () => {
               const response = await fetch('http://localhost:3000/todos');
               const data = await response.json();
               setTodos(data);
           };
           fetchTodos();
       }, []);

       const addTodo = async () => {
           const response = await fetch('http://localhost:3000/todos', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ text: newTodo, completed: false }),
           });
           const data = await response.json();
           setTodos([...todos, data]);
           setNewTodo('');
       };

       const toggleComplete = async (id) => {
           const updatedTodo = todos.find(todo => todo.id === id);
           updatedTodo.completed = !updatedTodo?.completed;
           await fetch(`http://localhost:3000/todos/${id}`, {
               method: 'PUT', 
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(updatedTodo),
           });
           setTodos([...todos]);
       };

       const deleteTodo = async (id) => {
           await fetch(`http://localhost:3000/todos/${id}`, {
               method: 'DELETE',
           });
           setTodos(todos.filter(todo => todo.id !== id));
       };

       const clearCompleted = () => {
           const activeTodos = todos.filter(todo => !todo.completed);
           setTodos(activeTodos);
       };

       const filteredTodos = todos.filter(todo => {
           if (filter === 'active') return !todo.completed;
           if (filter === 'completed') return todo.completed;
           return true; 
       });

       return (
           <div className={` min-h-screen flex flex-col items-center  w-[100%] justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-500 text-white p-2 rounded-xl self- hover:bg-gray-600 top-3">Toggle Dark Mode</button>
               <div className="flex flex-col items-center w-full max-w-md p-4">
                   <input 
                       type="text" 
                       value={newTodo} 
                       onChange={(e) => setNewTodo(e.target.value)} 
                       placeholder="Add a new todo" 
                       className="border p-2 rounded w-full mb-2"
                   />
                   <div className="flex space-x-2 mb-4">
                       <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Todo</button>
                       <button onClick={clearCompleted} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Clear Completed</button>
                       
                   </div>
                   <div className="flex space-x-2 mb-4">
                       <button onClick={() => setFilter('all')} className="p-2 rounded hover:bg-gray-200">All</button>
                       <button onClick={() => setFilter('active')} className="p-2 rounded hover:bg-gray-200">Active</button>
                       <button onClick={() => setFilter('completed')} className="p-2 rounded hover:bg-gray-200">Completed</button>
                   </div>
                   <div className="w-full">
                       {filteredTodos.map(todo => (
                           <div key={todo.id} className="flex justify-between items-center border-b py-2">
                               <span 
                                   onClick={() => toggleComplete(todo.id)} 
                                   className={`cursor-pointer ${todo.completed ? 'line-through' : ''}`}
                               >
                                   {todo.text}
                               </span>
                               <div>
                                   <Link href={`/users/${todo.id}`}>
                                   <span className="bg-green-500 text-white p-1 rounded hover:bg-green-600">View</span>
                                   </Link>
                                   <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white p-1 rounded ml-2 hover:bg-red-600">Delete</button>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
       );
   }