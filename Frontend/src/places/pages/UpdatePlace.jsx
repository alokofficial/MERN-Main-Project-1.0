import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import './PlaceForm.css'

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building1",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 12.9101576,
      lng: 77.6019046,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building2",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 12.9101576,
      lng: 77.6019046,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Empire State Building3",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 12.9101576,
      lng: 77.6019046,
    },
    creator: "u3",
  },
];
const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { placeId } = useParams();
  

  const [formState, inputHandler,setFormData ]=useForm({
    title:{
        value:'',
        isValid:false
    },
    description:{
        value:'',
        isValid:false
    }
  },false)

  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);
  useEffect(() => {
    if(identifiedPlace){
      setFormData({
        title: {
          value: identifiedPlace.title,
          isValid: true
        },
        description: {  
          value: identifiedPlace.description,
          isValid: true
        }
      })
    }
    
    setIsLoading(false)
  },[setFormData,identifiedPlace])

  const placeUpdateSubmitHandler = event =>{
    event.preventDefault();
    console.log(formState.inputs)
  }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }
  if(isLoading){
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        initialValue={formState.inputs.title.value}
        InitialValid={formState.inputs.title.isValid}
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description"
        initialValue={formState.inputs.description.value}
        InitialValid={formState.inputs.description.isValid}
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
  );
};

export default UpdatePlace;