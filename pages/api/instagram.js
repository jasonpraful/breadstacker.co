const Instagram = require("instagram-web-api");
const { tmpdir } = require("os");
const { join } = require("path");
const FileCookieStore = require("tough-cookie-filestore2");
const cookieStore = new FileCookieStore(join(tmpdir(), "session.json"));
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { body } = req;
    let following = false;
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

    const username = process.env.INSTA_USERNAME;
    const password = process.env.INSTA_PASSWORD;
    const client = new Instagram({ username, password, cookieStore });

    try {
      (async () => {
        try {
          await client.login();
          var UserToFind;
          var followers = 0;
          var idsToLike = [];
          var followersOfUser = [];
          var end_cursor;

          await client
            .getUserByUsername({ username: "thedeeb" })
            .then((user) => {
              UserToFind = user.id;
              followers = user.edge_followed_by.count;
            });

          while (followersOfUser.length <= followers) {
            await client
              .getFollowers({
                userId: UserToFind,
                first: 50,
                after: end_cursor,
              })
              .then((followers) => {
                followers.data.forEach(function (value) {
                  followersOfUser.push(value.username);
                });
                end_cursor = followers.page_info.end_cursor;
                //   sleep(2000);
              });
          }
          followersOfUser.map(async (c) => {
            if (c == userName) {
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
        } catch (e) {
          console.log(e);
          return res.status(400).json({ data: "error" });
        }
      })();
    } catch (e) {
      console.log(e);
      return res.status(400).json({ data: "error" });
    }
  } else {
  }
}
