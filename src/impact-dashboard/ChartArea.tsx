import React from "react";
import { useState } from "react";
import styled from "styled-components";

import { MarkColors as markColors } from "../design-system/Colors";
import { CurveData } from "../infection-model";
import { useChartDataFromProjectionData } from "../page-multi-facility/projectionCurveHooks";
import CurveChart from "./CurveChartContainer";
import CurveChartLegend from "./CurveChartLegend";

export type MarkColors = {
  exposed: string;
  infectious: string;
  fatalities: string;
  hospitalized: string;
  hospitalBeds: string;
};

const Container = styled.div``;

const LegendAndActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 40px;
`;

const LegendContainer = styled.div`
  flex: 0 0 auto;
`;

const LegendTitle = styled.div`
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.15em;
  margin: 0 1em;
  font-weight: normal;
  padding-bottom: 0.6em;
`;

const ChartArea: React.FC<{
  projectionData?: CurveData;
}> = ({ projectionData }) => {
  const [groupStatus, setGroupStatus] = useState({
    exposed: true,
    fatalities: true,
    hospitalized: true,
    infectious: true,
  });

  const toggleGroup = (groupName: keyof typeof groupStatus) => {
    setGroupStatus({ ...groupStatus, [groupName]: !groupStatus[groupName] });
  };

  const chartData = useChartDataFromProjectionData(projectionData);

  return (
    <Container>
      <LegendAndActions>
        <LegendTitle>projection</LegendTitle>
        <LegendContainer>
          <CurveChartLegend
            markColors={markColors}
            toggleGroup={toggleGroup}
            groupStatus={groupStatus}
          />
        </LegendContainer>
      </LegendAndActions>
      <CurveChart
        curveData={chartData}
        groupStatus={groupStatus}
        markColors={markColors}
      />
    </Container>
  );
};

export default ChartArea;
