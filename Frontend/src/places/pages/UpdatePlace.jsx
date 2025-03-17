import React,{useContext, useEffect, useState} from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import './PlaceForm.css'
import AuthContext from "../../shared/context/auth-context";


// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building1",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 12.9101576,
//       lng: 77.6019046,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Empire State Building2",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 12.9101576,
//       lng: 77.6019046,
//     },
//     creator: "u2",
//   },
//   {
//     id: "p3",
//     title: "Empire State Building3",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_Cropped.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 12.9101576,
//       lng: 77.6019046,
//     },
//     creator: "u3",
//   },
// ];
const UpdatePlace = () => {
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { placeId } = useParams();
  const history = useHistory();
  const auth = useContext(AuthContext);

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

 useEffect(() => {
  const fetchPlace = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`
      );
      setLoadedPlaces(responseData.place);
      setFormData({
              title: {
                value: responseData.place.title,
                isValid: true
              },
              description: {  
                value: responseData.place.description,
                isValid: true
              }
            },
            true,
          )
    } catch (err) {}
  };
  fetchPlace();
 }, [sendRequest, placeId, setFormData]);

  // const identifiedPlace = loadedPlaces.find(p => p.id === placeId);
  // useEffect(() => {
  //   if(identifiedPlace){
  //     setFormData({
  //       title: {
  //         value: identifiedPlace.title,
  //         isValid: true
  //       },
  //       description: {  
  //         value: identifiedPlace.description,
  //         isValid: true
  //       }
  //     })
  //   }
    
  // },[setFormData,identifiedPlace])

  const placeUpdateSubmitHandler = async (event) =>{
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      )
      history.push(`/${auth.userId}/places`)
    } catch (error) {
      
    }
  }
  if(isLoading){
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  if (!loadedPlaces && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  return ( <>
    <ErrorModal error={error} onClear={clearError} />
    {isLoading && loadedPlaces && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        initialValue={loadedPlaces.title}
        InitialValid={true}
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description"
        initialValue={loadedPlaces.description}
        InitialValid={true}
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>}
    </>);
};

export default UpdatePlace;