import ParkMap from '../d3-components/ParkMap';
import { useParks } from '../../../context/ParksContext';
import { openParkDetails } from '../../../util/handlers';

export default function MapView() {

  const { state, dispatch } = useParks();

  const handleParkClick = (park) => {
    const currentCode = state.activePark?.parkCode || state.activePark;
    const newCode = park.parkCode;

    if (currentCode !== newCode) {
      openParkDetails(dispatch, park); // Shared logic
    }
  };



  return <ParkMap onParkClick={handleParkClick} />;
}
