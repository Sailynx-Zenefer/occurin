import React, { useState } from "react";
import renderer from "react-test-renderer";
import {
  SearchBoxOptions,
  SearchBoxRetrieveResponse,
  SearchBoxSuggestionResponse,
  SearchBoxFeatureSuggestion,
} from "@mapbox/search-js-core";
import NativePaperMapboxSearch from "../../src/components/NativePaperMapboxSearch.tsx";

const mapBoxToken = process.env?.EXPO_PUBLIC_MAPBOX_OCCURIN_TOKEN as string;

describe("<NativePaperMapboxSearch />", () => {
  it("has 2 child", () => {

    type RHFormValues = {
      eventName: string;
      eventDescription: string;
      eventBeginDate: Date;
      eventFinishDate: Date;
      imgUrl: string;
      inPerson: boolean;
      location: {
        name: string;
        lat: number;
        long: number;
        address: string;
      };
      ticketed: boolean;
      ticketPrice: number;
    };


    const [testState,setTestState] = useState<RHFormValues>({
      eventName: "",
      eventDescription: "",
      eventBeginDate: new Date(),
      eventFinishDate: new Date(),
      imgUrl: "",
      inPerson: true,
      location: {
        name: "",
        lat: 0,
        long: 0,
        address: "",
      },
      ticketed: false,
      ticketPrice: 0,
    })


    const tree: any = renderer
      .create(
        <NativePaperMapboxSearch
          accessToken={mapBoxToken}
          options={{
            language: "en",
            country: "GB",
          }}
          value={testState.eventName}
          onChange={([name] : SearchBoxFeatureSuggestion[]) => {
            setTestState((oldForm)=> {
              const newForm = {...oldForm}
              newForm.eventName = `${name}`
              return newForm
            })
            console.log(testState.toString())
          }
        }
          onRetrieve={({
            features: [name_preferred, place_formatted, coordinates],
          }) => {
            setTestState((oldForm)=> {
              const newForm = {...oldForm}
              newForm.eventName =  `${name_preferred}`;
              newForm.location.long = coordinates.geometry.coordinates[0];
              newForm.location.lat = coordinates.geometry.coordinates[1];
              newForm.location.address = `${place_formatted}`;
              return newForm
            })
            console.log(testState.toString())
          }
            
          }
          placeholder={"Search for locations"}
        />,
      )
      .toJSON();
    expect(tree?.children?.length).toBe(2);
  });
});
