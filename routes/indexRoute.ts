import express from "express";
const router = express.Router();
import { ensureAuthenticated, ensuredAdmin } from "../middleware/checkAuth";

router.get("/admin", ensuredAdmin , (req, res) => {
  if (!req.sessionStore.all) {
        return res.status(500).send("Session store unavailable");
    }


  req.sessionStore.all((err, sessions) => { 
    
    if (err) {
      return res.status(500).send("Unable to retrieve sessions");
    }
    res.render("admin", {user: req.user, sessions});
  });
});

router.post("/admin/revoke/:sessionId", ensuredAdmin, (req, res) => {
  const sessionId = req.params.sessionId;
  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      return res.status(500).send("Unable to revoke session");
    }
    res.redirect("/admin");
});
});

router.get("/", (req, res) => {
  res.send(
    "<pre><strong>http://localhost:8000/auth/login</strong> for the login page. </pre><pre><strong>http://localhost:8000/dashboard</strong> for the dashboard (requires login).</pre>",
  );
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
