import { withIronSessionApiRoute } from "iron-session/next";
import { AuthService } from "../../lib/services/auth.service";
import { sessionOptions } from "../../lib/withSession";

export default withIronSessionApiRoute(signinRoute, sessionOptions);

async function signinRoute(req, res) {
  try {
    const authService = new AuthService();
    const user = await authService.signin(req.body.username, req.body.password, req.body.passwordConfirm);
    req.session.id = user.id;
    req.session.username = user.username;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
