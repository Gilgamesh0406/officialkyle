import React, { useState, useEffect } from "react";
import { Button, Typography, Grid, Box, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "@/utils/const";
import BaseCaseData from "../creator/BaseCaseData";
import RustSkinsManager from "../creator/RustSkinsManager";
import { toast } from "react-toastify";

interface EditCaseProps {
  caseid: string;
  closeEdit: () => void;
}
const EditCase: React.FC<EditCaseProps> = ({ caseid, closeEdit }) => {
  const [caseImage, setCaseImage] = useState<string | null>(null);
  const [rustSkins, setRustSkins] = useState<
    { itemid: string; name: string; chance: number; price: number }[]
  >([]);
  const [canBattle, setCanBattle] = useState<boolean>(false);
  const [priceOffset, setPriceOffset] = useState<number>(0);
  const [caseType, setCaseType] = useState<"daily" | "unboxing">("unboxing");
  const [caseName, setCaseName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caseid) {
      // Fetch case details by ID
      axios.get(`${BACKEND_URL}/api/case/${caseid}`).then((response) => {
        const data = response.data;
        setCaseImage(data.image);
        setPriceOffset(data.offset);
        setCaseName(data.name);
        setRustSkins(JSON.parse(data.items));
        setCaseType("unboxing");
        setCanBattle(data.battle);
      });
    }
  }, [caseid]);

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
      await axios.put(`${BACKEND_URL}/api/case/`, {
        caseid,
        data: caseData,
      });
      toast.success("Case updated successfully.");
      setCaseName("");
      setCaseImage("");
      setCanBattle(false);
      setPriceOffset(0);
      setRustSkins([]);
      setCaseType("unboxing");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update Case.");
    }
    setError(null);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Case
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveCase}
              fullWidth
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={closeEdit}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <RustSkinsManager
            rustSkins={rustSkins}
            setRustSkins={setRustSkins}
            priceOffset={priceOffset}
          />
        </Grid>
        {error && (
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        )}
      </Grid>
    </>
  );
};

export default EditCase;
