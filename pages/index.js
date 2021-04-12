import Head from "next/head";
import { useState, useRef } from "react";
import styles from "../styles/Home.module.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import {
  MenuItem,
  FormControl,
  Select,
  Button,
  CircularProgress,
  Fade,
  InputLabel,
  Backdrop,
  Modal,
  TextField,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: "5px 5px 25px 5px red",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "70%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  modal: {
    "&:focus": {
      outline: "none",
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [verifyMethod, setVerifyMethod] = useState("instagram");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorReason, setErrorReason] = useState("Please enter your username");
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  const timer = useRef();

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = (category) => {
    setModalOpen(true);
    setCategory(category);
  };

  const handleServerSubmit = async () => {
    setLoading(true);
    if (verifyMethod === "instagram") {
      const result = await fetch("api/instagram", {
        method: "POST",
        body: JSON.stringify({ userName: username, category }),
      })
        .then((res) => res.json())
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setSuccess(true);
        });
      setLoading(false);
      setSuccess(true);
      if (result.data === "usererror") {
        setError(true);
        setErrorReason(
          "Make sure your profile is public and you're following @deebtheweeb"
        );
      } else if (result.data === "usernotfound") {
        setError(true);
        setErrorReason("Please check your username");
      } else if (result.data === -1) {
        setError(true);
        setErrorReason("Oh ho, looks like you're not following @thedeeb");
      } else if (result.data === "error") {
        setError(true);
        setErrorReason(
          "Sorry an internal error has occured, Please try an alternative verification method"
        );
      } else {
        setValidated(true);
        setLink(result.data);
        // window.open(result.data, "_blank");
      }
    } else if (verifyMethod === "twitter") {
      const result = await fetch("api/twitter", {
        method: "POST",
        body: JSON.stringify({ userName: username, category }),
      })
        .then((res) => res.json())
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setSuccess(true);
        });
      setLoading(false);
      setSuccess(true);
      if (result.data === "usererror") {
        setError(true);
        setErrorReason(
          "Make sure your profile is public and you're following @deebtheweeb"
        );
      } else if (result.data === "usernotfound") {
        setError(true);
        setErrorReason("Please check your username");
      } else if (result.data === -1) {
        setError(true);
        setErrorReason("Oh ho, looks like you're not following @deebtheweeb");
      } else {
        setValidated(true);
        setLink(result.data);
        // window.open(result.data, "_blank");
      }
    } else {
    }
  };

  const renderModal = () => {
    if (verifyMethod == "instagram") {
      return (
        <div>
          <h2 id="transition-modal-title">Verify Instagram</h2>
          <p style={{ fontSize: 15 }}>
            Please ensure you're following{" "}
            <b>
              <a href="https://instagram.com/thedeeb" target="_blank">
                @thedeeb
              </a>
            </b>{" "}
            on Instagram
          </p>
          <TextField
            style={{ width: "100%" }}
            error={error}
            id="outlined-error-helper-text"
            label="Instagram Username"
            helperText={errorReason}
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleServerSubmit}
            >
              {loading ? "Please wait validating" : "Submit"}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      );
    } else if (verifyMethod === "twitter") {
      return (
        <div>
          <h2 id="transition-modal-title">Verify Twitter</h2>
          <p style={{ fontSize: 15 }}>
            Please ensure you're following{" "}
            <b>
              <a href="https://twitter.com/deebtheweeb" target="_blank">
                @deebtheweeb
              </a>
            </b>{" "}
            on twitter
          </p>
          <p
            style={{
              fontSize: 15,
              padding: 0,
              lineHeight: 0,
              marginBottom: 30,
            }}
          >
            Ensure your twitter is set to Public.
          </p>
          <TextField
            style={{ width: "100%" }}
            error={error}
            id="outlined-error-helper-text"
            label="@TwitterHandle"
            helperText={errorReason}
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleServerSubmit}
            >
              {loading ? "Please wait validating" : "Submit"}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ width: 400 }}></span>
          <p></p>
        </div>
      );
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>BreadStackers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 0,
            borderRadius: 20,
          }}
          open={modalOpen}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalOpen}>
            <div className={classes.paper}>
              <FormControl style={{ minWidth: "70%" }}>
                <InputLabel id="demo-simple-select-label">
                  Select Verification Method
                </InputLabel>
                <Select
                  style={{ minWidth: "220px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={verifyMethod}
                  // value={age}
                  onChange={(e) => setVerifyMethod(e.target.value)}
                >
                  <MenuItem value={"instagram"}>Instagram</MenuItem>
                  <MenuItem value={"twitter"}>Twitter</MenuItem>
                </Select>
              </FormControl>
              {renderModal()}
              {validated && (
                <div style={{ padding: 5 }}>
                  <p>
                    Thanks for verifying. Here’s the invite to the discord
                    community!
                  </p>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonSuccess}
                    style={{ width: 100 }}
                    onClick={() => {
                      window.open(link, "_blank");
                    }}
                  >
                    Open
                  </Button>
                </div>
              )}
            </div>
            {/*
             */}
          </Fade>
        </Modal>

        <div className={styles.splitTop}>
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_server_background_beziwt.jpg"
            className={styles.topImageBackground}
          />
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_server_logo_qi7bri.jpg"
            width={200}
            height={200}
            className={styles.imgstyle}
            onClick={() => handleOpen("server")}
          />
        </div>
        <div className={styles.splitBottom}>
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219963/breadstackers_crypto_background_vvnfhy.jpg"
            className={styles.backImageBackground}
          />
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_crypto_logo_rfgmai.jpg"
            width={200}
            height={200}
            className={styles.imgstyle}
            onClick={() => handleOpen("crypto")}
          />
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
