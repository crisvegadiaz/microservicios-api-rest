import { Router } from "express";

const errorRouter = Router();

errorRouter.use((_, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default errorRouter;
