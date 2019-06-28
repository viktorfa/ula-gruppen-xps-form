import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import ProductForm from "../components/product-form";

import "semantic-ui-css/semantic.min.css";

const IndexPage = () => (
  <Layout>
    <SEO title="Skjema" />
    <div className="flex flex-col items-center">
      <header className="m-2">
        <h1 className="text-xl uppercase">VP Bygg XPS</h1>
      </header>
      <ProductForm />
    </div>
  </Layout>
);

export default IndexPage;
