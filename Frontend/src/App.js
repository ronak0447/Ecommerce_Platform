import { useEffect, useState } from 'react';
import './App.css';
import Header from './component/layout/Header/Header';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import webfont from 'webfontloader'
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home';
import ProductDetails from './component/Product/ProductDetails.jsx'
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import LoginSignUp from './component/User/LoginSignUp';
import Profile from './component/User/Profile';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from './component/Cart/Cart';
import Shipping from './component/Cart/Shipping';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from './component/Cart/Payment';
import OrderSuccess from './component/Cart/OrderSucces';
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import DashBoard from './component/Admin/DashBoard';
import ProductList from './component/Admin/ProductList';
import NewProduct from './component/Admin/NewProduct';
import UpdateProduct from './component/Admin/UpdateProduct';
import Orders from './component/Admin/OrderList';
import UpdateOrder from './component/Admin/UpdateOrder';
import UsersList from './component/Admin/UsersList';
import UpdateUser from './component/Admin/UpdateUser';
import ProductReviews from './component/Admin/ProductReviews';
import About from './component/layout/About/About';
import Contact from './component/layout/Contact/Contact';

import store from './Store';
import { loadUser } from './Actions/UserAction';
import UserOptions from './component/layout/Header/UserOPtions';
import { useSelector,useDispatch } from 'react-redux';
import ProtectedRoutes from './component/Route/ProtectedRoutes';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NotFound from './component/layout/NotFound/NotFound';



function App() {
  const options = {
    timeout: 5000,
    position: positions.BOTTOM_CENTER,
    transition: transitions.SCALE,
  };
  const dispatch = useDispatch();
  const {user,isAuthenticated} = useSelector((state)=>state.user);
  const [stripeApiKey , setStripeApiKey] = useState("");
  
  async function getStripeApiKey(){
    const { data } = await axios.get("/api/stripeapikey");
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {

    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka","cursive"]
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  },[dispatch]);
  window.addEventListener("contextmenu",(e)=>e.preventDefault());
  return (
    <Router>
       <AlertProvider template={AlertTemplate} {...options}>
          <Header />
          {isAuthenticated && <UserOptions user={user}/>}
          
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/product/:id" element={<ProductDetails/>}/>
          <Route exact path="/products" element={<Products/>}/>
          <Route  path="/products/:keyword" element={<Products/>}/>
          <Route exact path="/products/product/:id" element={<ProductDetails/>}/>
          <Route exact path="/search" element={<Search/>}/>
          <Route path="/account" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Profile/>
            </ProtectedRoutes>
            }/>
          <Route path="/account/me/update" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <UpdateProfile/>Forgo
            </ProtectedRoutes>
            }/>
          <Route path="/api/changepassword" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <UpdatePassword/>
            </ProtectedRoutes>
            }/>
          <Route path="/login/shipping" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <Shipping/>
            </ProtectedRoutes>
          } />  
          <Route exact path="/order/confirm" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}> 
              <ConfirmOrder/>
            </ProtectedRoutes>
          }/>
          <Route path="/proccess/payment" element={
          <>
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoutes isAuthenticated={isAuthenticated}> 
              <Payment/>
            </ProtectedRoutes>
          </Elements>
          )}
          </>
          }/>
          <Route exact path="/success" element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <OrderSuccess/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/myorder" element={
            <ProtectedRoutes >
              <MyOrders/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/order/:id" element={
            <ProtectedRoutes >
              <OrderDetails/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/dashboard" element={
            <ProtectedRoutes isAdmin={true}>
              <DashBoard/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/products" element={
            <ProtectedRoutes isAdmin={true}>
              <ProductList/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/product" element={
            <ProtectedRoutes isAdmin={true}>
              <NewProduct/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/product/:id" element={
            <ProtectedRoutes isAdmin={true}>
              <UpdateProduct/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/orders" element={
            <ProtectedRoutes isAdmin={true}>
              <Orders/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/order/:id" element={
            <ProtectedRoutes isAdmin={true}>
              <UpdateOrder/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/users" element={
            <ProtectedRoutes isAdmin={true}>
              <UsersList/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/user/:id" element={
            <ProtectedRoutes isAdmin={true}>
              <UpdateUser/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/admin/reviews" element={
            <ProtectedRoutes isAdmin={true}>
              <ProductReviews/>
            </ProtectedRoutes>
          }/>
          <Route exact path="/api/forgot" element={<ForgotPassword/>}/>
          <Route exact path="/reset/:token" element={<ResetPassword/>}/>
          <Route exact path="/cart" element={<Cart/>}/>
          <Route exact path="/login" element={<LoginSignUp/>}/>
          <Route exact path='/about' element={<About/>}/>
          <Route exact path='/contact' element={<Contact/>}/>
          <Route
          element={
            window.location.pathname === "/process/payment" ? null:<NotFound/>
          }
          />
        </Routes>
          <Footer />
      </AlertProvider>
    </Router>
  );
}

export default App;
