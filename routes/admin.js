import { Router } from "express";
import { renderView } from "../helpers/helpers.js";

const router = new Router();

router.get('/admin', (req, res) => {
    renderView("admin/index.html")(res);
})

router.get('/admin/editpreset', (req, res) => {
    renderView("admin/editpreset.html")(res);
})

export default router;
