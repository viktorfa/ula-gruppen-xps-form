import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ProductForm from "../components/product-form";

import "./main.css";
import "semantic-ui-css/semantic.min.css";

const IndexPage = () => (
  <Layout>
    <SEO title="Skjema" />
    <div className="flex flex-col items-center">
      <h1 className="text-xl uppercase">VP Bygg XPS</h1>
      <ProductForm />
    </div>
  </Layout>
);

export default IndexPage;
