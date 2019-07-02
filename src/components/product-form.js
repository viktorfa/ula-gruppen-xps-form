import React, { Component } from "react";
import { Label, Input, Select, Form, Button, Message } from "semantic-ui-react";

import handleForm from "../handleNetlifyForm";
import xpsData from "../xpsData.json";
import locationData from "../locationData.json";

import "./product-form.css";

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
const getDeliveryFee = location => location.price;

const formatPrice = price => {
  return price.toFixed(2);
};

const getFormData = state => {
  const { rounded } = getPackages(state.sqm, state.productType);
  const packagePrice = getProductPrice(state.sqm, state.productType);
  const deliveryPrice = getDeliveryFee(state.location);
  const totalPrice = packagePrice + deliveryPrice;
  return {
    ...state,
    packages: rounded,
    packagePrice,
    totalPrice,
    deliveryPrice,
  };
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
      const { ok } = await handleForm("order", getFormData(this.state));
      if (ok) {
        this.setState({ submitState: "success" });
      } else {
        throw new Error("Could not submit form.");
      }
    } catch (error) {
      console.error(error);
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
        <Form
          name="order"
          data-netlify="true"
          subject="Bestilling XPS"
          error={submitState === "error"}
          success={submitState === "success"}
        >
          <div className="mb-4">
            <div className="ui labeled input fluid">
              <Label size="large" className="ui label">
                type plater
              </Label>
              <input
                type="hidden"
                name="productType"
                value={productType.name}
              />
              <input type="hidden" name="location" value={location.name} />
              <Select
                name="productType"
                fluid
                style={{ borderRadius: "0 2px 2px 0" }}
                options={productTypes}
                placeholder="Velg type"
                value={productType.value}
                onChange={(_event, target) => {
                  this.setProductType(
                    productTypes.find(({ value }) => value === target.value),
                  );
                }}
              />
            </div>
            <Input
              name="sqm"
              fluid
              value={sqm}
              type="number"
              placeholder="10"
              label={{ basic: true, content: "kvm" }}
              labelPosition="right"
              onChange={event => this.setSqm(event.target.value)}
            />
            <div className="ui labeled input fluid">
              <Label size="large" className="ui label">
                levering til
              </Label>
              <Select
                name="location"
                fluid
                style={{ borderRadius: "0 2px 2px 0" }}
                options={locations}
                placeholder="Levering til"
                value={location.value}
                onChange={(_event, target) => {
                  this.setLocation(
                    locations.find(({ value }) => value === target.value),
                  );
                }}
              />
            </div>
          </div>

          <Input
            name="packages"
            fluid
            disabled
            label={<Label style={{ width: "8rem" }}>antall pakker</Label>}
            value={productType && getPackages(sqm, productType).rounded}
          />
          <Input
            name="packagePrice"
            fluid
            disabled
            label={<Label style={{ width: "8rem" }}>pris</Label>}
            value={
              productType && formatPrice(getProductPrice(sqm, productType))
            }
          />
          <Input
            name="deliveryPrice"
            fluid
            disabled
            label={<Label style={{ width: "8rem" }}>frakt</Label>}
            value={
              (location &&
                getDeliveryFee(location) &&
                formatPrice(getDeliveryFee(location))) ||
              "diskuteres senere"
            }
          />
          <input
            type="hidden"
            name="totalPrice"
            value={
              productType &&
              formatPrice(
                getProductPrice(sqm, productType) + getDeliveryFee(location),
              )
            }
          />
          <div className="my-8">
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

          <h3>Send inn navn og telefonnummer så tar vi kontakt om tilbud.</h3>
          <Input
            fluid
            name="name"
            label={<Label style={{ width: "5rem" }}>navn</Label>}
            onChange={event => this.setName(event.target.value)}
          />
          <Input
            fluid
            name="number"
            label={<Label style={{ width: "5rem" }}>telefon</Label>}
            onChange={event => this.setNumber(event.target.value)}
          />
          <Button
            type="submit"
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
  locations: locationData,
};

export default ProductForm;
