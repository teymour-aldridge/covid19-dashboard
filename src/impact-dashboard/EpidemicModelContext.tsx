import React from "react";

const {
  populationAndHospitalData,
} = require("../page-overview/assets/dataSource") as any;

type Action = { type: "update"; payload: EpidemicModelState };
type Dispatch = (action: Action) => void;
interface EpidemicModelInputs {
  totalIncarcerated: number;
  rateOfSpreadFactor: number;
  confirmedCases?: number;
  usePopulationSubsets: boolean;
  staff?: number;
  age0?: number;
  age20?: number;
  age45?: number;
  age55?: number;
  age65?: number;
  age75?: number;
  age85?: number;
  ageUnknown?: number;
}
interface EpidemicModelState extends EpidemicModelInputs {
  stateCode: string; // corresponds to populationAndHospitalData keys
  countyName?: string;
  facilityName?: string;
}
type EpidemicModelProviderProps = { children: React.ReactNode };

const EpidemicModelStateContext = React.createContext<
  EpidemicModelState | undefined
>(undefined);

const EpidemicModelDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
);

function epidemicModelReducer(
  state: EpidemicModelState,
  action: Action,
): EpidemicModelState {
  switch (action.type) {
    case "update":
      // the desired user flow is to fill out a form, review the entries,
      // then submit it all at once; therefore we can just expose a single
      // action and merge the whole object into previous state.
      // it's not very granular but it doesn't need to be at the moment
      return Object.assign({}, state, action.payload);
  }
}

function EpidemicModelProvider({ children }: EpidemicModelProviderProps) {
  const [state, dispatch] = React.useReducer(epidemicModelReducer, {
    stateCode: "US",
    totalIncarcerated: populationAndHospitalData.US.incarceratedPopulation,
    rateOfSpreadFactor: 3.7,
    usePopulationSubsets: false,
  });

  return (
    <EpidemicModelStateContext.Provider value={state}>
      <EpidemicModelDispatchContext.Provider value={dispatch}>
        {children}
      </EpidemicModelDispatchContext.Provider>
    </EpidemicModelStateContext.Provider>
  );
}

function useEpidemicModelState() {
  const context = React.useContext(EpidemicModelStateContext);

  if (context === undefined) {
    throw new Error(
      "useEpidemicModelState must be used within an EpidemicModelProvider",
    );
  }

  return context;
}

function useEpidemicModelDispatch() {
  const context = React.useContext(EpidemicModelDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useEpidemicModelDispatch must be used within an EpidemicModelProvider",
    );
  }

  return context;
}

export {
  EpidemicModelProvider,
  useEpidemicModelState,
  useEpidemicModelDispatch,
  EpidemicModelInputs,
};