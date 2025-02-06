"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import BaseCaseData from "./BaseCaseData";
import RustSkinsManager from "./RustSkinsManager";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import { toast } from "react-toastify";

const CaseBuilder: React.FC = () => {
  const [caseImage, setCaseImage] = useState<string | null>(null);
  const [rustSkins, setRustSkins] = useState<
    { itemid: string; name: string; chance: number; price: number }[]
  >([]);
  const [canBattle, setCanBattle] = useState<boolean>(false);
  const [priceOffset, setPriceOffset] = useState<number>(0);
  const [caseType, setCaseType] = useState<"daily" | "unboxing">("unboxing");
  const [caseName, setCaseName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSaveCase = async () => {
    // Validate fields
    if (!caseName.trim()) {
      setError("Case name is required.");
      return;
    }

    if (!caseImage) {
      setError("Case image is required.");
      return;
    }

    if (rustSkins.length === 0) {
      setError("At least one Rust skin is required.");
      return;
    }

    for (const skin of rustSkins) {
      if (!skin.name.trim() || skin.chance <= 0) {
        setError(
          "Each Rust skin must have a valid name and chance greater than 0."
        );
        return;
      }
    }

    const caseData = {
      name: caseName,
      image: caseImage,
      rustSkins,
      canBattle,
      priceOffset,
      type: caseType,
    };

    try {
      await axios.post(`${BACKEND_URL}/api/case`, caseData);
      toast.success("A new Case added successfully.");
      setCaseName("");
      setCaseImage("");
      setCanBattle(false);
      setPriceOffset(0);
      setRustSkins([]);
      setCaseType("unboxing");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add Case.");
    }
    setError(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Case
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <BaseCaseData
            caseName={caseName}
            setCaseName={setCaseName}
            caseImage={caseImage}
            setCaseImage={setCaseImage}
            canBattle={canBattle}
            setCanBattle={setCanBattle}
            priceOffset={priceOffset}
            setPriceOffset={setPriceOffset}
            caseType={caseType}
            setCaseType={setCaseType}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCase}
            fullWidth
          >
            Save Case
          </Button>
        </Grid>
        <Grid item xs={12} md={8}>
          <RustSkinsManager
            rustSkins={rustSkins}
            setRustSkins={setRustSkins}
            priceOffset={priceOffset}
          />
        </Grid>
      </Grid>

      {/* Show error message if any */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default CaseBuilder;
