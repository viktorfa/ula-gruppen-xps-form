import React, { Component } from "react";
import { Input, Select, Form, Button, Message } from "semantic-ui-react";

import xpsData from "../xpsData.json";

const getPackages = (sqm, product) => {
  const exact = sqm / product.quantity_sqm;
  const rounded = Math.ceil(exact);
  const spareSqm = (rounded - exact) * product.quantity_sqm;
  return {
    rounded,
    exact,
    spareSqm,
  };
};
const getProductPrice = (sqm, product) =>
  getPackages(sqm, product).rounded * product.price;
const getDeliveryFee = location => {
  switch (location.key) {
    case "romerike":
      return 300;
    default:
      return 800;
  }
};

const formatPrice = price => {
  return price.toFixed(2);
};

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sqm: 10,
      productType: props.productTypes[0],
      location: props.locations[0],
      submitState: "none",
      name: "",
      number: "",
    };
    this.setProductType = this.setProductType.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.setSqm = this.setSqm.bind(this);
    this.setName = this.setName.bind(this);
    this.setNumber = this.setNumber.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  setProductType(productType) {
    this.setState({ productType });
  }
  setLocation(location) {
    this.setState({ location });
  }
  setSqm(sqm) {
    this.setState({ sqm });
  }
  setName(name) {
    this.setState({ name });
  }
  setNumber(number) {
    this.setState({ number });
  }
  async submitForm() {
    this.setState({ submitState: "loading" });
    try {
      const response = await new Promise(resolve =>
        setTimeout(() => {
          resolve("ok");
        }, 500),
      );
      if (response === "ok") {
        this.setState({ submitState: "success" });
      } else {
        throw new Error("no");
      }
    } catch (error) {
      this.setState({ submitState: "error" });
    }
  }

  render() {
    const { productTypes, locations } = this.props;
    const {
      location,
      sqm,
      productType,
      submitState,
      name,
      number,
    } = this.state;
    return (
      <div style={{ width: "100%", maxWidth: "512px" }}>
        <Select
          fluid
          options={productTypes}
          placeholder="Velg type"
          value={productType.value}
          onChange={(_event, target) => {
            this.setProductType(
              productTypes.find(({ value }) => value === target.value),
            );
          }}
        />
        <Input
          fluid
          value={sqm}
          type="number"
          placeholder="10"
          label={{ basic: true, content: "kvm" }}
          labelPosition="right"
          onChange={event => this.setSqm(event.target.value)}
        />
        <Select
          fluid
          options={locations}
          placeholder="Levering til"
          value={location.value}
          onChange={(_event, target) => {
            console.log("target");
            console.log(target);
            this.setLocation(
              locations.find(({ value }) => value === target.value),
            );
          }}
        />

        <div>
          <Input
            fluid
            disabled
            label="antall pakker"
            value={productType && getPackages(sqm, productType).rounded}
          />
          <Input
            fluid
            disabled
            label="pris"
            value={
              productType && formatPrice(getProductPrice(sqm, productType))
            }
          />
          <Input
            fluid
            disabled
            label="frakt"
            value={location && formatPrice(getDeliveryFee(location))}
          />
          <h2>
            Total pris:{" "}
            {location &&
              productType &&
              formatPrice(
                getProductPrice(sqm, productType) + getDeliveryFee(location),
              )}
            ,-
          </h2>
          <p>
            {productType &&
              `${getPackages(sqm, productType).spareSqm.toFixed(
                1,
              )} kvm til overs`}
          </p>
        </div>
        <hr className="border" />
        <Form
          error={submitState === "error"}
          success={submitState === "success"}
        >
          <h3>Send inn navn og telefonnummer så tar vi kontakt om tilbud.</h3>
          <Input
            fluid
            label="navn"
            onChange={event => this.setName(event.target.value)}
          />
          <Input
            fluid
            label="telefon"
            onChange={event => this.setNumber(event.target.value)}
          />
          <Button
            fluid
            primary
            disabled={
              submitState === "success" ||
              !(name && number && number.length >= 8)
            }
            loading={submitState === "loading"}
            onClick={this.submitForm}
          >
            Send inn
          </Button>
          <Message
            error
            header="Oi da"
            content="Noe feil skjedde. Vennligst prøv igjen."
          />
          <Message
            success
            header={`Takk, ${name}`}
            content={`Din bestilling er mottatt. Vi tar kontakt på ${number} snarest.`}
          />
        </Form>
      </div>
    );
  }
}

ProductForm.defaultProps = {
  productTypes: xpsData.map(item => ({
    ...item,
    key: item.varenr,
    value: item.varenr,
    text: item.name,
  })),
  locations: [
    { text: "Romerike", key: "romerike", value: "romerike" },
    { text: "Annen Oslo og omegn", key: "aoo", value: "aoo" },
  ],
};

export default ProductForm;
