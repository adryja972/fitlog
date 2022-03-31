import { withIronSessionApiRoute } from "iron-session/next";
import { AuthService } from "../../lib/services/auth.service";
import { sessionOptions } from "../../lib/withSession";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req, res) {
  try {
    const authService = new AuthService();
    const user = await authService.login(req.body.username, req.body.password);
    req.session.id = user.id;
    req.session.username = user.username;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
