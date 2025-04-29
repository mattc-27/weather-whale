import toast, { Toaster } from 'react-hot-toast';

const toasterStyle = {
    minWidth: '270px',
    height: '120px',
    background: '#fafafa',
    color: '#121212',
    fontFamily: "Open Sans",
    fontSize: '1.25em',
    fontWeight: '400',
    textAlign: 'center',

}
const toasterContainer = {
    position: 'absolute',
    zIndex: '999999999999999999',
    top: '5%'
}

export { toasterContainer, toasterStyle }