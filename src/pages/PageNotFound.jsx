import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notFound.css'; 
import Navbar from '../components/Navbar';
import NotFound from "../components/NotFound"

const PageNotFound = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("../");
    };

    return (
        <div>
            <Navbar/>
            <NotFound/>
        </div>
    );
};

export default PageNotFound;
