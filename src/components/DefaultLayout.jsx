import React from "react";
import Box from "@mui/material/Box";
import Header from "./Header";
import HeaderLogo from "./HeaderLogo";
import Footer from "./Footer";

const DefaultLayout = ({ children, headerRender }) => {
  return (
    <div>
      {headerRender === 1 ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100px" }}
        >
          <Header />
          <Box
            sx={{
              border: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100px" }}
        >
          <HeaderLogo />
          <Box
            sx={{
              border: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {children}
          </Box>
          <Footer />
        </Box>
      )}
    </div>
  );
};

export default DefaultLayout;
