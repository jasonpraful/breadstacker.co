export default async function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;

    var userName = JSON.parse(body).userName;
    var category = JSON.parse(body).category;
    if (
      userName == "" ||
      category == undefined ||
      category == "" ||
      userName == undefined
    ) {
      return res.status(200).json({ data: "usernotfound" });
    }
    if (userName.includes("@")) {
      userName = userName.replace("@", "");
    }

    const result = await fetch(
      `https://api.twitter.com/2/users/by/username/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTERKEY}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.data) {
          return response.data.id;
        } else {
          return "usernotfound";
        }
      });
    if (result != "usernotfound") {
      await fetch(`https://api.twitter.com/2/users/${result}/following`, {
        headers: {
          Authorization: `Bearer ${process.env.TWITTERKEY}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.data) {
            const users = response.data;
            let following = false;
            users.map(async (c) => {
              if (c.id == "1083436297765773312") {
                following = true;
                if (category == "server") {
                  const code = await fetch(
                    `https://discord.com/api/v8/channels/${process.env.SERVERWELCOMECHANNELID}/invites`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bot ${process.env.SERVERTOKEN}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        max_age: 3600,
                        max_uses: 1,
                        unique: true,
                      }),
                    }
                  )
                    .then((result) => result.json())
                    .then((result) => {
                      if (result.code) {
                        return result.code;
                      } else {
                        return "inviteerror";
                      }
                    });
                  if (code === "inviteerror") {
                    return res.status(200).json({ data: `inviteerror` });
                  } else {
                    return res
                      .status(200)
                      .json({ data: `https://discord.gg/${code}` });
                  }
                } else if (category == "crypto") {
                  return res
                    .status(200)
                    .json({ data: `${process.env.CRYPTODISCORD}` });
                } else {
                  return res
                    .status(200)
                    .json({ data: "https://www.twitter.com/deebtheweeb" });
                }
              }
            });
            if (following === false) {
              return res.status(200).json({ data: -1 });
            }
          } else {
            return res.status(200).json({ data: "usererror" });
          }
        })
        .catch((e) => console.log(e));
    } else {
      return res.status(200).json({ data: "usernotfound" });
    }
  } else {
  }
}
