import React from 'react'
import {Link,Route,Routes} from 'react-router-dom'
import Dashboard from '../Pages/Dashboard'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Register from '../Pages/Register'
import AddTransaction from '../Pages/AddNewTransactions'
import ViewTransactions from '../Pages/ViewTransactions'
import EditTransactions from '../Pages/EditTransactions'
import PrivateRoute from '../Components/PrivateRoute'


function AppRoutes({setIsLoggedIn}) {
  return (
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
    <Route path='/register' element={<Register/>} />


    <Route path='/dashboard' element={ <PrivateRoute><Dashboard/></PrivateRoute>  } />
    <Route path='/add' element={ <PrivateRoute><AddTransaction/></PrivateRoute> } />
    <Route path='/transactions' element={<PrivateRoute><ViewTransactions/></PrivateRoute>} />
    <Route path='/edit/:id' element={<PrivateRoute><EditTransactions/></PrivateRoute>} />
   </Routes>
  )
}

export default AppRoutes
