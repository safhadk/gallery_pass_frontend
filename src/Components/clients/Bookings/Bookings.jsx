import React from 'react'
import { useEffect,useState } from 'react';
import Axios from "../../../Axios/userAxios.js";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment'


function Bookings() {
  const navigate=useNavigate();

  let token = useSelector((state) => state.Client.Token);
  const [bookings,setBookings]=useState({})
  const [show,setshow]=useState({})
  const [SearchInput,setSearchInput]=useState("")
  const [event,setevent]=useState("")

  
 
  if (!token) {
    console.log("no token")
    navigate("/");
  }

  useEffect( () => {
    Axios.get('/bookings',
    {headers:{
      Authorization: `Bearer ${token}`,
    }}).then((res) => {
      setBookings(res.data)
      setshow(res.data)
         console.log(res.data,"response here")
 
   }).catch((error) => {
       console.log(error.message);
   });
}, []);

const handleChange = (event) => {
  console.log(event.target.value);
  
  if (event.target.value=='Completed') {
    console.log('yes')
    let Completed = bookings.filter((booking) => booking.status=='Completed');
    console.log(Completed)
    setshow(Completed); 
    setevent(event.target.value)
  } else if(event.target.value=='Upcoming') {
    console.log('no')
    let pending = bookings.filter((booking) => booking.status!=='Completed');
    console.log(pending)
    setshow(pending);
    setevent('Upcoming')
  }else{
    setshow(bookings);
    setevent('All Bookings')
  }
}

const handleSearch = (event) => {
  setSearchInput(event.target.value)
  
 if(event.target.value){
  let uppdateUse=bookings.filter((item)=>item.bookingId.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1   )
  setshow(uppdateUse)
 }else{
  setshow(bookings)
 }
}
  return (

    <div id="main-wrapper">
           
                    <div class="row align-items-center grid-margin">
                        <div class="col-12">
                            <div class="card card-white">
                                <div class="card-body row align-items-center">
                                    <div class="col-12 col-md-5 mb-4 mb-md-0">
                                        <h4 class="mb-0">My Bookings</h4>
                                    </div>

                                    <div class="col-12 col-md-7">

                                        <div class="row">

                                            <div class="col-md-8 mb-3 mb-md-0">
                                                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="exampleInputEmail1" placeholder="search by booking Id" onChange={handleSearch}
                                         value={SearchInput}/>
                                            </div>

                                            <div class="col-md-4">
                                                <select class="form-control form-select" onChange={handleChange}
                                                 >
                                                    <option>All Bookings</option>
                                                    <option>Upcoming</option>
                                                    <option>Completed</option>
                                                </select>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div class="container-fluid">
  <div class="row">
    <div class="col-12 grid-margin">
      <div class="card card-white">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead class="bg-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Car</th>
                  <th scope="col">Order Date</th>
                  <th scope="col">Advance</th>
                  <th scope="col">Total Amount</th>
                  <th scope="col">Pickup</th>
                  <th scope="col">Drop</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {show.length > 0 && show.map((booking,index)=>(
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <div class="d-flex align-items-center">
                      <div class="me-4">
                        <img src={`/safad/${booking.car.images[0]}`} class="rounded-circle" alt="..." style={{height:'50px',width:'50px'}}/>
                      </div>
                      <div>
                        <h6>{booking.car.carModel}</h6>
                        <span>ID : #{booking.bookingId}</span>
                      </div>
                    </div>
                  </td>
                  <td><Moment format="dddd,DD-MM-YYYY hh:mm:a">{booking.orderDate}</Moment></td>
                  <td>₹{booking.Advance}</td>
                  <td>₹{booking.TotalAmount}</td>
                  <td><Moment format="dddd,DD-MM-YYYY hh:mm:a">{booking.pickup}</Moment></td>
                  <td><Moment format="dddd,DD-MM-YYYY hh:mm:a">{booking.drop}</Moment></td>
                  <td>
                    {booking.status==="Completed" ?<button type="button" class="btn btn-sm  text-white" style={{backgroundColor:'green'}}>{booking.status}</button>: <button type="button" class="btn btn-sm  text-white" style={{backgroundColor:'#2b2e4a'}}>Upcoming</button>}
  
  
</td>

                  <td>
                    <button class="btn text-white me-4" type="button" style={{backgroundColor:'#F77D0A'}} onClick={() => navigate('/bookingDetail', { state: { id: booking._id } })}>
                      View
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  
                </div>


  //   <div class="container mt-5">
  //   <div class="row">

  //       <div class="col-md-4">
  //         <div class="card mb-4">
  //           <img class="card-img-top" src="/safad/car-rent-1.png" alt="Car Image"/>
  //           <div class="card-body">
  //             <h5 class="card-title">Mercedez benz</h5>
  //             <p class="card-text">Automatic</p>
  //             <ul class="list-unstyled">
  //               <li><strong>Date:</strong> 12-05-2023</li>
  //               <li><strong>Time:</strong> 12:00 am</li>
  //               <li><strong>Location:</strong> Bengaluru</li>
  //             </ul>
  //             <a href="#" class="btn btn-warning">View Details</a>
  //           </div>
  //         </div>
  //       </div>

  //       <div class="col-md-4">
  //         <div class="card mb-4">
  //           <img class="card-img-top" src="/safad/car-rent-2.png" alt="Car Image"/>
  //           <div class="card-body">
  //             <h5 class="card-title">Mercedez benz</h5>
  //             <p class="card-text">Automatic</p>
  //             <ul class="list-unstyled">
  //               <li><strong>Date:</strong> 12-05-2023</li>
  //               <li><strong>Time:</strong> 12:00 am</li>
  //               <li><strong>Location:</strong> Bengaluru</li>
  //             </ul>
  //             <a href="#" class="btn btn-warning">View Details</a>
  //           </div>
  //         </div>
  //       </div>


  //       <div class="col-md-4">
  //         <div class="card mb-4">
  //           <img class="card-img-top" src="/safad/car-rent-3.png" alt="Car Image"/>
  //           <div class="card-body">
  //             <h5 class="card-title">Mercedez benz</h5>
  //             <p class="card-text">Automatic</p>
  //             <ul class="list-unstyled">
  //               <li><strong>Date:</strong> 12-05-2023</li>
  //               <li><strong>Time:</strong> 12:00 am</li>
              
  //               <li><strong>Location:</strong> Bengaluru</li>
  //             </ul>
  //             <a href="#" class="btn btn-warning">View Details</a>
  //           </div>
  //         </div>
  //       </div>

  //   </div>
  // </div>
  

                
  )
}

export default Bookings