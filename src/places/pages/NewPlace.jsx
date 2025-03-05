import React from "react";
import Input from "../../shared/components/FormElements/Input";
import {VALIDATOR_REQUIRE} from "../../shared/util/validators";
import "./NewPlace.css";
const NewPlace = () => {
  return (
    <form className="place-form">
      <Input
        id="title"
        label="Title"
        element="input"
        type="text"
        validator={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
      />
    </form>
  );
};

export default NewPlace;
