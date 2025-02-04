"use client"
   import { useEffect, useState } from 'react';
   import { useRouter } from 'next/navigation';

   const TodoDetail = () => {
       const router = useRouter();
       const { id } = router.query; // This remains the same
       const [todo, setTodo] = useState(null);
       const [isEditing, setIsEditing] = useState(false);
       const [updatedText, setUpdatedText] = useState('');

       useEffect(() => {
           const fetchTodo = async () => {
               if (id) {
                   const response = await fetch(`http://localhost:3000/todos`);
                   const data = await response.json();
                   const foundTodo = data.find(todo => todo.id == id);
                   setTodo(foundTodo);
                   setUpdatedText(foundTodo.text);
               }
           };
           fetchTodo();
       }, [id]);

       const updateTodo = async () => {
           const updatedTodo = { ...todo, text: updatedText };
           await fetch(`http://localhost:3000/todos/${id}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(updatedTodo),
           });
           setTodo(updatedTodo);
           setIsEditing(false);
       };

       const deleteTodo = async () => {
           await fetch(`http://localhost:3000/todos/${id}`, {
               method: 'DELETE',
           });
           router.push('/todos'); // Adjusted to redirect to the todos list
       };

       if (!todo) return <div>Loading...</div>;

       return (
           <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
               <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
                   {isEditing ? (
                       <>
                           <input 
                               type="text" 
                               value={updatedText} 
                               onChange={(e) => setUpdatedText(e.target.value)} 
                               className="border p-2 rounded w-full mb-2"
                           />
                           <button onClick={updateTodo} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update</button>
                       </>
                   ) : (
                       <>
                           <h2 className="text-xl font-bold mb-2">{todo.text}</h2>
                           <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Edit</button>
                           <button onClick={deleteTodo} className="bg-red-500 text-white p-2 rounded ml-2 hover:bg-red-600">Delete</button>
                       </>
                   )}
               </div>
           </div>
       );
   };

   export default TodoDetail;