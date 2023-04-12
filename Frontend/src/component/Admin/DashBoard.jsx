import React ,{useEffect} from 'react';
import Sidebar from './Sidebar';
import './DashBoard.css'
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {Doughnut,Line} from 'react-chartjs-2';
import {CategoryScale, 
        Chart,
        LinearScale,
        Legend, 
        PointElement,
        LineElement,
        BarElement,
        ArcElement,
    } from 'chart.js'
import { useDispatch,useSelector } from 'react-redux';
import {getAdminProduct} from '../../Actions/ProductAction';


const DashBoard = () => {
  const dispatch = useDispatch();
  const {products} = useSelector((state)=>state.products);
  Chart.register(
    CategoryScale,
    LinearScale,
    Legend,
    PointElement,
    LineElement,
    BarElement,
    ArcElement);
   
  let outOfStock = 0;
  products && 
  products.forEach((item)=>{
    if(item.Stock === 0){
        outOfStock += 1;
    };
  });
  useEffect(()=>{

    dispatch(getAdminProduct());
  },[dispatch,]) ;    
    
  const chartData ={
    labels:["Intial Amount","Amount Earned"],
    datasets:[
        {
            label:'Total Amount',
            backgroundColor:'tomato',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor:'rgb(197,72,49)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data:[0,4000],
        },
    ],
  };
  const chartOptions = {
    Legend:{
        xAxisKey:'key.value',
    },
  };
  const doughnutState = {
    labels:["Out of Stock","InStock"],
    datasets:[
        {
            backgroundColor: ["#00A6B4", "#6800B4"],
            hoverBackgroundColor: ["#4B5000", "#35014F"],
            data:[outOfStock,products.length - outOfStock],
        },
    ],
  };

  return (
    <div className='dashboard'>
        <Sidebar/>
       <div className="dashboardContainer">

        <Typography component="h1">Dashboard</Typography>
         <div className="dashboardSummary">
            <div>
                <p>
                    Total Amount <br /> ₹2000
                </p>
            </div>
                <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                    <p>Product</p>
                    <p>{products && products.length}</p>
                </Link>
                <Link to="/admin/orders">
                    <p>Orders</p>
                    <p>5</p>
                </Link>
                <Link to="/admin/users">
                    <p>Users</p>
                    <p>5</p>
                </Link>
            </div>
         </div>
         <div className="lineChart">
            <Line 
               data={chartData} options={chartOptions}
            />
         </div>
         <div className="doughnutChart">
            <Doughnut
               data={doughnutState} 
            />
         </div>
       </div> 
    </div>
  )
}

export default DashBoard
