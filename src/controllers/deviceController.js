export const addDevice = (req, res) => {
  const { name, client } = req.body;
  // later: save to DB
  res.json({ message: `Device ${name} added for ${client}` });
};

export const updateDevice = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // later: update in DB + trigger WhatsApp
  res.json({ message: `Device ${id} updated to ${status}` });
};
