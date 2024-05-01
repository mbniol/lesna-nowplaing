import request from 'request';

async function get_id(value) {
  if (value.length === 32) {
    try {
      const finalLocation = await expandShortLink(value);
      return get(finalLocation);
    } catch (error) {
      console.error(error);
    }
  } else {
    return get(value);
  }
}

async function expandShortLink(shortLink) {
  return new Promise((resolve, reject) => {
    request(
        {
          uri: shortLink,
          followRedirect: false,
          rejectUnauthorized: false,
        },
        function (err, httpResponse) {
          if (err) {
            reject(err);
          } else {
            const finalLocation = httpResponse.headers.location || shortLink;
            resolve(finalLocation);
          }
        }
    );
  });
}

function get(value) {
  if (value.indexOf(" ") === -1 && value.length === 22) {
    return value;
  } else {
    let string = value.split("/");
    if (string[3] === "track" && string[4].length === 22) {
      return string[4];
    } else {
      if (String(string[4]).includes("?")) {
        let id = string[4].split("?");
        if (string[3] === "track" && id[0].length === 22) {
          return id[0];
        } else {
          return false;
        }
      }
    }
  }
}
export { get_id };
