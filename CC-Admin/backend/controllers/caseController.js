const caseService = require("../services/caseService");

const loadItems = async (req, res) => {
  try {
    const items = await caseService.getItemList(req.query);
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch Items" });
  }
};

const loadCases = async (req, res) => {
  try {
    const cases = await caseService.getCaseList(req.query);
    res.status(200).json(cases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch Cases" });
  }
};

const loadCase = async (req, res) => {
  const { caseid } = req.params;
  try {
    const casee = await caseService.getCase(caseid);
    res.status(200).json(casee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch Cases" });
  }
};

const addCase = async (req, res) => {
  try {
    const newCase = await caseService.addCase(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create a new Case" });
  }
};
const updateCase = async (req, res) => {
  try {
    const newCase = await caseService.updateCase(
      req.body.caseid,
      req.body.data
    );
    res.status(201).json(newCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create a new Case" });
  }
};

const deleteCase = async (req, res) => {
  const { caseid } = req.params;
  try {
    const result = await caseService.deleteCase(caseid);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete a Case" });
  }
};

module.exports = {
  loadItems,
  addCase,
  updateCase,
  loadCases,
  loadCase,
  deleteCase,
};
