import React from "react";
import Input from "../../shared/components/FormElements/Input";
import "./NewPlace.css";
const NewPlace = () => {
  return (
    <form className="place-form">
      <Input
        id="title"
        label="Title"
        element="input"
        type="text"
        validator={[]}
        errorText="Please enter a valid title."
      />
    </form>
  );
};

export default NewPlace;
