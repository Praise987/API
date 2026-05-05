import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { SelectChangeEvent } from "@mui/material";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  state: string;
  lga: string;
}

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    state: "",
    lga: "",
  });

  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("https://nga-states-lga.onrender.com/fetch");
        const data = await res.json();
        setStates(data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const name = e.target.name as keyof FormData;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { lga: "" }),
    }));

    if (name === "state") {
      try {
        const res = await fetch(
          `https://nga-states-lga.onrender.com/?state=${value}`
        );
        const data = await res.json();
        setLgas(data || []);
      } catch (error) {
        console.error("Error fetching LGAs:", error);
        setLgas([]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setOpenAlert(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0b1f3a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "#ffffff",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Input your details
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Select state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Select LGA"
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              disabled={!formData.state}
            >
          {lgas.map((lga) => (
             <MenuItem key={lga} value={lga}>
               {lga}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
                //comment
          <Grid size={12}>
            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={() => setOpenAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenAlert(false)}
            severity="success"
            variant="filled"
          >
            Sign up successful!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default SimpleForm;