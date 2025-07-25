
export function handleSidebarClick({
  parkCode,
  setActivePark,
  setShowModal,
  setViewMode,
  setVisible,
  mapRef,
  parkRefs
}) {
  setActivePark(parkCode);
  setShowModal(true);
  setViewMode('map');
  setVisible(true);
  mapRef.current?.zoomToPark(parkCode);
  const el = parkRefs.current[parkCode];
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


export function openParkDetails(dispatch, park, navigate = null) {

  if (!park) return;
  dispatch({ type: 'SET_ACTIVE_PARK', payload: park });
  dispatch({ type: 'SET_VIEW_MODE', payload: 'details' });
  dispatch({ type: 'TOGGLE_MODAL' });

  if (navigate) {
    navigate('/parks/details');
  }
}
