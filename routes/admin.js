import { Router } from "express";
import { renderView } from "../helpers/helpers.js";

const router = new Router();

router.get('/admin', (req, res) => {
    renderView("admin/index.html")(res);
})

export default router;
