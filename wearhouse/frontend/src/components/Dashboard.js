import { useEffect, useState } from 'react';
import Form from './Form';
import '../App.css'


export default function Dashboard({ isAdmin }) {
 const [categories, setCategories] = useState([]);
 const [products, setProducts] = useState([]);
 const [search, setSearch] = useState('');


 const [editCategory, setEditCategory] = useState(null);
 const [editProduct, setEditProduct] = useState(null);


 const fetchData = () => {
   fetch('http://localhost:3000/categories')
     .then(res => res.json())
     .then(setCategories);
   fetch('http://localhost:3000/products')
     .then(res => res.json())
     .then(setProducts);
 };


 useEffect(() => {
   fetchData();
 }, []);


 const addOrUpdateCategory = async (data) => {
   const method = editCategory ? 'PUT' : 'POST';
   const url = editCategory
     ? `http://localhost:3000/categories/${editCategory.category_id}`
     : 'http://localhost:3000/categories';


   await fetch(url, {
     method,
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });
   setEditCategory(null);
   fetchData();
 };


 const addOrUpdateProduct = async (data) => {
   const method = editProduct ? 'PUT' : 'POST';
   const url = editProduct
     ? `http://localhost:3000/products/${editProduct.product_id}`
     : 'http://localhost:3000/products';


   await fetch(url, {
     method,
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });
   setEditProduct(null);
   fetchData();
 };


 const deleteCategory = async (id) => {
   await fetch(`http://localhost:3000/categories/${id}`, { method: 'DELETE' });
   fetchData();
 };


 const deleteProduct = async (id) => {
   await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
   fetchData();
 };


 const getCategoryName = (category_id) => {
   const cat = categories.find(c => c.category_id === category_id);
   return cat ? cat.category_name : 'Unknown';
 };


 const filteredProducts = products.filter(p =>
   p.product_name.toLowerCase().includes(search.toLowerCase())
 );

const checkAddCourse = (course) => {
  // Check If a course is possible to add:
  // A student isn't allowed to add multiple
  // different sections of the same course
  alert(course.product_name)
}


 return (
    <div className='dataContainer'>
     <h2 className='header2'>Categories</h2>
     {isAdmin && (
       <Form
         type="category"
         onSubmit={addOrUpdateCategory}
         initialData={editCategory || {}}
       />
     )}
     <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
       <thead>
         <tr>
           <th>Category ID</th>
           <th>Category Name</th>
           {isAdmin && <th>Actions</th>}
         </tr>
       </thead>
       <tbody>
         {categories.map(cat => (
           <tr key={cat.category_id}>
             <td>{cat.category_id}</td>
             <td>{cat.category_name}</td>
             {isAdmin && (
               <td>
                 <button onClick={() => setEditCategory(cat)}>Edit</button>
                 <button onClick={() => deleteCategory(cat.category_id)}>Delete</button>
               </td>
             )}
           </tr>
         ))}
       </tbody>
     </table>

     <h2 className='header2'>All Products</h2>
     <input
       placeholder="Search product name..."
       value={search}
       onChange={e => setSearch(e.target.value)}
       style={{ marginBottom: '1em', padding: '4px', width: '300px' }}
     />


     {isAdmin && (
       <Form
         type="product"
         onSubmit={addOrUpdateProduct}
         initialData={editProduct || {}}
         categories={categories}
       />
     )}


     <table style={{cellPadding: 15, width: "50%"}}>
       <thead>
         <tr>
           <th>Product ID</th>
           <th>Name</th>
           <th>Price</th>
           <th>Category ID</th>
           {isAdmin && <th>Actions</th>}
         </tr>
       </thead>
       <tbody>
         {filteredProducts.map(prod => (
           <tr key={prod.product_id}>
             <td>{prod.product_id}</td>
             <td>{prod.product_name}</td>
             <td>${prod.price}</td>
             <td>{prod.category_id}</td>
             {isAdmin && (
               <td>
                 <button onClick={() => setEditProduct(prod)}>Edit</button>
                 <button onClick={() => deleteProduct(prod.product_id)}>Delete</button>
               </td>
             )}
           </tr>
         ))}
       </tbody>
     </table>

     {/* This is the container holding all the cards */}
     {/* Card design for courses (Will implement later on) - Deris */}
     {/*  Try with mapping */}
      <div style={{marginTop: "30px"}} className='header1'>This is a test container for card below for storing courses</div>
      <div className='courses_Container_Parent'>
         {filteredProducts.map(prod => (
           <div className='course_Card_Container' key={prod.product_id}>
           <div className='course_Title_Container'>
             <h2 className='cardHeader2'>{prod.product_id}</h2>
           </div>
           <div className='course_Room_Container'>
             <p className='cardText'>{prod.product_name}</p>
           </div>
           <div className='course_Time_Container'>
             <p className='cardText'>4:30 PM</p>
           </div>
           {isAdmin && (
            <div className='course_Actions_Container'>
              <button className='cardAdd'>Add</button>
              <button className='cardDelete'>Drop</button>
            </div>
           )}
         </div>
         ))}
        
        {/* Don't delete */}
         {/* <div className='course_Card_Container'>
           <div className='course_Title_Container'>
             <h2 className='cardHeader2'>CSI-300: Database Management Systems</h2>
           </div>
           <div className='course_Room_Container'>
             <p className='cardText'>Joyce 310</p>
           </div>
           <div className='course_Time_Container'>
             <p className='cardText'>4:30 PM</p>
           </div>
           <div className='course_Actions_Container'>
             <button className='cardAdd'>Add</button>
             <button className='cardDelete'>Drop</button>
           </div>
         </div> */}

      </div>

      {/* Possibly add a list of courses to choose from instead of raw text input */}
      {/* Text Input Can be used to add More Courses into database */}
      {/* Probably need to map the different courses from the courses table (When it's created)  */}
      <p className='header1'>Course Listings</p>
      <p className='header2'>Test Design For Course Listings Table</p>
      <div className='courseListContainer'>
        <h1 className='header2'>Courses Available</h1>
        
        {products.map(prod => (
          <div className='courseContainer' key={prod.product_id}>
            <div className='tableBox'>
              <p className='courseName'>{prod.product_id}</p>
            </div>
            <div className='tableBox'>
              <p className='courseName'>{prod.product_id}</p>
            </div>
            <div className='tableBox'>
              <p className='courseStartTime'>{prod.product_name}</p>
            </div>
            <div className='tableBox'>
              <p className='courseRoomDetails'>Course Number</p>
            </div>
              {isAdmin && (
                <button className='courseListingAddButton' onClick={() => checkAddCourse(prod)}>Add Course To Schedule</button>
              )}
          </div> 
        ))}
      </div>
    </div>
 );
}