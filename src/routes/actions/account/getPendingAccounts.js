export const getPendingAccounts = async (req, res) => {
  const accounts = await Account.get(
    { Email: { $exists: false } },
    { sort: { Level: -1 }, projection: { _id: 0, UserName: 1, Password: 1 } }
  );
  if (!accounts) return res.status(500).json({ error: 'Problem finding accounts' });
  res.status(200).json({ count: accounts.length, accounts });
};
