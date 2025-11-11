import * as React from "react";
import Box from "@mui/material/Box";

function Header(){
    return(
        <Box sx={{ 
            backgroundColor: "#C91E1E",
            height: "30px",
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}/>
    )
}

export default Header;