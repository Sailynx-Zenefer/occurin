import { SearchBoxCore, SearchSession } from "@mapbox/search-js-core";
import { useEffect, useState, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteScrollView,
} from "react-native-paper-autocomplete";
import * as React from "react";

import {
  SearchBoxOptions,
  SearchBoxRetrieveResponse,
  SearchBoxSuggestionResponse,
} from "@mapbox/search-js-core";

export interface NativeSearchBoxProps {
  accessToken: string;
  options?: Partial<SearchBoxOptions>;
  placeholder?: string;
  optionTextValue?: OptionType;
  onChangeTextAC?: (res: string) => void;
  onOptionSelect?: (res: OptionType) => void;
  onSuggestSBSR?: (res: SearchBoxSuggestionResponse) => void;
  onSuggestError?: (error: Error) => void;
  onRetrieveSBRR?: (res: SearchBoxRetrieveResponse) => void;
  interceptSearch?: (value: string) => string;
}

type OptionType = {
  label: string;
  value: number;
  description: string;
};

export default function NativePaperMapboxSearch({
  accessToken,
  options: { language, country } = {},
  placeholder,
  optionTextValue,
  onOptionSelect = () => {},
  onChangeTextAC = () => {},
  onSuggestSBSR = () => {},
  onSuggestError = () => {},
  onRetrieveSBRR = () => {},
}: NativeSearchBoxProps) {

  const [autocompleteOptions, setAutocompleteOptions] = useState<OptionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | undefined>(undefined);

  const calculateOptions = ({
    suggestions,
  }: SearchBoxSuggestionResponse): OptionType[] => {
    return suggestions.map((option, id: number) => ({
      label: option.name,
      value: id,
      description: option.place_formatted,
    }));
  };

  const session = useMemo(() => {
    const search = new SearchBoxCore({ accessToken, language, country });
    return new SearchSession(search);
  }, [accessToken, language, country]);

  useEffect(() => {
    const passSuggestionResponse = (
      suggestionRes: SearchBoxSuggestionResponse,
    ) => {
      if (suggestionRes) {
        try {
          setAutocompleteOptions((prevOptions) => {
            const searchText =
              prevOptions.length > 0
                ? prevOptions[0]
                : {
                    label: "",
                    value: 0,
                    description: "",
                  };
            const newOptions = calculateOptions(suggestionRes);
            return [searchText, ...newOptions];
          });
        } catch (error) {
          console.error('setAutocompleteOptions', error);
        }
        onSuggestSBSR(suggestionRes);
      }
    };

    const passRetrieveResponse = (retrieveRes: SearchBoxRetrieveResponse) => {
      if (retrieveRes) {
        onRetrieveSBRR(retrieveRes);
      }
    };


    session.addEventListener("suggesterror", (error) => {
      console.error('Suggest Error:', error);
      onSuggestError(error);
    });


    session.addEventListener("suggest", (res) => {
      try {
        passSuggestionResponse(res);
      } catch (error) {
        console.error('Suggest Error:', error);
      }
    });

    session.addEventListener("retrieve", (res) => {
      try {
        passRetrieveResponse(res);
      } catch (error) {
        console.error('Retrieve Error:', error);
      }
    });

    return () => {
      session.removeEventListener("suggest", passSuggestionResponse);
      session.removeEventListener("retrieve", passRetrieveResponse);
    };
  }, [onRetrieveSBRR, onSuggestSBSR, session]);

  const handleSession = (searchText: string) => {
    try {
      session.suggest(searchText);
      const suggestions = session.suggestions?.suggestions || [];
      if (searchText.length === 0 || suggestions.length === 0) {
        return;
      }
      const suggestion = suggestions[0];

      if (session.canRetrieve(suggestion)) {
        session.retrieve(suggestion);
      } else if (session.canSuggest(suggestion)) {
        session.suggest(suggestion.name);
      }
    } catch (error) {
      console.error('Session Error:', error);
    }
  };

  const handleTextChange = (searchText: string) => {
    try {
      onChangeTextAC(searchText);
      handleSession(searchText);
    } catch (error) {
      console.error('Text Change Error:', error);
    }
  };

  return (
    <>
      <AutocompleteScrollView>
        <Autocomplete
          onChange={(selectedOption: OptionType) => {
            if (selectedOption) {
              try {
                setSelectedOption(selectedOption)
                onOptionSelect(selectedOption);
              } catch (error) {
                console.error("selectOptionError",error)
              }
            }
          }}
          value={selectedOption}
          options={autocompleteOptions}
          inputProps={{
            placeholder: placeholder,
            onChangeText: handleTextChange,
          }}
        />
      </AutocompleteScrollView>
    </>
  );
}