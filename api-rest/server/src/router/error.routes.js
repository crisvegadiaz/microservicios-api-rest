import { Router } from "express";

const errorRouter = Router();

errorRouter.use((_, res) => {
  res.status(404).json({ message: "Route does not exite"});
});

export default errorRouter;
