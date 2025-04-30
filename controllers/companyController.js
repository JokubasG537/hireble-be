const Company = require("../models/Company");


exports.createCompany = async (req, res) => {
  try {
    const company = new Company({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      website: req.body.website,
      industry: req.body.industry,
      logoUrl: req.body.logoUrl
    });

    await company.save();
    res.status(201).json({ message: "Company created", company });
  } catch (err) {
    res.status(500).json({ error: "Failed to create company", details: err.message });
  }
};


exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json({ companies });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch companies", details: err.message });
  }
};


exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ company });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch company", details: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ message: "Company updated", company });
  } catch (err) {
    res.status(500).json({ error: "Failed to update company", details: err.message });
  }
};


exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json({ message: "Company deleted", company });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete company", details: err.message });
  }
};
