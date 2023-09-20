import { Router } from "express";
import { renderView } from "../helpers/helpers.js";

const router = new Router();

router.get('/admin', (req, res) => {
    renderView(res, "admin/index.html");
})

router.get('/admin/editpreset', (req, res) => {
    renderView(res, "admin/editpreset.html");
})

export default router;
