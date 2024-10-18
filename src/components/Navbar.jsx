import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, user as firebaseUser, userSnap, isHead, isLoggedIn, isMentor, isMember, isPresident } from "../auth/Auth";
import logo from "../assets/logo/logo.png";
import ImgHome from "../assets/bg/home.jpeg";
import "../css/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(firebaseUser);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (User) => {
      if (User) {
        setUser(User);
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        document.querySelector('.header').classList.add('hide-navbar');
        setShowMenu(false);
      } else {
        // Scrolling up
        document.querySelector('.header').classList.remove('hide-navbar');
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("../login");
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${ImgHome})`,
        marginBottom: "6em",
        transition: "top 0.3s",
        top: visible ? "0" : "-100px", // Adjust top value to slide up or down
        position: "fixed",
        width: "100%",
        zIndex: "1000",
      }}
    >
      <header className="header" style={{marginBottom: "200em"}}>
        <nav style={{ padding: "0.7rem" }}>
          <NavLink to="/" className="nav__logo">
            <img className="nav__logo_image" src={logo} alt="Fast Gaming Club" />
          </NavLink>

          <div
            className={`nav__menu ${showMenu ? "show-menu" : ""}`}
            id="nav-menu"
          >
            <div className="nav__scroll-container">
              <ul className="nav__list">
                <li className="nav__item">
                  <NavLink
                    to="/"
                    className="nav__link"
                    onClick={closeMenuOnMobile}
                  >
                    Home
                  </NavLink>
                </li>
                {membershipRequest()}
                {becomeAMember()}
                {gallery()}
                {registerEvent()}
                {eventRequests()}
                {eventRegistrations()}
                {issues()}
                {assignTasksToTeams()}
                {assignTask()}
                {/* {addAnnouncement()}
                {announcements()} */}
                {getSignInOrOutButton()}
              </ul>
            </div>
            <div className="nav__close" id="nav-close" onClick={toggleMenu}>
              <IoClose />
            </div>
          </div>

          <div
            className="nav__toggle"
            id="nav-toggle"
            onClick={toggleMenu}
            style={{ paddingLeft: "2.5rem", marginTop: "1rem" }}
          >
            <IoMenu />
          </div>
        </nav>
      </header>
    </div>
  );

    function membershipRequestLink() {
    navigate("../approve-member")
  }

  function membershipRequest() {
    console.log("AAAA",userSnap);
    if (isLoggedIn() &&  (isMentor() || isPresident())) {
      return (
        <li className="nav__item">
          <button
            onClick={membershipRequestLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Membership Requests
          </button>
        </li>
      );
    } else {
      return (<></>);
    }
  }


  function membershipRequestLink() {
    navigate("../approve-member")
  }

  function membershipRequest() {
    console.log("AAAA",userSnap);
    if (isLoggedIn() &&  (isMentor() || isPresident())) {
      return (
        <li className="nav__item">
          <button
            onClick={membershipRequestLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Membership Requests
          </button>
        </li>
      );
    } else {
      return (<></>);
    }
  }


  function becomeAMemberLink() {
    navigate("../become-member")
  }

  function becomeAMember() {
    if (isLoggedIn() && (!isMentor() && !isPresident() && !isHead() && !isMember())) {
      return (
        <li className="nav__item">
          <button
            onClick={becomeAMemberLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Become A Member
          </button>
        </li>
      );
    } else {
      return (<></>);
    }
  }

  function galleryLink() {
    navigate("../gallery-page");
  }
  
  function gallery() {
    return (
      <li className="nav__item">
        <button
          onClick={galleryLink}
          className="nav__link nav__cta"
          style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
          >
          Gallery
        </button>
      </li>
    );
  }
  
  function registerEventLink() {
    navigate("../register-event");
  }
  
  function registerEvent() {
    if (isLoggedIn() && (isMember() || isHead() || isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={registerEventLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Register Event
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function eventRequestsLink() {
    navigate("../approve-event");
  }
  
  function eventRequests() {
    if (isLoggedIn() && (isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={eventRequestsLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Event Requests
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function eventRegistrationsLink() {
    navigate("../view-participants");
  }
  
  function eventRegistrations() {
    if (isLoggedIn() && (isMember() || isHead() || isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={eventRegistrationsLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Event Registrations
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function issuesLink() {
    navigate("../view-issues");
  }
  
  function issues() {
    if (isLoggedIn() && (isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={issuesLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Issues
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function assignTasksToTeamsLink() {
    navigate("../assign-task-to-team");
  }
  
  function assignTasksToTeams() {
    if (isLoggedIn() && (isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={assignTasksToTeamsLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Assign Tasks (Teams)
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function assignTaskLink() {
    navigate("../assign-task-to-member");
  }
  
  function assignTask() {
    if (isLoggedIn() && isHead()) {
      return (
        <li className="nav__item">
          <button
            onClick={assignTaskLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Assign Task
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function addAnnouncementLink() {
    navigate("../add-announcement");
  }
  
  function addAnnouncement() {
    if (isLoggedIn() && (isPresident() || isMentor())) {
      return (
        <li className="nav__item">
          <button
            onClick={addAnnouncementLink}
            className="nav__link nav__cta"
            style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
            >
            Add Announcement
          </button>
        </li>
      );
    } else {
      return <></>;
    }
  }
  
  function announcementsLink() {
    navigate("../announcements");
  }
  
  function announcements() {
    return (
      <li className="nav__item">
        <button
          onClick={announcementsLink}
          className="nav__link nav__cta"
          style={{ backgroundColor: "transparent", marginLeft: "-1.5rem", marginTop: "0px", marginBottom: "0px" }}
          >
          Announcements
        </button>
      </li>
    );
  }
  

  function getSignInOrOutButton() {
    if (isLoggedIn()) {
      return (
        <li className="nav__item">
          <button
            onClick={handleSignOut}
            className="nav__link nav__cta"
            style={{ backgroundColor: "#930505", padding: "0.5rem 1rem" }}
          >
            Log Out
          </button>
        </li>
      );
    } else {
      return (
        <li className="nav__item">
          <NavLink
            to="../login"
            className="nav__link nav__cta"
            style={{ backgroundColor: "#930505", padding: "0.5rem 1rem" }}
          >
            Get Started
          </NavLink>
        </li>
      );
    }
  }
};

export default Navbar;
