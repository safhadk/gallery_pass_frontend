import React from "react";
import Header from "../../Components/clients/Header/Header";
import Banner from "../../Components/clients/Banner/Banner";
import Locations from "../../Components/clients/Locations/Locations";
import QRScanner from "../../Components/clients/QR/QR";

function Home() {
    return (
        <div>
            <QRScanner/>
            {/* <Header />
            <Banner/>
            <Locations/> */}
            
        </div>
    );
}

export default Home;
