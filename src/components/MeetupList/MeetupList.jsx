import meetupService from "../../services/meetupService";
import { useState, useEffect } from "react";
import authService from "../../services/authService";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import {useNavigate } from 'react-router-dom';

const MeetupList = () => {
  const [meetups, setMeetups] = useState([]);
  const user = authService.getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const getMeetups = async () => {
      const meetupData = await meetupService.index();
      setMeetups(meetupData);
    };
    getMeetups();
  }, []);

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  const handleDelete = async (meetupID) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6a0dad',
      cancelButtonColor: '#8b0000',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        await meetupService.deleteEvent(meetupID); // Assuming deleteEvent is an async function
        Swal.fire('Deleted!', 'The meetup has been deleted.', 'success');
        navigate('/meetups'); 
        location.reload();
      } catch (error) {
        console.error("Error deleting meetup:", error);
        Swal.fire('Error!', 'There was an error deleting the meetup.', 'error');
      }
    }
  };

  if (!meetups) <h3>Loading...</h3>

  return (
    <>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Upcoming Astro Gatherings</h1>
        <div className="row">
          {meetups.length > 0 ? (
            meetups.map((meetup) => (
              <div key={meetup._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <img
                    src={meetup.eventid.image}
                    alt={meetup.eventid.image}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{meetup.eventid.name}</h5>
                    <p className="card-text">
                      <strong>Organized by:</strong> {meetup.userid.username}
                    </p>
                    <p className="card-text">
                      <strong>Description:</strong> {meetup.eventid.description}
                    </p>
                    <p className="card-text">
                      <strong>Date/Time:</strong>
                      {formatDateTime(meetup.eventid.datetime)}
                    </p>
                    <p className="card-text">
                      <strong>Location:</strong> {meetup.location}
                    </p>
                    <div className="d-flex justify-content-between">
                      {user ? (
                        user.type === "user" ? (
                          <button className="btn btn-primary">Book Now</button>
                        ) : user.type === "club" ? (
                          <div className="row">
                            <div className="col-6">
                              <Link
                                key={meetup._id}
                                to={meetup._id}
                                className="btn btn-primary p-2 m-0"
                              >
                                Edit
                              </Link>
                            </div>
                            <div className="col-6">
                              <button
                                className="btn btn-danger p-2 m-0"
                                onClick={() => handleDelete(meetup._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                </div>
                <br />
                <hr />
              </div>
            ))
          ) : (
            <h3 className="text-center mb-3 pb-3">No meetups available</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default MeetupList;
