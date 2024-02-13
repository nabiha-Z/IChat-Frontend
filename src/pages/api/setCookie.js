// pages/api/setCookie.js

export default function setCookie(req, res) {
  const { token } = req.body;

  res.setHeader(
    "Set-Cookie",
    `authToken=${token}; HttpOnly; Secure; SameSite=Strict`
  );
  res.status(200).json({ message: "Cookie set successfully" });
}
