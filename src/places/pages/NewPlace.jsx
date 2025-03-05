import React, { useCallback } from "react";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./NewPlace.css";
const NewPlace = () => {
  const titleInputHandler = useCallback((id, value, isValid) => {}, []);

  const descriptionInputHandler = useCallback((id, value, isValid) => {}, []);
  return (
    <form className="place-form">
      <Input
        id="title"
        label="Title"
        element="input"
        type="text"
        validator={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={titleInputHandler}
      />
      <textarea
        id="description"
        label="Description"
        element="textarea"
        type="text"
        validator={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description(at least 5 characters)."
        onInput={descriptionInputHandler}
      />
    </form>
  );
};

export default NewPlace;
