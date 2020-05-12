import { navigate } from "gatsby";
import React, { useReducer, useState } from "react";

import config from "../auth/auth_config.json";
import { Auth0Provider } from "../auth/react-auth0-spa";
import { FeatureFlagsProvider } from "../feature-flags";
import { LocaleDataProvider } from "../locale-data-context";
import { FacilitiesProvider } from "../facilities-context/FacilitiesContext";
import {
  FacilityContext,
  rtDataReducer,
} from "../page-multi-facility/FacilityContext";
import { Facility } from "../page-multi-facility/types";
import { ScenarioProvider } from "../scenario-context";

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
  navigate(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

const SiteProvider: React.FC = (props) => {
  const [facility, setFacility] = useState<Facility | undefined>();
  const [rtData, dispatchRtData] = useReducer(rtDataReducer, {});

  let redirectUri =
    typeof window === "undefined" ? undefined : window.location.origin;

  return (
    <FeatureFlagsProvider>
      <Auth0Provider
        domain={config.domain}
        client_id={config.clientId}
        audience={config.audience}
        redirect_uri={redirectUri}
        onRedirectCallback={onRedirectCallback as any}
      >
        <LocaleDataProvider>
          <ScenarioProvider>
            <FacilitiesProvider>
              <FacilityContext.Provider
                value={{ facility, setFacility, rtData, dispatchRtData }}
              >
                {props.children}
              </FacilityContext.Provider>
            </FacilitiesProvider>
          </ScenarioProvider>
        </LocaleDataProvider>
      </Auth0Provider>
    </FeatureFlagsProvider>
  );
};

export default SiteProvider;
