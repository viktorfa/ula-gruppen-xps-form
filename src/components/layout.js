/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import "./main.css";

const Layout = ({ children }) => {
  return (
    <>
      <div className="md:mx-0 mx-2">
        <main style={{ minHeight: "90vh" }} className="container mx-auto">
          {children}
        </main>
        <footer className="text-center">
          © {new Date().getFullYear()} VP Bygg
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
