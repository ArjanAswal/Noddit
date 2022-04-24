exports.healthz = async (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};
