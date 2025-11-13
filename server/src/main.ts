import express from "express";

const PORT = parseInt(process.env.PORT ?? "8080", 10);

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  const value = {
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
  };
  console.log(JSON.stringify(value, null, 2));
  next();
});

app.get("/", (_req, res) => {
  res.json({ msg: "this was a triumph" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
