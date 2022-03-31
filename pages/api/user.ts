import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/withSession";

export type User = {
  id: string;
  username: string;
};

export default withIronSessionApiRoute(userRoute, sessionOptions);

function userRoute(req, res) {
  res.send({ user: req.session.username });
};
