import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { closeSnackbar } from "../redux/reducers/SnackbarSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackbarAlert = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
